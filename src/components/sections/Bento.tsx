"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Clock, MapPin, Rocket, Trophy, Sparkles, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { featuredTech } from "@/data/skills";
import { profile, whatsappLink } from "@/data/profile";
import Counter from "@/components/ui/Counter";
import TiltCard from "@/components/ui/TiltCard";

function IstClock() {
  const [now, setNow] = useState<string>("");
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
      setHour(Number(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false })));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const working = hour !== null && hour >= 9 && hour < 21;
  return (
    <div>
      <p className="whitespace-nowrap font-display text-3xl font-bold tabular-nums text-white xl:text-4xl">{now || "––:––:––"}</p>
      <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
        <span className={`h-2 w-2 rounded-full ${working ? "animate-pulse bg-emerald-400" : "bg-amber-400"}`} />
        {hour === null ? "India Standard Time" : working ? "Usually online now · replies fast" : "Off-hours in India · I'll reply in the morning"}
      </p>
    </div>
  );
}

const card = "spotlight relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-white/20";

function Cell({ className = "", delay = 0, children }: { className?: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard className="rounded-3xl" max={5}>
        {children}
      </TiltCard>
    </motion.div>
  );
}

export default function Bento() {
  const stack = featuredTech.slice(0, 18);
  return (
    <section aria-label="At a glance" className="relative py-20 sm:py-24">
      <div className="container-x">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300"
        >
          ✦ At a glance ✦
        </motion.p>
        <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Current role */}
          <Cell className="sm:col-span-2" delay={0}>
            <div className={card}>
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/25 blur-3xl" />
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Currently
              </p>
              <h3 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
                Senior Software Developer <span className="text-gradient">@ Zindagi Technologies</span>
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                Leading the frontend architecture of an enterprise Cybersecurity Simulation Platform: live CTF events, real-time training labs, RBAC, AG Grid and React Flow at scale.
              </p>
              <a href="#experience" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-white">
                <Briefcase className="h-4 w-4" /> See my experience <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Cell>

          {/* Clock */}
          <Cell delay={0.06}>
            <div className={card}>
              <p className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
                <Clock className="h-4 w-4 text-cyan-300" /> My local time
              </p>
              <IstClock />
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5 text-pink-300" /> {profile.shortLocation}
              </p>
            </div>
          </Cell>

          {/* Stats */}
          <Cell delay={0.12}>
            <div className={`${card} grid grid-cols-2 gap-4`}>
              {[
                { v: 6, s: "+", l: "Years" },
                { v: 5, s: "", l: "Products" },
                { v: 190, s: "+", l: "Skills" },
                { v: 2, s: "", l: "Awards" },
              ].map((x) => (
                <div key={x.l}>
                  <p className="text-gradient font-display text-4xl font-bold">
                    <Counter to={x.v} suffix={x.s} />
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted">{x.l}</p>
                </div>
              ))}
            </div>
          </Cell>

          {/* Tech stack wall */}
          <Cell className="sm:col-span-2 lg:row-span-2" delay={0.18}>
            <div className={card}>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
                <Sparkles className="h-4 w-4 text-violet-300" /> Daily toolkit
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6">
                {stack.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.03, type: "spring", stiffness: 260, damping: 18 }}
                    whileHover={{ y: -6, scale: 1.08 }}
                    className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/[0.08]"
                    title={t.name}
                  >
                    <t.icon className="h-7 w-7 transition-transform group-hover:scale-110" style={{ color: t.color }} />
                    <span className="px-1 text-center text-[10px] leading-tight text-white/70">{t.name}</span>
                  </motion.div>
                ))}
              </div>
              <a href="#skills" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-white">
                Explore all 190+ skills <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Cell>

          {/* GoChatPilot */}
          <Cell className="sm:col-span-2" delay={0.24}>
            <a href={profile.socials.goChatPilot} target="_blank" rel="noopener noreferrer" className={`${card} group block`}>
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-60 w-60 rounded-full bg-fuchsia-500/25 blur-3xl" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
                    <Rocket className="h-4 w-4 text-fuchsia-300" /> Live product I built
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">GoChatPilot 🤖</h3>
                  <p className="mt-2 max-w-md text-sm text-muted">AI-powered WhatsApp toolkit: links, QR codes, AI-written messages and marketing content. Next.js + Groq AI, installable PWA.</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/10 text-white transition group-hover:rotate-45 group-hover:bg-fuchsia-500">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> chat-pilot.in · online
              </p>
            </a>
          </Cell>

          {/* Awards */}
          <Cell delay={0.3}>
            <a href="#awards" className={`${card} group block`}>
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
                <Trophy className="h-4 w-4 text-amber-300" /> Recognised
              </p>
              <div className="mt-4 flex -space-x-6">
                {["/awards/standout-performer.webp", "/awards/pat-on-the-back.webp"].map((src, i) => (
                  <div key={src} className="relative h-20 w-28 overflow-hidden rounded-xl ring-2 ring-amber-300/40 transition-transform duration-500 group-hover:rotate-0" style={{ transform: `rotate(${i ? 6 : -6}deg)` }}>
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-white">Standout Performer · Pat on the Back</p>
            </a>
          </Cell>

          {/* Contact */}
          <Cell delay={0.36}>
            <div className={`${card} flex flex-col justify-between bg-gradient-to-br from-violet-600/30 via-transparent to-cyan-500/20`}>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Have an idea or a role?</h3>
                <p className="mt-1 text-sm text-muted">Let&apos;s talk. I reply quickly.</p>
              </div>
              <div className="mt-4 flex gap-2">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-[#06290f]">
                  <FaWhatsapp className="h-4 w-4" /> WhatsApp
                </a>
                <a href="#contact" className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15">
                  <Mail className="h-4 w-4" /> Email
                </a>
              </div>
            </div>
          </Cell>
        </div>
      </div>
    </section>
  );
}
