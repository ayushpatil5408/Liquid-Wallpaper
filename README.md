# ✦ AURA — Interactive Liquid Wallpaper

> A living, interactive generative light canvas and fluid particle wallpaper responding in real-time to pointer and touch movements.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-liquid--wallpaper.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://liquid-wallpaper.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

🔗 **Live Application**: [https://liquid-wallpaper.vercel.app/](https://liquid-wallpaper.vercel.app/)

---

## ✨ Features

- **Fluid Particle Dynamics**: Real-time canvas particle synthesis with speed-based velocity stretching, radius dilation, and chromatic trails.
- **Dynamic Light Gradients**: Multi-stop radial gradients (`screen` blend mode) simulating glowing liquid luminescence.
- **Curated Atmosphere Presets**:
  - 🌊 **Ocean**: Deep cerulean and bioluminescent cyan hues.
  - ☀️ **Solar**: Blazing amber, neon coral, and golden radiation.
  - 🔮 **Cyberpunk**: Electric magenta and ultraviolet synthwave tones.
- **Interactive HUD Controls**: Real-time slider feedback for **Colour** (hue spectrum 0–360°), **Glow** (intensity), and **Trail length**.
- **Touch & Mobile Ready**: Full pointer support with touch drag on mobile and tablet devices, preventing scroll interference with `touch-action: none`.
- **Zero Heavy Dependencies**: Pure Vanilla CSS glassmorphic aesthetic + HTML5 2D Canvas context rendering at a crisp 60 FPS.
- **Vercel Ready**: Pre-configured with `vercel.json` for zero-configuration instant deployment.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayushpatil5408/Liquid-Wallpaper.git
   cd Liquid-Wallpaper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local dev server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deploy to Vercel

This repository is pre-configured for seamless deployment on [Vercel](https://vercel.com):

### Option 1: Import via Vercel Dashboard (Recommended)
1. Push this repository to your GitHub account (`https://github.com/ayushpatil5408/Liquid-Wallpaper.git`).
2. Log into [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **"Add New..."** → **"Project"**.
4. Select `Liquid-Wallpaper` from your GitHub repositories.
5. Vercel automatically detects the Vite framework and settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your site will be live on a `*.vercel.app` URL in seconds!

### Option 2: Deploy using Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Graphics**: HTML5 2D Canvas API
- **Styling**: Vanilla CSS (Glassmorphism, CSS Custom Properties, Responsive Media Queries)
- **Deployment**: Vercel

---

## 📄 License

MIT License © 2026 Ayush Patil
