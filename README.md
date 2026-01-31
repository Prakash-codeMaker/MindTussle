# 🧠 MindTussle: AI Tactical Focus Shield

![MindTussle Status](https://img.shields.io/badge/Status-Operational-emerald)
![AI Model](https://img.shields.io/badge/AI-Gemini_1.5_Flash-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_React_|_Tailwind-slate)

**MindTussle** is an advanced, AI-powered focus guardian that acts as a **ruthless personal proctor**. Unlike simple website blockers, it uses **Computer Vision (Gemini 1.5 Flash)** to analyze your screen in real-time, detecting distractions even if they are in background tabs, split screens, or different windows.

> **"It's like having an exam proctor watching your screen, ensuring you stick to your allowed tools."**

---

## 🛡️ Key Features

### 👁️ Ruthless AI Proctoring
- **Real-Time Screen Analysis**: Captures screen activity every 5 seconds.
- **Strict Whitelist Enforcement**: You define EXACTLY what is allowed (e.g., "LeetCode", "VS Code").
- **Zero Tolerance**: If the AI detects **ANY** non-allowed site (YouTube, Twitter, Netflix) anywhere on your screen, it triggers an immediate **RED ALERT**.
- **AI + Heuristic Hybrid**: Combines Gemini's semantic understanding with hard-coded safety nets for instant detection of common distractions.

### 🎮 Gamified Focus
- **Mission Control**: Set your objective (e.g., "Study DSA for 2 hours").
- **XP System**: Earn `Focus XP` for every minute of clean, distraction-free work.
- **Drift Penalties**: Lose integrity and XP when distractions are detected.
- **Daily Analytics**: Track your focus score, shield efficiency, and distraction patterns.

### 🧩 Browser Extension Integration
- **Tactical Shield Extension**: Connects with the dashboard to provide seamless feedback.
- **Non-Intrusive**: No page blocking or blurring—just clear, undeniable feedback when you drift.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Framer Motion (for tactical animations).
- **Styling**: Tailwind CSS (Dark/Cyberpunk aesthetic).
- **AI Core**: Google Gemini API (`gemini-1.5-flash`) for multimodal vision analysis.
- **State Management**: LocalStorage for mission persistence across reloads.
- **Extension**: Chrome Manifest V3.

---

## 🚀 Getting Started

### 1. Prerequisities
- Node.js 18+ installed.
- A Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/)).

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Prakash-codeMaker/MindTussle.git
cd MindTussle

# Install dependencies
npm install
```

### 3. Configuration

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run the Dashboard

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Tactical Dashboard.

### 5. Install the Chrome Extension
1. Go to `chrome://extensions/`.
2. Enable **Developer Mode** (top right).
3. Click **Load unpacked**.
4. Select the `tactical-shield-extension` folder inside this project.

---

## 🕹️ How to Use

1. **Enter Mission Control**: Open the dashboard and define your goal.
2. **Set Allowed Tools**: Be specific! (e.g., "LeetCode", "StackOverflow").
   - *Note: If you don't add it, the AI will flag it as a distraction!*
3. **Start Monitoring**:
   - Click **"Start Monitoring"** in the Live Monitor.
   - Select the screen or window you want to protect.
4. **Work**:
   - Limit your activity to your allowed tools.
   - If you open YouTube or drift away, the **Red Alert** will trigger immediately.

---

## ⚠️ Privacy Note
MindTussle processes screen data **ephemerally**. Screenshots are sent to the Gemini API for analysis and strictly **discarded** afterwards. No video is recorded or stored on any server.

---

## 📄 License
MIT License. Built for Hack Day.
