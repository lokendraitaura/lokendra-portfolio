"use client";

import { motion } from "framer-motion";

const SKIN = "#c68a63";
const SKIN_SHADE = "#a96f4c";
const HAIR = "#15100c";
const BEARD = "#1c1510";

/**
 * Vector caricature of Lokendra (no photo): swept-up black hair, thick brows,
 * full trimmed beard + moustache, warm smile. Centered at (0,0), radius r.
 */
export default function CartoonHead({ r = 40, blink = true, smile = 1 }: { r?: number; blink?: boolean; smile?: number }) {
  const k = (n: number) => n * r;
  return (
    <g>
      {/* ears */}
      <ellipse cx={k(-0.88)} cy={k(0.05)} rx={k(0.16)} ry={k(0.24)} fill={SKIN_SHADE} />
      <ellipse cx={k(0.88)} cy={k(0.05)} rx={k(0.16)} ry={k(0.24)} fill={SKIN_SHADE} />
      {/* face */}
      <ellipse cx={0} cy={k(0.05)} rx={k(0.86)} ry={k(1.02)} fill={SKIN} />
      {/* subtle cheek shading */}
      <ellipse cx={k(-0.45)} cy={k(0.22)} rx={k(0.2)} ry={k(0.12)} fill="#d9967a" opacity={0.35} />
      <ellipse cx={k(0.45)} cy={k(0.22)} rx={k(0.2)} ry={k(0.12)} fill="#d9967a" opacity={0.35} />

      {/* beard (jaw + chin + moustache band) */}
      <path
        d={`M ${k(-0.86)} ${k(0.02)}
            C ${k(-0.9)} ${k(0.82)} ${k(-0.45)} ${k(1.18)} 0 ${k(1.18)}
            C ${k(0.45)} ${k(1.18)} ${k(0.9)} ${k(0.82)} ${k(0.86)} ${k(0.02)}
            C ${k(0.74)} ${k(0.3)} ${k(0.56)} ${k(0.36)} ${k(0.34)} ${k(0.36)}
            Q 0 ${k(0.24)} ${k(-0.34)} ${k(0.36)}
            C ${k(-0.56)} ${k(0.36)} ${k(-0.74)} ${k(0.3)} ${k(-0.86)} ${k(0.02)} Z`}
        fill={BEARD}
      />
      {/* mouth */}
      <motion.path
        d={`M ${k(-0.2)} ${k(0.52)} Q 0 ${k(0.52 + 0.18 * smile)} ${k(0.2)} ${k(0.52)} Q 0 ${k(0.6)} ${k(-0.2)} ${k(0.52)} Z`}
        fill="#f5f0ec"
        stroke="#6d3328"
        strokeWidth={k(0.04)}
        strokeLinejoin="round"
      />

      {/* nose */}
      <path d={`M ${k(-0.02)} ${k(-0.02)} Q ${k(-0.13)} ${k(0.2)} ${k(-0.02)} ${k(0.24)} Q ${k(0.1)} ${k(0.25)} ${k(0.12)} ${k(0.17)}`} fill="none" stroke={SKIN_SHADE} strokeWidth={k(0.06)} strokeLinecap="round" />

      {/* eyes */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={blink ? { scaleY: [1, 1, 0.1, 1, 1] } : undefined}
        transition={blink ? { repeat: Infinity, duration: 3.8, times: [0, 0.9, 0.93, 0.96, 1] } : undefined}
      >
        {[-1, 1].map((s) => (
          <g key={s}>
            <ellipse cx={k(0.34 * s)} cy={k(-0.08)} rx={k(0.17)} ry={k(0.12)} fill="#fbfaf7" />
            <circle cx={k(0.34 * s + 0.02)} cy={k(-0.07)} r={k(0.085)} fill="#3a2213" />
            <circle cx={k(0.34 * s + 0.05)} cy={k(-0.1)} r={k(0.028)} fill="#fff" />
          </g>
        ))}
      </motion.g>
      {/* thick brows */}
      <path d={`M ${k(-0.56)} ${k(-0.27)} Q ${k(-0.36)} ${k(-0.42)} ${k(-0.14)} ${k(-0.3)}`} fill="none" stroke={HAIR} strokeWidth={k(0.11)} strokeLinecap="round" />
      <path d={`M ${k(0.56)} ${k(-0.27)} Q ${k(0.36)} ${k(-0.42)} ${k(0.14)} ${k(-0.3)}`} fill="none" stroke={HAIR} strokeWidth={k(0.11)} strokeLinecap="round" />

      {/* hair: swept-up quiff with side volume */}
      <path
        d={`M ${k(-0.9)} ${k(0.02)}
            C ${k(-1.0)} ${k(-0.75)} ${k(-0.62)} ${k(-1.2)} ${k(-0.05)} ${k(-1.28)}
            C ${k(0.5)} ${k(-1.34)} ${k(0.98)} ${k(-1.0)} ${k(0.92)} ${k(-0.2)}
            L ${k(0.86)} ${k(0.02)}
            C ${k(0.8)} ${k(-0.36)} ${k(0.72)} ${k(-0.5)} ${k(0.55)} ${k(-0.58)}
            C ${k(0.3)} ${k(-0.68)} ${k(0.05)} ${k(-0.6)} ${k(-0.18)} ${k(-0.66)}
            C ${k(-0.45)} ${k(-0.72)} ${k(-0.7)} ${k(-0.6)} ${k(-0.8)} ${k(-0.3)}
            Z`}
        fill={HAIR}
      />
      {/* hair shine */}
      <path d={`M ${k(-0.35)} ${k(-1.08)} Q ${k(0.05)} ${k(-1.2)} ${k(0.4)} ${k(-1.02)}`} fill="none" stroke="#3a2e26" strokeWidth={k(0.06)} strokeLinecap="round" />
    </g>
  );
}
