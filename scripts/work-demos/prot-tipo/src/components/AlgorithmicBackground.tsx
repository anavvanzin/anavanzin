import React, { useEffect, useRef, useState } from "react";
import { Sliders, Sparkles, Play, Pause, RefreshCw, Palette } from "lucide-react";

type ThemeKey = "teal" | "amber" | "violet" | "mono";

interface ThemeConfig {
  color: string;
  glow: string;
  cursorGlow: string;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  teal: {
    color: "rgba(20, 184, 166, 0.15)", // Teal
    glow: "rgba(20, 184, 166, 0.35)",
    cursorGlow: "rgba(20, 184, 166, 0.6)"
  },
  amber: {
    color: "rgba(245, 158, 11, 0.15)", // Amber
    glow: "rgba(245, 158, 11, 0.35)",
    cursorGlow: "rgba(245, 158, 11, 0.6)"
  },
  violet: {
    color: "rgba(168, 85, 247, 0.15)", // Purple
    glow: "rgba(168, 85, 247, 0.35)",
    cursorGlow: "rgba(168, 85, 247, 0.6)"
  },
  mono: {
    color: "rgba(148, 163, 184, 0.15)", // Slate/Grey
    glow: "rgba(148, 163, 184, 0.3)",
    cursorGlow: "rgba(148, 163, 184, 0.5)"
  }
};

