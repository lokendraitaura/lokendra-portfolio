"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, ArrowUpRight } from "lucide-react";
import { FaWhatsapp, FaLinkedinIn, FaGithub } from "react-icons/fa";
import { profile, whatsappLink } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Magnetic from "@/components/ui/Magnetic";


type Status = "idle" | "sending" | "sent" | "error";

/** Backup path: deliver straight from the visitor's browser via FormSubmit if the server couldn't. */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type FormData = { name: string; email: string; phone: string; subject: string; message: string };

/** Web3Forms: browser-side delivery straight to the inbox (access key is public by design, no activation link). */
async function sendViaWeb3Forms(f: FormData) {
  if (!WEB3FORMS_KEY) return false;
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `💼 ${f.subject}: ${f.name}`,
        from_name: `Portfolio · ${f.name}`,
        replyto: f.email,
        name: f.name,
        email: f.email,
        phone: f.phone || "Not provided",
        topic: f.subject,
        message: f.message,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

/** Backup path: deliver straight from the visitor's browser if the server couldn't. */
async function sendFromBrowser(f: FormData) {
  if (await sendViaWeb3Forms(f)) return true;
  if (WEB3FORMS_KEY) return false; // configured: don't fall back to FormSubmit's activation flow
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `💼 ${f.subject}: ${f.name}`,
        _replyto: f.email,
        _template: "table",
        _captcha: "false",
        Name: f.name,
        Email: f.email,
        Phone: f.phone || "Not provided",
        Subject: f.subject,
        Message: f.message,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
    return data.success === true || data.success === "true";
  } catch {
    return false;
  }
}

const channels = [
  { icon: FaWhatsapp, label: "WhatsApp", value: "Chat instantly", href: whatsappLink(), color: "#25D366", external: true },
  { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}`, color: "#f472b6", external: false },
  { icon: Phone, label: "Phone", value: profile.phone, href: `tel:+${profile.phoneRaw}`, color: "#22d3ee", external: false },
  { icon: FaLinkedinIn, label: "LinkedIn", value: "Lokendra Kumar Prajapati", href: profile.socials.linkedin, color: "#0A66C2", external: true },
  { icon: FaGithub, label: "GitHub", value: "@lokendraitaura", href: profile.socials.github, color: "var(--color-white)", external: true },
  { icon: MapPin, label: "Location", value: "Delhi NCR & Uttar Pradesh, India", href: "https://maps.google.com/?q=Jalaun,Uttar+Pradesh", color: "#fbbf24", external: true },
];

const subjects = ["Full-time opportunity", "Freelance / contract project", "AI product / consulting", "Just saying hi 👋"];

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: subjects[0], message: "", company_website: "" });

  const update = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
      // Validation problems (4xx) are shown as-is; delivery failures (5xx) get a browser-side retry.
      if (!res.ok && res.status < 500) throw new Error(data.error || "Please check the form and try again.");
      if (!res.ok && !(await sendFromBrowser(form))) {
        throw new Error(
          data.code === "activation"
            ? "Couldn't send right now. Please tap \"Send on WhatsApp\": your message is already filled in."
            : data.error || "Couldn't send right now. Please try WhatsApp or email me directly."
        );
      }
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", subject: subjects[0], message: "", company_website: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const sendOnWhatsApp = () => {
    const text = [
      `Hi Lokendra! 👋`,
      form.name && `I'm ${form.name}${form.email ? ` (${form.email})` : ""}.`,
      form.subject && `Regarding: ${form.subject}`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  };

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-muted/60 outline-none transition focus:border-violet-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10";

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[160px]" />
      <div className="container-x relative">
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title="Let's build something"
          highlight="great together."
          subtitle="Have a role, a project or an AI idea? Send a message (it lands straight in my inbox) or ping me on WhatsApp for a quick reply."
        />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06} x={-30} y={0}>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="glass spotlight group flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl transition group-hover:scale-110" style={{ background: `color-mix(in oklab, ${c.color} 14%, transparent)`, color: c.color }}>
                    <c.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs uppercase tracking-widest text-muted">{c.label}</span>
                    <span className="block truncate font-medium text-white">{c.value}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </a>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <div className="glass flex items-center gap-3 rounded-2xl p-4 text-sm text-muted">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400" />
                  <span className="relative h-3 w-3 rounded-full bg-emerald-400" />
                </span>
                Usually replies within a few hours · IST (UTC+5:30)
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="gradient-border relative overflow-hidden rounded-3xl bg-white/[0.03] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[460px] flex-col items-center justify-center gap-5 text-center"
                  >
                    <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                      <CheckCircle2 className="h-20 w-20 text-emerald-400" />
                    </motion.div>
                    <h3 className="font-display text-3xl font-bold text-white">Message sent! 🎉</h3>
                    <p className="max-w-sm text-muted">Thanks for reaching out. Your message is in my inbox and I&apos;ll get back to you soon.</p>
                    <button onClick={() => setStatus("idle")} className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white hover:bg-white/5">
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" noValidate={false}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-white/80">Your name *</span>
                        <input required minLength={2} maxLength={80} value={form.name} onChange={update("name")} placeholder="Jane Doe" className={input} autoComplete="name" />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-white/80">Email *</span>
                        <input required type="email" maxLength={120} value={form.email} onChange={update("email")} placeholder="jane@company.com" className={input} autoComplete="email" />
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-white/80">Phone / WhatsApp</span>
                        <input type="tel" maxLength={20} value={form.phone} onChange={update("phone")} placeholder="+91 …" className={input} autoComplete="tel" />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-sm text-white/80">Subject</span>
                        <select value={form.subject} onChange={update("subject")} className={`${input} appearance-none`}>
                          {subjects.map((s) => (
                            <option key={s} value={s} className="bg-ink-2">
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-sm text-white/80">Message *</span>
                      <textarea required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={update("message")} placeholder="Tell me about the role, project or idea…" className={`${input} resize-none`} />
                    </label>
                    {/* Honeypot (hidden from humans) */}
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company_website}
                      onChange={update("company_website")}
                      className="hidden"
                      aria-hidden
                    />

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                      <Magnetic className="sm:flex-1" strength={0.2}>
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-8px_color-mix(in_oklab,var(--c1)_80%,transparent)] transition disabled:opacity-70"
                        >
                          <span className="absolute inset-0 translate-x-[-120%] bg-white/25 transition-transform duration-700 group-hover:translate-x-[120%]" />
                          {status === "sending" ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" /> Sending…
                            </>
                          ) : (
                            <>
                              <Send className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-1" /> Send to my inbox
                            </>
                          )}
                        </button>
                      </Magnetic>
                      <Magnetic className="sm:flex-1" strength={0.2}>
                        <button
                          type="button"
                          onClick={sendOnWhatsApp}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-[#06290f] shadow-[0_10px_40px_-10px_rgba(37,211,102,0.8)] transition hover:brightness-110"
                        >
                          <FaWhatsapp className="h-5 w-5" /> Send on WhatsApp
                        </button>
                      </Magnetic>
                    </div>
                    <p className="text-center text-xs text-muted">Your details are only used to reply to you. No spam, ever.</p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
