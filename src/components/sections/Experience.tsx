"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, MapPin, Calendar, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { experiences } from "@/data/career";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-pad relative overflow-x-clip">
      <div className="absolute left-1/2 top-0 h-full w-[60rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--c2)_8%,transparent),transparent_60%)]" />
      <div className="container-x relative">
        <SectionHeading
          id="experience-title"
          eyebrow="Experience"
          title="6+ years of building"
          highlight="what matters."
          subtitle="From shipping ERP, HR and investment platforms to leading the frontend architecture of an enterprise cybersecurity platform."
        />

        <div ref={ref} className="relative mx-auto max-w-5xl">
          {/* Timeline rail */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-8" />
          <motion.div style={{ scaleY }} className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-violet-400 via-cyan-300 to-pink-400 md:left-8" />

          <ol className="space-y-14">
            {experiences.map((e, idx) => (
              <li key={e.company} className="relative pl-14 md:pl-24">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="absolute left-4 top-2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full bg-ink ring-2 ring-cyan-300/70 md:left-8 md:h-14 md:w-14"
                >
                  <span className="absolute inset-0 animate-pulse-ring rounded-full ring-2 ring-cyan-300/40" />
                  <Briefcase className="h-4 w-4 text-cyan-200 md:h-6 md:w-6" />
                </motion.span>

                <Reveal x={40} y={0}>
                  <article className="glass gradient-border relative overflow-hidden rounded-3xl p-6 sm:p-8">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-500/15 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {idx === 0 && (
                          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Current role
                          </span>
                        )}
                        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{e.role}</h3>
                        <p className="mt-1 text-lg">
                          {e.companyUrl ? (
                            <a href={e.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gradient font-semibold">
                              {e.company} <ArrowUpRight className="h-4 w-4 text-cyan-300" />
                            </a>
                          ) : (
                            <span className="text-gradient font-semibold">{e.company}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 text-sm text-muted sm:items-end">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-violet-300" /> {e.period} · {e.duration}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-pink-300" /> {e.location}
                        </span>
                        <span className="text-xs">{e.type}</span>
                      </div>
                    </div>

                    <p className="relative mt-5 text-base leading-relaxed text-white/85">{e.summary}</p>

                    <ul className="relative mt-5 space-y-3">
                      {e.highlights.map((h, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-3 text-sm leading-relaxed text-muted sm:text-[15px]"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                          <span>{h}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="relative mt-6 flex flex-wrap gap-2">
                      {e.stack.map((s) => (
                        <span key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
