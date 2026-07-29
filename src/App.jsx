import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ScanSearch,
  Move3d,
  Orbit,
  Sparkles,
  Waves,
} from "lucide-react";

const SECTION = "relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";
const PANEL =
  "rounded-3xl border border-white/[0.1] bg-white/[0.06] shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl";
const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Label({ children, tone = "neutral" }) {
  const tones = {
    neutral: "border-white/[0.15] bg-white/[0.06] text-white/80",
    established: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    supported: "border-sky-400/30 bg-sky-400/10 text-sky-200",
    model: "border-violet-400/30 bg-violet-400/10 text-violet-200",
    hypothesis: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    speculation: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    personal: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  };
  return <span className={cn(chipBase, tones[tone] || tones.neutral)}>{children}</span>;
}

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-12 bg-gradient-to-r from-cyan-300/70 to-transparent" />
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100/80">
          {kicker}
        </span>
      </div>
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-pretty text-base leading-8 text-white/70 sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
}

function StarField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let raf = 0;
    let stars = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(canvas.clientWidth * dpr);
      h = canvas.height = Math.floor(canvas.clientHeight * dpr);
      stars = Array.from({ length: Math.floor((w * h) / 170000) + 180 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.15,
        v: Math.random() * 0.08 + 0.02,
        a: Math.random() * 0.7 + 0.15,
      }));
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(w * 0.5, h * 0.18, 0, w * 0.5, h * 0.18, Math.max(w, h) * 0.8);
      g.addColorStop(0, "rgba(110,90,255,0.18)");
      g.addColorStop(0.35, "rgba(29,78,216,0.1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.y += s.v;
        if (s.y > h + 5) {
          s.y = -5;
          s.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-80" />;
}

function PointIcon() {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <div className="h-4 w-4 rounded-full bg-white shadow-[0_0_50px_rgba(255,255,255,0.95)]" />
    </div>
  );
}

function LineIcon() {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <svg viewBox="0 0 200 200" className="h-56 w-56">
        <motion.line
          x1="25"
          y1="100"
          x2="175"
          y2="100"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>
    </div>
  );
}

function SquareIcon() {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <svg viewBox="0 0 200 200" className="h-56 w-56">
        <motion.rect
          x="40"
          y="40"
          width="120"
          height="120"
          rx="10"
          fill="none"
          stroke="white"
          strokeWidth="4"
          initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
        />
      </svg>
    </div>
  );
}

function CubeIcon() {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <svg viewBox="0 0 220 220" className="h-60 w-60">
        <g fill="none" stroke="white" strokeWidth="3">
          <path d="M60 70 L140 70 L140 150 L60 150 Z" />
          <path d="M85 45 L165 45 L165 125 L85 125 Z" opacity="0.8" />
          <path d="M60 70 L85 45" />
          <path d="M140 70 L165 45" />
          <path d="M140 150 L165 125" />
          <path d="M60 150 L85 125" />
        </g>
      </svg>
    </div>
  );
}

function TesseractIcon() {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <svg viewBox="0 0 220 220" className="h-60 w-60">
        <g fill="none" stroke="white" strokeWidth="2.5">
          <rect x="42" y="48" width="90" height="90" rx="6" />
          <rect x="88" y="82" width="90" height="90" rx="6" opacity="0.82" />
          <path d="M42 48 L88 82" />
          <path d="M132 48 L178 82" />
          <path d="M132 138 L178 172" />
          <path d="M42 138 L88 172" />
        </g>
      </svg>
      <div className="mt-2 text-center text-sm text-white/55">
        A 4D object is often seen only through projection or cross-section.
      </div>
    </div>
  );
}

