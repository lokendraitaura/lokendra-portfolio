"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Search, Mic, Camera, RotateCcw, ArrowUpRight, Lock, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { profile, SITE_URL, whatsappLink } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const QUERY = "Lokendra Kumar Prajapati Senior Software Developer";

const siteHost = SITE_URL.replace(/^https?:\/\//, "");

const results = [
  {
    favicon: "LK",
    faviconBg: "from-violet-500 to-cyan-400",
    site: "Lokendra Kumar",
    crumb: `https://${siteHost}`,
    href: "#home",
    title: "Lokendra Kumar Prajapati – Senior Software Developer & Frontend Architect",
    snippet:
      "Senior Frontend Engineer with 6+ years building enterprise React.js, Next.js & TypeScript apps: design systems, AG Grid, React Flow, TanStack Query and AI chat interfaces.",
    links: ["Skills", "Experience", "Projects", "Contact"],
  },
  {
    favicon: "in",
    faviconBg: "from-[#0A66C2] to-[#0A66C2]",
    site: "LinkedIn",
    crumb: "linkedin.com › in › lokendra-kumar-prajapati",
    href: profile.socials.linkedin,
    title: "Lokendra Kumar Prajapati – Senior Software Developer – Zindagi Technologies",
    snippet:
      "Senior Software Developer at Zindagi Technologies · Frontend Architect · React.js · Next.js · TypeScript · LLM Applications · Design Systems · Delhi, India.",
  },
  {
    favicon: "GH",
    faviconBg: "from-zinc-600 to-zinc-800",
    site: "GitHub",
    crumb: "github.com › lokendraitaura",
    href: profile.socials.github,
    title: "lokendraitaura (Lokendra Kumar) · GitHub",
    snippet: "Frontend engineer building with React, Next.js, TypeScript and AI. Explore repositories, experiments and open-source contributions.",
  },
  {
    favicon: "🤖",
    faviconBg: "from-fuchsia-500 to-violet-600",
    site: "GoChatPilot",
    crumb: "chat-pilot.in",
    href: profile.socials.goChatPilot,
    title: "GoChatPilot – WhatsApp Marketing Made Simple",
    snippet: "AI-powered WhatsApp toolkit: create WhatsApp links, QR codes, AI-generated messages and marketing content from one dashboard. Built with Next.js, Groq AI and Shadcn UI.",
  },
];

function Logo({ small = false }: { small?: boolean }) {
  const letters = [
    ["G", "#4285F4"],
    ["o", "#EA4335"],
    ["o", "#FBBC05"],
    ["g", "#4285F4"],
    ["l", "#34A853"],
    ["e", "#EA4335"],
  ];
  return (
    <span className={`select-none font-sans font-medium tracking-tight ${small ? "text-2xl" : "text-5xl sm:text-6xl"}`}>
      {letters.map(([l, c], i) => (
        <span key={i} style={{ color: c }}>
          {l}
        </span>
      ))}
    </span>
  );
}

export default function SearchShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "loading" | "results">("typing");
  const [run, setRun] = useState(0);
  const started = inView || run > 0;

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const id = setInterval(() => {
      i++;
      setTyped(QUERY.slice(0, i));
      if (i >= QUERY.length) {
        clearInterval(id);
        timers.push(setTimeout(() => setPhase("loading"), 450));
        timers.push(setTimeout(() => setPhase("results"), 1350));
      }
    }, 55);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [started, run]);

  const replay = () => {
    setTyped("");
    setPhase("typing");
    setRun((r) => r + 1);
  };

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent("Lokendra Kumar Frontend Engineer")}`;

  return (
    <section id="search" aria-labelledby="search-title" className="section-pad relative overflow-hidden">
      <div className="absolute left-1/2 top-1/3 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="container-x relative">
        <SectionHeading
          id="search-title"
          eyebrow="Find me online"
          title="Just"
          highlight="Google me."
          subtitle="Recruiters, founders and engineers find me everywhere: my portfolio, LinkedIn, GitHub and the AI product I built and launched, GoChatPilot."
        />

        <Reveal>
          <div ref={ref} className="dark-island mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#202124] shadow-[0_40px_120px_-30px_rgba(66,133,244,0.45)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b border-white/5 bg-[#2b2c30] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="hidden items-center gap-2 text-white/40 sm:flex">
                <ChevronLeft className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
                <RefreshCw className="h-3.5 w-3.5" />
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#1d1e21] px-4 py-1.5 font-mono text-xs text-white/60">
                <Lock className="h-3 w-3 shrink-0 text-emerald-400" />
                <span className="truncate">
                  google.com/search?q={phase === "results" || phase === "loading" ? encodeURIComponent(QUERY).replace(/%20/g, "+") : ""}
                </span>
              </div>
              <button onClick={replay} aria-label="Replay search animation" className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="relative px-4 py-8 sm:px-8">
              {/* Results always occupy the layout (no layout shift); the search screen overlays them until done. */}
              <AnimatePresence>
                {phase !== "results" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 bg-[#202124] px-4"
                  >
                    <Logo />
                    <div className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/15 bg-[#303134] px-5 py-3.5 shadow-lg">
                      <Search className="h-5 w-5 shrink-0 text-white/50" />
                      <span className="min-w-0 flex-1 truncate text-left text-white">
                        {typed}
                        <span className="ml-0.5 inline-block h-5 w-[2px] animate-blink bg-blue-400 align-middle" />
                      </span>
                      <Mic className="h-5 w-5 shrink-0 text-[#4285F4]" />
                      <Camera className="hidden h-5 w-5 shrink-0 text-[#FBBC05] sm:block" />
                    </div>
                    <div className="flex gap-3">
                      <motion.span
                        animate={phase === "loading" ? { scale: [1, 0.92, 1], backgroundColor: "#4a4b4f" } : {}}
                        className="rounded-md bg-[#303134] px-4 py-2 text-sm text-white/80"
                      >
                        Google Search
                      </motion.span>
                      <span className="rounded-md bg-[#303134] px-4 py-2 text-sm text-white/80">I&apos;m Feeling Lucky</span>
                    </div>
                    {phase === "loading" && (
                      <div className="h-1 w-48 overflow-hidden rounded bg-white/10">
                        <motion.div className="h-full w-1/3 bg-[#4285F4]" animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 0.8 }} />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div key={`results-${run}`} initial={false} animate={{ opacity: phase === "results" ? 1 : 0 }} inert={phase !== "results"}>
                    <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
                      <Logo small />
                      <div className="flex flex-1 items-center gap-3 rounded-full border border-white/15 bg-[#303134] px-5 py-2.5">
                        <span className="min-w-0 flex-1 truncate text-sm text-white">{QUERY}</span>
                        <Search className="h-4 w-4 text-[#8ab4f8]" />
                      </div>
                    </div>
                    <div className="mb-5 flex gap-5 overflow-x-auto text-sm text-white/60 no-scrollbar">
                      {["All", "Images", "News", "Videos", "Profiles"].map((t, i) => (
                        <span key={t} className={`whitespace-nowrap pb-2 ${i === 0 ? "border-b-2 border-[#8ab4f8] text-[#8ab4f8]" : ""}`}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
                      <ol className="space-y-7">
                        {results.map((r, i) => (
                          <motion.li
                            key={r.title}
                            initial={false}
                            animate={phase === "results" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: 0.12 * i + 0.1 }}
                          >
                            <a
                              href={r.href}
                              target={r.href.startsWith("http") ? "_blank" : undefined}
                              rel="noopener noreferrer"
                              className="group block"
                            >
                              <div className="mb-1 flex items-center gap-3">
                                {r.favicon === "LK" ? (
                                  <Image src="/images/lokendra-avatar.webp" alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
                                ) : (
                                  <span className={`grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br ${r.faviconBg} text-[10px] font-bold text-white`}>
                                    {r.favicon}
                                  </span>
                                )}
                                <div className="leading-tight">
                                  <p className="text-sm text-white/90">{r.site}</p>
                                  <p className="text-xs text-white/50">{r.crumb}</p>
                                </div>
                              </div>
                              <h3 className="text-lg text-[#8ab4f8] group-hover:underline sm:text-xl">{r.title}</h3>
                            </a>
                            <p className="mt-1 text-sm leading-relaxed text-white/65">{r.snippet}</p>
                            {r.links && (
                              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                                {r.links.map((l) => (
                                  <a key={l} href={`#${l.toLowerCase()}`} className="text-[#8ab4f8] hover:underline">
                                    {l}
                                  </a>
                                ))}
                              </div>
                            )}
                          </motion.li>
                        ))}
                      </ol>

                      {/* Knowledge panel */}
                      <motion.aside
                        initial={false}
                        animate={phase === "results" ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ delay: 0.4 }}
                        className="h-fit overflow-hidden rounded-xl border border-white/10"
                        aria-label="Profile summary"
                      >
                        <div className="relative grid h-48 grid-cols-[1fr_0.62fr] gap-0.5">
                          <div className="relative overflow-hidden">
                            <Image src="/images/lokendra.webp" alt="Lokendra Kumar – Senior Frontend Engineer" fill sizes="280px" className="object-cover object-[50%_18%]" />
                          </div>
                          <div className="grid grid-rows-2 gap-0.5">
                            <div className="relative overflow-hidden">
                              <Image src="/awards/pat-on-the-back.webp" alt="Pat on the Back award, Zindagi Technologies" fill sizes="160px" className="object-cover object-[20%_45%]" />
                            </div>
                            <div className="relative overflow-hidden">
                              <Image src="/awards/standout-performer.webp" alt="Standout Performer certificate, Zindagi Technologies" fill sizes="160px" className="object-cover" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 p-5">
                          <div>
                            <p className="text-2xl text-white">{profile.name}</p>
                            <p className="text-sm text-white/60">Senior Frontend Engineer</p>
                          </div>
                          <p className="text-sm leading-relaxed text-white/70">
                            Frontend Architect & AI Frontend Engineer with 6+ years of experience in React.js, Next.js and TypeScript. Creator of GoChatPilot.
                          </p>
                          <dl className="space-y-1.5 text-sm">
                            {[
                              ["Works at", "Zindagi Technologies"],
                              ["Expertise", "React · Next.js · TypeScript · AI UI"],
                              ["Awards", "Standout Performer, Pat on the Back"],
                              ["Education", "MCA (Kurukshetra University)"],
                            ].map(([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="shrink-0 font-semibold text-white/90">{k}:</dt>
                                <dd className="text-[#8ab4f8]">{v}</dd>
                              </div>
                            ))}
                          </dl>
                          <div className="flex gap-3 border-t border-white/10 pt-3">
                            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full bg-[#0A66C2] text-white">
                              <FaLinkedinIn />
                            </a>
                            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white">
                              <FaGithub />
                            </a>
                            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
                              <FaWhatsapp />
                            </a>
                          </div>
                        </div>
                      </motion.aside>
                    </div>
              </motion.div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white transition hover:border-[#4285F4] hover:bg-[#4285F4]/10"
          >
            <Search className="h-4 w-4" /> Search me on Google for real <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
