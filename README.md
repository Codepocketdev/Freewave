# 🎵 FreeWave  
**A Nostr-Based Open Music Player**

FreeWave is a lightweight, open-source ,decentralized, peer-to-peer music player that empowers creators and listeners by removing intermediaries. Leveraging Nostr for event distribution and YouTube for music content, FreeWave delivers a censorship-resistant, privacy-first listening experience. It supports both personal and social modes, ensuring secure playback, creator control, and freedom from reliance on centralized platforms.

---

##  Features

-  Listens to Nostr relays for secure, censorship-resistant song commands.
  
-  Automatically downloads and plays songs from YouTube using `yt-dlp` and `mpv`.
 
-  Caches recently played songs locally to optimize playback speed.

-  Supports both personal and social listening modes.
  
-  Uses exported private keys—no sensitive keys stored directly in the code.
 
-  Fully open-source, extensible, and community-driven.
  
-  Privacy-first design ensures user and creator control without centralized intermediaries.


##  How It Works

-  FreeWave monitors Nostr events that begin with a command prefix, such as:
  PLAY_SONG: (song name and artist)
-  Upon receiving a valid command, it:
Securely identifies the song on YouTube.

-  Downloads the audio as an MP3 using yt-dlp.
 
-  Plays the track locally with mpv, keeping playback private and on-device.
  
-  Deletes the file after playback to conserve storage.
   
-  All communication is encrypted and decentralized, ensuring censorship-resistant, privacy-first music delivery.

---

##  Requirements
To run FreeWave, ensure your environment includes:
-  Node.js v18+ – FreeWave is written in JavaScript (ES Modules), so you need Node.js to execute it.
  
-  npm – Comes with Node.js; needed to install dependencies.
  
-  yt-dlp – Command-line tool to fetch songs from YouTube.
  
-  mpv – Media player to play the downloaded audio locally.
  
-  Internet connection – Required to fetch songs and receive Nostr events.
 
Optional / Recommended
-  pm2 – To keep FreeWave running in the background continuously.
  
-  Speakers or audio output device – Without a way to play audio, the script can’t serve its main purpose.
  
- Storage – Enough disk space to temporarily store MP3 files before playback.

---

## Installation Guide

1️⃣ Clone the Repository

`git clone https://github.com/Codepocketdev/FreeWave.git
cd FreeWave`

2️⃣ Install Dependencies

`npm install`

3️⃣ Install System Tools

Ubuntu / Debian:

`sudo apt update
sudo apt install mpv python3-pip -y
pip3 install yt-dlp`

macOS:

`brew install mpv yt-dlp`

Windows:

Install Node.js from nodejs.org.

Download `yt-dlp.exe` and `mpv.exe` and add both to your PATH.


 ## Exporting Your Keys
 
-  FreeWave never stores your keys directly inside the script. Instead, export them as environment variables to protect your privacy. You can use either your nsec key or npub key depending on your setup.

1. Using an nsec Key

-  If you have an nsec key, convert it to hex first:

node

`import { nip19 } from "nostr-tools";
const result = nip19.decode("nsec1yourkeyhere");
console.log(Buffer.from(result.data).toString("hex"));`

-  Then export the result:

`export NOSTR_PRIVKEY_HEX="converted_hex_key_here"`


---

2. Using an npub Key

-  If you only have an npub key, you can decode it to hex using a helper script:

1. Create the helper:



`nano decode-npub.mjs`

2. Paste the following:

`#!/usr/bin/env node
import { nip19 } from "nostr-tools";
// Get the npub from command line
const npub = process.argv[2];
if (!npub) {
  console.log("Usage: decode-npub <npub>");
  process.exit(1);
}
try {
  const { data: pubkeyHex } = nip19.decode(npub);
  console.log(pubkeyHex);
} catch (err) {
  console.error("Failed to decode:", err.message);
}`

3. Run the script with your npub:



`node decode-npub.mjs <npub>`

4. Export the output:



`export NOSTR_PUBKEY_HEX="decoded_hex_key_here"`

-  Now your scripts can access the keys automatically for both personal and social listening modes.


---


## Usage

-  FreeWave provides two modes for playback:

1️⃣ Personal Mode (Terminal)

-  This mode is ideal if you want to publish and play songs from a local terminal (Ubuntu, Termux, macOS, etc.).

-  Publisher Script – Use this to send a song command:


`node scripts/send-song-command.mjs "Song by artist"`

-  Listener & Player Script – Use this to receive and play the song locally:


`node scripts/listen-and-play-song.mjs`

-  The listener automatically downloads the song from YouTube, plays it locally, and deletes it after playback.




---

2️⃣ Social Mode (Any Nostr Client)

-  This mode allows you to listen to commands sent from a specific Nostr user on a chosen relay. Only new commands from that user are processed and verified, preventing spam.

`node scripts/social-listen-play.mjs <artist_npub> <relay_url>`


-  Only commands from the specified npub and relay will be played.




---

Folder Structure

`FreeWave/
├── scripts/
│   ├── send-song-command.mjs       # Personal mode: publisher
│   ├── listen-and-play-song.mjs   # Personal mode: listener & player
│   └── social-listen-play.mjs     # Social mode listener
├── package.json
├── .gitignore
└── README.md`


---

 ## Gadgets & Hardware Setup (Optional)

-  You can take FreeWave beyond the terminal and create your own portable or interactive music node. Here’s how:

-  Old Android Phone – Run FreeWave via Termux or Node.js as a portable Nostr node.

-  Raspberry Pi (3 or 4) – 24/7 listener connected to a speaker or display.

-  Arduino / ESP32 / ESP8266 – Control LEDs, buttons, or other visual indicators.

-  OLED / LCD Display – Show current track name, artist, or relay information.

-  RGB LEDs or Neopixels – Flash, pulse, or animate to the music beat.

-  Powerbank or UPS – Run your setup off-grid.

-  WiFi Dongle / Ethernet – Ensure a stable network connection.

-  Buttons / Rotary Knob – Control play, pause, or skip tracks directly.

-  Mini Amplifier (PAM8403) – Boost small speaker setups.

-  3D-Printed Case – Give your FreeWave node a futuristic, custom look.



---

How to Make It Interactive

Bring your FreeWave node to life with real-time interaction:

1. Light Shows – Use an ESP32 or similar board to detect new song events and trigger LED effects.


2. Track Display – Connect an OLED or LCD to show the current track, artist, and relay name.


3. Physical Controls – Add buttons, knobs, or switches to control playback through simple serial commands.


-  With these additions, FreeWave becomes a smart, physical music player powered by Nostr, combining software freedom with tangible interactivity.





---

## package.json (For Reference)

`{
  "name": "freewave",
  "version": "1.0.0",
  "description": "Nostr-based music player that listens for song commands",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start-listener": "node scripts/listen-and-play-song.mjs",
    "send-song": "node scripts/send-song-command.mjs"
  },
  "keywords": ["nostr", "music", "player", "youtube", "yt-dlp"],
  "author": "<Your Name or Handle>",
  "license": "ISC",
  "dependencies": {
    "nostr-tools": "^2.17.2"
  }
}`



 Contributing

FreeWave is community-built — feel free to fork, open issues, or submit pull requests!

Ideas welcome:

Add a GUI or web dashboard

Add LED sync effects

Integrate more Nostr event types

Create themed hardware builds




Credits

Developed by Martin Arts & contributors
Powered by Nostr, yt-dlp, and mpv

> “Let the music flow freely across the network — this is the wave of sound, not control.”

Your keys your music
