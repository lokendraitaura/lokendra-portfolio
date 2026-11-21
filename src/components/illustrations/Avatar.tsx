"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import CartoonHead from "./CartoonHead";

export type Pose = "type" | "point" | "cheer" | "rest";

const SKIN = "#c58c66";
const SUIT = "#1e3a8a";
const SUIT_DARK = "#172554";

/**
 * Illustrated version of Lokendra: a vector body in his navy suit + white shirt,
 * topped with a cartoon of his face. Coordinates are relative to the head centre.
 */
export default function Avatar({
  x,
  y,
  r = 40,
  pose = "rest",
  bob = false,
}: {
  x: number;
  y: number;
  r?: number;
  pose?: Pose;
  bob?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const s = r / 40; // scale factor for body proportions

  const sleeve = { stroke: SUIT, strokeWidth: 24 * s, strokeLinecap: "round" as const, fill: "none" };

  return (
    <g transform={`translate(${x} ${y})`}>
    <motion.g
      animate={bob ? { y: [0, 1.6 * s, 0] } : undefined}
      transition={bob ? { repeat: Infinity, duration: 0.45, ease: "easeInOut" } : undefined}
    >
      <defs>
        <linearGradient id={`ring-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      {/* Arms behind body */}
      {pose === "cheer" && (
        <>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
            animate={{ rotate: [-6, 8, -6] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
          >
            <path d={`M ${-62 * s} ${r + 34 * s} L ${-92 * s} ${-6 * s} L ${-86 * s} ${-44 * s}`} {...sleeve} />
            <circle cx={-86 * s} cy={-52 * s} r={11 * s} fill={SKIN} />
          </motion.g>
          <motion.g
            style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
            animate={{ rotate: [6, -8, 6] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
          >
            <path d={`M ${62 * s} ${r + 34 * s} L ${92 * s} ${-6 * s} L ${86 * s} ${-44 * s}`} {...sleeve} />
            <circle cx={86 * s} cy={-52 * s} r={11 * s} fill={SKIN} />
          </motion.g>
        </>
      )}
      {(pose === "type" || pose === "rest") && (
        <>
          <path d={`M ${-64 * s} ${r + 36 * s} Q ${-70 * s} ${r + 90 * s} ${-34 * s} ${r + 108 * s}`} {...sleeve} />
          <path d={`M ${64 * s} ${r + 36 * s} Q ${70 * s} ${r + 90 * s} ${34 * s} ${r + 108 * s}`} {...sleeve} />
        </>
      )}
      {pose === "point" && (
        <path d={`M ${-64 * s} ${r + 36 * s} Q ${-72 * s} ${r + 92 * s} ${-44 * s} ${r + 116 * s}`} {...sleeve} />
      )}

      {/* Neck */}
      <rect x={-11 * s} y={r - 10 * s} width={22 * s} height={22 * s} rx={7 * s} fill={SKIN} />
      {/* Torso / blazer */}
      <path
        d={`M ${-80 * s} ${r + 130 * s} L ${-76 * s} ${r + 40 * s} Q ${-72 * s} ${r + 12 * s} ${-38 * s} ${r + 6 * s} L ${38 * s} ${r + 6 * s} Q ${72 * s} ${r + 12 * s} ${76 * s} ${r + 40 * s} L ${80 * s} ${r + 130 * s} Z`}
        fill={SUIT}
      />
      {/* Shirt */}
      <path d={`M ${-24 * s} ${r + 6 * s} L 0 ${r + 58 * s} L ${24 * s} ${r + 6 * s} Z`} fill="#f8fafc" />
      {/* Lapels */}
      <path d={`M ${-26 * s} ${r + 6 * s} L ${-4 * s} ${r + 62 * s} L ${-30 * s} ${r + 40 * s} Z`} fill={SUIT_DARK} />
      <path d={`M ${26 * s} ${r + 6 * s} L ${4 * s} ${r + 62 * s} L ${30 * s} ${r + 40 * s} Z`} fill={SUIT_DARK} />
      <circle cx={0} cy={r + 80 * s} r={3 * s} fill="#93c5fd" opacity={0.6} />

      {/* Pointing arm in front */}
      {pose === "point" && (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}
          animate={{ rotate: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <path d={`M ${62 * s} ${r + 36 * s} L ${108 * s} ${r + 18 * s} L ${150 * s} ${-14 * s}`} {...sleeve} />
          <circle cx={156 * s} cy={-20 * s} r={11 * s} fill={SKIN} />
          <path d={`M ${160 * s} ${-26 * s} L ${172 * s} ${-38 * s}`} stroke={SKIN} strokeWidth={6 * s} strokeLinecap="round" />
        </motion.g>
      )}

      {/* Head: vector caricature (no photo) */}
      <CartoonHead r={r * 0.92} smile={pose === "cheer" ? 1.6 : 1} />
    </motion.g>
    </g>
  );
}
