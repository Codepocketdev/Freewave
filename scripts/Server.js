import express from "express";
import { exec } from "child_process";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());

// Helper to get full path to script
const scriptPath = (script) => path.join(process.cwd(), "scripts", script);

function runCommand(cmd) {
  console.log("Running:", cmd);
  return exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    console.log(stdout);
  });
}

// START SOCIAL MODE
app.post("/start-social", (req, res) => {
  const { pubKey, relay } = req.body;

  const cmd = `node ${scriptPath("social-listen-play.mjs")} ${pubKey} ${relay}`;
  runCommand(cmd);

  res.json({ started: true });
});

// STOP SOCIAL MODE
app.post("/stop-social", (req, res) => {
  runCommand(`pkill -f ${scriptPath("social-listen-play.mjs")}`);
  res.json({ stopped: true });
});

// START PERSONAL MODE
app.post("/start-personal", (req, res) => {
  const { privKey, relay } = req.body;

  const cmd = `node ${scriptPath("personal-listen-play.mjs")} ${privKey} ${relay}`;
  runCommand(cmd);

  res.json({ started: true });
});

// STOP PERSONAL MODE
app.post("/stop-personal", (req, res) => {
  runCommand(`pkill -f ${scriptPath("personal-listen-play.mjs")}`);
  res.json({ stopped: true });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
