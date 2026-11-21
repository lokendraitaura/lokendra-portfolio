"use client";

import { useEffect, useMemo, useRef } from "react";

interface Props {
  items: { name: string; color: string }[];
  radius?: number;
}

/** Interactive 3D word sphere. Drag/hover to steer; auto-rotates otherwise. */
export default function SkillSphere({ items, radius = 210 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  const points = useMemo(() => {
    const n = items.length;
    return items.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i + 1) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)] as [number, number, number];
    });
  }, [items]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ax = 0.0022;
    let ay = 0.0032;
    let rotX = 0;
    let rotY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let raf = 0;

    const getR = () => Math.min(radius, el.clientWidth / 2 - 40);

    const render = () => {
      const r = getR();
      const cx = Math.cos(rotX), sx = Math.sin(rotX), cy = Math.cos(rotY), sy = Math.sin(rotY);
      points.forEach(([x, y, z], i) => {
        // rotate around X then Y
        const y1 = y * cx - z * sx;
        const z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy;
        const z2 = -x * sy + z1 * cy;
        const scale = (z2 + 2) / 3;
        const node = refs.current[i];
        if (node) {
          node.style.transform = `translate(-50%, -50%) translate3d(${(x2 * r).toFixed(1)}px, ${(y1 * r).toFixed(1)}px, 0px) scale(${scale.toFixed(3)})`;
          node.style.opacity = String(0.2 + ((z2 + 1) / 2) * 0.8);
          node.style.zIndex = String(Math.round(scale * 100));
          node.style.filter = z2 < -0.3 ? "blur(1px)" : "none";
        }
      });
    };

    const loop = () => {
      if (visible && !reduced) {
        rotX += ax;
        rotY += ay;
        if (!dragging) {
          ax += (0.0022 - ax) * 0.02;
          ay += (0.0032 - ay) * 0.02;
        }
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    render();
    raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      ay = (e.clientX - lastX) * 0.0016;
      ax = -(e.clientY - lastY) * 0.0016;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => (dragging = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [points, radius]);

  return (
    <div
      ref={wrap}
      className="relative mx-auto aspect-square w-full max-w-[520px] touch-none select-none"
     
      aria-label="Interactive 3D sphere of skills. Drag to rotate."
    >
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c1)_25%,transparent),transparent_65%)]" />
      <div className="absolute inset-[18%] animate-spin-slower rounded-full border border-dashed border-white/10" />
      {items.map((it, i) => (
        <span
          key={`${it.name}-${i}`}
          ref={(n) => {
            refs.current[i] = n;
          }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-white/10 bg-ink-2/70 px-3 py-1 text-xs font-medium will-change-transform sm:text-sm"
          suppressHydrationWarning
          style={
            {
              "--c": it.color,
              color: "var(--c)",
              transform: `translate(-50%, -50%) translate3d(${Math.round(points[i][0] * radius * 0.8)}px, ${Math.round(points[i][1] * radius * 0.8)}px, 0px)`,
            } as React.CSSProperties
          }
        >
          {it.name}
        </span>
      ))}
    </div>
  );
}
