// listen-and-play-song.mjs
import { getPublicKey, SimplePool } from "nostr-tools";
import { execSync } from "child_process";
import fs from "fs";
import 'dotenv/config'; // loads .env automatically

// --- CONFIG ---
const sk = process.env.NOSTR_PRIVATE_KEY;
if (!sk) {
  console.error("❌ Please set your NOSTR_PRIVATE_KEY environment variable!");
  process.exit(1);
}

const pubkey = getPublicKey(sk);
const LAST_PLAYED_FILE = "./last_song.txt";

console.log("🎯 Fetching latest song command for:", pubkey);

const relays = [
  "wss://nostr.oxtr.dev",
  "wss://nos.lol",
  "wss://nostr.bitcoiner.social",
  "wss://nostr.mom",
];

const pool = new SimplePool();
const filter = { kinds: [1], authors: [pubkey] };

// --- HELPERS ---
function sanitizeToFilename(name) {
  const cleaned = name.replace(/^(_?SONG:|PLAY_SONG:)/i, "").replace(/^play\s*/i, "").trim();
  let safe = cleaned.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "_");
  if (!safe) safe = "song";
  if (safe.length > 60) safe = safe.slice(0, 60);
  return `_SONG_${safe}`;
}

function readLastPlayed() {
  if (!fs.existsSync(LAST_PLAYED_FILE)) return null;
  return fs.readFileSync(LAST_PLAYED_FILE, "utf-8").trim();
}

function writeLastPlayed(eventId) {
  fs.writeFileSync(LAST_PLAYED_FILE, eventId, "utf-8");
}

// --- PLAY SONG ---
async function playSong(songName) {
  const base = sanitizeToFilename(songName);
  const mp3File = `${base}.mp3`;
// delete file on exit if configured
  const cleanup = () => {
    if (fs.existsSync(mp3File)) {
      fs.unlinkSync(mp3File);
      console.log(`🗑️ Cleanup: deleted ${mp3File}`);
    }
    process.exit(0);
  };

  process.once("SIGINT", cleanup);
  process.once("SIGTERM", cleanup);
  process.once("exit", cleanup);

  try {
    if (!fs.existsSync(mp3File)) {
      console.log(`⬇️ Downloading: ${songName}`);
      const ytdlpCmd = `yt-dlp -x --audio-format mp3 --no-playlist "ytsearch1:${songName}" -o "${base}.%(ext)s"`;
      execSync(ytdlpCmd, { stdio: "inherit" });

      if (!fs.existsSync(mp3File)) {
        console.warn(`⚠️ File ${mp3File} not found. Skipping.`);
        return;
      }

      console.log(`✅ Download complete: ${mp3File}`);
    } else {
      console.log(`✅ Cached file found: ${mp3File}`);
    }

    console.log(`🎧 Now playing: ${songName}`);
    execSync(`mpv --no-video "${mp3File}"`, { stdio: "inherit" });
    console.log(`✅ Finished: ${songName}`);

    if (fs.existsSync(mp3File)) {
      fs.unlinkSync(mp3File);
      console.log(`🗑️ Deleted: ${mp3File}`);
    }
  } catch (err) {
    console.error("❌ Error in playSong:", err.message || err);
  }
}

// --- FETCH AND PLAY LATEST COMMAND ---
pool.subscribeMany(relays, filter, {
  onevent(event) {
    const content = event.content?.trim() || "";
    if (!content.toLowerCase().startsWith("play")) return;

    const lastPlayed = readLastPlayed();
    if (event.id === lastPlayed) {
      console.log("⚠️ This command was already played. Exiting.");
      process.exit(0);
    }

    const songName = content.replace(/play|_SONG:|PLAY_SONG:/gi, "").trim();
    if (!songName) return;

    console.log(`🎵 New song command received: ${songName}`);

    (async () => {
      await playSong(songName);
      writeLastPlayed(event.id);
      console.log("📭 Done. Exiting until next command.");
      process.exit(0);
    })();
  },
  onclose(reason) {
    console.log("🔌 Subscription closed:", reason);
    process.exit(0);
  },
  oneose() {
    console.log("📡 Finished fetching events.");
  },
});
