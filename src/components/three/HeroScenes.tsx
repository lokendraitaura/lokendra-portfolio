"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Float, OrbitControls, RoundedBox, Edges } from "@react-three/drei";
import { Hand, Maximize2, Minimize2, RotateCcw, Pause, Play, Move } from "lucide-react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { media } from "@/data/media";
import { useTheme } from "@/components/layout/ThemeStore";
import useMediaQuery from "@/hooks/useMediaQuery";
import RealAvatar from "./RealAvatar";
import Workspace from "./Workspace";
import Workstation from "./Workstation";
import { SceneCanvas, SpeechBubble, StudioLights } from "./SceneKit";
import { PosterImage } from "./HeroPoster";

const TARGET: [number, number, number] = [0, 0.7, 0.15];
const POSITION: [number, number, number] = [-2.95, 2.4, 5.3];

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

/** Locally drawn textures keep the floating 3D labels independent of external fonts. */
function TechTile({ label, color, position, rotation = 0, paused }: { label: string; color: string; position: [number, number, number]; rotation?: number; paused: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#101523";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = `${color}77`;
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 240, 240);
    ctx.fillStyle = color;
    ctx.font = `600 ${label.length > 2 ? 80 : 102}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 128, 132);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [label, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <Float speed={paused ? 0 : 1.5} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[-0.06, 0.06]}>
    <group position={position} rotation={[0.05, -0.3, rotation]}>
      <RoundedBox args={[0.43, 0.43, 0.1]} radius={0.05}><meshStandardMaterial color="#192031" metalness={0.65} roughness={0.28} /></RoundedBox>
      {[1, -1].map((side) => <mesh key={side} position={[0, 0, side * 0.052]} rotation={[0, side < 0 ? Math.PI : 0, 0]}><planeGeometry args={[0.36, 0.36]} /><meshBasicMaterial map={texture} /></mesh>)}
    </group>
  </Float>;
}

function StudioWorld({ paused }: { paused: boolean }) {
  const theme = useTheme();
  return <group>
    <mesh position={[0, -0.12, 0.2]} rotation={[0, Math.PI / 6, 0]}>
      <cylinderGeometry args={[1.65, 1.7, 0.16, 6]} />
      <meshStandardMaterial color="#111a2d" metalness={0.5} roughness={0.45} />
      <Edges threshold={20} color={theme.c1} />
    </mesh>
    <mesh position={[0, -0.23, 0.2]} rotation={[0, Math.PI / 6, 0]}>
      <cylinderGeometry args={[1.5, 1.6, 0.08, 6]} />
      <meshStandardMaterial color="#070b16" roughness={0.6} />
    </mesh>
    <TechTile label="TS" color="#78b6ff" position={[1.35, 1.65, -0.45]} rotation={-0.12} paused={paused} />
    <TechTile label="</>" color="#bba4ff" position={[-1.2, 1.75, -0.3]} rotation={0.1} paused={paused} />
    <TechTile label="AI" color="#6ae5d3" position={[1.2, 0.6, 0.7]} rotation={-0.15} paused={paused} />
    <Float speed={paused ? 0 : 1.2} rotationIntensity={0.18} floatIntensity={0.2}>
      <group position={[-1.3, 0.65, 0.7]} scale={0.22}>
        {[0, Math.PI / 3, -Math.PI / 3].map((angle) => <mesh key={angle} rotation={[0, 0, angle]} scale={[1, 0.4, 1]}><torusGeometry args={[1, 0.045, 8, 48]} /><meshBasicMaterial color="#7be1f5" /></mesh>)}
        <mesh><sphereGeometry args={[0.15, 16, 16]} /><meshBasicMaterial color="#7be1f5" /></mesh>
      </group>
    </Float>
    {/* A small desk plant adds a human detail to the working studio. */}
    <group position={[-0.72, 0.78, 0.32]}>
      <mesh><cylinderGeometry args={[0.065, 0.045, 0.12, 20]} /><meshStandardMaterial color="#d9dce5" roughness={0.8} /></mesh>
      {[0, 1, 2, 3, 4].map((n) => <mesh key={n} position={[Math.sin(n * 1.4) * 0.04, 0.12, Math.cos(n * 1.4) * 0.04]} rotation={[0.3 * Math.cos(n), n, 0.4 * Math.sin(n)]} scale={[0.035, 0.12, 0.018]}><sphereGeometry args={[1, 12, 12]} /><meshStandardMaterial color={n % 2 ? "#5b9e7c" : "#8ec6a0"} roughness={0.8} /></mesh>)}
    </group>
  </group>;
}

export function HeroScene({ compact = false, hasAvatar = false }: { compact?: boolean; hasAvatar?: boolean }) {
  const [wave, setWave] = useState(0);
  const [greeting, setGreeting] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pauseOverride, setPauseOverride] = useState<boolean | null>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const paused = pauseOverride ?? reduced;
  const controls = useRef<OrbitControlsImpl>(null);
  const stage = useRef<HTMLDivElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  const camera = useMemo(() => ({
    position: (hasAvatar ? [POSITION[0], POSITION[1], POSITION[2]] : [0, 0.85, 6.1]) as [number, number, number],
    target: hasAvatar ? TARGET : [0, -0.2, 0] as [number, number, number],
    fov: 34,
  }), [hasAvatar]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    stage.current?.focus();
    const close = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") { setExpanded(false); expandButton.current?.focus(); }
      if (event.key === "Tab" && stage.current) {
        const buttons = Array.from(stage.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === stage.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); stage.current.focus(); }
      }
    };
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previous; window.__lenis?.start(); window.removeEventListener("keydown", close); };
  }, [expanded]);

  const greet = () => {
    if (!ready) return;
    setPauseOverride(false);
    setWave(n => n + 1);
    setGreeting(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setGreeting(false), 3400);
  };
  const reset = () => {
    const orbit = controls.current;
    if (!orbit) return;
    orbit.target.set(...camera.target);
    orbit.object.position.set(...camera.position);
    orbit.update();
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !controls.current) return;
    const orbit = controls.current;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() - 0.18),
      ArrowRight: () => orbit.setAzimuthalAngle(orbit.getAzimuthalAngle() + 0.18),
      ArrowUp: () => orbit.setPolarAngle(orbit.getPolarAngle() - 0.12),
      ArrowDown: () => orbit.setPolarAngle(orbit.getPolarAngle() + 0.12),
      '+': () => orbit.dollyIn(), '=': () => orbit.dollyIn(), '-': () => orbit.dollyOut(), Home: reset,
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); orbit.update(); }
  };

  return <div ref={stage} className={`world-stage dark-island ${expanded ? "world-expanded" : ""}`} role={expanded ? "dialog" : "group"} aria-modal={expanded || undefined} aria-label="Explore Lokendra's 3D workspace" aria-describedby="world-instructions" tabIndex={0} onKeyDown={keyboard}>
    <div className="world-aura" aria-hidden />
    <div className="world-grid" aria-hidden />
    <div className="world-topline"><span>THE DEVELOPER&apos;S WORLD</span><span>3D / REAL TIME</span></div>
    <div className="world-canvas" data-lenis-prevent onContextMenu={event => event.preventDefault()}>
      {hasAvatar && !unavailable && <PosterImage hidden={ready} />}
      <SceneCanvas className="h-full w-full" paused={paused} onUnavailable={onUnavailable} camera={camera} label="Drag to rotate the 3D avatar and workspace" overlay={greeting ? <SpeechBubble text="Hey! Good to see you here." className="left-[25%] top-[18%]" /> : undefined}>
        <StudioLights intensity={0.72} />
        <directionalLight position={[0, 2, -4]} intensity={0.7} color="#c3d1ff" />
        <Suspense fallback={null}>
          {hasAvatar ? <>
            <StudioWorld paused={paused} />
            <group onClick={event => { if (event.delta < 5) { event.stopPropagation(); greet(); } }}>
              <RealAvatar url={media.avatar} mode="still" pose="sit" waveSignal={wave} follow={0} paused={paused} />
            </group>
            <Workstation seated paused={paused} />
          </> : <Workspace />}
          <Ready onReady={onReady} />
        </Suspense>
        <OrbitControls ref={controls} makeDefault target={camera.target} enableDamping dampingFactor={0.08} rotateSpeed={0.65} zoomSpeed={0.75} panSpeed={0.6} minDistance={1.2} maxDistance={9} minPolarAngle={0.08} maxPolarAngle={Math.PI - 0.08} enablePan enableZoom />
      </SceneCanvas>
    </div>
    <div className="world-bottom">
      <div className="world-hint" id="world-instructions"><Move size={18} /><span><strong>Your perspective. Your control.</strong><span>{compact ? "Drag to orbit · Pinch to zoom · Two fingers to pan" : "Drag to orbit · Scroll to zoom · Right-drag to pan"}</span><span className="sr-only">Keyboard: arrow keys rotate, plus and minus zoom, Home resets.</span></span></div>
      <div className="world-actions">
        <button onClick={greet} disabled={!ready} aria-label="Say hello" title="Say hello"><Hand size={18} /></button>
        <button onClick={() => setPauseOverride(!paused)} aria-label={paused ? "Play animation" : "Pause animation"} title={paused ? "Play animation" : "Pause animation"}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>
        <button onClick={reset} aria-label="Reset 3D view" title="Reset view"><RotateCcw size={18} /></button>
        <button ref={expandButton} onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Exit fullscreen" : "Explore fullscreen"} title={expanded ? "Exit fullscreen" : "Explore fullscreen"}>{expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
      </div>
    </div>
  </div>;
}
