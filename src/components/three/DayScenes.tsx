"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OrbitControls } from "@react-three/drei";
import { media } from "@/data/media";
import RealAvatar, { type AvatarPose } from "./RealAvatar";
import Workstation from "./Workstation";
import { Halo, SceneCanvas, StudioLights } from "./SceneKit";

export type DayKey = "code" | "architect" | "meet" | "ship";

const CONFIG: Record<DayKey, { pose: AvatarPose; mode: "still" | "talk" | "wave" }> = {
  code: { pose: "sit", mode: "still" },
  architect: { pose: "point", mode: "talk" },
  meet: { pose: "present", mode: "talk" },
  ship: { pose: "relaxed", mode: "wave" },
};

const CAMERA = { position: [0, 1.42, 2.75] as [number, number, number], fov: 30, target: [0, 1.22, 0] as [number, number, number] };

/* ───────────── DOM overlays per scene ───────────── */

function CodeOverlay() {
  const lines = [
    ["const", " grid ", "= ", "useGrid", "({ virtual: true })"],
    ["const", " { data } ", "= ", "useQuery", "(events)"],
    ["return", " <", "", "AgGridReact", " rowData={data} />"],
  ];
  return (
    <>
      <div className="absolute right-[3%] top-[10%] w-[44%] max-w-[260px] rounded-xl border border-white/10 bg-[#0b0d1d]/85 p-3 font-mono text-[10px] leading-relaxed shadow-2xl sm:text-[11px]">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[9px] text-muted">Dashboard.tsx</span>
        </div>
        {lines.map((l, i) => (
          <p key={i} className="overflow-hidden whitespace-nowrap" style={{ animation: `typeline 4s steps(30) ${i * 0.9}s infinite both` }}>
            <span className="text-violet-300">{l[0]}</span>
            <span className="text-white/90">{l[1]}</span>
            <span className="text-muted">{l[2]}</span>
            <span className="text-cyan-300">{l[3]}</span>
            <span className="text-amber-200">{l[4]}</span>
          </p>
        ))}
      </div>
      <div className="absolute bottom-[12%] left-[4%] rounded-full border border-violet-400/40 bg-violet-950/70 px-3 py-1.5 font-mono text-[10px] text-violet-200 shadow-lg sm:text-xs">
        git commit -m &quot;feat: virtual grid ✨&quot;
      </div>
    </>
  );
}

function ArchitectOverlay() {
  const nodes = [
    { x: 50, y: 14, t: "App Shell", c: "#f472b6" },
    { x: 18, y: 48, t: "Auth · RBAC", c: "#34d399" },
    { x: 50, y: 48, t: "Dashboard", c: "#22d3ee" },
    { x: 82, y: 48, t: "React Flow", c: "#a78bfa" },
    { x: 32, y: 84, t: "AG Grid", c: "#fbbf24" },
    { x: 68, y: 84, t: "TanStack Query", c: "#fb7185" },
  ];
  const edges = [[0, 1], [0, 2], [0, 3], [2, 4], [2, 5], [3, 5]];
  return (
    <div className="absolute left-[2%] top-[8%] h-[62%] w-[46%] rounded-2xl border border-cyan-300/25 bg-cyan-400/[0.06] shadow-[0_0_60px_-10px_color-mix(in_oklab,var(--c2)_50%,transparent)]">
      <p className="absolute left-3 top-2 font-mono text-[9px] uppercase tracking-widest text-cyan-200/80">architecture.flow</p>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={i % 2 ? "#22d3ee" : "#a78bfa"}
            strokeWidth={0.6}
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            style={{ animation: "dash 1.4s linear infinite" }}
          />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <span
          key={n.t}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#0b1226]/90 px-1.5 py-0.5 text-[8px] text-white sm:text-[10px]"
          style={{ left: `${n.x}%`, top: `${n.y}%`, boxShadow: `0 0 12px ${n.c}55`, animation: `pop 0.6s ease-out ${0.2 + i * 0.12}s both` }}
        >
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: n.c }} />
          {n.t}
        </span>
      ))}
    </div>
  );
}