export default function AlgorithmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Customization controls
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("teal");
  const [density, setDensity] = useState<number>(35); // Number of streams as percentage of screen width
  const [speedMult, setSpeedMult] = useState<number>(1); // Speed multiplier
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [cursorInfluence, setCursorInfluence] = useState<boolean>(true);

  // Keep mouse coords in ref for animation frame callback loop
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Handle stream state dynamically
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions setup
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
        initStreams(); // Reinitialize columns to fit the new size
      }
    });
    resizeObserver.observe(container);

    // Stream elements setup
    const fontSize = 14;
    interface Stream {
      x: number;
      y: number;
      speed: number;
      chars: string[];
      opacity: number;
      lastUpdate: number;
      updateInterval: number;
    }

    let streams: Stream[] = [];

    const initStreams = () => {
      const colCount = Math.floor((width / fontSize) * (density / 100)) || 10;
      streams = [];
      for (let i = 0; i < colCount; i++) {
        const xCoord = Math.random() * width;
        const initialY = Math.random() * -height;
        const speed = (Math.random() * 2 + 1) * speedMult;

        // Generate pre-populated symbols arrays
        const charLength = Math.floor(Math.random() * 12 + 6);
        const randChars = Array.from({ length: charLength }, () =>
          Math.random() > 0.6 ? "1" : "0"
        );

        streams.push({
          x: xCoord,
          y: initialY,
          speed,
          chars: randChars,
          opacity: Math.random() * 0.6 + 0.3,
          lastUpdate: 0,
          updateInterval: Math.random() * 150 + 50
        });
      }
    };

    initStreams();

    let animationFrameId: number;
    const currentTheme = THEMES[activeTheme];

    // Main Canvas Render loop
    const render = (time: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint grid gridline pattern for extra high-tech aesthetic
      ctx.strokeStyle = "rgba(15, 23, 42, 0.4)";
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw interactive cursor shockwaves if cursor active
      if (cursorInfluence && mouseRef.current.active) {
        const mouse = mouseRef.current;
        const radius = 120;

        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, radius
        );
        gradient.addColorStop(0, currentTheme.cursorGlow.replace("0.6", "0.08"));
        gradient.addColorStop(0.5, currentTheme.cursorGlow.replace("0.6", "0.02"));
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render binary cascades
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];

        // Push characters down
        stream.y += stream.speed;

        // Reset if reached bottom
        if (stream.y > height + 100) {
          stream.y = Math.random() * -150 - 20;
          stream.x = Math.random() * width;
        }

        // Randomly flip existing binary states for natural organic flicker
        if (time - stream.lastUpdate > stream.updateInterval) {
          stream.chars = stream.chars.map((char) => {
            if (Math.random() > 0.85) {
              return char === "0" ? "1" : "0";
            }
            return char;
          });
          stream.lastUpdate = time;
        }

        // Apply interactive cursor deflection
        let screenX = stream.x;
        let screenY = stream.y;

        if (cursorInfluence && mouseRef.current.active) {
          const m = mouseRef.current;
          const dx = screenX - m.x;
          const dy = screenY - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const force = (110 - dist) / 110;
            const angle = Math.atan2(dy, dx);
            // Deflect character codes slightly away
            screenX += Math.cos(angle) * force * 15;
            screenY += Math.sin(angle) * force * 15;
          }
        }

        // Draw character column stream
        for (let j = 0; j < stream.chars.length; j++) {
          const charY = screenY - j * (fontSize + 2);
          if (charY < 0 || charY > height) continue;

          const isHead = j === 0;
          const charRatio = (stream.chars.length - j) / stream.chars.length;

          // Outer elements fade out gradually
          const baseOpacity = stream.opacity * charRatio;

          if (isHead) {
            // Bright leading character
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.shadowColor = currentTheme.glow;
            ctx.shadowBlur = 6;
          } else {
            // Flow theme styling
            ctx.fillStyle = currentTheme.color.replace("0.15", baseOpacity.toFixed(3));
            ctx.shadowBlur = 0; // Disable blur for body to remain robustly performant
          }

          ctx.fillText(stream.chars[j], screenX, charY);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [density, speedMult, activeTheme, isPaused, cursorInfluence]);

  // Track cursor coordinates
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-auto cursor-default opacity-85"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Subtle bottom screen black blur gradient overlay for layout integration */}
      <div className="absolute bottom-0 left-0 right-0 h-[22rem] bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

      {/* Floating Algorithmic Aesthetic Calibration Panel */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
        <div className="relative">
          {/* Main small toggler */}
          <button
            onClick={() => setShowControls(prev => !prev)}
            className="flex items-center gap-1.5 p-2 px-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 text-[10px] uppercase font-mono tracking-wider font-bold text-slate-300 rounded-lg shadow-xl hover:border-teal-500/50 hover:text-white transition duration-200"
          >
            <Sliders size={12} className={showControls ? "text-teal-400 rotate-90 transition-transform duration-300" : "text-slate-400 transition-transform duration-350"} />
            <span>Fundo Algorítmico</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          </button>

          {/* Expanded tuning details dashboard window */}
          {showControls && (
            <div className="absolute bottom-11 left-0 bg-slate-950/95 border border-slate-850 p-4 rounded-xl w-72 shadow-2xl space-y-4 backdrop-blur-md animate-fadeIn">
              <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-black font-mono uppercase text-slate-200 tracking-wide flex items-center gap-1">
                    <Sparkles size={11} className="text-teal-400" />
                    Console de Calibração
                  </h4>
                  <p className="text-[9px] text-slate-500 font-mono">Personalização de Cascatas Binárias</p>
                </div>
                <button
                  onClick={() => setIsPaused(p => !p)}
                  className="p-1 px-2 bg-slate-900 rounded border border-slate-800 hover:border-slate-705 text-[8.5px] font-mono hover:text-white transition"
                >
                  {isPaused ? <span className="flex items-center gap-0.5"><Play size={8} /> RETOMAR</span> : <span className="flex items-center gap-0.5"><Pause size={8} /> CONGELAR</span>}
                </button>
              </div>

              {/* Theme selection slots */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                  Perfil de Matriz Cromática (Cor)
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(Object.keys(THEMES) as ThemeKey[]).map((theme) => {
                    const isActive = activeTheme === theme;
                    let label = "Teal";
                    let badgeColor = "bg-teal-500";
                    if (theme === "amber") { label = "Amber"; badgeColor = "bg-amber-500"; }
                    if (theme === "violet") { label = "Violet"; badgeColor = "bg-purple-500"; }
                    if (theme === "mono") { label = "Slate"; badgeColor = "bg-slate-400"; }

                    return (
                      <button
                        key={theme}
                        onClick={() => setActiveTheme(theme)}
                        className={`p-1.5 rounded text-[9px] font-mono border text-center transition ${
                          isActive
                            ? "bg-slate-905 border-slate-700 text-white font-black"
                            : "bg-slate-900/40 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-350"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badgeColor} inline-block mr-1`} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Density sliders */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9.5px] font-mono uppercase font-bold text-slate-400">
                  <span>Densidade de Fluxos</span>
                  <span className="text-teal-400">{density}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Speed modifiers */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9.5px] font-mono uppercase font-bold text-slate-400">
                  <span>Velocidade de Processo</span>
                  <span className="text-teal-400">{speedMult}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.2"
                  value={speedMult}
                  onChange={(e) => setSpeedMult(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              {/* Interaction toggle switches */}
              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[9.5px] font-mono">
                <span className="text-slate-400">Interação sob Cursor</span>
                <button
                  onClick={() => setCursorInfluence(!cursorInfluence)}
                  className={`px-1.5 py-0.5 rounded border text-[8.5px] uppercase font-bold transition ${
                    cursorInfluence
                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400"
                      : "bg-slate-900 border-slate-850 text-slate-500"
                  }`}
                >
                  {cursorInfluence ? "ATIVO" : "INATIVO"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

    </div>
  );
}