function HypercubeIcon({ level }) {
  return (
    <div className="grid h-64 w-64 place-items-center">
      <svg viewBox="0 0 220 220" className="h-60 w-60">
        <g fill="none" stroke="white" strokeWidth="2.1" opacity="0.95">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.circle
              key={i}
              cx="110"
              cy="110"
              r={24 + i * 12}
              opacity={0.85 - i * 0.09}
              animate={{ rotate: 360 }}
              transition={{ duration: 30 - i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
          <path d="M35 110 H185" opacity="0.4" />
          <path d="M110 35 V185" opacity="0.4" />
          <path d="M58 58 L162 162" opacity="0.35" />
          <path d="M162 58 L58 162" opacity="0.35" />
        </g>
      </svg>
      <div className="mt-2 text-center text-sm text-white/55">
        {level}D remains mathematically drawable even when it is not intuitively visualizable.
      </div>
    </div>
  );
}

function DimensionDiagram() {
  const [dim, setDim] = useState(3);
  const items = useMemo(
    () => [
      { d: 0, name: "Point", desc: "No length, no width, no volume." },
      { d: 1, name: "Line", desc: "Only one direction exists." },
      { d: 2, name: "Square / Plane", desc: "Two independent directions." },
      { d: 3, name: "Cube", desc: "Our everyday spatial intuition." },
      { d: 4, name: "Tesseract", desc: "A 4D analog of a cube." },
      { d: 5, name: "Hypercube", desc: "A further step into abstract geometry." },
      { d: 6, name: "Higher-dimensional space", desc: "Useful in some theories, invisible to our senses." },
      { d: 7, name: "Beyond familiar intuition", desc: "Mathematics can still describe it." },
    ],
    []
  );

  const current = items[dim];
  const pulse = 1 + dim * 0.035;

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label tone="model">Mathematical Model</Label>
              <h3 className="mt-4 text-2xl font-semibold text-white">Journey Through Dimensions</h3>
            </div>
            <span className="rounded-full border border-white/[0.1] bg-black/30 px-3 py-1 text-xs text-white/60">
              0D → 7D
            </span>
          </div>

          <div className="mt-8 rounded-3xl border border-white/[0.1] bg-black/25 p-6">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Dimension slider</span>
              <span className="font-mono text-white/90">{dim}D</span>
            </div>

            <input
              aria-label="Dimension slider"
              type="range"
              min="0"
              max="7"
              step="1"
              value={dim}
              onChange={(e) => setDim(parseInt(e.target.value, 10))}
              className="mt-4 w-full accent-cyan-300"
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <button
                  key={item.d}
                  onClick={() => setDim(item.d)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition",
                    dim === item.d
                      ? "border-cyan-300/40 bg-cyan-300/10 text-white"
                      : "border-white/[0.1] bg-white/[0.05] text-white/70 hover:bg-white/[0.08]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {item.d}D — {item.name}
                    </div>
                    <span className="text-xs text-white/40">{item.d === 4 ? "4D" : ""}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-white/60">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-white/[0.1] bg-[radial-gradient(circle_at_center,rgba(101,163,255,0.16),rgba(10,10,25,0.95)_58%)] p-6">
          <div className="absolute inset-0 opacity-70">
            <svg viewBox="0 0 600 600" className="h-full w-full">
              <defs>
                <linearGradient id="gridGlow" x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(125,211,252,0.08)" />
                  <stop offset="50%" stopColor="rgba(196,181,253,0.18)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                </linearGradient>
              </defs>
              <g stroke="url(#gridGlow)" strokeWidth="1.1" fill="none" opacity="0.9">
                {[...Array(12)].map((_, i) => (
                  <circle key={i} cx="300" cy="300" r={28 + i * 18} opacity={0.35 - i * 0.02} />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={i} x1={40 + i * 45} y1="40" x2={40 + i * 45} y2="560" opacity="0.2" />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={i} x1="40" y1={40 + i * 45} x2="560" y2={40 + i * 45} opacity="0.2" />
                ))}
              </g>
            </svg>
          </div>

          <motion.div
            key={dim}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
            style={{ scale: pulse }}
          >
            {dim === 0 && <PointIcon />}
            {dim === 1 && <LineIcon />}
            {dim === 2 && <SquareIcon />}
            {dim === 3 && <CubeIcon />}
            {dim === 4 && <TesseractIcon />}
            {dim >= 5 && <HypercubeIcon level={dim} />}
          </motion.div>

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/[0.1] bg-black/30 p-4 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{current.name}</div>
                <p className="mt-1 text-sm leading-6 text-white/65">{current.desc}</p>
              </div>
              <div className="text-right text-xs text-white/45">
                <div>Cross-sections are how lower-dimensional observers perceive higher-dimensional objects.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CrossSectionExplainer() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: "Enter", x: 20, r: 20 },
    { label: "Slice", x: 80, r: 46 },
    { label: "Peak", x: 150, r: 72 },
    { label: "Exit", x: 220, r: 42 },
    { label: "Gone", x: 280, r: 18 },
  ];
  const p = phases[phase];

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Label tone="supported">Established Science</Label>
          <h3 className="mt-4 text-2xl font-semibold text-white">Flatland and the Problem of Perception</h3>
          <p className="mt-4 text-base leading-8 text-white/70">
            Imagine a 2D world. A 3D hand passes through it. The inhabitants never see the hand all at once.
            They only see a changing cross-section. That is not magic. It is geometry. The same logic is why we ask a difficult question: if this happens one dimension lower, could something analogous happen one dimension higher?
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              className="rounded-full border border-white/[0.1] bg-white/[0.08] px-3 py-2 text-sm text-white/75"
              onClick={() => setPhase((s) => Math.max(0, s - 1))}
            >
              Previous slice
            </button>
            <button
              className="rounded-full border border-white/[0.1] bg-white/[0.08] px-3 py-2 text-sm text-white/75"
              onClick={() => setPhase((s) => Math.min(phases.length - 1, s + 1))}
            >
              Next slice
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/[0.1] bg-black/30 p-5">
          <div className="mb-4 flex items-center justify-between text-sm text-white/55">
            <span>Flatland cross-section</span>
            <span>{p.label}</span>
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-3xl bg-[linear-gradient(180deg,rgba(16,18,32,0.9),rgba(4,7,16,0.96))]">
            <svg viewBox="0 0 300 240" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="flatGrid" x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                  <stop offset="100%" stopColor="rgba(135,206,255,0.12)" />
                </linearGradient>
              </defs>
              <g stroke="url(#flatGrid)" strokeWidth="1">
                {[...Array(10)].map((_, i) => (
                  <line key={i} x1="20" y1={30 + i * 20} x2="280" y2={30 + i * 20} />
                ))}
                {[...Array(12)].map((_, i) => (
                  <line key={i} x1={20 + i * 22} y1="20" x2={20 + i * 22} y2="220" opacity="0.45" />
                ))}
              </g>
              <rect x="20" y="20" width="260" height="200" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
              <motion.circle
                cx={p.x}
                cy="120"
                r={p.r}
                fill="rgba(125,211,252,0.22)"
                stroke="rgba(125,211,252,0.9)"
                strokeWidth="3"
                animate={{ cx: p.x, r: p.r }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
              />
              <path d="M20 120 H280" stroke="rgba(255,255,255,0.14)" strokeDasharray="8 8" />
              <text x="24" y="238" fill="rgba(255,255,255,0.55)" fontSize="11">
                Only the slice is visible to Flatland observers.
              </text>
            </svg>
            <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
              A 3D object becomes a 2D event.
            </div>
            <div className="absolute right-4 bottom-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
              What would a 4D object become in our 3D world?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RangeCard({ title, value, min, max, onChange, label }) {
  return (
    <div className="rounded-3xl border border-white/[0.1] bg-black/25 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/50">{label}</div>
        </div>
        <div className="font-mono text-lg text-white/90">{value}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 w-full accent-violet-300"
      />
    </div>
  );
}

function BlackHoleScene() {
  const [mass, setMass] = useState(12);
  const [distance, setDistance] = useState(56);

  const rs = (mass * 2.95).toFixed(1);
  const curvature = Math.min(95, Math.max(10, 100 - distance));

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div>
          <Label tone="established">Established Physics</Label>
          <h3 className="mt-4 text-2xl font-semibold text-white">The Black Hole Mystery</h3>
          <p className="mt-4 text-base leading-8 text-white/70">
            A massive star exhausts nuclear fuel. Pressure support weakens. Gravity wins. Matter can collapse into a region where escape becomes impossible beyond the event horizon. The horizon is not a surface of solid material; it is a boundary in spacetime. A singularity appears in classical equations, but many physicists expect quantum gravity to change that story.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <RangeCard title="Mass of the object" value={mass} min={3} max={40} onChange={setMass} label="Solar masses" />
            <RangeCard title="Observer distance" value={distance} min={4} max={100} onChange={setDistance} label="Closer means stronger curvature" />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Label tone="supported">Supported Observation</Label>
            <Label tone="model">Mathematical Model</Label>
            <Label tone="hypothesis">Research Hypothesis</Label>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[radial-gradient(circle_at_center,rgba(20,24,51,0.95),rgba(4,7,16,1)_68%)] p-5">
          <svg viewBox="0 0 640 560" className="h-full w-full">
            <defs>
              <linearGradient id="gridWaves" x1="0" x2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(125,211,252,0.18)" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="640" height="560" fill="rgba(255,255,255,0.01)" />
            <g opacity="0.55" stroke="url(#gridWaves)">
              {[...Array(10)].map((_, i) => (
                <path
                  key={i}
                  d={`M40 ${110 + i * 30} C 180 ${90 + i * 30}, 380 ${140 + i * 24}, 600 ${100 + i * 30}`}
                  fill="none"
                  opacity={0.16 + i * 0.03}
                />
              ))}
            </g>
            <circle cx="320" cy="280" r="54" fill="rgba(0,0,0,0.98)" />
            <circle cx="320" cy="280" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <circle cx="320" cy="280" r="160" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="320" cy="280" r="220" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <motion.circle
              cx="320"
              cy="280"
              r="104"
              fill="none"
              stroke="rgba(125,211,252,0.85)"
              strokeWidth="2"
              strokeDasharray="10 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              style={{ originX: 320, originY: 280 }}
            />
            <g transform="translate(480 120)">
              <motion.path
                d="M0 0 C 40 18, 70 42, 106 74"
                fill="none"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}
              />
              <circle cx="0" cy="0" r="7" fill="white" />
              <text x="0" y="108" fill="rgba(255,255,255,0.65)" fontSize="14">
                Spacetime bends
              </text>
            </g>
          </svg>

          <div className="absolute left-5 top-5 rounded-2xl border border-white/[0.1] bg-black/35 p-4 backdrop-blur-md">
            <div className="text-sm font-semibold text-white">Schwarzschild radius</div>
            <div className="mt-1 font-mono text-2xl text-cyan-200">{rs} km</div>
            <div className="mt-1 text-xs text-white/50">
              Approximate for non-rotating idealized objects.
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/[0.1] bg-black/35 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">Curvature intensity</div>
                <div className="text-xs text-white/50">A visual metaphor, not a literal measurement</div>
              </div>
              <div className="font-mono text-xl text-violet-200">{curvature}%</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500"
                style={{ width: `${curvature}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MathSection() {
  const cards = [
    { eq: "(x, y)", title: "Coordinates", tone: "established", desc: "A point in 2D space is described by two numbers." },
    { eq: "d = √((x₂−x₁)² + (y₂−y₁)²)", title: "Distance formula", tone: "supported", desc: "How far apart are two points? Geometry turned into arithmetic." },
    { eq: "(x, y, z)", title: "3D coordinates", tone: "supported", desc: "Add one more independent direction." },
    { eq: "(x, y, z, w)", title: "4D coordinates", tone: "model", desc: "Mathematically valid, physically hidden from direct sight." },
    { eq: "Rμν − ½gμνR + Λgμν = (8πG/c⁴)Tμν", title: "Einstein field equations", tone: "established", desc: "Matter-energy tells spacetime how to curve; curvature tells matter how to move." },
    { eq: "rₛ = 2GM/c²", title: "Schwarzschild radius", tone: "supported", desc: "The horizon scale for a non-rotating black hole idealization." },
  ];

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <SectionHeading
        kicker="Mathematics"
        title="How do equations let us think beyond intuition?"
        subtitle="Start with points and distances. Then extend to vectors, curvature, tensors, and relativity. The formulas are not decoration. They are compressed ways of asking precise questions."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-3xl border border-white/[0.1] bg-black/25 p-5">
            <Label tone={card.tone}>{card.tone.charAt(0).toUpperCase() + card.tone.slice(1)}</Label>
            <div className="mt-4 text-sm uppercase tracking-[0.25em] text-white/40">{card.title}</div>
            <div className="mt-3 text-xl font-semibold text-white">{card.eq}</div>
            <p className="mt-3 text-sm leading-7 text-white/65">{card.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-white/[0.1] bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-fuchsia-500/10 p-5">
        <p className="text-sm leading-7 text-white/72">
          <Label tone="model">Mathematical Model</Label>{" "}
          A tensor is like a multi-directional data structure for geometry and physics. A curvature tensor tells us how space changes when you move in different directions. In general relativity, curvature is not a background stage; it is the stage itself.
        </p>
      </div>
    </div>
  );
}

function TheoryMatrix() {
  const theories = [
    ["General Relativity", "Strongly supported", "Gravity as spacetime curvature."],
    ["Quantum Mechanics", "Strongly supported", "The best-tested theory of microphysics."],
    ["String Theory", "Mathematically rich, unconfirmed", "A possible framework with extra dimensions."],
    ["M-Theory", "Speculative framework", "An umbrella idea unifying string pictures."],
    ["Brane Cosmology", "Research hypothesis", "Our universe as a membrane in a higher-dimensional space."],
    ["Holographic Principle", "Active research", "Information in a volume may be encoded on a boundary."],
    ["Loop Quantum Gravity", "Active research", "A discrete approach to quantum spacetime."],
    ["Black String", "Mathematical solution", "Useful in theoretical gravity, not observed astrophysically."],
    ["Higher-Dimensional Black Holes", "Mathematical possibility", "Solutions exist in some theories of gravity."],
    ["ER = EPR", "Highly speculative", "A bold conjecture linking geometry and entanglement."],
  ];

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <SectionHeading
        kicker="Existing Scientific Theories"
        title="Which ideas are well-supported, and which are still only possibilities?"
        subtitle="The map must stay honest. Mathematics can permit many worlds, but nature chooses only those that survive observation."
      />
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.1]">
        <div className="grid grid-cols-[1.2fr_0.75fr_1.1fr] bg-white/[0.05] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          <div>Theory</div>
          <div>Status</div>
          <div>What it suggests</div>
        </div>
        <div className="divide-y divide-white/[0.1] bg-black/25">
          {theories.map(([name, status, meaning]) => (
            <div key={name} className="grid grid-cols-[1.2fr_0.75fr_1.1fr] gap-4 px-5 py-4 text-sm text-white/75">
              <div className="font-medium text-white">{name}</div>
              <div>{status}</div>
              <div className="leading-6 text-white/65">{meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EvidenceQuestions() {
  const objections = [
    "We do not currently have direct evidence that black holes are intersections with higher-dimensional objects.",
    "Analogies are not proof. A shared visual pattern can arise from very different physics.",
    "Classical black holes are already explained extremely well by general relativity in 4D spacetime.",
    "Extra-dimensional models must still reproduce precision tests of gravity, cosmology, and particle physics.",
    "No confirmed observation uniquely requires a higher-dimensional footprint interpretation.",
  ];
  const tests = [
    ["Gravitational waves", "Look for deviations in ringdown spectra or inspiral dynamics."],
    ["Event Horizon Telescope", "Seek horizon-scale structure inconsistent with standard models."],
    ["Particle accelerators", "Search for signatures of extra dimensions, if they exist at accessible scales."],
    ["Quantum gravity", "Try to connect horizon behavior with a deeper microphysical theory."],
    ["Future telescopes", "Sharper imaging could constrain alternative compact-object models."],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={cn(PANEL, "p-6 sm:p-8")}>
        <SectionHeading
          kicker="Could This Idea Be Wrong?"
          title="Yes — and the scientific objections matter."
          subtitle="Brutal honesty is part of the method. Right now, scientists do not conclude that black holes are higher-dimensional footprints. The burden of proof is extremely high."
        />
        <div className="mt-6 space-y-3">
          {objections.map((text) => (
            <div key={text} className="rounded-2xl border border-white/[0.1] bg-black/25 p-4 text-sm leading-7 text-white/72">
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className={cn(PANEL, "p-6 sm:p-8")}>
        <SectionHeading
          kicker="Could This Idea Ever Be Tested?"
          title="What would count as evidence?"
          subtitle="Only predictions that can fail are useful. If the idea cannot distinguish itself from ordinary black holes, it remains philosophical."
        />
        <div className="mt-6 space-y-3">
          {tests.map(([name, desc]) => (
            <div key={name} className="rounded-2xl border border-white/[0.1] bg-black/25 p-4">
              <div className="flex items-center gap-2 text-white">
                <ScanSearch className="h-4 w-4 text-cyan-200" />
                <div className="font-semibold">{name}</div>
              </div>
              <p className="mt-2 text-sm leading-7 text-white/65">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    ["Euclid", "Geometry becomes rigorous language."],
    ["Newton", "Gravity becomes a universal force."],
    ["Maxwell", "Fields unify electricity and magnetism."],
    ["Einstein", "Spacetime curves."],
    ["Schwarzschild", "The first black hole solution appears."],
    ["Penrose", "Singularity theorems reshape collapse."],
    ["Hawking", "Black holes radiate in quantum theory."],
    ["Modern imaging", "The horizon gets close to a picture."],
    ["Future quantum gravity", "The next revolution may live here."],
  ];
  const [active, setActive] = useState(4);

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <SectionHeading
        kicker="Timeline of Discovery"
        title="Science did not arrive at black holes all at once."
        subtitle="Every generation changed the question. Every answer opened a more difficult one."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-white/[0.1] bg-black/25 p-4">
          <div className="space-y-2">
            {events.map(([name], idx) => (
              <button
                key={name}
                onClick={() => setActive(idx)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
                  idx === active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/[0.05]"
                )}
              >
                <span className={cn("grid h-7 w-7 place-items-center rounded-full border text-xs", idx === active ? "border-cyan-300/50 bg-cyan-300/12" : "border-white/[0.1] bg-white/[0.05]")}>
                  {idx + 1}
                </span>
                <span className="font-semibold">{name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-br from-cyan-400/10 via-violet-500/10 to-black/25 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-white/45">Selected moment</div>
          <h4 className="mt-3 text-3xl font-semibold text-white">{events[active][0]}</h4>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/72">{events[active][1]}</p>
          <div className="mt-8 h-60 rounded-3xl border border-white/[0.1] bg-black/30 p-4">
            <svg viewBox="0 0 500 260" className="h-full w-full">
              <defs>
                <linearGradient id="timelineGlow" x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(125,211,252,0.18)" />
                  <stop offset="100%" stopColor="rgba(196,181,253,0.24)" />
                </linearGradient>
              </defs>
              <path d="M20 182 C110 160, 160 112, 240 142 S390 220, 480 96" fill="none" stroke="url(#timelineGlow)" strokeWidth="5" />
              <circle cx={40 + active * 48} cy={170 - active * 7} r="12" fill="rgba(125,211,252,0.9)" />
              <g stroke="rgba(255,255,255,0.12)">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={i} x1="20" y1={40 + i * 35} x2="480" y2={40 + i * 35} />
                ))}
              </g>
              <text x="22" y="28" fill="rgba(255,255,255,0.55)" fontSize="12">
                A timeline is a memory of questions, not just dates.
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThoughtExperiment() {
  const [slice, setSlice] = useState(3);
  const slices = ["A point.", "A growing circle.", "A full sphere.", "A shrinking sphere.", "Nothing visible."];

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <SectionHeading
        kicker="Interactive Thought Experiments"
        title="What happens when you move objects between dimensions?"
        subtitle="The viewer can manipulate a slice of a sphere and watch the visible cross-section change. The point is not entertainment alone. The point is to make hidden geometry feel concrete."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="rounded-3xl border border-white/[0.1] bg-black/25 p-5">
          <div className="text-sm font-semibold text-white">Slice position</div>
          <input
            type="range"
            min="0"
            max="4"
            step="1"
            value={slice}
            onChange={(e) => setSlice(parseInt(e.target.value, 10))}
            className="mt-4 w-full accent-cyan-300"
          />
          <div className="mt-4 rounded-2xl border border-white/[0.1] bg-white/[0.05] p-4 text-sm leading-7 text-white/70">
            {slices[slice]} Imagine a lower-dimensional observer watching a higher-dimensional object pass through their world.
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-white/45">
            <Move3d className="h-4 w-4" />
            <span>The visible shape changes with position.</span>
          </div>
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/[0.1] bg-[radial-gradient(circle_at_center,rgba(104,91,255,0.16),rgba(2,4,12,0.96)_68%)]">
          <svg viewBox="0 0 560 380" className="h-full w-full">
            <defs>
              <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(125,211,252,0.2)" />
                <stop offset="100%" stopColor="rgba(125,211,252,0)" />
              </radialGradient>
            </defs>
            <rect width="560" height="380" fill="rgba(255,255,255,0.01)" />
            <circle cx="280" cy="190" r="122" fill="url(#sphereGlow)" />
            <circle cx="280" cy="190" r={18 + slice * 22} fill="rgba(255,255,255,0.03)" stroke="rgba(125,211,252,0.9)" strokeWidth="4" />
            <line x1="70" y1={190 - slice * 22} x2="490" y2={190 - slice * 22} stroke="rgba(255,255,255,0.13)" strokeDasharray="10 8" />
            <text x="24" y="30" fill="rgba(255,255,255,0.55)" fontSize="12">
              The visible circle is only a slice of something larger.
            </text>
            {[...Array(7)].map((_, i) => (
              <circle key={i} cx={110 + i * 58} cy="315" r={6 + (i % 3) * 2} fill="rgba(255,255,255,0.45)" opacity={0.4 + i * 0.08} />
            ))}
          </svg>
          <div className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1 text-xs text-white/70">
            Cross-section simulator
          </div>
          <div className="absolute bottom-5 right-5 rounded-full bg-black/35 px-3 py-1 text-xs text-white/70">
            This is an analogy — not evidence.
          </div>
        </div>
      </div>
    </div>
  );
}

function RealityCheck() {
  const rows = [
    ["Proven", "Black holes exist as astrophysical objects with strong observational support."],
    ["Strong evidence", "Spacetime curvature predicts black-hole-like behavior accurately."],
    ["Supported by mathematics", "Extra dimensions, branes, and higher-dimensional black-hole solutions are mathematically valid in some models."],
    ["Active research", "Quantum gravity, holography, and higher-dimensional gravity remain under study."],
    ["Hypothesis", "A black hole could be a footprint or intersection of a higher-dimensional object."],
    ["Pure speculation", "Any claim that this is already established truth."],
  ];

  return (
    <div className={cn(PANEL, "p-6 sm:p-8")}>
      <SectionHeading
        kicker="Reality Check"
        title="Never blur categories."
        subtitle="A magazine can be cinematic without becoming sloppy. Here the labels matter because scientific trust depends on them."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(([label, text]) => {
          const tone =
            label === "Proven"
              ? "established"
              : label === "Strong evidence"
              ? "supported"
              : label === "Supported by mathematics"
              ? "model"
              : label === "Active research"
              ? "hypothesis"
              : label === "Hypothesis"
              ? "speculation"
              : "speculation";
          return (
            <div key={label} className="rounded-3xl border border-white/[0.1] bg-black/25 p-5">
              <Label tone={tone}>{label}</Label>
              <p className="mt-4 text-sm leading-7 text-white/70">{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FinalChapter() {
  return (
    <div className={cn(PANEL, "overflow-hidden p-0")}>
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[420px] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_35%)]" />
          <div className="relative">
            <Label tone="personal">Personal Hypothesis</Label>
            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Maybe Reality Is Bigger.</h3>
            <div className="mt-6 space-y-5 text-pretty text-base leading-8 text-white/74 sm:text-lg">
              <p>What if black holes are not the end of space, but the beginning of another geometry?</p>
              <p>What if dimensions are not hidden, but simply impossible for us to perceive directly?</p>
              <p>What if every scientific revolution began with someone asking a question everyone else ignored?</p>
            </div>
            <div className="mt-8 rounded-3xl border border-white/[0.1] bg-black/25 p-5 text-sm leading-7 text-white/68">
              Questions change science. Evidence changes the answers.
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden border-t border-white/[0.1] lg:border-l lg:border-t-0">
          <svg viewBox="0 0 640 420" className="absolute inset-0 h-full w-full">
            <defs>
              <radialGradient id="finalGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(125,211,252,0.2)" />
                <stop offset="45%" stopColor="rgba(196,181,253,0.14)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
            </defs>
            <rect width="640" height="420" fill="rgba(3,5,13,1)" />
            <circle cx="330" cy="210" r="140" fill="url(#finalGlow)" />
            <g stroke="rgba(255,255,255,0.12)">
              {[...Array(13)].map((_, i) => (
                <line key={i} x1={70 + i * 36} y1="60" x2={70 + i * 36} y2="360" />
              ))}
              {[...Array(9)].map((_, i) => (
                <line key={i} x1="40" y1={50 + i * 35} x2="600" y2={50 + i * 35} />
              ))}
            </g>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} style={{ originX: 330, originY: 210 }}>
              <circle cx="330" cy="210" r="80" fill="rgba(0,0,0,0.98)" />
              <circle cx="330" cy="210" r="118" fill="none" stroke="rgba(125,211,252,0.7)" strokeWidth="2" strokeDasharray="8 10" />
              <circle cx="330" cy="210" r="150" fill="none" stroke="rgba(196,181,253,0.38)" strokeWidth="1.5" />
            </motion.g>
            <path d="M110 260 C 160 220, 220 180, 260 185 S 380 215, 460 165 S 540 112, 590 92" fill="none" stroke="rgba(255,255,255,0.58)" strokeWidth="3" />
            <text x="44" y="378" fill="rgba(255,255,255,0.55)" fontSize="13">
              A black hole may be an answer. Or it may be a doorway to a larger question.
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#02040c] text-white selection:bg-cyan-300/30 selection:text-white">
      <div className="fixed inset-x-0 top-0 z-50 h-1 bg-white/5">
        <motion.div className="h-full bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500" style={{ width: bar }} />
      </div>

      <section className="relative min-h-screen overflow-hidden">
        <StarField />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(110,90,255,0.18),transparent_30%),linear-gradient(180deg,rgba(2,4,12,0.35),rgba(2,4,12,0.95))]" />
        <div className="relative z-10">
          <div className={cn(SECTION, "flex min-h-screen items-center py-20")}>
            <div className="max-w-4xl">
              <div className="mb-5 flex flex-wrap gap-2">
                <Label tone="established">Established Physics</Label>
                <Label tone="hypothesis">Research Hypothesis</Label>
                <Label tone="speculation">Speculative Idea</Label>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-[6.5rem]"
              >
                THE DIMENSION HYPOTHESIS
              </motion.h1>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-white/72 sm:text-2xl sm:leading-10">
                Could black holes be footprints of higher dimensions? What if everything we know is only a shadow cast by a larger reality?
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#journey" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]">
                  Begin the magazine <ArrowDown className="h-4 w-4" />
                </a>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-5 py-3 text-sm text-white/70 backdrop-blur-xl">
                  Cinematic science, responsibly told
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 space-y-8 pb-20">
        <section id="journey" className={SECTION}>
          <DimensionDiagram />
        </section>

        <section className={SECTION}>
          <CrossSectionExplainer />
        </section>

        <section className={SECTION}>
          <BlackHoleScene />
        </section>

        <section className={SECTION}>
          <div className={cn(PANEL, "p-6 sm:p-8")}>
            <div className="max-w-4xl">
              <Label tone="personal">My Hypothesis</Label>
              <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                Could a higher-dimensional object leave only a 3D footprint?
              </h3>
              <div className="mt-6 space-y-5 text-base leading-8 text-white/72 sm:text-lg">
                <p>If a 3D finger touches a 2D universe, the 2D beings never see the whole finger. They only see the footprint.</p>
                <p>Then… what if our universe is similar?</p>
                <p>Could what we call a black hole simply be the intersection between our universe and something larger?</p>
                <p>Or is this impossible?</p>
              </div>
              <div className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-7 text-amber-100/90">
                Hypothesis only. This is a question, not a conclusion.
              </div>
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <MathSection />
        </section>

        <section className={SECTION}>
          <TheoryMatrix />
        </section>

        <section className={SECTION}>
          <EvidenceQuestions />
        </section>

        <section className={SECTION}>
          <Timeline />
        </section>

        <section className={SECTION}>
          <ThoughtExperiment />
        </section>

        <section className={SECTION}>
          <RealityCheck />
        </section>

        <section className={SECTION}>
          <FinalChapter />
        </section>
      </main>

      <footer className={cn(SECTION, "pb-10 pt-6 text-center text-sm text-white/45")}>
        Built as a cinematic magazine prototype. Science labels are intentionally separated to keep speculation honest.
      </footer>
    </div>
  );
}

export default App;
