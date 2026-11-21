"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { whatsappLink } from "@/data/profile";

/** Floating WhatsApp chat button + back-to-top. */
export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const t1 = setTimeout(() => setTip(true), 6000);
    const t2 = setTimeout(() => setTip(false), 14000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            onClick={toTop}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            className="glass grid h-11 w-11 place-items-center rounded-full text-white transition hover:bg-white/15"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
      <div className="relative flex items-center gap-3">
        <AnimatePresence>
          {tip && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="glass hidden rounded-2xl px-4 py-2 text-sm text-white sm:block"
            >
              👋 Chat with me on WhatsApp
            </motion.div>
          )}
        </AnimatePresence>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Lokendra on WhatsApp"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-6px_rgba(37,211,102,0.7)] transition hover:scale-110"
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" />
          <FaWhatsapp className="relative h-7 w-7" />
        </a>
      </div>
    </div>
  );
}
