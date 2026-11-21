import { featuredTech } from "@/data/skills";

export default function TechMarquee() {
  const row = [...featuredTech, ...featuredTech];
  return (
    <div aria-label="Technologies I work with" className="relative overflow-hidden border-y border-white/5 bg-ink-2/60 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <ul className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <li key={i} aria-hidden={i >= featuredTech.length} className="flex items-center gap-3 whitespace-nowrap text-lg text-white/70 transition hover:text-white">
            <t.icon className="h-7 w-7" style={{ color: t.color }} />
            <span className="font-display font-medium">{t.name}</span>
            <span className="ml-7 text-violet-400/60">✦</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
