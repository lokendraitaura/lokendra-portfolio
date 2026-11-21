"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Code2, Network, Users, Rocket, Layers, Brain, Gauge, ShieldCheck } from "lucide-react";
import { profile, stats } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import TiltCard from "@/components/ui/TiltCard";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useLiteDevice } from "@/hooks/usePerf";
import { ArchitectScene, CodingScene, MeetingScene, ShippingScene } from "@/components/illustrations/Scenes";

const scenes = [
  {
    key: "architect",
    label: "Architecting",
    icon: Network,
    title: "Designing the architecture",
    text: "Planning feature-based, co-located structures, data flow with TanStack Query, RBAC and the boundaries that keep big apps scalable.",
    Scene: ArchitectScene,
  },
  {
    key: "code",
    label: "Coding",
    icon: Code2,
    title: "Deep in the code",
    text: "Writing clean, typed React and Next.js, from reusable hooks and design-system components to complex AG Grid and React Flow screens.",
    Scene: CodingScene,
  },
  {
    key: "meet",
    label: "Collaborating",
    icon: Users,
    title: "Leading with the team",
    text: "Sprint planning, design reviews with UI/UX in Figma, code reviews and aligning backend contracts. Ownership is a team sport.",
    Scene: MeetingScene,
  },
  {
    key: "ship",
    label: "Shipping",
    icon: Rocket,
    title: "Shipping to production",
    text: "Lint, test, build, deploy. CI/CD on every push, Web Vitals in the green, and features in users' hands faster.",
    Scene: ShippingScene,
  },
];

const pillars = [
  { icon: Layers, title: "Frontend Architecture", text: "Co-location, feature-based structure, SOLID and design patterns for scalable codebases." },
  { icon: Brain, title: "AI-Native Interfaces", text: "Streaming LLM chat, prompt design, tool calling, RAG and agent UIs." },
  { icon: Gauge, title: "Performance Obsessed", text: "Core Web Vitals, code-splitting, virtualization and memoization." },
  { icon: ShieldCheck, title: "Secure & Accessible", text: "RBAC, protected routes, CSP, WCAG and full keyboard support." },
];

import type { DayKey } from "@/components/three/DayScenes";

const DayScenes = dynamic(() => import("@/components/three/DayScenes"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/[0.03]" />,
});

type SceneImages = Partial<Record<"code" | "architect" | "meet" | "ship", string | null>>;

/** A real photo/render with a slow Ken Burns move and a glossy caption chip. */
function PhotoScene({ src, label }: { src: string; label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-full w-full animate-[kenburns_14s_ease-in-out_infinite_alternate] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-transparent to-cyan-500/10 mix-blend-overlay" />
    </div>
  );
}

function DayInLife({ images: provided = {}, hasAvatar = false }: { images?: SceneImages; hasAvatar?: boolean }) {
  // Phones/tablets show crisp pre-rendered stills of the same 3D scenes instead of a second WebGL stage.
  const lite = useLiteDevice();
  const images: SceneImages = lite && hasAvatar
    ? {
        architect: "/images/day/architect.webp",
        code: "/images/day/code.webp",
        meet: "/images/day/meet.webp",
        ship: "/images/day/ship.webp",
        // a real photo dropped into public/scenes still wins
        ...Object.fromEntries(Object.entries(provided).filter(([, v]) => v)),
      }
    : provided;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Only download/compile the 3D stage when this card is about to scroll into view.
  const nearRef = useRef<HTMLDivElement>(null);
  const near = useInView(nearRef, { once: true, margin: "300px" });
  const onScreen = useInView(nearRef);

  // Auto-advance only while the card is actually on screen.
  useEffect(() => {
    if (paused || reducedMotion || !onScreen) return;
    const t = setInterval(() => setActive((a) => (a + 1) % scenes.length), 6500);
    return () => clearInterval(t);
  }, [paused, reducedMotion, onScreen]);

  const current = scenes[active];

  return (
    <div ref={nearRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onPointerDown={() => setPaused(true)}>
      <TiltCard max={hasAvatar ? 0 : 6} className="rounded-3xl">
        <div className="dark-island gradient-border relative aspect-[600/420] overflow-hidden rounded-3xl bg-[radial-gradient(120%_100%_at_50%_0%,#24185a,#0c0e24_70%)] shadow-[0_40px_100px_-30px_color-mix(in_oklab,var(--c1)_50%,transparent)]">
          {hasAvatar && near && !images[current.key as keyof SceneImages] && (
            <div className="absolute inset-0">
              <DayScenes active={current.key as DayKey} />
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, scale: 1.04, filter: "blur(0px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.97, filter: "blur(0px)" }}
              transition={{ duration: 0.55 }}
              className="absolute inset-0"
            >
              {images[current.key as keyof SceneImages] ? (
                <PhotoScene src={images[current.key as keyof SceneImages]!} label={current.title} />
              ) : hasAvatar ? null : (
                <current.Scene />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </TiltCard>

      <div role="tablist" aria-label="A day in my life" className="mt-5 grid grid-cols-4 gap-2">
        {scenes.map((s, i) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl px-2 py-3 text-xs transition sm:text-sm ${
              i === active ? "bg-white/10 text-white" : "text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
            {i === active && !paused && (
              <motion.span
                key={`bar-${active}`}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-400 to-cyan-300"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6.5, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 text-center"
        >
          <p className="font-display text-lg font-semibold text-white">{current.title}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">{current.text}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function About({ sceneImages = {}, hasAvatar = false }: { sceneImages?: SceneImages; hasAvatar?: boolean }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative overflow-x-clip">
      <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
      <div className="container-x relative">
        <SectionHeading
          id="about-title"
          eyebrow="About me"
          title="The engineer behind the"
          highlight="pixels."
          subtitle="Frontend architect by role, product builder by heart. Here's who I am, what I do every day, and what I bring to your team."
        />

        <div className="grid items-start gap-14 lg:grid-cols-2">
          <div className="space-y-6 text-base leading-relaxed text-muted sm:text-lg">
            <Reveal>
              <p>
                Hi, I&apos;m <strong className="text-white">{profile.name}</strong> (Lokendra Kumar Prajapati), a{" "}
                <strong className="text-white">Senior Frontend Engineer and Frontend Architect</strong> from Uttar Pradesh, India, currently leading frontend at{" "}
                <a href={profile.socials.company} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline-offset-4 hover:underline">
                  Zindagi Technologies
                </a>{" "}
                in Delhi.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>{profile.summary}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>{profile.aiSummary}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>{profile.alsoSummary}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4 text-center">
                    <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                      <Counter to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mt-1 text-xs leading-snug text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} x={40} y={0}>
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">A day in my life</p>
            <DayInLife images={sceneImages} hasAvatar={hasAvatar} />
          </Reveal>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <TiltCard className="rounded-2xl">
                <div className="glass spotlight group h-full rounded-2xl p-6 transition hover:bg-white/[0.07]">
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-cyan-200 ring-1 ring-white/10 transition group-hover:scale-110">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted">{p.text}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
