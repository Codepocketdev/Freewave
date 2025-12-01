// social-listen-play.mjs
import { SimplePool } from "nostr-tools";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// -------------------------
// USER INPUT
// -------------------------
const ARTIST_NPUB = process.argv[2];
const RELAY = process.argv[3];
if (!ARTIST_NPUB || !RELAY) {
  console.log("Usage: node social-listen-play.mjs <artist_npub> <relay_url>");
  process.exit(1);
}

// -------------------------
// CONFIG
// -------------------------
const LAST_PLAYED_FILE = "./last_song_social.json";
const DOWNLOAD_DIR = "./songs";

if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

// -------------------------
// CLEANUP HANDLER 
// -------------------------
let currentSongFile = null;

function cleanup() {
  if (currentSongFile && fs.existsSync(currentSongFile)) {
    try {
      fs.unlinkSync(currentSongFile);
      console.log(`🗑️ Cleaned up: ${currentSongFile}`);
    } catch (err) {
      console.log("Cleanup error:", err.message);
    }
  }
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// -------------------------
// HELPERS
// -------------------------
function sanitizeToFilename(name) {
  const cleaned = name
    .replace(/^(_?SONG:|PLAY_SONG:)/i, "")
    .replace(/^play\s*/i, "")
    .trim();
  let safe = cleaned.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "_");
  if (!safe) safe = "song";
  if (safe.length > 60) safe = safe.slice(0, 60);
  return `_SONG_${safe}`;
}

function readLastPlayed() {
  if (!fs.existsSync(LAST_PLAYED_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(LAST_PLAYED_FILE, "utf-8"));
  } catch {
    return null;
  }
}

function writeLastPlayed(eventId, timestamp) {
  fs.writeFileSync(
    LAST_PLAYED_FILE,
    JSON.stringify({ eventId, timestamp }),
    "utf-8"
  );
}

// -------------------------
// PLAY SONG
// -------------------------
async function playSong(songName) {
  const base = sanitizeToFilename(songName);
  const mp3File = path.join(DOWNLOAD_DIR, `${base}.mp3`);
  currentSongFile = mp3File; // Track for cleanup

  try {
    // -------------------------
    // DOWNLOAD SONG (patched)
    // -------------------------
    if (!fs.existsSync(mp3File)) {
      console.log(`⬇️ Downloading: ${songName}`);

      const cmd = `yt-dlp --force-overwrite --no-part -x --audio-format mp3 --no-playlist "ytsearch1:${songName}" -o "${path.join(
        DOWNLOAD_DIR,
        base
      )}.%(ext)s"`;

      execSync(cmd, { stdio: "inherit" });

      if (!fs.existsSync(mp3File)) {
        console.warn(`⚠️ Could not download: ${mp3File}`);
        return;
      }

      console.log(`✅ Download complete: ${mp3File}`);
    } else {
      console.log(`✅ Cached file found: ${mp3File}`);
    }

    // -------------------------
    // PLAY SONG
    // -------------------------
    console.log(`🎧 Playing: ${songName}`);
    execSync(`mpv --no-video "${mp3File}"`, { stdio: "inherit" });

    console.log(`🏁 Finished: ${songName}`);

    // -------------------------
    // DELETE AFTER PLAYBACK
    // -------------------------
    fs.unlinkSync(mp3File);
    currentSongFile = null;
    console.log(`🗑️ Deleted: ${mp3File}`);
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
}

// -------------------------
// NOSTR SUBSCRIPTION
// -------------------------
const relays = [RELAY];
const pool = new SimplePool();
const filter = { kinds: [1], authors: [ARTIST_NPUB] };

const lastPlayed = readLastPlayed();
const lastTimestamp = lastPlayed?.timestamp || 0;

console.log(`🎯 Listening for artist: ${ARTIST_NPUB}`);
console.log(`📡 Relay: ${RELAY}`);

pool.subscribeMany(relays, filter, {
  onevent(event) {
    if (event.pubkey !== ARTIST_NPUB) return;

    const content = event.content?.trim() || "";
    if (!content.toLowerCase().startsWith("play")) return;

    if (event.created_at <= lastTimestamp) {
      console.log(`⚠️ Old event, skipping: ${event.id}`);
      return;
    }

    const songName = content.replace(/play|_SONG:|PLAY_SONG:/gi, "").trim();
    if (!songName) return;

    console.log(`🎵 New command: ${songName}`);

    (async () => {
      await playSong(songName);
      writeLastPlayed(event.id, event.created_at);
      console.log("📭 Done. Exiting...");
      process.exit(0);
    })();
  },

  onclose(reason) {
    console.log("🔌 Connection closed:", reason);
    console.log("📡 Reconnecting in 5s...");
    setTimeout(() => {
      pool.subscribeMany(relays, filter, this);
    }, 5000);
  },
});
