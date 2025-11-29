# 🎵 FreeWave  
**A Nostr-Based Open Music Player**

FreeWave is a lightweight, open-source Nostr music player that listens for song commands sent through Nostr relays — then automatically plays and manages them locally.  
It’s built for freedom, experimentation, and creativity — turning simple code into a distributed jukebox that anyone can extend, test, or remix.

---

##  Features

-  Listens to Nostr relays for song commands  
-  Downloads and plays songs automatically using `yt-dlp` and `mpv`  
-   Caches songs locally for faster playback  
-  Uses exported private keys (no need to store keys inside the code)  
-  Open-source, easy to extend, and community-driven  
-  Optional hardware integration — LED lights, displays, and buttons  


##  How It Works

FreeWave listens for Nostr events that start with a prefix like:

```bash
PLAY_SONG: <song name>
```

Once received, it automatically:
1. Finds the song on YouTube.  
2. Downloads it as an MP3 using `yt-dlp`.  
3. Plays it locally using `mpv`.  
4. Deletes it after playback to save space.  

It’s simple, transparent, and totally open.

---

##  Requirements

Before running FreeWave, make sure you have:

- **Node.js v18+**
- **npm**
- **yt-dlp** (YouTube downloader)
- **mpv** (audio player)
- **Internet connection**
- *(Optional)* `pm2` for background running

---

##  Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/FreeWave.git
cd FreeWave
```

### 2️⃣ Install Dependencies
```
npm install
npm install dotenv
```

### 3️⃣ Install System Tools

### i) Ubuntu / Debian

```bash
sudo apt update
sudo apt install mpv
pip install yt-dlp
```

### ii) macOS

```bash
brew install mpv yt-dlp
```

### iii) Windows

Install `Node.js` from [nodejs.org](https://nodejs.org/en)

Download yt-dlp.exe and mpv.exe, and add both to PATH

### 4️⃣ Setup Your Nostr Private Key

#### Step 1 — Generate a private key

In Node.js:
 ```bash
 node
> const { generateSecretKey, getPublicKey } = await import("nostr-tools");
> const sk = generateSecretKey();
> console.log("PRIVATE KEY (hex):", sk);
> console.log("PUBLIC KEY:", getPublicKey(sk));
```

#### Step 2 — Save it in a .env file
FreeWave never stores your key in code. Use an environment variable instead.

Rename the `.env.example` file to `.env`. You can find it in the project root folder.
```bash
FreeWave/
├── scripts/
│   ├── send-song-command.mjs
│   └── listen-and-play-song.mjs
├── package.json
├── .gitignore
├── .env.example
└── README.md
```

Then, on the `.env` file, replace `YOUR_NOSTR_PRIVATE_KEY_HERE` with your nost private key 

#### Step 3 — Verify 

```bash
node -e "import('dotenv/config'); console.log(process.env.NOSTR_PRIVATE_KEY)"
```
You should see your 64-character hex key printed.

### 5. Exporting Your Keys

To protect privacy, FreeWave never stores your keys directly inside the script.
Instead, export them as environment variables.

Example:

```bash
export NOSTR_PRIVKEY_HEX="your_private_key_here"
```

If you only have an nsec key, you can convert it to hex:

```bash
node
> const { nip19 } = await import("nostr-tools");
> const result = nip19.decode("nsec1yourkeyhere");
> console.log(Buffer.from(result.data).toString("hex"));
```

Then export the result again:

```bash
export NOSTR_PRIVKEY_HEX="converted_hex_key_here"
```

Now your scripts can access it automatically!



## Usage

Send a Song Command

```bash
npm run send-song "Blinding Lights by The Weeknd"
```

Start the Listener

```bash
npm run start-listener
```

FreeWave will automatically detect your Nostr commands, download, play, and clean up after itself.


 #### Folder Structure:
```bash
FreeWave/
├── scripts/
│   ├── send-song-command.mjs
│   └── listen-and-play-song.mjs
├── package.json
├── .gitignore
└── README.md
```


## Gadgets & Hardware Setup (Optional)

You can go beyond the terminal — build your own FreeWave Node!

| Gadget                   | Purpose / Use                                      |
|---------------------------|--------------------------------------------------|
| Old Android Phone         | Run FreeWave via Termux or Node.js as a portable Nostr node |
| Raspberry Pi (3 or 4)     | 24/7 listener connected to a speaker or display |
| Arduino (ESP32 / ESP8266) | Control LEDs, buttons, or visual indicators     |
| OLED / LCD Display        | Show current track name, artist, or connection status |
| Bluetooth Speaker         | Wireless music playback                           |
| RGB LEDs or Neopixels     | Flash, pulse, or animate with the beat           |
| Powerbank or UPS          | Run your setup off-grid                           |
| WiFi Dongle / Ethernet    | Ensure a stable connection                        |
| Buttons / Rotary Knob     | Control play, pause, or skip directly            |
| Mini Amplifier (PAM8403)  | Boost small speaker setups                        |
| 3D-Printed Case           | Make your node look like a futuristic jukebox    |





## How to Make It Interactive

Want to bring your FreeWave to life?

- Use an ESP32 board to detect song events and light up LEDs.

- Add an OLED display to show track titles and relay names.

- Control playback with buttons using simple serial commands.


Your FreeWave becomes a smart, physical music player powered by Nostr!

### package.json (For Reference)

```bash
{
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
}
```


## Contributing

FreeWave is community-built — feel free to fork, open issues, or submit pull requests!

## Ideas welcome:

- Add a GUI or web dashboard

- Add LED sync effects

- Integrate more Nostr event types

- Create themed hardware builds



## Credits

Developed by Martin Arts & contributors
Powered by `Nostr`, `yt-dlp`, and `mpv`

> “Let the music flow freely across the network — this is the wave of sound, not control.”

Your keys your music
