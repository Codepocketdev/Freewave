
```markdown
<div align="center">

# 🎵 FreeWave

### A Nostr-Based Decentralized Music Player

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

*Your keys. Your music. Your freedom.*

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#usage) • [Contributing](#contributing)

</div>

---

## 📖 About

FreeWave is a lightweight, open-source music player that leverages the Nostr protocol for decentralized, censorship-resistant music distribution. By combining Nostr events with `yt-dlp` for content retrieval, FreeWave delivers a privacy-first listening experience free from centralized platforms.

### Why FreeWave?

- 🔒 **Privacy-First**: Your listening habits stay private
- 🌐 **Decentralized**: No central authority controls your music
- 🚫 **Censorship-Resistant**: Built on Nostr's distributed network
- 🎨 **Creator-Friendly**: Direct connection between artists and listeners
- 🔓 **Open Source**: Community-driven and transparent

---

## ✨ Features

- 📡 **Nostr Integration** - Listens to Nostr relays for secure, censorship-resistant song commands
- 🎵 **Automatic Playback** - Downloads and plays songs using `yt-dlp` and `mpv`
- 💾 **Smart Caching** - Locally caches recently played songs for faster playback
- 👤 **Dual Modes** - Supports both personal and social listening experiences
- 🔐 **Secure Key Management** - Uses environment variables for private key storage
- 🧹 **Auto-Cleanup** - Automatically removes files after playback
- 🎛️ **Extensible** - Easy to customize and extend for hardware projects

---

## 🚀 Quick Start

### Prerequisites

Before installing FreeWave, ensure you have:

| Requirement | Version | Purpose |
|------------|---------|---------|
| [Node.js](https://nodejs.org/) | ≥18.0 | Runtime environment |
| npm | (bundled) | Package management |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) | latest | Audio fetching |
| [mpv](https://mpv.io/) | latest | Audio playback |

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Codepocketdev/FreeWave.git
cd FreeWave
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Install System Tools

<details>
<summary><b>Ubuntu / Debian</b></summary>

```bash
sudo apt update
sudo apt install mpv python3-pip -y
pip3 install yt-dlp
```
</details>

<details>
<summary><b>macOS</b></summary>

```bash
brew install mpv yt-dlp
```
</details>

<details>
<summary><b>Windows</b></summary>

1. Install [Node.js](https://nodejs.org/)
2. Download [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp/releases)
3. Download [mpv.exe](https://mpv.io/installation/)
4. Add both to your PATH
</details>

#### 4. Configure Environment

Create a `.env` file in the project root:

```env
NOSTR_PRIVATE_KEY=<your_hex_private_key>
```

<details>
<summary><b>Converting Keys to Hex</b></summary>

**From nsec key:**
```javascript
import { nip19 } from "nostr-tools";
const result = nip19.decode("nsec1yourkeyhere");
console.log(Buffer.from(result.data).toString("hex"));
```

**From npub key:**
```bash
# Create decode-npub.mjs
nano decode-npub.mjs

# Run the decoder
node decode-npub.mjs <your_npub>
```
</details>

---

## 📚 Usage

### Personal Mode

Perfect for local terminal-based playback.

**Send a song command:**
```bash
node scripts/send-song-command.mjs "Song by Artist"
```

**Start the listener:**
```bash
node scripts/listen-and-play-song.mjs
```

### Social Mode

Listen to songs from a specific Nostr user.

```bash
node scripts/social-listen-play.mjs <artist_npub> <relay_url>
```

**Example:**
```bash
node scripts/social-listen-play.mjs npub1abc... wss://relay.damus.io
```

---

## 📁 Project Structure

```
FreeWave/
├── scripts/
│   ├── send-song-command.mjs      # Personal mode publisher
│   ├── listen-and-play-song.mjs   # Personal mode listener
│   └── social-listen-play.mjs     # Social mode listener
├── .env                            # Environment configuration
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Hardware Projects

Transform FreeWave into a physical music node with these components:

### Supported Hardware

| Component | Use Case |
|-----------|----------|
| 📱 Android Phone (v13+) | Portable Nostr node via Termux |
| 🥧 Raspberry Pi (3/4/5) | 24/7 listener with speaker output |
| 🔌 Arduino/ESP32/ESP8266 | LED control & physical buttons |
| 📺 OLED/LCD Display | Track information display |
| 💡 RGB LEDs/Neopixels | Visual music feedback |
| 🔋 Powerbank/UPS | Off-grid operation |
| 🎚️ Rotary Encoder | Physical playback control |
| 🔊 Mini Amplifier | Enhanced audio output |

### Example Setup Ideas

- **LED Visualizer**: Sync RGB strips to song changes
- **Track Display**: Show current song info on OLED screen
- **Physical Controls**: Add buttons for play/pause/skip
- **Portable Node**: Battery-powered Raspberry Pi in custom enclosure

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🎨 Create GUI/web interface
- 🔧 Optimize performance
- 🎛️ Share hardware builds
- 🧪 Add tests

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support

If you find FreeWave useful, please consider:

- ⭐ Starring the repository
- 🐦 Sharing on social media
- 🤝 Contributing to the project
- 💬 Joining the discussion on Nostr

---

<div align="center">

### "Let the music flow freely across the network"

**Made with ❤️ by the FreeWave community**

[Report Bug](https://github.com/Codepocketdev/FreeWave/issues) • [Request Feature](https://github.com/Codepocketdev/FreeWave/issues) • [Nostr Community](https://nostr.com)

</div>
```
