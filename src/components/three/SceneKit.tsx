"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/layout/ThemeStore";
import { useLiteDevice } from "@/hooks/usePerf";
import useMediaQuery from "@/hooks/useMediaQuery";

/** Static message. Used as <Canvas fallback>, which React always mounts as <canvas> child content,
 *  so it must NOT report "unavailable" itself (that hid the hero poster even when WebGL worked). */
function FallbackMessage() {
  return <div className="studio-loading"><span className="font-display text-5xl text-white/80">&lt;/&gt;</span><span>The studio is taking a break.</span><p className="max-w-xs text-center text-sm text-muted">3D is unavailable in this browser. Explore my projects and experience below.</p></div>;
}

/** Shown only when the 3D tree actually crashed (error boundary); reports it to the parent. */
function SceneFallback({ onUnavailable }: { onUnavailable?: () => void }) {
  useEffect(() => { onUnavailable?.(); }, [onUnavailable]);
  return <div className="studio-loading"><span className="font-display text-5xl text-white/80">&lt;/&gt;</span><span>The studio is taking a break.</span><p className="max-w-xs text-center text-sm text-muted">3D is unavailable in this browser. Explore my projects and experience below.</p></div>;
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <SceneFallback onUnavailable={this.props.onUnavailable} /> : this.props.children; }
}

/** True once the element is (nearly) on screen; used to pause rendering off-screen. */
export function useInViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/**
 * R3F 9 doesn't restart its render loop when `frameloop` flips from "never" to "always";
 * it waits for the next event. Kick it explicitly whenever the canvas becomes visible.
 */
function LoopKick({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);
  return null;
}

export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  const th = useTheme();
  const lite = useLiteDevice();
  if (lite) {
    // Mobile: 3 lights + hemisphere, no environment map → far cheaper shaders and no PMREM bake.
    return (
      <>
        <hemisphereLight args={["#fff4ea", "#1a1530", 1.1 * intensity]} />
        <directionalLight position={[2.5, 4, 4]} intensity={2.6 * intensity} color="#fff3e6" />
        <pointLight position={[-2.2, 2.2, -1.5]} intensity={18 * intensity} color={th.c1} />
      </>
    );
  }
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <directionalLight position={[2.5, 4, 4]} intensity={2.4 * intensity} color="#fff3e6" />
      {/* soft face fill from the front */}
      <spotLight position={[0, 2.2, 3]} angle={0.45} penumbra={1} intensity={5 * intensity} color="#ffe9dc" />
      <directionalLight position={[-3, 2, 2]} intensity={0.6 * intensity} color="#c7d2fe" />
      <pointLight position={[-2.2, 2.2, -1.5]} intensity={18 * intensity} color={th.c1} />
      <pointLight position={[2.2, 2, -1.5]} intensity={16 * intensity} color={th.c2} />
      <Environment resolution={64}>
        <Lightformer form="rect" intensity={2} position={[0, 3, 4]} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-4, 1.5, -2]} scale={[2, 5, 1]} color={th.c1} />
        <Lightformer form="rect" intensity={2.5} position={[4, 1.5, -2]} scale={[2, 5, 1]} color={th.c2} />
        <Lightformer form="circle" intensity={0.8} position={[0, -2, 3]} scale={3} color={th.c3} />
      </Environment>
    </>
  );
}

/** Static studio backdrop: soft theme-coloured glow behind the subject and a lit floor. No spinning rings. */
export function Halo({ position = [0, 0.55, -1.2] as [number, number, number], scale = 1 }) {
  const th = useTheme();
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.35)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group position={position} scale={scale}>
      <mesh>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={tex} color={th.c1} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0.9, -0.4, 0.05]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={tex} color={th.c2} transparent opacity={0.25} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Gentle mouse parallax around a fixed look-at target. */
export function CameraRig({ base, target, amount = [0.4, 0.2] }: { base: [number, number, number]; target: [number, number, number]; amount?: [number, number] }) {
  useFrame(({ camera, pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, base[0] + pointer.x * amount[0], 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, base[1] + pointer.y * amount[1], 0.04);
    camera.lookAt(target[0], target[1], target[2]);
  });
  return null;
}

export function SceneCanvas({
  children,
  overlay,
  className = "",
  camera,
  onActivate,
  label,
  canvasClassName = "",
  paused,
  onUnavailable,
}: {
  children: ReactNode;
  overlay?: ReactNode;
  className?: string;
  camera: { position: [number, number, number]; fov: number; target: [number, number, number] };
  /** Click / Enter on the stage (e.g. make the avatar wave). */
  onActivate?: () => void;
  label?: string;
  /** Classes for the canvas layer only (e.g. a soft-edge mask that must not clip overlays). */
  canvasClassName?: string;
  paused?: boolean;
  onUnavailable?: () => void;
}) {
  const { ref, visible } = useInViewport<HTMLDivElement>();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const lite = useLiteDevice();
  const isPaused = paused ?? reducedMotion;
  return (
    <div
      ref={ref}
      className={`relative ${onActivate ? "cursor-pointer" : ""} ${className}`}
      onClick={onActivate}
      onKeyDown={onActivate ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); } } : undefined}
      role={onActivate ? "button" : label ? "group" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      aria-label={label}
    >
      <div className={`absolute inset-0 ${canvasClassName}`}>
      <SceneBoundary onUnavailable={onUnavailable}>
      <Canvas
        frameloop={visible ? isPaused ? "demand" : "always" : "never"}
        fallback={<FallbackMessage />}
        dpr={lite ? 1 : [1, 1.25]}
        performance={{ min: 0.5 }}
        camera={{ position: camera.position, fov: camera.fov }}
        gl={{ antialias: true, alpha: true, powerPreference: lite ? "low-power" : "high-performance", toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        onCreated={({ camera: cam }) => cam.lookAt(...camera.target)}
      >
        <LoopKick active={visible && !isPaused} />
        {children}
      </Canvas>
      </SceneBoundary>
      </div>
      {overlay}
    </div>
  );
}

/** Rotating speech bubble rendered as plain DOM above the canvas. */
export function SpeechBubble({ text, className = "left-[56%] top-[9%] sm:top-[11%]" }: { text: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute z-10 ${className}`} aria-live="polite">
      <div
        key={text}
        className="relative origin-bottom-left animate-[bubble_0.45s_cubic-bezier(.2,1.4,.4,1)] rounded-2xl rounded-bl-sm bg-[#ffffff] px-4 py-2 text-xs font-semibold text-[#05060f] ring-1 ring-black/5 shadow-[0_10px_40px_-5px_color-mix(in_oklab,var(--c1)_80%,transparent)] sm:text-sm"
      >
        {text}
        <span className="absolute -bottom-1.5 left-0 h-3 w-3 bg-[#ffffff] [clip-path:polygon(0_0,100%_0,0_100%)]" />
      </div>
    </div>
  );
}

/** Cycles through messages; returns the current index. */
export function useRotatingIndex(length: number, ms = 3400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(id);
  }, [length, ms]);
  return i;
}
