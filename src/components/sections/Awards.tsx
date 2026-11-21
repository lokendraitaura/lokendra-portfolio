"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy, Medal, GraduationCap, Award, Maximize2, X, Quote } from "lucide-react";
import { awards, education } from "@/data/career";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

type AwardItem = (typeof awards)[number];

function Lightbox({ award, onClose }: { award: AwardItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <motion.div
      className="dark-island fixed inset-0 z-[150] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={award.title}
    >
      <motion.div
        initial={{ scale: 0.85, rotateX: 12, opacity: 0 }}
        animate={{ scale: 1, rotateX: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={award.image}
          alt={award.imageAlt}
          loading="eager"
          decoding="async"
          className="mx-auto block max-h-[80vh] w-auto max-w-full rounded-2xl shadow-[0_40px_140px_-20px_rgba(251,191,36,0.55)] ring-1 ring-amber-200/40"
        />
        <p className="mt-4 text-center text-sm text-white/80">
          {award.title} · {award.org} · {award.date}
        </p>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-2 -top-12 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20 sm:-right-12 sm:-top-2"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function AwardCard({ a, i, onOpen }: { a: AwardItem; i: number; onOpen: () => void }) {
  const Icon = i === 0 ? Trophy : Medal;
  return (
    <Reveal delay={i * 0.12}>
      <TiltCard className="rounded-[2rem]" max={8}>
        <article className="group relative h-full overflow-hidden rounded-[2rem] border border-amber-200/20 bg-gradient-to-br from-amber-400/[0.12] via-white/[0.03] to-fuchsia-500/[0.1] p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 animate-shimmer bg-[linear-gradient(115deg,transparent_35%,rgba(251,191,36,0.10)_50%,transparent_65%)] bg-[length:250%_100%]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

          {/* Original award image in a glowing frame */}
          <button
            onClick={onOpen}
            className="relative block w-full overflow-hidden rounded-2xl bg-black/40 ring-1 ring-amber-200/30 shadow-[0_30px_80px_-30px_rgba(251,191,36,0.6)]"
            style={{ aspectRatio: "16/11" }}
            aria-label={`View ${a.title} full size`}
          >
            {/* blurred fill so the full original always fits */}
            <Image src={a.image} alt="" aria-hidden fill sizes="200px" className="scale-110 object-cover opacity-60 blur-2xl" />
            <Image
              src={a.image}
              alt={a.imageAlt}
              fill
              sizes="(max-width: 768px) 92vw, 600px"
              className="object-contain p-2 drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white ring-1 ring-white/20 transition group-hover:bg-amber-400 group-hover:text-black">
              <Maximize2 className="h-3.5 w-3.5" /> View original
            </span>
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black shadow-lg">
              <Icon className="h-3.5 w-3.5" /> {a.date}
            </span>
          </button>

          <div className="relative mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">{a.kind}</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{a.title}</h3>
            <p className="text-sm text-white/70">{a.org}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{a.description}</p>
            <figure className="mt-5 rounded-2xl border-l-2 border-amber-300/70 bg-white/[0.04] p-4">
              <Quote className="mb-2 h-4 w-4 text-amber-300" />
              <blockquote className="text-sm italic leading-relaxed text-white/85">“{a.quote}”</blockquote>
              <figcaption className="mt-2 text-xs text-amber-200/80">— {a.by}</figcaption>
            </figure>
          </div>
        </article>
      </TiltCard>
    </Reveal>
  );
}

export default function Awards() {
  const [open, setOpen] = useState<AwardItem | null>(null);
  return (
    <section id="awards" aria-labelledby="awards-title" className="section-pad relative overflow-x-clip">
      <div className="absolute right-0 top-20 h-[28rem] w-[28rem] rounded-full bg-amber-500/10 blur-[130px]" />
      <div className="container-x relative">
        <SectionHeading
          id="awards-title"
          eyebrow="Recognition & Education"
          title="Awarded for"
          highlight="ownership."
          subtitle="Recognised twice by Zindagi Technologies' directors for exceptional ownership, timely delivery and lasting impact on product quality. Here are the originals."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {awards.map((a, i) => (
            <AwardCard key={a.title} a={a} i={i} onOpen={() => setOpen(a)} />
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.1}>
              <article className="glass spotlight group flex h-full items-center gap-5 rounded-3xl p-6 transition hover:bg-white/[0.06]">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/25 to-violet-500/20 text-cyan-200 ring-1 ring-white/10 transition group-hover:-rotate-6 group-hover:scale-110">
                  {i === 0 ? <GraduationCap className="h-8 w-8" /> : <Award className="h-8 w-8" />}
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{e.period}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-white sm:text-xl">{e.degree}</h3>
                  <p className="text-sm text-muted">{e.school}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <Lightbox award={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
