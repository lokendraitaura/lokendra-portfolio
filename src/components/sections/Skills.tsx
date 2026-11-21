"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { levelScore, skillCategories, skillGroups, allSkills, type Level, type Skill } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import SkillSphere from "./SkillSphere";
import { scrollToId } from "@/components/layout/SmoothScroll";

const sphereItems = [
  ["React", "#22d3ee"], ["Next.js", "#ffffff"], ["TypeScript", "#60a5fa"], ["JavaScript", "#facc15"], ["Redux Toolkit", "#a78bfa"],
  ["TanStack Query", "#f472b6"], ["AG Grid", "#34d399"], ["React Flow", "#f472b6"], ["Storybook", "#fb7185"], ["Material UI", "#60a5fa"],
  ["Tailwind CSS", "#38bdf8"], ["shadcn/ui", "#ffffff"], ["Radix UI", "#c4b5fd"], ["Zustand", "#fbbf24"], ["Zod", "#93c5fd"],
  ["React Hook Form", "#f472b6"], ["SSR / ISR", "#22d3ee"], ["Server Actions", "#a78bfa"], ["RSC", "#22d3ee"], ["Web Vitals", "#fb923c"],
  ["Code Splitting", "#fb923c"], ["Virtualization", "#fb923c"], ["WCAG / ARIA", "#2dd4bf"], ["PWA", "#2dd4bf"], ["i18n", "#2dd4bf"],
  ["RBAC", "#f87171"], ["JWT / OAuth", "#f87171"], ["WebSockets", "#f87171"], ["Jest", "#60a5fa"], ["Playwright", "#60a5fa"],
  ["Vite", "#a78bfa"], ["Micro-Frontends", "#34d399"], ["Design Patterns", "#34d399"], ["System Design", "#34d399"], ["LLM APIs", "#e879f9"],
  ["Streaming UI", "#e879f9"], ["RAG", "#e879f9"], ["LangChain.js", "#e879f9"], ["LangGraph.js", "#e879f9"], ["AI Agents", "#e879f9"],
  ["MCP", "#e879f9"], ["Vercel AI SDK", "#e879f9"], ["React Native", "#38bdf8"], ["Node.js", "#4ade80"], ["MongoDB", "#4ade80"],
  ["Docker", "#fbbf24"], ["AWS", "#fbbf24"], ["Figma", "#f472b6"],
].map(([name, color]) => ({ name, color }));

const levelStyle: Record<Level, string> = {
  Expert: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
  Advanced: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
  Proficient: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
  "Working knowledge": "bg-amber-400/15 text-amber-300 ring-amber-400/30",
};

