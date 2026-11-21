"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bot, Send, User, Sparkles, Zap, Wrench, Database, Workflow, Plug, LineChart, MessagesSquare } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const qa = [
  {
    q: "Who is Lokendra?",
    a: "Lokendra Kumar is a Senior Frontend Engineer & Frontend Architect with 6+ years of experience building enterprise React.js, Next.js and TypeScript apps. He leads frontend architecture for a cybersecurity simulation platform at Zindagi Technologies and built GoChatPilot, a live AI-powered WhatsApp toolkit (PWA). ✨",
  },
  {
    q: "What AI work has he done?",
    a: "He builds AI-native interfaces: streaming chat UIs on Groq, OpenAI and Gemini, system prompts and structured outputs, plus working knowledge of the Vercel AI SDK, tool calling, RAG, LangChain.js, LangGraph.js, agents and MCP. GoChatPilot is his live, production AI product. 🤖",
  },
  {
    q: "Why should we hire him?",
    a: "Proven ownership: he designed a company-wide design system in Storybook, introduced the co-location architecture, tamed huge datasets with AG Grid and React Flow, and earned two awards, 'Standout Performer' and 'Pat on the Back'. He ships fast, clean and accessible. 🚀",
  },
  {
    q: "How can I contact him?",
    a: "Easy! Use the contact form below (it lands straight in his inbox), tap the green WhatsApp button for an instant chat, or email lokendraitaura@gmail.com. 📬",
  },
];

const capabilities = [
  { icon: Zap, title: "Streaming UIs", text: "Token-by-token rendering over SSE with stop, retry and smooth auto-scroll." },
  { icon: MessagesSquare, title: "Prompt Engineering", text: "System prompts, few-shot examples and structured, schema-validated outputs." },
  { icon: Wrench, title: "Tool Calling", text: "Models trigger functions, with results rendered as rich, interactive UI." },
  { icon: Database, title: "RAG & Embeddings", text: "Document Q&A grounded in your own data via vector search." },
  { icon: Workflow, title: "Agents & LangGraph", text: "Stateful multi-step agents with memory and human-in-the-loop approval." },
  { icon: Plug, title: "MCP", text: "Model Context Protocol clients and tools to plug AI into real systems." },
  { icon: LineChart, title: "AI Evaluation", text: "LangSmith & Langfuse tracing to measure quality, latency and cost." },
  { icon: Sparkles, title: "Multi-Model", text: "OpenAI, Gemini, Groq and Claude, picked per task by cost and latency." },
];

type Msg = { role: "user" | "ai"; text: string };

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const started = useRef(false);

  const ask = (idx: number) => {
    if (streaming) return;
    const { q, a } = qa[idx];
    setMessages((m) => [...m, { role: "user", text: q }]);
    setThinking(true);
    setStreaming(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((m) => [...m, { role: "ai", text: "" }]);
      const tokens = a.split(/(\s+)/);
      let i = 0;
      const id = setInterval(() => {
        i += 2;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", text: tokens.slice(0, i).join("") };
          return copy;
        });
        if (i >= tokens.length) {
          clearInterval(id);
          setStreaming(false);
        }
      }, 45);
    }, 700);
  };

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      ask(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div ref={ref} className="dark-island gradient-border flex h-[560px] flex-col overflow-hidden rounded-3xl bg-[#0b0d1d] shadow-[0_40px_120px_-30px_color-mix(in_oklab,var(--c1)_40%,transparent)]">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600">
          <Bot className="h-5 w-5 text-white" />
        </span>
        <div>
          <p className="font-display font-semibold text-white">Ask about Lokendra</p>
          <p className="flex items-center gap-1.5 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> streaming · live AI demo
          </p>
        </div>
      </div>

      <div ref={scroller} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-cyan-500/20 text-cyan-300" : "bg-fuchsia-500/20 text-fuchsia-300"}`}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </span>
              <p
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "rounded-tr-sm bg-cyan-500/15 text-white" : "rounded-tl-sm bg-white/[0.06] text-white/90"
                }`}
              >
                {m.text}
                {m.role === "ai" && streaming && i === messages.length - 1 && (
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-blink bg-fuchsia-300 align-middle" />
                )}
              </p>
            </motion.div>
          ))}
          {thinking && (
            <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-fuchsia-500/20 text-fuchsia-300">
                <Bot className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl bg-white/[0.06] px-4 py-3">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="anim-bob h-2 w-2 rounded-full bg-fuchsia-300" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {qa.map((item, i) => (
            <button
              key={item.q}
              onClick={() => ask(i)}
              disabled={streaming}
              className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:border-fuchsia-400/60 hover:text-white disabled:opacity-40"
            >
              {item.q}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] px-4 py-3 text-sm text-muted">
          <span className="flex-1">Pick a question above…</span>
          <Send className="h-4 w-4 text-fuchsia-300" />
        </div>
      </div>
    </div>
  );
}

const pipeline = [
  { label: "User Prompt", sub: "React UI", color: "#22d3ee" },
  { label: "System Prompt", sub: "Prompt design", color: "#a78bfa" },
  { label: "LLM", sub: "Groq · OpenAI · Gemini", color: "#e879f9" },
  { label: "Tools · RAG", sub: "Functions · Vector DB", color: "#fbbf24" },
  { label: "Streamed UI", sub: "SSE · token by token", color: "#34d399" },
];

function Pipeline() {
  return (
    <div className="relative">
      <div className="grid gap-3 sm:grid-cols-5">
        {pipeline.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
            <div className="glass relative z-10 rounded-2xl p-4 text-center">
              <span
                className="anim-pulse mx-auto mb-2 block h-3 w-3 rounded-full"
                style={{ background: p.color, boxShadow: `0 0 18px ${p.color}`, animationDelay: `${i * 0.5}s` }}
              />
              <p className="font-display text-sm font-semibold text-white">{p.label}</p>
              <p className="mt-0.5 text-[11px] text-muted">{p.sub}</p>
            </div>
            {i < pipeline.length - 1 && (
              <div className="absolute left-1/2 top-full z-0 h-3 w-px bg-white/15 sm:left-full sm:top-1/2 sm:h-px sm:w-3">
                <span
                  className="anim-travel absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white sm:translate-x-0"
                  style={{ top: "50%", animationDelay: `${i * 0.25}s` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AIShowcase() {
  return (
    <section id="ai" aria-labelledby="ai-title" className="section-pad relative overflow-hidden">
      <div className="absolute right-[-10%] top-20 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/15 blur-[150px]" />
      <div className="absolute bottom-0 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="container-x relative">
        <SectionHeading
          id="ai-title"
          eyebrow="AI Frontend Engineering"
          title="Interfaces that"
          highlight="think & stream."
          subtitle="I design and build the UI layer of AI products: real-time streaming chat, prompt design, tool calling, retrieval and agent workflows. Try the demo below."
        />

        <Reveal className="mb-14">
          <Pipeline />
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <ChatDemo />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <TiltCard className="rounded-2xl" max={10}>
                  <div className="glass spotlight group h-full rounded-2xl p-5 transition hover:bg-white/[0.07]">
                    <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-violet-500/10 text-fuchsia-200 ring-1 ring-white/10 transition group-hover:scale-110 group-hover:rotate-6">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display font-semibold text-white">{c.title}</h3>
                    <p className="mt-1.5 text-sm text-muted">{c.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
