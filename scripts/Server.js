import express from "express";
import { spawn } from "child_process";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

// Helper to get full path to script
const scriptPath = (script) => path.join(process.cwd(), "scripts", script);

// Track running processes and their restart configs
let activeProcesses = {
  personal: { process: null, config: null, shouldRun: false },
  social: { process: null, config: null, shouldRun: false }
};

// Function to run command with auto-restart
function runCommandWithRestart(script, args, mode, envVars = {}) {
  console.log(`🚀 Starting ${mode} mode: node ${script} ${args.join(' ')}`);

  const child = spawn("node", [script, ...args], {
    stdio: "inherit",
    shell: false,
    env: { ...process.env, ...envVars }
  });

  activeProcesses[mode].process = child;

  child.on('close', (code) => {
    console.log(`\n📭 ${mode} mode process exited with code ${code}`);

    if (activeProcesses[mode].shouldRun) {
      console.log(`⏳ Restarting ${mode} mode in 5 seconds...`);
      setTimeout(() => {
        if (activeProcesses[mode].shouldRun) {
          console.log(`🔄 Auto-restarting ${mode} mode...`);
          runCommandWithRestart(script, args, mode, envVars);
        }
      }, 5000);
    } else {
      console.log(`⏹️ ${mode} mode stopped (not restarting)`);
    }
  });

  child.on('error', (err) => {
    console.error(`❌ ${mode} mode error:`, err.message);
  });

  return child;
}

// START SOCIAL MODE
app.post("/start-social", (req, res) => {
  const { pubKey, relay } = req.body;

  console.log(`\n📡 Starting SOCIAL mode...`);
  console.log(`   Artist: ${pubKey}`);
  console.log(`   Relay: ${relay}`);

  if (activeProcesses.social.process) {
    activeProcesses.social.shouldRun = false;
    activeProcesses.social.process.kill();
  }

  activeProcesses.social.config = { pubKey, relay };
  activeProcesses.social.shouldRun = true;

  const script = scriptPath("social-listen-play.mjs");
  const args = [pubKey, relay];
  runCommandWithRestart(script, args, "social");

  res.json({ started: true, mode: "social", relay });
});

// STOP SOCIAL MODE
app.post("/stop-social", (req, res) => {
  console.log(`\n⏹️ Stopping SOCIAL mode...`);

  activeProcesses.social.shouldRun = false;

  if (activeProcesses.social.process) {
    activeProcesses.social.process.kill();
    activeProcesses.social.process = null;
  }

  activeProcesses.social.config = null;
  res.json({ stopped: true, mode: "social" });
});

// START PERSONAL MODE
app.post("/start-personal", (req, res) => {
  const { privKey, relay } = req.body;

  console.log(`\n📡 Starting PERSONAL mode...`);
  console.log(`   Relay: ${relay}`);

  if (activeProcesses.personal.process) {
    activeProcesses.personal.shouldRun = false;
    activeProcesses.personal.process.kill();
  }

  activeProcesses.personal.config = { privKey, relay };
  activeProcesses.personal.shouldRun = true;

  const script = scriptPath("listen-and-play-song.mjs");
  const envVars = { NOSTR_PRIVATE_KEY: privKey };
  runCommandWithRestart(script, [], "personal", envVars);

  res.json({ started: true, mode: "personal", relay });
});

// STOP PERSONAL MODE
app.post("/stop-personal", (req, res) => {
  console.log(`\n⏹️ Stopping PERSONAL mode...`);

  activeProcesses.personal.shouldRun = false;

  if (activeProcesses.personal.process) {
    activeProcesses.personal.process.kill();
    activeProcesses.personal.process = null;
  }

  activeProcesses.personal.config = null;
  res.json({ stopped: true, mode: "personal" });
});

// STATUS CHECK
app.get("/status", (req, res) => {
  res.json({
    social: {
      running: activeProcesses.social.shouldRun,
      config: activeProcesses.social.config ? { relay: activeProcesses.social.config.relay } : null
    },
    personal: {
      running: activeProcesses.personal.shouldRun,
      config: activeProcesses.personal.config ? { relay: activeProcesses.personal.config.relay } : null
    }
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');

  activeProcesses.social.shouldRun = false;
  activeProcesses.personal.shouldRun = false;

  if (activeProcesses.social.process) activeProcesses.social.process.kill();
  if (activeProcesses.personal.process) activeProcesses.personal.process.kill();

  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🎵 FreeWave Backend Server');
  console.log('='.repeat(50));
  console.log(`📡 Listening on port ${PORT}`);
  console.log('🌊 Ready to stream music via Nostr!');
  console.log('='.repeat(50) + '\n');
});
