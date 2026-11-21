"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Props {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  id?: string;
}

export default function SectionHeading({ eyebrow, title, highlight, subtitle, align = "left", id }: Props) {
  const reduced = useReducedMotion();
  const center = align === "center";
  return (
    <motion.div initial={{ opacity: 0, y: reduced ? 0 : 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.65 }} className={`section-heading mb-14 ${center ? "text-center" : "text-left"}`}>
      <div className={`mb-5 flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span aria-hidden className="h-px w-8 bg-violet-400" />
        <span className="studio-eyebrow">{eyebrow}</span>
      </div>
      <h2 id={id} className="max-w-4xl font-display text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.13] tracking-[-0.045em] text-white" style={center ? { marginInline: "auto" } : undefined}>
        {title}{highlight && <> <span className="text-violet-300">{highlight}</span></>}
      </h2>
      {subtitle && <p className={`mt-5 max-w-2xl text-base leading-relaxed text-muted ${center ? "mx-auto" : ""}`}>{subtitle}</p>}
    </motion.div>
  );
}
