/**
 * Lightweight stand-in for the hero 3D scene: a pre-rendered still of the same view.
 * Shown instantly (good LCP) while the 3D engine loads in the background, then fades out.
 */
export const HERO_POSTER = "/images/hero-scene.webp";

export function PosterImage({ hidden = false }: { hidden?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={HERO_POSTER}
      srcSet={`/images/hero-scene-800.webp 800w, ${HERO_POSTER} 1485w`}
      sizes="(max-width: 1023px) 100vw, 55vw"
      alt=""
      aria-hidden
      decoding="async"
      fetchPriority="high"
      className={`world-poster ${hidden ? "is-hidden" : ""}`}
    />
  );
}

export default function HeroPoster() {
  return (
    <div className="world-stage dark-island" aria-label="Lokendra's 3D workspace (loading)">
      <div className="world-aura" aria-hidden />
      <div className="world-grid" aria-hidden />
      <div className="world-topline">
        <span>THE DEVELOPER&apos;S WORLD</span>
        <span>3D / REAL TIME</span>
      </div>
      <div className="world-canvas">
        <PosterImage />
      </div>
    </div>
  );
}
