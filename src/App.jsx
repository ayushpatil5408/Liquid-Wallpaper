import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";

const PRESETS = {
  Nebula: {
    name: "Nebula",
    tubes: ["#5e72e4", "#8965e0", "#f5365c"],
    lights: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"],
  },
  Cyberpunk: {
    name: "Cyberpunk",
    tubes: ["#ff007f", "#7928ca", "#00f0ff"],
    lights: ["#ff0055", "#00f0ff", "#7928ca", "#ffe600"],
  },
  Ocean: {
    name: "Ocean",
    tubes: ["#0070f3", "#00dfd8", "#7928ca"],
    lights: ["#00dfd8", "#0070f3", "#50e3c2", "#11cdef"],
  },
  Solar: {
    name: "Solar",
    tubes: ["#ff4b1f", "#ff9068", "#ff0844"],
    lights: ["#ff4e50", "#f9d423", "#ff0844", "#ffb199"],
  },
  Acid: {
    name: "Acid",
    tubes: ["#10b981", "#06b6d4", "#84cc16"],
    lights: ["#34d399", "#a3e635", "#22d3ee", "#4ade80"],
  },
};

/**
 * Generates an array of random hex color strings.
 * @param {number} count - The number of random colors to generate.
 * @returns {string[]} An array of color strings.
 */
function randomColors(count) {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
}

export default function App() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  const [activePreset, setActivePreset] = useState("Nebula");
  const [tubeColors, setTubeColors] = useState(PRESETS.Nebula.tubes);
  const [lightColors, setLightColors] = useState(PRESETS.Nebula.lights);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize the TubesCursor 3D animation
  useEffect(() => {
    let isMounted = true;

    const initTimer = setTimeout(async () => {
      try {
        let module;
        const dynamicImport = (u) => new Function("url", "return import(url)")(u);

        try {
          // Primary: load from local bundle in public folder
          module = await dynamicImport("/tubes1.min.js");
        } catch {
          // Fallback: CDN
          module = await dynamicImport(
            "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
          );
        }

        if (!isMounted || !canvasRef.current) return;

        const TubesCursor = module.default;

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: PRESETS.Nebula.tubes,
            lights: {
              intensity: 200,
              colors: PRESETS.Nebula.lights,
            },
          },
        });

        appRef.current = app;
      } catch (err) {
        console.error("Failed to load TubesCursor module:", err);
      }
    }, 120);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (appRef.current && typeof appRef.current.dispose === "function") {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, []);

  // Applies a predefined color atmospheric preset
  const applyPreset = useCallback((key) => {
    const preset = PRESETS[key];
    if (!preset) return;

    setTubeColors(preset.tubes);
    setLightColors(preset.lights);
    setActivePreset(preset.name);

    if (appRef.current?.tubes) {
      appRef.current.tubes.setColors(preset.tubes);
      appRef.current.tubes.setLightsColors(preset.lights);
    }
  }, []);

  // Randomizes the tube and light colors
  const randomizeColors = useCallback(() => {
    const newTubes = randomColors(3);
    const newLights = randomColors(4);

    setTubeColors(newTubes);
    setLightColors(newLights);
    setActivePreset("Custom");

    if (appRef.current?.tubes) {
      appRef.current.tubes.setColors(newTubes);
      appRef.current.tubes.setLightsColors(newLights);
    }
  }, []);

  // Clicking the backdrop triggers color randomization
  const handleContainerClick = (e) => {
    // Prevent triggering when clicking interactive controls
    if (e.target.closest("button") || e.target.closest("aside") || e.target.closest(".topbar")) {
      return;
    }
    randomizeColors();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`app-container ${isZenMode ? "zen-mode" : ""}`}
    >
      {/* 3D WebGL Canvas positioned behind the interface */}
      <canvas ref={canvasRef} className="tubes-canvas" />

      {/* Top Navigation Bar */}
      <header className="topbar">
        <a className="brand" href="/" onClick={(e) => e.stopPropagation()}>
          <span className="brand-mark">✦</span>
          <span className="brand-title">AURA</span>
          <span className="brand-tag">TUBES 3D</span>
        </a>

        <div className="topbar-actions">
          <div className="live-status">
            <span className="status-dot" />
            <span className="status-label">WebGL Active</span>
          </div>

          <button
            type="button"
            className="action-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}
          </button>

          <button
            type="button"
            className={`action-btn ${isZenMode ? "active" : ""}`}
            title="Toggle Zen Wallpaper View"
            onClick={() => setIsZenMode((prev) => !prev)}
          >
            {isZenMode ? "Show HUD" : "Zen Mode"}
          </button>
        </div>
      </header>

      {/* Central Hero Typography */}
      <section className="hero">
        <div className="hero-badge">3D KINETIC LIGHTFIELD</div>
        <h1 className="hero-title">
          <span className="title-lead">Tubes</span>
          <br />
          <span className="title-accent">Cursor</span>
        </h1>
        <p className="hero-subtitle">
          A dynamic three-dimensional fluid light sculpture responding to kinetic gesture.
        </p>

        {/* Live Active Palette Swatch */}
        <div className="palette-preview" title="Current active palette">
          <span className="palette-label">Palette:</span>
          <div className="swatches">
            {tubeColors.map((color, idx) => (
              <span
                key={`tube-${idx}`}
                className="swatch-dot"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                title={`Tube color: ${color}`}
              />
            ))}
            <span className="swatch-divider" />
            {lightColors.map((color, idx) => (
              <span
                key={`light-${idx}`}
                className="swatch-dot light-swatch"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                title={`Light color: ${color}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bottom Left Interaction Hint */}
      <div className="hint">
        <span className="hint-icon">⚡</span>
        <span>Click anywhere to randomize • Move to sculpt light</span>
      </div>

      {/* Floating Interactive Controls HUD */}
      <aside className="controls" onClick={(e) => e.stopPropagation()}>
        <div className="control-heading">
          <span className="heading-title">Atmosphere</span>
          <span className="preset-name">{activePreset}</span>
        </div>

        {/* Curated Preset Buttons */}
        <div className="preset-grid">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              className={`preset-btn ${activePreset === key ? "active" : ""}`}
              onClick={() => applyPreset(key)}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Randomize / Morph Trigger */}
        <button
          type="button"
          className="randomize-btn"
          onClick={randomizeColors}
        >
          <span className="btn-icon">🎲</span>
          <span>Shuffle Palette</span>
        </button>
      </aside>

      {/* Zen Mode Exit Reminder */}
      {isZenMode && (
        <button
          type="button"
          className="zen-restore-btn"
          onClick={() => setIsZenMode(false)}
        >
          ✦ Exit Zen Mode
        </button>
      )}

      {/* Footer */}
      <footer>
        <span>© 2026 AURA LABS</span>
        <span className="footer-dot">•</span>
        <a
          href="https://github.com/ayushpatil5408/Liquid-Wallpaper"
          target="_blank"
          rel="noreferrer"
          className="footer-link"
        >
          GitHub Repo
        </a>
      </footer>
    </div>
  );
}