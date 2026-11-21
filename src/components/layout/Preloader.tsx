"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const words = ["Hello", "नमस्ते", "Architect", "Build", "Ship"];

/** Short intro animation, shown once per session. */
export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("lk-intro") === "1" || window.matchMedia("(pointer: coarse), (max-width: 1023px)").matches) {
      const skip = requestAnimationFrame(() => setVisible(false));
      return () => cancelAnimationFrame(skip);
    }
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const total = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      setCount(Math.round(p * 100));
      setWord(Math.min(words.length - 1, Math.floor(p * words.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("lk-intro", "1");
          document.documentElement.style.overflow = "";
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="lk-preloader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="relative grid h-20 w-20 place-items-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
            >
              <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 border-r-cyan-300" />
              <span className="absolute inset-2 rounded-full border-2 border-transparent border-b-pink-400" />
            </motion.div>
            <span className="font-display text-xl font-bold tracking-[0.4em] text-white">LK</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={word}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-gradient font-display text-4xl font-bold sm:text-6xl"
              >
                {words[word]}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="absolute bottom-10 left-1/2 w-[min(80vw,420px)] -translate-x-1/2">
            <div className="mb-2 flex justify-between font-mono text-xs text-muted">
              <span>Loading portfolio</span>
              <span>{count}%</span>
            </div>
            <div className="h-[2px] w-full overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-400"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
