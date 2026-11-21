"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Shuffle, Check, Sun, Moon } from "lucide-react";
import { themePresets, type StoredTheme } from "@/data/themes";
import { resetTheme, setMode, setTheme, useMode, useTheme } from "./ThemeStore";

const FIELDS: { key: "c1" | "c2" | "c3" | "bg"; label: string; hint: string }[] = [
  { key: "c1", label: "Primary", hint: "buttons, headings, glow" },
  { key: "c2", label: "Secondary", hint: "links, highlights" },
  { key: "c3", label: "Accent", hint: "gradients, sparkles" },
  { key: "bg", label: "Background", hint: "deep space tint" },
];

function hsl(h: number, s: number, l: number) {
  const a = (s * Math.min(l, 1 - l)) / 1;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomTheme(): StoredTheme {
  const h = Math.floor(Math.random() * 360);
  return {
    id: "custom",
    c1: hsl(h, 0.85, 0.6),
    c2: hsl((h + 140) % 360, 0.85, 0.6),
    c3: hsl((h + 290) % 360, 0.85, 0.66),
    bg: hsl(h, 0.6, 0.12),
  };
}

export default function ThemeCustomizer() {
  const theme = useTheme();
  const mode = useMode();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener("lk:theme-studio", show);
    return () => window.removeEventListener("lk:theme-studio", show);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const update = (key: "c1" | "c2" | "c3" | "bg", value: string) => setTheme({ ...theme, [key]: value, id: "custom" });

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="scrim"
              className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-label="Theme customizer"
              data-lenis-prevent
              initial={{ x: -420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="dark-island fixed bottom-3 left-3 top-3 z-[121] flex w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0c1d]/95 p-6 shadow-[0_30px_120px_-20px_var(--c1)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">Make it yours</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-white">Theme studio</h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close theme studio" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-6 text-xs uppercase tracking-widest text-muted">Appearance</p>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.05] p-1">
                {(["dark", "light"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm capitalize transition ${mode === m ? "bg-white text-[#0b0c1d] shadow" : "text-white/80 hover:text-white"}`}
                  >
                    {m === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {m}
                  </button>
                ))}
              </div>

              <p className="mt-6 text-xs uppercase tracking-widest text-muted">Presets</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {themePresets.map((p) => {
                  const active = theme.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setTheme({ id: p.id, c1: p.c1, c2: p.c2, c3: p.c3, bg: p.bg })}
                      className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${active ? "border-white/60" : "border-white/10 hover:border-white/30"}`}
                      style={{ background: `radial-gradient(120% 120% at 0% 0%, ${p.c1}40, transparent 60%), linear-gradient(140deg, ${p.bg}, #05060f)` }}
                    >
                      <div className="flex gap-1">
                        {[p.c1, p.c2, p.c3].map((c) => (
                          <span key={c} className="h-4 w-4 rounded-full ring-1 ring-white/30" style={{ background: c }} />
                        ))}
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">
                        {p.emoji} {p.name}
                      </p>
                      {active && <Check className="absolute right-2 top-2 h-4 w-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              <p className="mt-7 text-xs uppercase tracking-widest text-muted">Custom colours</p>
              <div className="mt-3 space-y-2.5">
                {FIELDS.map((f) => (
                  <label key={f.key} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.06]">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/20" style={{ background: theme[f.key] }}>
                      <input
                        type="color"
                        value={theme[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        aria-label={`${f.label} colour`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white">{f.label}</span>
                      <span className="block text-xs text-muted">{f.hint}</span>
                    </span>
                    <span className="font-mono text-xs uppercase text-white/70">{theme[f.key]}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button onClick={() => setTheme(randomTheme())} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white">
                  <Shuffle className="h-4 w-4" /> Surprise me
                </button>
                <button onClick={resetTheme} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white hover:bg-white/5">
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 p-4" style={{ background: `linear-gradient(140deg, ${theme.bg}, #05060f)` }}>
                <p className="text-xs text-muted">Live preview</p>
                <p className="text-gradient mt-1 font-display text-2xl font-bold">Lokendra Kumar</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white">Primary</span>
                  <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs text-cyan-200 ring-1 ring-cyan-300/40">Secondary</span>
                  <span className="rounded-full bg-pink-400/20 px-3 py-1 text-xs text-pink-200 ring-1 ring-pink-300/40">Accent</span>
                </div>
              </div>
              <p className="mt-4 text-center text-[11px] text-muted">Saved on this device · applies to the whole site, including the 3D scenes.</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
