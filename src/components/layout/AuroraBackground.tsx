/** Quiet theme-aware lighting leaves the animated work and avatar in focus. */
export default function AuroraBackground() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_0%,color-mix(in_oklab,var(--c1)_8%,transparent),transparent_55%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_80%,color-mix(in_oklab,var(--c2)_4%,transparent),transparent_50%)]" />
  </div>;
}
