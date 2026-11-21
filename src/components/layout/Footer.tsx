import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { Mail, ArrowUpRight } from "lucide-react";
import { navLinks, profile, whatsappLink } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 pt-20">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="container-x relative">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-bold text-white">
              Let&apos;s build something <span className="text-gradient">remarkable</span>.
            </p>
            <p className="mt-4 max-w-md text-muted">
              {profile.title} & Frontend Architect crafting fast, accessible and AI-powered web experiences with React, Next.js and TypeScript.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: profile.socials.linkedin, label: "LinkedIn", icon: FaLinkedinIn },
                { href: profile.socials.github, label: "GitHub", icon: FaGithub },
                { href: whatsappLink(), label: "WhatsApp", icon: FaWhatsapp },
                { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="glass grid h-11 w-11 place-items-center rounded-xl text-white transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan-300">Navigate</p>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="text-muted transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-cyan-300">Contact</p>
            <ul className="space-y-2 text-muted">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-white">{profile.email}</a>
              </li>
              <li>
                <a href={`tel:+${profile.phoneRaw}`} className="hover:text-white">{profile.phone}</a>
              </li>
              <li>{profile.shortLocation}</li>
              <li>
                <a href={profile.socials.goChatPilot} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
                  GoChatPilot <ArrowUpRight className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-16 select-none text-center font-display text-[18vw] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.12)] md:text-[13vw]"
        >
          LOKENDRA
        </p>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-8 text-sm text-muted sm:flex-row">
          <p>© Lokendra Kumar Prajapati · Senior Software Developer at Zindagi Technologies · <a href="/about" className="hover:text-white hover:underline">About Lokendra</a></p>
          <p className="font-mono text-xs">Designed & built with Next.js · TypeScript · Three.js · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
