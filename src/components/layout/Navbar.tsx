"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Download, Sun, Moon, Palette, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { navLinks, profile, whatsappLink } from "@/data/profile";
import { openThemeStudio, setMode, useMode } from "./ThemeStore";

const iconBtn =
  "grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-white/25 hover:bg-white/10";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const mode = useMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
      window.__lenis?.start();
    };
  }, [open]);

  return (
    <>
      {/* Solid, opaque, full-width header. Compacts slightly on scroll. */}
      <motion.header
        initial={{ y: -90 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-[90] bg-ink transition-shadow duration-300 ${scrolled ? "shadow-[0_10px_40px_-18px_rgba(0,0,0,0.55)]" : ""}`}
      >
        <nav
          aria-label="Primary"
          className={`container-x flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? "h-16" : "h-[76px]"}`}
        >
          {/* Brand */}
          <a href="#home" className="group flex min-w-0 shrink-0 items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center">
              <span className="absolute inset-0 animate-[ring-spin_6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,var(--c1),var(--c2),var(--c3),var(--c1))]" />
              <span className="absolute inset-[2.5px] rounded-full bg-ink" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lokendra-avatar.webp"
                alt="Lokendra Kumar"
                width={40}
                height={40}
                className="relative h-[38px] w-[38px] rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
            </span>
            <span className="hidden min-w-0 flex-col leading-tight sm:flex lg:hidden xl:flex">
              <span className="truncate font-display text-[15px] font-semibold text-white">{profile.name}</span>
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Frontend Architect · Available
              </span>
            </span>
          </a>

          {/* Centered segmented nav */}
          <ul className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-1 lg:flex">
            {navLinks.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors xl:px-4 ${
                      isActive ? "text-white" : "text-muted hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      >
                        <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                      </motion.span>
                    )}
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={mode === "dark" ? "Light mode" : "Dark mode"}
              className={iconBtn}
            >
              <motion.span key={mode} initial={{ rotate: -90, scale: 0.5, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                {mode === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
              </motion.span>
            </button>
            <button onClick={openThemeStudio} aria-label="Customize theme colours" title="Theme studio" className={`relative ${iconBtn}`}>
              <span className="absolute inset-[8px] rounded-full bg-[conic-gradient(var(--c1),var(--c2),var(--c3),var(--c1))]" />
              <Palette className="relative h-[14px] w-[14px] text-white drop-shadow" />
            </button>
            <span className="mx-1 hidden h-6 w-px bg-white/10 xl:block" />
            <a
              href={profile.resume}
              download
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:text-white xl:inline-flex"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
            <a
              href="#contact"
              className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2.5 pl-5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_var(--c1)] transition hover:brightness-110 sm:inline-flex"
            >
              Hire me
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`${iconBtn} lg:hidden`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {/* hairline that fades in once scrolled */}
        <div className={`h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`} />
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[85] flex flex-col overflow-y-auto bg-ink px-5 pb-8 pt-24 sm:px-8 lg:hidden"
            data-lenis-prevent
          >
            <ul className="flex flex-col">
              {navLinks.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between border-b border-white/[0.07] py-4 font-display text-[1.7rem] font-semibold sm:text-3xl ${
                      active === l.id ? "text-white" : "text-white/75"
                    }`}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="w-6 text-xs font-medium text-muted">0{i + 1}</span>
                      {l.label}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted" />
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <a href="#contact" onClick={() => setOpen(false)} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-3.5 font-semibold text-white">
                Hire me <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={profile.resume} download className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm text-white">
                <Download className="h-4 w-4" /> Resume
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  openThemeStudio();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm text-white"
              >
                <Palette className="h-4 w-4" /> Theme
              </button>
            </div>
            <div className="mt-auto flex items-center gap-3 pt-8">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white">
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-12 w-12 place-items-center rounded-full bg-[#0A66C2] text-white">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white">
                <FaGithub className="h-5 w-5" />
              </a>
              <span className="ml-auto text-xs text-muted">{profile.email}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