function MeetOverlay() {
  const people = [
    { n: "Product Manager", i: "PM", c: "#f472b6" },
    { n: "UI/UX Designer", i: "UX", c: "#22d3ee" },
    { n: "Backend Lead", i: "BE", c: "#fbbf24" },
  ];
  return (
    <>
      <div className="absolute left-[3%] top-[8%] rounded-full bg-red-500/90 px-3 py-1 text-[10px] font-semibold text-white shadow-lg">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white align-middle" />
        LIVE · Sprint Planning
      </div>
      <div className="absolute right-[3%] top-[10%] flex w-[30%] max-w-[170px] flex-col gap-2">
        {people.map((p, i) => (
          <div key={p.i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b0d1d]/85 p-2 shadow-xl" style={{ animation: `pop 0.6s ease-out ${0.2 + i * 0.15}s both` }}>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-bold text-[#0b0d1d]" style={{ background: p.c }}>
              {p.i}
            </span>
            <span className="truncate text-[9px] text-white/80 sm:text-[10px]">{p.n}</span>
            <span className="ml-auto text-xs">{["👏", "🔥", "💡"][i]}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-[12%] left-[4%] flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/70 px-3 py-1.5 text-[10px] text-emerald-200 sm:text-xs">
        <span className="flex items-end gap-0.5">
          {[0, 1, 2, 3].map((b) => (
            <span key={b} className="w-0.5 rounded bg-emerald-300" style={{ height: 10, animation: `eq 0.8s ease-in-out ${b * 0.12}s infinite` }} />
          ))}
        </span>
        Lokendra is presenting
      </div>
    </>
  );
}

function ShipOverlay() {
  const steps = ["Lint", "Test", "Build", "Deploy"];
  return (
    <>
      <div className="absolute left-1/2 top-[6%] flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-[#0b0d1d]/85 px-3 py-2 shadow-xl">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] text-white" style={{ animation: `pop 0.5s ease-out ${0.3 + i * 0.35}s both` }}>
              ✓
            </span>
            <span className="text-[10px] text-white/80">{s}</span>
            {i < steps.length - 1 && <span className="mx-0.5 h-px w-3 bg-emerald-400/60" />}
          </span>
        ))}
      </div>
      <div className="absolute bottom-[12%] right-[4%] rounded-xl border border-emerald-400/40 bg-emerald-950/70 px-3 py-2 font-mono text-[10px] text-emerald-200 sm:text-xs" style={{ animation: "pop 0.6s ease-out 1.8s both" }}>
        ● Production: Ready · Web Vitals ✓
      </div>
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 h-2.5 w-1.5 rounded-sm"
          style={{
            left: `${(i * 41) % 100}%`,
            background: ["#f472b6", "#22d3ee", "#a78bfa", "#fbbf24", "#34d399"][i % 5],
            animation: `confetti ${3 + (i % 4) * 0.5}s linear ${(i % 7) * 0.3}s infinite`,
          }}
        />
      ))}
    </>
  );
}

const OVERLAYS: Record<DayKey, () => React.JSX.Element> = {
  code: CodeOverlay,
  architect: ArchitectOverlay,
  meet: MeetOverlay,
  ship: ShipOverlay,
};

/** One persistent 3D stage where Lokendra's avatar changes pose per scene. */
export default function DayScenes({ active }: { active: DayKey }) {
  const cfg = CONFIG[active];
  const Overlay = OVERLAYS[active];
  return (
    <SceneCanvas
      className="h-full w-full"
      camera={CAMERA}
      overlay={
        <div className="dark-island pointer-events-none absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              <Overlay />
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <StudioLights />
      <Halo position={[0, 1.35, -1]} scale={0.6} />
      <Suspense fallback={null}>
        <RealAvatar url={media.avatar} pose={cfg.pose} mode={cfg.mode} follow={0.5} />
      </Suspense>
      <Workstation show={active === "code"} monitor={false} seated />
      <OrbitControls makeDefault target={CAMERA.target} enableDamping dampingFactor={0.08} minDistance={1.1} maxDistance={6} minPolarAngle={0.08} maxPolarAngle={Math.PI - 0.08} rotateSpeed={0.6} />
    </SceneCanvas>
  );
}
