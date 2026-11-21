"use client";

import { motion } from "framer-motion";
import Avatar from "./Avatar";

const W = 600;
const H = 420;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full">
      <defs>
        <linearGradient id="scene-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141733" />
          <stop offset="100%" stopColor="#090a18" />
        </linearGradient>
        <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b2a5a" />
          <stop offset="100%" stopColor="#1e1534" />
        </linearGradient>
        <radialGradient id="glow-v" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-c" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} rx={28} fill="url(#scene-bg)" />
      {children}
    </svg>
  );
}

function Desk() {
  return (
    <g>
      <rect x={30} y={318} width={540} height={14} rx={6} fill="url(#desk)" />
      <rect x={30} y={318} width={540} height={3} rx={2} fill="#a78bfa" opacity={0.35} />
      <rect x={70} y={332} width={14} height={70} fill="#1e1534" />
      <rect x={516} y={332} width={14} height={70} fill="#1e1534" />
    </g>
  );
}

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M ${x + i * 8} ${y} q -6 -10 0 -20 q 6 -10 0 -20`}
          stroke="#cbd5e1"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 0.7, 0], y: [6, -10, -18] }}
          transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.6 }}
        />
      ))}
    </g>
  );
}

function Mug({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Steam x={x + 8} y={y - 4} />
      <rect x={x} y={y} width={32} height={36} rx={6} fill="#f472b6" />
      <path d={`M ${x + 32} ${y + 8} q 14 0 14 12 q 0 12 -14 12`} stroke="#f472b6" strokeWidth={5} fill="none" />
      <text x={x + 16} y={y + 24} textAnchor="middle" fontSize={11} fill="#fff" fontFamily="monospace">{"{}"}</text>
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    >
      <path d={`M ${x} ${y} q -18 -30 -6 -54`} stroke="#34d399" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M ${x} ${y} q 18 -26 10 -50`} stroke="#10b981" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M ${x} ${y} q -2 -36 2 -62`} stroke="#6ee7b7" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d={`M ${x - 16} ${y} h 32 l -4 26 h -24 z`} fill="#8b5cf6" />
    </motion.g>
  );
}

function Twinkles() {
  const pts = [
    [60, 50], [120, 34], [168, 70], [96, 92], [520, 46], [470, 80], [560, 110], [400, 36],
  ];
  return (
    <g>
      {pts.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={1.8}
          fill="#e0e7ff"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 + (i % 3), delay: i * 0.3 }}
        />
      ))}
    </g>
  );
}

const codeLines = [
  { indent: 0, parts: [["#c084fc", 34], ["#e2e8f0", 60], ["#22d3ee", 40]] },
  { indent: 1, parts: [["#f472b6", 28], ["#e2e8f0", 48]] },
  { indent: 1, parts: [["#c084fc", 40], ["#fbbf24", 70]] },
  { indent: 2, parts: [["#22d3ee", 30], ["#e2e8f0", 30], ["#34d399", 56]] },
  { indent: 2, parts: [["#e2e8f0", 64], ["#fbbf24", 24]] },
  { indent: 1, parts: [["#f472b6", 44]] },
  { indent: 1, parts: [["#c084fc", 20], ["#22d3ee", 52], ["#e2e8f0", 30]] },
  { indent: 0, parts: [["#e2e8f0", 16]] },
] as const;

/* ───────────────────────── 1. Coding at the computer ───────────────────────── */
export function CodingScene() {
  return (
    <Frame label="Illustration of Lokendra coding at his computer">
      <Twinkles />
      {/* Window with moon */}
      <rect x={44} y={40} width={150} height={110} rx={12} fill="#0b1030" stroke="#2a2f5a" strokeWidth={3} />
      <circle cx={150} cy={78} r={16} fill="#fde68a" />
      <circle cx={158} cy={72} r={14} fill="#0b1030" />
      <line x1={119} y1={40} x2={119} y2={150} stroke="#2a2f5a" strokeWidth={3} />
      {/* Neon sign */}
      <motion.text
        x={255}
        y={78}
        fontSize={34}
        fontFamily="monospace"
        fontWeight={700}
        fill="#22d3ee"
        animate={{ opacity: [1, 0.55, 1, 1, 0.7, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        style={{ filter: "drop-shadow(0 0 8px #22d3ee)" }}
      >
        {"</>"}
      </motion.text>

      <circle cx={420} cy={190} r={150} fill="url(#glow-v)" />

      {/* Avatar seated behind laptop */}
      <Avatar x={215} y={168} r={42} pose="type" bob />

      {/* Monitor with live code */}
      <g>
        <rect x={330} y={108} width={226} height={156} rx={12} fill="#0f172a" stroke="#334155" strokeWidth={4} />
        <rect x={330} y={108} width={226} height={20} rx={10} fill="#1e293b" />
        <circle cx={344} cy={118} r={3.5} fill="#ff5f57" />
        <circle cx={356} cy={118} r={3.5} fill="#febc2e" />
        <circle cx={368} cy={118} r={3.5} fill="#28c840" />
        <text x={386} y={122} fontSize={9} fill="#94a3b8" fontFamily="monospace">Dashboard.tsx</text>
        {codeLines.map((line, li) => {
          let cursor = 346 + line.indent * 14;
          return (
            <g key={li}>
              <text x={336} y={146 + li * 14} fontSize={8} fill="#475569" fontFamily="monospace">{li + 1}</text>
              {line.parts.map(([color, w], pi) => {
                const xPos = cursor;
                cursor += w + 6;
                return (
                  <motion.rect
                    key={pi}
                    x={xPos}
                    y={140 + li * 14}
                    height={6}
                    rx={3}
                    fill={color}
                    initial={{ width: 0 }}
                    animate={{ width: [0, w, w, 0] }}
                    transition={{ repeat: Infinity, duration: 7, times: [0, 0.1, 0.9, 1], delay: li * 0.45 + pi * 0.12 }}
                  />
                );
              })}
            </g>
          );
        })}
        <rect x={430} y={264} width={26} height={40} fill="#334155" />
        <rect x={404} y={300} width={78} height={10} rx={5} fill="#475569" />
      </g>

      {/* Laptop (back of the lid faces us) */}
      <g>
        <path d="M 140 222 L 290 222 L 300 312 L 130 312 Z" fill="#cbd5e1" />
        <path d="M 140 222 L 290 222 L 300 312 L 130 312 Z" fill="url(#glow-c)" opacity={0.6} />
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        >
          <circle cx={215} cy={266} r={5} fill="#0891b2" />
          {[0, 60, 120].map((deg) => (
            <ellipse key={deg} cx={215} cy={266} rx={26} ry={10} fill="none" stroke="#0891b2" strokeWidth={3} transform={`rotate(${deg} 215 266)`} />
          ))}
        </motion.g>
        <rect x={110} y={312} width={210} height={8} rx={4} fill="#94a3b8" />
      </g>

      <Desk />
      <Mug x={70} y={282} />
      <Plant x={530} y={318} />

      {/* Floating typing badge */}
      <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
        <rect x={40} y={190} width={118} height={30} rx={15} fill="#1e1b4b" stroke="#8b5cf6" />
        <text x={99} y={209} textAnchor="middle" fontSize={11} fill="#c4b5fd" fontFamily="monospace">git commit -m ✨</text>
      </motion.g>
    </Frame>
  );
}

/* ───────────────────────── 2. Architecting / developing ───────────────────────── */
const nodes = [
  { id: "app", x: 415, y: 80, label: "App Shell" },
  { id: "auth", x: 305, y: 160, label: "Auth · RBAC" },
  { id: "dash", x: 420, y: 155, label: "Dashboard" },
  { id: "flow", x: 527, y: 160, label: "React Flow" },
  { id: "grid", x: 360, y: 234, label: "AG Grid" },
  { id: "query", x: 482, y: 234, label: "TanStack Query" },
];
const edges: [string, string][] = [
  ["app", "auth"], ["app", "dash"], ["app", "flow"], ["dash", "grid"], ["dash", "query"], ["flow", "query"],
];

export function ArchitectScene() {
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <Frame label="Illustration of Lokendra designing a frontend architecture diagram">
      <Twinkles />
      <circle cx={400} cy={160} r={170} fill="url(#glow-c)" />
      {/* Big board */}
      <rect x={220} y={36} width={360} height={232} rx={16} fill="#0c1226" stroke="#334155" strokeWidth={3} />
      <text x={238} y={58} fontSize={10} fill="#64748b" fontFamily="monospace">architecture.flow</text>
      {edges.map(([a, b], i) => {
        const A = pos[a];
        const B = pos[b];
        const d = `M ${A.x} ${A.y + 12} C ${A.x} ${(A.y + B.y) / 2 + 6}, ${B.x} ${(A.y + B.y) / 2 - 6}, ${B.x} ${B.y - 12}`;
        return (
          <g key={i}>
            <path d={d} stroke="#334155" strokeWidth={2} fill="none" />
            <motion.path
              d={d}
              stroke={i % 2 ? "#22d3ee" : "#a78bfa"}
              strokeWidth={2.5}
              fill="none"
              strokeDasharray="6 10"
              animate={{ strokeDashoffset: [0, -64] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
            />
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.15, type: "spring" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <rect x={n.x - 46} y={n.y - 12} width={92} height={24} rx={8} fill="#111a35" stroke={i === 0 ? "#f472b6" : "#475569"} strokeWidth={1.5} />
          <circle cx={n.x - 34} cy={n.y} r={3.5} fill={["#f472b6", "#34d399", "#22d3ee", "#a78bfa", "#fbbf24", "#fb7185"][i]} />
          <text x={n.x + 4} y={n.y + 3.5} textAnchor="middle" fontSize={9.5} fill="#e2e8f0" fontFamily="sans-serif">{n.label}</text>
        </motion.g>
      ))}

      {/* Avatar pointing at the board, standing behind a lectern */}
      <Avatar x={120} y={150} r={40} pose="point" />
      <g>
        <path d="M 46 300 L 194 300 L 184 396 L 56 396 Z" fill="#2a1f47" />
        <rect x={40} y={292} width={160} height={14} rx={5} fill="#3b2a5a" />
        <rect x={40} y={292} width={160} height={3} rx={2} fill="#a78bfa" opacity={0.4} />
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <circle cx={120} cy={346} r={4} fill="#22d3ee" />
          {[0, 60, 120].map((deg) => (
            <ellipse key={deg} cx={120} cy={346} rx={22} ry={8} fill="none" stroke="#22d3ee" strokeWidth={2.5} transform={`rotate(${deg} 120 346)`} />
          ))}
        </motion.g>
      </g>

      {/* Terminal */}
      <g>
        <rect x={300} y={286} width={270} height={108} rx={12} fill="#05070f" stroke="#334155" strokeWidth={2} />
        <text x={314} y={306} fontSize={10} fill="#64748b" fontFamily="monospace">~/cyber-platform</text>
        {[
          { t: "$ npm run build", c: "#e2e8f0" },
          { t: "✓ Lint & type-check passed", c: "#34d399" },
          { t: "✓ Storybook components built", c: "#34d399" },
          { t: "✓ Compiled successfully", c: "#22d3ee" },
        ].map((l, i) => (
          <motion.text
            key={i}
            x={314}
            y={326 + i * 16}
            fontSize={10.5}
            fill={l.c}
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ repeat: Infinity, duration: 6, times: [0, 0.08, 0.9, 1], delay: i * 0.7 }}
          >
            {l.t}
          </motion.text>
        ))}
      </g>
      <rect x={30} y={392} width={540} height={4} rx={2} fill="#1e1534" />
    </Frame>
  );
}

/* ───────────────────────── 3. Team meeting / video call ───────────────────────── */
const teammates = [
  { name: "Product Manager", initials: "PM", color: "#f472b6" },
  { name: "UI/UX Designer", initials: "UX", color: "#22d3ee" },
  { name: "Backend Lead", initials: "BE", color: "#fbbf24" },
];

export function MeetingScene() {
  return (
    <Frame label="Illustration of Lokendra leading a team video meeting">
      {/* App window */}
      <rect x={24} y={22} width={552} height={376} rx={18} fill="#0b0f1f" stroke="#2a2f5a" strokeWidth={2} />
      <circle cx={46} cy={42} r={5} fill="#ff5f57" />
      <circle cx={62} cy={42} r={5} fill="#febc2e" />
      <circle cx={78} cy={42} r={5} fill="#28c840" />
      <text x={300} y={46} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="sans-serif">Sprint Planning · Frontend Architecture Review</text>
      <motion.circle cx={548} cy={42} r={5} fill="#ef4444" animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} />

      {/* Main speaker tile */}
      <rect x={40} y={62} width={330} height={262} rx={14} fill="#121a3a" />
      <motion.rect
        x={40}
        y={62}
        width={330}
        height={262}
        rx={14}
        fill="none"
        stroke="#34d399"
        strokeWidth={3}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <circle cx={205} cy={180} r={110} fill="url(#glow-v)" />
      <g clipPath="url(#tile-clip)">
        <clipPath id="tile-clip">
          <rect x={40} y={62} width={330} height={262} rx={14} />
        </clipPath>
        <Avatar x={205} y={160} r={50} pose="rest" />
      </g>
      <rect x={52} y={292} width={150} height={22} rx={11} fill="#000" opacity={0.55} />
      <text x={64} y={307} fontSize={11} fill="#fff" fontFamily="sans-serif">Lokendra · Presenting</text>
      {/* Audio bars */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={340 + i * 6}
          y={290}
          width={3.5}
          rx={1.5}
          fill="#34d399"
          animate={{ height: [4, 18, 6, 14, 4], y: [304, 290, 302, 294, 304] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12 }}
        />
      ))}

      {/* Teammate tiles */}
      {teammates.map((t, i) => (
        <g key={t.name}>
          <rect x={384} y={62 + i * 89} width={176} height={80} rx={12} fill="#121a3a" />
          <circle cx={472} cy={96 + i * 89} r={22} fill={t.color} opacity={0.9} />
          <text x={472} y={101 + i * 89} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0b0f1f" fontFamily="sans-serif">{t.initials}</text>
          <text x={394} y={135 + i * 89} fontSize={9} fill="#cbd5e1" fontFamily="sans-serif">{t.name}</text>
        </g>
      ))}

      {/* Caption bubble + floating reactions */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 0] }}
        transition={{ repeat: Infinity, duration: 6, times: [0, 0.1, 0.85, 1], delay: 0.8 }}
      >
        <rect x={52} y={74} width={128} height={24} rx={12} fill="#22d3ee" opacity={0.18} stroke="#22d3ee" />
        <text x={64} y={90} fontSize={10} fill="#fff" fontFamily="sans-serif">Design system demo 🎨</text>
      </motion.g>
      {["👏", "🔥", "🚀"].map((e, i) => (
        <motion.text
          key={e}
          x={540}
          y={130 + i * 89}
          fontSize={16}
          textAnchor="middle"
          animate={{ y: [130 + i * 89, 80 + i * 89], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, delay: 0.8 + i * 0.9 }}
        >
          {e}
        </motion.text>
      ))}

      {/* Toolbar */}
      <rect x={190} y={336} width={220} height={46} rx={23} fill="#151b36" />
      {[
        { x: 222, c: "#334155", icon: "🎙" },
        { x: 268, c: "#334155", icon: "📷" },
        { x: 314, c: "#4f46e5", icon: "🖥" },
        { x: 360, c: "#334155", icon: "💬" },
      ].map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={359} r={16} fill={b.c} />
          <text x={b.x} y={364} textAnchor="middle" fontSize={13}>{b.icon}</text>
        </g>
      ))}
      <rect x={420} y={343} width={56} height={32} rx={16} fill="#ef4444" />
      <text x={448} y={364} textAnchor="middle" fontSize={11} fill="#fff" fontFamily="sans-serif">Leave</text>
    </Frame>
  );
}

/* ───────────────────────── 4. Shipping to production ───────────────────────── */
const confetti = Array.from({ length: 26 }, (_, i) => ({
  x: 40 + ((i * 97) % 520),
  delay: (i % 7) * 0.35,
  color: ["#f472b6", "#22d3ee", "#a78bfa", "#fbbf24", "#34d399"][i % 5],
  rot: (i * 47) % 360,
}));

export function ShippingScene() {
  const steps = ["Lint", "Test", "Build", "Deploy"];
  return (
    <Frame label="Illustration of Lokendra celebrating a successful production deployment">
      {confetti.map((c, i) => (
        <motion.rect
          key={i}
          x={c.x}
          y={-10}
          width={6}
          height={10}
          rx={1}
          fill={c.color}
          animate={{ y: [-10, 430], rotate: [c.rot, c.rot + 360] }}
          transition={{ repeat: Infinity, duration: 4.5, delay: c.delay, ease: "linear" }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}

      {/* CI pipeline */}
      <g>
        <line x1={110} y1={56} x2={490} y2={56} stroke="#334155" strokeWidth={4} strokeLinecap="round" />
        <motion.line
          x1={110}
          y1={56}
          x2={490}
          y2={56}
          stroke="#34d399"
          strokeWidth={4}
          strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 6, times: [0, 0.5, 0.92, 1] }}
        />
        {steps.map((s, i) => (
          <g key={s}>
            <motion.circle
              cx={110 + i * 126.6}
              cy={56}
              r={16}
              stroke="#34d399"
              strokeWidth={3}
              animate={{ fill: ["#0f172a", "#0f172a", "#065f46", "#065f46", "#0f172a"] }}
              transition={{ repeat: Infinity, duration: 6, times: [0, 0.12 * i + 0.02, 0.12 * i + 0.1, 0.92, 1] }}
            />
            <text x={110 + i * 126.6} y={61} textAnchor="middle" fontSize={13} fill="#fff">✓</text>
            <text x={110 + i * 126.6} y={90} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="sans-serif">{s}</text>
          </g>
        ))}
      </g>

      <circle cx={300} cy={230} r={160} fill="url(#glow-v)" />

      {/* Rocket */}
      <motion.g animate={{ y: [40, -40, 40], x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
        <g transform="translate(470 210) rotate(20)">
          <motion.path
            d="M -10 40 Q 0 80 10 40 Z"
            fill="#fbbf24"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          />
          <path d="M 0 -40 C 18 -20 18 20 12 40 L -12 40 C -18 20 -18 -20 0 -40 Z" fill="#e2e8f0" />
          <circle cx={0} cy={-6} r={7} fill="#22d3ee" stroke="#334155" strokeWidth={2} />
          <path d="M -12 22 L -24 44 L -10 40 Z" fill="#f472b6" />
          <path d="M 12 22 L 24 44 L 10 40 Z" fill="#f472b6" />
        </g>
      </motion.g>

      <Avatar x={250} y={186} r={42} pose="cheer" />

      {/* Laptop front (screen facing us) */}
      <g>
        <rect x={170} y={262} width={160} height={58} rx={6} fill="#0f172a" stroke="#475569" strokeWidth={3} />
        <text x={250} y={286} textAnchor="middle" fontSize={11} fill="#34d399" fontFamily="monospace">● Production: Ready</text>
        <text x={250} y={304} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">deployed via CI/CD ✓</text>
        <rect x={150} y={318} width={200} height={8} rx={4} fill="#94a3b8" />
      </g>

      {/* Web vitals rings */}
      {[
        { label: "LCP", x: 80 },
        { label: "CLS", x: 80 },
        { label: "INP", x: 80 },
      ].map((v, i) => (
        <g key={v.label} transform={`translate(${v.x} ${140 + i * 52})`}>
          <circle r={20} fill="none" stroke="#1e293b" strokeWidth={5} />
          <motion.circle
            r={20}
            fill="none"
            stroke="#34d399"
            strokeWidth={5}
            strokeLinecap="round"
            transform="rotate(-90)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0.96, 0.96, 0] }}
            transition={{ repeat: Infinity, duration: 6, times: [0, 0.3, 0.9, 1], delay: i * 0.2 }}
          />
          <text y={4} textAnchor="middle" fontSize={9} fill="#e2e8f0" fontFamily="sans-serif">{v.label}</text>
        </g>
      ))}
      <text x={80} y={290} textAnchor="middle" fontSize={10} fill="#34d399" fontFamily="sans-serif">Web Vitals: Good</text>

      <Desk />
    </Frame>
  );
}
