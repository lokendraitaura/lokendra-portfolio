"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ExternalLink, Loader2, Monitor, Smartphone } from "lucide-react";
import { featuredProject, projects, type Project } from "@/data/career";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useLiteDevice } from "@/hooks/usePerf";

/** Renders a live site at a fixed virtual resolution and scales it to fit its box. */
function ScaledFrame({ src, width, height, title, active }: { src: string; width: number; height: number; title: string; active: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [loaded, setLoaded] = useState(false);
  // On phones/tablets the live site (a whole external app) only loads when the visitor taps.
  const lite = useLiteDevice();
  const [tapped, setTapped] = useState(false);
  const show = active && (!lite || tapped);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={box} className="relative w-full overflow-hidden bg-[#0b0d1d]" style={{ aspectRatio: `${width}/${height}` }}>
      {show && (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width, height, transform: `scale(${scale})` }}
          allow="clipboard-write"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-fuchsia-900/40 to-violet-900/40">
          {show ? (
            <div className="flex flex-col items-center gap-3 text-sm text-white/80">
              <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" />
              Loading live GoChatPilot…
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setTapped(true)}
              className="flex flex-col items-center gap-2 rounded-2xl bg-black/40 px-5 py-4 text-sm font-semibold text-white ring-1 ring-white/20"
            >
              <span className="text-2xl" aria-hidden>▶</span>
              Tap to open the live app
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function FeaturedProject() {
  const p = featuredProject;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [modeChoice, setMode] = useState<"desktop" | "mobile" | null>(null);
  const mode = modeChoice ?? (isMobile ? "mobile" : "desktop");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [18, 0]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [80, -60]);

  return (
    <div ref={ref} className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="glass inline-flex rounded-full p-1 text-xs">
            {(["desktop", "mobile"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 capitalize transition ${mode === m ? "text-white" : "text-muted"}`}
              >
                {mode === m && <motion.span layoutId="device-pill" className="absolute inset-0 -z-10 rounded-full bg-white/15" />}
                {m === "desktop" ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                {m}
              </button>
            ))}
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live & interactive
          </span>
        </div>

        <div className="perspective">
          {mode === "desktop" ? (
            <motion.div style={{ rotateX }} className="origin-bottom">
              {/* Laptop */}
              <div className="dark-island rounded-t-2xl border border-white/15 bg-[#1a1b26] p-2 pb-3 shadow-[0_50px_120px_-30px_color-mix(in_oklab,var(--c1)_50%,transparent)] sm:p-3">
                <div className="mb-2 flex items-center gap-2 px-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 flex-1 truncate rounded-md bg-black/40 px-3 py-1 font-mono text-[10px] text-white/60">chat-pilot.in</span>
                </div>
                <div className="overflow-hidden rounded-lg">
                  <ScaledFrame src={p.live!} width={1280} height={800} title="GoChatPilot live preview (desktop)" active={inView} />
                </div>
              </div>
              <div className="mx-auto h-4 w-[106%] -translate-x-[3%] rounded-b-2xl bg-gradient-to-b from-[#3a3b4a] to-[#1a1b26]" />
              <div className="mx-auto h-1.5 w-1/4 rounded-b-xl bg-[#2a2b38]" />
            </motion.div>
          ) : (
            <motion.div style={{ y: phoneY }} className="mx-auto w-[min(78vw,300px)]">
              <div className="dark-island rounded-[2.6rem] border-[10px] border-[#1a1b26] bg-[#1a1b26] shadow-[0_50px_120px_-30px_color-mix(in_oklab,var(--c1)_50%,transparent)] ring-1 ring-white/15">
                <div className="relative overflow-hidden rounded-[1.9rem]">
                  <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
                  <ScaledFrame src={p.live!} width={390} height={800} title="GoChatPilot live preview (mobile)" active={inView} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-300">Featured · {p.org}</p>
        <h3 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          {p.title} <span className="align-middle text-3xl">{p.emoji}</span>
        </h3>
        <p className="mt-2 text-lg text-gradient font-semibold">{p.subtitle}</p>
        <p className="mt-4 leading-relaxed text-muted">{p.description}</p>
        <ul className="mt-5 space-y-2.5">
          {p.highlights.map((h) => (
            <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-300" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">
              {s}
            </span>
          ))}
        </div>
        <a
          href={p.live}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-3 font-semibold text-white shadow-[0_10px_40px_-8px_color-mix(in_oklab,var(--c1)_80%,transparent)] transition hover:brightness-110"
        >
          Open GoChatPilot <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function ProjectVisual({ slug, accent }: { slug: string; accent: string }) {
  if (slug === "cyber-security-platform") {
    const n = [[50, 40], [130, 25], [210, 45], [90, 95], [170, 100], [250, 90]];
    const links = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]];
    return (
      <svg viewBox="0 0 300 130" className="h-full w-full">
        {links.map(([a, b], i) => (
          <line key={i} x1={n[a][0]} y1={n[a][1]} x2={n[b][0]} y2={n[b][1]} stroke={accent} strokeWidth={1.5} strokeDasharray="4 6" className="anim-dash40" />
        ))}
        {n.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={12} fill={accent} opacity={0.15} className="anim-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
            <circle cx={x} cy={y} r={6} fill={i === 2 ? "#f87171" : accent} />
          </g>
        ))}
        <text x={150} y={124} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">CTF · LIVE TOPOLOGY</text>
      </svg>
    );
  }
  if (slug === "erp-platform") {
    const bars = [40, 70, 55, 90, 65, 100, 80];
    return (
      <svg viewBox="0 0 300 130" className="h-full w-full">
        {bars.map((h, i) => (
          <motion.rect key={i} x={30 + i * 36} width={22} rx={4} fill={accent} opacity={0.4 + i * 0.08} initial={{ height: 0, y: 115 }} whileInView={{ height: h, y: 115 - h }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8 }} />
        ))}
        <line x1={20} y1={115} x2={280} y2={115} stroke="#334155" />
      </svg>
    );
  }
  if (slug === "hr-portal") {
    return (
      <svg viewBox="0 0 300 130" className="h-full w-full">
        {Array.from({ length: 21 }).map((_, i) => {
          const x = 45 + (i % 7) * 32;
          const y = 18 + Math.floor(i / 7) * 34;
          const checked = [1, 2, 4, 5, 8, 9, 10, 12, 15, 16, 17, 19].includes(i);
          return (
            <g key={i}>
              <rect x={x} y={y} width={24} height={24} rx={6} fill={checked ? accent : "#1e293b"} opacity={checked ? 0.85 : 1} />
              {checked && (
                <motion.path d={`M ${x + 6} ${y + 12} l 4 4 l 8 -9`} stroke="#052e1c" strokeWidth={2.5} fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} />
              )}
            </g>
          );
        })}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 130" className="h-full w-full">
      <defs>
        <linearGradient id="inv" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path d="M 10 110 L 50 90 L 90 96 L 130 60 L 170 70 L 210 40 L 250 48 L 290 18 L 290 125 L 10 125 Z" fill="url(#inv)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} />
      <motion.path d="M 10 110 L 50 90 L 90 96 L 130 60 L 170 70 L 210 40 L 250 48 L 290 18" stroke={accent} strokeWidth={3} fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
      <circle cx={290} cy={18} r={6} fill={accent} className="anim-pulse" />
    </svg>
  );
}

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <Reveal delay={i * 0.08}>
      <TiltCard className="rounded-3xl" max={8}>
        <article className="glass spotlight group flex h-full flex-col overflow-hidden rounded-3xl">
          <div className="relative h-44 overflow-hidden border-b border-white/5" style={{ background: `radial-gradient(120% 120% at 50% 0%, ${p.accent}2a, transparent 70%)` }}>
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="relative h-full p-4 transition-transform duration-700 group-hover:scale-105">
              <ProjectVisual slug={p.slug} accent={p.accent} />
            </div>
            <span className="absolute right-4 top-4 text-3xl" aria-hidden>{p.emoji}</span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: p.accent }}>{p.org}</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">{p.title}</h3>
            <p className="text-sm text-white/70">{p.subtitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
            <ul className="mt-4 space-y-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm text-muted">
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.accent }} />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {p.stack.map((s) => (
                <span key={s} className="rounded-md bg-white/[0.06] px-2 py-1 text-[11px] text-white/75">{s}</span>
              ))}
            </div>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad relative overflow-hidden">
      <div className="absolute left-1/2 top-40 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-fuchsia-700/10 blur-[160px]" />
      <div className="container-x relative">
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Products I've"
          highlight="built & shipped."
          subtitle="Five production projects across AI, cybersecurity, ERP, HR and investment domains. Start with GoChatPilot below: it's running live inside this page."
        />
        <FeaturedProject />
        <div className="mt-24 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