function SkillCard({ skill, color, index }: { skill: Skill; color: string; index: number }) {
  const score = levelScore[skill.level];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.4) }}
      whileHover={{ y: -6 }}
      className="spotlight group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: color }}
      />
      <div className="relative flex items-start gap-4">
        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/10 transition-transform duration-500 group-hover:rotate-[360deg]"
          style={{ background: `${color}1f`, color }}
        >
          <skill.icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-display text-base font-semibold text-white">{skill.name}</h4>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${levelStyle[skill.level]}`}>
              {skill.level}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{skill.description}</p>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]" aria-hidden>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, #22d3ee)` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${score}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Skills() {
  const [active, setActive] = useState(skillCategories[0].id);
  const [query, setQuery] = useState("");


  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      q
        ? allSkills.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
        : [],
    [q]
  );

  const counts = skillGroups.map((g) => ({
    group: g,
    count: skillCategories.filter((c) => c.group === g).reduce((n, c) => n + c.skills.length, 0),
  }));

  return (
    <section id="skills" aria-labelledby="skills-title" className="section-pad relative overflow-x-clip">
      <div className="absolute left-0 top-1/4 h-[30rem] w-[30rem] rounded-full bg-violet-700/15 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & expertise"
          title="Every tool in my"
          highlight="toolkit, explained."
          subtitle={`${allSkills.length}+ skills across ${skillCategories.length} categories, each with how I actually use it in production. Drag the sphere, pick a category, or search.`}
        />

        <div className="mb-20 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <SkillSphere items={sphereItems} radius={230} />
          </Reveal>
          <div className="space-y-4">
            {counts.map((c, i) => {
              const cats = skillCategories.filter((x) => x.group === c.group);
              return (
                <Reveal key={c.group} delay={i * 0.1} x={30} y={0}>
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-lg font-semibold text-white">{c.group}</h3>
                      <span className="font-mono text-sm text-cyan-300">{c.count} skills</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {cats.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setQuery("");
                            setActive(cat.id);
                            scrollToId("skills-explorer");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 transition hover:border-white/30 hover:text-white"
                        >
                          <cat.icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                          {cat.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Explorer */}
        <div id="skills-explorer" className="scroll-mt-28 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:h-fit">
            <label className="glass mb-4 flex items-center gap-2 rounded-xl px-4 py-3">
              <Search className="h-4 w-4 text-muted" />
              <span className="sr-only">Search skills</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills… e.g. RAG, AG Grid"
                className="w-full bg-transparent text-sm text-white placeholder:text-muted/70 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X className="h-4 w-4 text-muted" />
                </button>
              )}
            </label>
            <nav aria-label="Skill categories" className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:gap-1 lg:overflow-visible" data-lenis-prevent>
              {skillGroups.map((g) => (
                <div key={g} className="contents lg:block">
                  <p className="hidden px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted/70 lg:block">{g}</p>
                  {skillCategories
                    .filter((c) => c.group === g)
                    .map((c) => {
                      const isActive = !q && c.id === active;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setQuery("");
                            setActive(c.id);
                          }}
                          className={`relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full ${
                            isActive ? "text-white" : "text-muted hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {isActive && (
                            <motion.span layoutId="skill-tab" className="absolute inset-0 -z-10 rounded-xl bg-white/10 ring-1 ring-white/15" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                          )}
                          <c.icon className="h-4 w-4 shrink-0" style={{ color: c.color }} />
                          <span className="whitespace-nowrap">{c.title}</span>
                          <span className="ml-auto hidden font-mono text-[11px] text-muted lg:inline">{c.skills.length}</span>
                        </button>
                      );
                    })}
                </div>
              ))}
            </nav>
          </aside>

          <div className="min-w-0">
            {q && (
              <div>
                <p className="mb-5 text-sm text-muted">
                  {results.length} result{results.length === 1 ? "" : "s"} for <span className="text-white">“{query}”</span>
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <AnimatePresence>
                    {results.map((s, i) => (
                      <SkillCard key={s.category + s.name} skill={s} index={i} color={skillCategories.find((c) => c.title === s.category)?.color ?? "#8b5cf6"} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* All categories stay in the DOM (good for SEO); only the active one is shown. */}
            {skillCategories.map((c) => {
              const show = !q && c.id === active;
              const avg = Math.round(c.skills.reduce((n, s) => n + levelScore[s.level], 0) / c.skills.length);
              return (
                <div key={c.id} hidden={!show} role="region" aria-label={c.title}>
                  {show && (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 p-6 sm:p-8"
                      style={{ background: `radial-gradient(120% 140% at 0% 0%, ${c.color}26, transparent 60%), rgba(255,255,255,0.02)` }}
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl ring-1 ring-white/15" style={{ background: `${c.color}22`, color: c.color }}>
                          <c.icon className="h-8 w-8" />
                        </span>
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: c.color }}>
                            {c.group}
                          </p>
                          <h3 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{c.title}</h3>
                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{c.summary}</p>
                        </div>
                        <div className="relative grid h-24 w-24 shrink-0 place-items-center">
                          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                            <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" />
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="42"
                              stroke={c.color}
                              strokeWidth="8"
                              strokeLinecap="round"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: avg / 100 }}
                              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </svg>
                          <div className="text-center">
                            <p className="font-display text-xl font-bold text-white">{c.skills.length}</p>
                            <p className="text-[10px] uppercase tracking-wider text-muted">skills</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {!show && (
                    <>
                      <h3>{c.title}</h3>
                      <p>{c.summary}</p>
                    </>
                  )}
                  <div className="grid gap-4 md:grid-cols-2">
                    {c.skills.map((s, i) =>
                      show ? (
                        <SkillCard key={s.name} skill={s} index={i} color={c.color} />
                      ) : (
                        <article key={s.name}>
                          <h4>{s.name}</h4>
                          <p>{s.description}</p>
                        </article>
                      )
                    )}
                  </div>
                </div>
              );
            })}

            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="font-mono uppercase tracking-widest">Legend:</span>
              {(Object.keys(levelStyle) as Level[]).map((l) => (
                <span key={l} className={`rounded-full px-2.5 py-1 ring-1 ${levelStyle[l]}`}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
