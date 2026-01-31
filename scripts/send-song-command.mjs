// send-song-command.mjs
import { Relay, getPublicKey, finalizeEvent } from "nostr-tools";

// ----------------- YOUR HEX PRIVATE KEY -----------------
const myHexPrivKey = "3e9be79584b215f2eca59412fd80ebcb8ece5b1bac38be34b29c3ea9281b9e5c"; 
// --------------------------------------------------------

// Get public key directly from hex
const pk = getPublicKey(myHexPrivKey);
console.log("Using public key:", pk);

// ----------------- RELAYS -----------------
const relays = [
  "wss://nostr.oxtr.dev/",
  "wss://nos.lol/",
  "wss://nostr.bitcoiner.social/",
  "wss://nostr.mom/"
];

// ----------------- GET SONG FROM CLI -----------------
const songQuery = process.argv[2];
if (!songQuery) {
  console.error("Please provide a song to play. Example:");
  console.error("node send-song-command.mjs \"Blinding Lights by The Weeknd\"");
  process.exit(1);
}

// ----------------- BUILD THE EVENT -----------------
const eventTemplate = {
  kind: 1, // text note
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: `PLAY_SONG:${songQuery}`, // prefix so script 2 knows it's a command
  pubkey: pk
};

// Sign & finalize
const event = finalizeEvent(eventTemplate, myHexPrivKey);
console.log("Event ready:", { id: event.id });

// ----------------- PUBLISH TO RELAYS -----------------
for (const url of relays) {
  (async () => {
    try {
      const relay = new Relay(url);
      await relay.connect();
      await relay.publish(event);
      console.log(`🚀 Event published to ${url}`);
      setTimeout(() => relay.close(), 1000);
    } catch (e) {
      console.error(`❌ Failed to publish to ${url}:`, e);
    }
  })();
}

console.log("🎉 Done publishing to all relays!");
