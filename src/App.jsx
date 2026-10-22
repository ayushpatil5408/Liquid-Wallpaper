import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
    const canvasRef = useRef(null);
    const [hue, setHue] = useState(205);
    const [intensity, setIntensity] = useState(70);
    const [trailLength, setTrailLength] = useState(75);
    const [activePreset, setActivePreset] = useState("Ocean");

    const presets = {
        Ocean: { hue: 205, intensity: 70, trail: 75 },
        Solar: { hue: 18, intensity: 90, trail: 95 },
        Cyberpunk: { hue: 290, intensity: 105, trail: 110 },
    };

    function applyPreset(name) {
        const preset = presets[name];
        setHue(preset.hue);
        setIntensity(preset.intensity);
        setTrailLength(preset.trail);
        setActivePreset(name);
    }

    function checkPreset(newHue, newIntensity, newTrail) {
        const matched = Object.entries(presets).find(
            ([, p]) => p.hue === newHue && p.intensity === newIntensity && p.trail === newTrail
        );
        setActivePreset(matched ? matched[0] : "Custom");
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const drops = [];
        let animationFrame;
        let lastX = window.innerWidth / 2;
        let lastY = window.innerHeight / 2;
        let lastTime = performance.now();

        function resizeCanvas() {
            const scale = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * scale;
            canvas.height = window.innerHeight * scale;
            context.setTransform(scale, 0, 0, scale, 0, 0);
        }

        function createDrop(x, y, speed, angle) {
            const size = 7 + Math.min(speed * 0.14, 25);

            drops.push({
                x,
                y,
                radius: size,
                opacity: 0.75,
                hue: hue + Math.min(speed * 0.5, 100),
                stretchX: Math.cos(angle) * speed * 0.12,
                stretchY: Math.sin(angle) * speed * 0.12,
            });

            if (drops.length > trailLength * 2) drops.shift();
        }

        function draw() {
            context.fillStyle = "rgba(6, 8, 22, 0.22)";
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            context.globalCompositeOperation = "screen";

            for (let index = drops.length - 1; index >= 0; index--) {
                const drop = drops[index];
                const radius = drop.radius * (1 + intensity / 100);

                const glow = context.createRadialGradient(
                    drop.x,
                    drop.y,
                    0,
                    drop.x + drop.stretchX,
                    drop.y + drop.stretchY,
                    radius * 3,
                );

                glow.addColorStop(
                    0,
                    `hsla(${drop.hue}, 100%, 78%, ${drop.opacity})`,
                );
                glow.addColorStop(
                    0.3,
                    `hsla(${drop.hue + 35}, 100%, 60%, ${drop.opacity * 0.58})`,
                );
                glow.addColorStop(
                    0.65,
                    `hsla(${drop.hue + 85}, 100%, 50%, ${drop.opacity * 0.18})`,
                );
                glow.addColorStop(1, "rgba(0, 0, 0, 0)");

                context.fillStyle = glow;
                context.beginPath();
                context.ellipse(
                    drop.x,
                    drop.y,
                    radius * 3 + Math.abs(drop.stretchX),
                    radius * 3 + Math.abs(drop.stretchY),
                    0,
                    0,
                    Math.PI * 2,
                );
                context.fill();

                drop.radius += 0.85;
                drop.opacity -= 0.012;

                if (drop.opacity <= 0) drops.splice(index, 1);
            }

            context.globalCompositeOperation = "source-over";
            animationFrame = requestAnimationFrame(draw);
        }

        function handlePointerMove(event) {
            const now = performance.now();
            const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
            if (distance > 260) {
                lastX = event.clientX;
                lastY = event.clientY;
                lastTime = now;
                return;
            }
            const elapsed = Math.max(now - lastTime, 16);
            const speed = (distance / elapsed) * 16;
            const angle = Math.atan2(event.clientY - lastY, event.clientX - lastX);

            createDrop(event.clientX, event.clientY, speed, angle);

            lastX = event.clientX;
            lastY = event.clientY;
            lastTime = now;
        }

        function handlePointerDown(event) {
            lastX = event.clientX;
            lastY = event.clientY;
            lastTime = performance.now();
            createDrop(event.clientX, event.clientY, 32, 0);
        }

        resizeCanvas();
        draw();

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerdown", handlePointerDown);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [hue, intensity, trailLength]);

    return (
        <main>
            <canvas ref={canvasRef} />

            <header className="topbar">
                <a className="brand" href="/">
                    <span className="brand-mark">✦</span>
                    AURA
                </a>

                <div className="live-status">
                    <span className="status-dot" />
                    Live canvas
                </div>
            </header>

            <section className="hero">
                <p className="eyebrow">GENERATIVE LIGHT / 001</p>
                <h1>
                    Touch the
                    <br />
                    <em>unknown.</em>
                </h1>
                <p className="hero-copy">
                    A living field of colour that responds to every movement.
                </p>
            </section>

            <div className="hint">
                <span className="mouse-icon">⌁</span>
                Move to create
            </div>

            <aside className="controls">
                <div className="control-heading">
                    <span>Atmosphere</span>
                    <span className="preset">{activePreset}</span>
                </div>

                <div className="preset-buttons">
                    {Object.keys(presets).map((name) => (
                        <button
                            className={activePreset === name ? "active" : ""}
                            key={name}
                            onClick={() => applyPreset(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <label>
                    Colour ({hue}°)
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            setHue(val);
                            checkPreset(val, intensity, trailLength);
                        }}
                    />
                </label>

                <label>
                    Glow ({intensity}%)
                    <input
                        type="range"
                        min="20"
                        max="120"
                        value={intensity}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            setIntensity(val);
                            checkPreset(hue, val, trailLength);
                        }}
                    />
                </label>

                <label>
                    Trail ({trailLength})
                    <input
                        type="range"
                        min="25"
                        max="120"
                        value={trailLength}
                        onChange={(event) => {
                            const val = Number(event.target.value);
                            setTrailLength(val);
                            checkPreset(hue, intensity, val);
                        }}
                    />
                </label>
            </aside>

            <footer>
                <span>© 2026 AURA LABS</span>
                <span>EXPERIMENT 01</span>
            </footer>
        </main>
    );
}