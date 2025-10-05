# DJ-AI: Visual AI-Powered DJ Mixing Platform with Intelligent Transitions

**AI-driven music mixing that analyzes BPM, energy, and harmonic compatibility to create professional DJ sets with automatic crossfading**

![Demo Video](https://drive.google.com/file/d/1Oif_AEZMVRYlulSDIwNmeiSTrf0f8z-1/view?pli=1)

## 🎯 The Problem

Creating professional DJ mixes requires deep technical knowledge:
- **BPM matching** - Songs need compatible tempos
- **Harmonic mixing** - Keys must align using the Camelot Wheel
- **Energy flow** - Maintaining proper crowd energy throughout the set
- **Transition timing** - Knowing when and how to blend tracks

Professional DJs spend years mastering these skills. Amateur music enthusiasts and content creators struggle to create quality mixes, often relying on expensive software like Ableton Live or Serato DJ Pro that require extensive training.

## 💡 The Solution

DJ-AI democratizes professional mixing by using AI to analyze music characteristics and suggest optimal transitions. Simply drag songs onto a canvas, and our AI engine:
- Analyzes BPM, energy levels, musical key, genre, and mood
- Suggests compatible tracks with confidence scores (50-95%)
- Recommends transition types (Beat Match, Smooth Blend, EQ Swap, etc.)
- Automatically creates seamless crossfades between songs
- Visualizes your mix flow in real-time

## ✨ Key Features

### 🎵 Visual Music Graph Interface
- Drag-and-drop song nodes onto an infinite canvas
- Connect tracks to build your mix flow visually
- Real-time path visualization with colored transitions

### 🤖 AI-Powered Transition Analysis
- **8 Transition Types**: Beat Match, Smooth Blend, EQ Swap, Quick Cut, Crossfade, Tempo Shift, Echo Out, Hard Cut
- **Harmonic Compatibility**: Uses Camelot Wheel for key matching
- **BPM Analysis**: Detects tempo compatibility (±2 BPM for perfect sync)
- **Energy Flow Detection**: Maintains natural crowd energy progression
- **Confidence Scoring**: 50-95% ratings for each suggested connection

### 🎧 Automatic DJ Playback
- Professional crossfading engine with 20-step volume automation
- Dual-audio player for seamless transitions
- Real-time progress tracking and timeline visualization
- Queue management with visual feedback

### 📊 Smart Music Database
- 23+ royalty-free electronic/dance tracks
- Complete metadata: BPM, key, genre, energy, mood, duration
- Instant streaming from Pixabay CDN

## 🚀 Demo Video

[Watch Demo on Google Drive](https://drive.google.com/file/d/1Oif_AEZMVRYlulSDIwNmeiSTrf0f8z-1/view?pli=1)

## 🏃 Quick Start

### Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

### Backend (Optional)

```bash
cd backend
python3 server.py
```

Server runs at `http://localhost:5001`

## 📖 How to Use

### 1. Add Songs to Canvas
- Browse the music library in the left sidebar
- Drag songs onto the canvas to add them to your mix

### 2. Connect Songs with AI Suggestions
- Click any song node to see AI-recommended connections
- Top suggestions show highest confidence matches (highlighted green)
- Click a suggestion to create an automatic connection
- View transition type and duration on the edge label

### 3. Play Your Mix
- Click **"▶️ Play Mix"** at the bottom
- Watch the AI apply recommended transitions automatically
- Enjoy professional-quality crossfades between tracks

## 🎨 AI Transition Types

| Type | Use Case | Duration | Confidence Trigger |
|------|----------|----------|-------------------|
| 🟢 **Beat Match** | Same BPM (±2), compatible keys | 16s | 90-95% |
| 🔵 **Smooth Blend** | Similar energy, same genre | 12s | 80-90% |
| 🟣 **EQ Swap** | Energy drop, creative mixing | 10s | 70-80% |
| 🟠 **Quick Cut** | Energy boost needed | 4s | 75-85% |
| 🔷 **Crossfade** | Standard transition | 8s | 65-75% |
| 🌸 **Tempo Shift** | Key compatible, BPM different | 10s | 60-70% |
| 🟡 **Echo Out** | Large BPM jump | 6s | 55-65% |
| 🔴 **Hard Cut** | Genre jump, dramatic shift | 2s | 50-60% |

## 🧠 Technical Architecture

### Frontend Stack
- **React** - UI framework with hooks (useState, useRef, useEffect)
- **ReactFlow** - Node-graph visualization engine
- **styled-components** - Modern CSS-in-JS styling
- **Web Audio API** - Dual-player audio engine for crossfading

### AI Analysis Engine
```javascript
musicAnalysis.js
├── Harmonic Wheel (Camelot key matching)
├── BPM Analysis (tempo compatibility)
├── Energy Flow Detection
├── Genre Compatibility Matrix
└── Confidence Scoring Algorithm
```

### Audio Playback System
```javascript
PlaybackController
├── Dual Audio Elements (current + next track)
├── 20-Step Crossfade Engine
├── Path-Finding Algorithm (follows node connections)
├── Real-time Progress Tracking
└── Transition Scheduler
```

## 📁 Project Structure

```
hackathon-dj/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js           # Music library
│   │   │   ├── TurboNode.js         # Song nodes
│   │   │   ├── TurboEdge.js         # Transition edges
│   │   │   ├── ConnectionPopup.js   # AI suggestions
│   │   │   ├── PlaybackController.js # Mix player
│   │   │   └── MusicPlayer.js       # Audio timeline
│   │   ├── utils/
│   │   │   ├── musicAnalysis.js     # AI engine
│   │   │   └── audioEffects.js      # Crossfade logic
│   │   ├── data/
│   │   │   └── songs.js             # Music database
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── server.py                    # Flask server
│   └── tracklist_api.py             # Music API
└── README.md
```

## 🎯 Use Cases

### For Music Enthusiasts
Create professional-sounding mixes without years of DJ training. Perfect for parties, workouts, or personal enjoyment.

### For Content Creators
Generate seamless background music for YouTube videos, podcasts, or streams with AI-guided transitions.

### For Event Planners
Build custom playlists with professional flow for weddings, corporate events, or social gatherings.

### For Learning DJs
Understand transition techniques and harmonic mixing principles through visual AI feedback.

## 🛠️ Technologies Used

- **Frontend**: React 19, ReactFlow, styled-components, Web Audio API
- **Backend**: Python, Flask
- **AI/ML**: Rule-based music analysis with BPM/key/energy algorithms
- **Audio**: HTML5 Audio, Crossfade automation, Dual-player architecture
- **Deployment**: Node.js, npm

## 🎓 How It Works

### AI Analysis Process
1. **Extract Metadata**: BPM (120-140), Key (Camelot notation), Energy (0-1), Genre
2. **Compare Tracks**: Calculate compatibility using harmonic wheel and BPM difference
3. **Score Transitions**: Assign confidence based on matching criteria
4. **Recommend Type**: Select optimal transition (Beat Match, Blend, Cut, etc.)
5. **Visual Feedback**: Color-code suggestions and edge labels

### Crossfade Engine
1. **Preload Next Track**: Load audio in background
2. **Calculate Timing**: Determine transition point based on AI recommendation
3. **Volume Automation**: 20-step fade curve (current track down, next track up)
4. **Sync Playback**: Use `requestAnimationFrame` for smooth volume changes
5. **Seamless Switch**: Complete transition at optimal timing

## 🏆 Why This Matters

DJ-AI bridges the gap between amateur music curation and professional mixing. By automating the technical analysis that typically requires years of experience, we empower anyone to create high-quality mixes. This has applications in:
- **Education**: Teaching harmonic mixing principles visually
- **Content Creation**: Streamlining background music production
- **Event Planning**: Democratizing professional DJ services
- **Music Discovery**: Finding compatible tracks based on musical characteristics

## 🚀 Future Enhancements

- [ ] Real-time beat detection from audio files
- [ ] Waveform visualization
- [ ] Custom transition duration override
- [ ] Export mix to MP3
- [ ] Real-time audio effects (reverb, echo, filter)
- [ ] Auto-mix generation (AI creates full mix automatically)
- [ ] Spotify/Apple Music integration
- [ ] Collaborative mix editing

## 👥 Team

Shrey Birmiwal, Avi Agarwal, Rishik Kolpekwar, Arjan Suri

## 📄 License

This project uses royalty-free music from Pixabay. All audio files are licensed for free use.

---

**Made with ❤️ and AI** 🎵🤖✨
