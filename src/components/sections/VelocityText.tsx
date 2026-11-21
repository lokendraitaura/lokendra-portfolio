"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "framer-motion";

function Row({ text, baseVelocity, outline = false, active }: { text: string; baseVelocity: number; outline?: boolean; active: boolean }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const translate = useTransform(x, (v) => `${wrap(-25, -50, v)}%`);

  useAnimationFrame((_, delta) => {
    if (!active) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    x.set(x.get() + move);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: translate }} className="flex flex-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          // Decorative: drawn via ::before from data-text, so it isn't real (contrast-checked) text.
          <span
            key={i}
            data-text={text}
            className={`velocity-word mr-10 block font-display text-[clamp(3rem,9vw,8rem)] font-bold uppercase leading-[1.05] tracking-tight ${
              outline ? "text-transparent [-webkit-text-stroke:1.5px_color-mix(in_oklab,var(--c1)_55%,transparent)]" : "velocity-fill"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}

/** Two giant text rows that slide faster (and flip direction) with scroll velocity. */
export default function VelocityText({ top, bottom }: { top: string; bottom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { margin: "100px" });
  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden py-10 sm:py-14">
      <div className="-rotate-2 scale-105">
        <Row text={top} baseVelocity={-2.5} active={active} />
        <Row text={bottom} baseVelocity={2.5} outline active={active} />
      </div>
    </div>
  );
}
