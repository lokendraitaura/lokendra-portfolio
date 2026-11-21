"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Tok = [string, string];
const CODE: Tok[][] = [
  [["import", "#c084fc"], [" { motion } ", "#e2e8f0"], ["from", "#c084fc"], [" 'framer-motion'", "#fbbf24"]],
  [["", ""]],
  [["export default function", "#c084fc"], [" Portfolio", "#22d3ee"], ["() {", "#e2e8f0"]],
  [["  const", "#c084fc"], [" dev ", "#e2e8f0"], ["= ", "#94a3b8"], ["useDeveloper", "#22d3ee"], ["('lokendra')", "#fbbf24"]],
  [["  const", "#c084fc"], [" { data } ", "#e2e8f0"], ["= ", "#94a3b8"], ["useQuery", "#22d3ee"], ["(projects)", "#e2e8f0"]],
  [["", ""]],
  [["  return", "#c084fc"], [" (", "#e2e8f0"]],
  [["    <", "#94a3b8"], ["Hero", "#f472b6"], [" role", "#34d399"], ["=", "#94a3b8"], ["'Frontend Architect'", "#fbbf24"], [" />", "#94a3b8"]],
  [["    <", "#94a3b8"], ["DesignSystem", "#f472b6"], [" tokens", "#34d399"], ["={", "#94a3b8"], ["theme", "#e2e8f0"], ["} />", "#94a3b8"]],
  [["    <", "#94a3b8"], ["DataGrid", "#f472b6"], [" rows", "#34d399"], ["={", "#94a3b8"], ["data", "#e2e8f0"], ["} virtual />", "#94a3b8"]],
  [["    <", "#94a3b8"], ["AIChat", "#f472b6"], [" model", "#34d399"], ["=", "#94a3b8"], ["'groq'", "#fbbf24"], [" stream />", "#94a3b8"]],
  [["  )", "#e2e8f0"]],
  [["}", "#e2e8f0"]],
  [["// ✓ Compiled · LCP 0.9s · a11y 100", "#34d399"]],
];

/** Draws an editor that "types" code in real time onto a canvas texture. */
class CodePainter {
  canvas = document.createElement("canvas");
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  private last = 0;
  private prog = 0;
  private total = CODE.reduce((n, l) => n + l.reduce((m, [s]) => m + s.length, 0) + 1, 0);

  constructor() {
    this.canvas.width = 1024;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.draw(3);
  }

  draw(t: number) {
    if (t - this.last < 1 / 30) return;
    this.last = t;
    this.prog = (t * 42) % (this.total + 120);
    const { ctx, canvas } = this;
    const W = canvas.width;
    const H = canvas.height;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0b1020");
    g.addColorStop(1, "#140b2b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#111833";
    ctx.fillRect(0, 0, W, 44);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(26 + i * 22, 22, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 18px ui-monospace, monospace";
    ctx.fillText("Portfolio.tsx — lokendra", 110, 28);
    ctx.fillStyle = "#0d1430";
    ctx.fillRect(0, 44, 56, H - 44);
    ["#a78bfa", "#22d3ee", "#94a3b8", "#94a3b8"].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.globalAlpha = i === 0 ? 1 : 0.5;
      ctx.fillRect(18, 70 + i * 46, 20, 20);
    });
    ctx.globalAlpha = 1;

    ctx.font = "500 24px ui-monospace, Menlo, monospace";
    let budget = this.prog;
    let cx = 118;
    let cy = 90;
    CODE.forEach((line, li) => {
      const y = 90 + li * 37;
      ctx.fillStyle = "#475569";
      ctx.fillText(String(li + 1).padStart(2, " "), 70, y);
      let x = 118;
      for (const [text, color] of line) {
        if (budget <= 0) break;
        const shown = text.slice(0, Math.max(0, Math.floor(budget)));
        budget -= text.length;
        ctx.fillStyle = color || "#e2e8f0";
        ctx.fillText(shown, x, y);
        x += ctx.measureText(shown).width;
      }
      if (budget > -1) {
        cx = x;
        cy = y;
      }
      budget -= 1;
    });
    if (Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = "#22d3ee";
      ctx.fillRect(cx + 2, cy - 22, 3, 28);
    }
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
  }
}

export function CodeScreen({ width, height, paused = false }: { width: number; height: number; paused?: boolean }) {
  const [painter] = useState(() => new CodePainter());
  const time = useRef(3);
  useEffect(() => () => painter.dispose(), [painter]);
  useFrame((_, dt) => {
    if (paused) return;
    time.current += Math.min(dt, 0.05);
    painter.draw(time.current);
  });
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={painter.texture} toneMapped={false} />
    </mesh>
  );
}

function ReactAtom() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.6;
      ref.current.rotation.z += dt * 0.2;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((r) => (
        <mesh key={r} rotation={[0, 0, r]} scale={[1, 0.36, 1]}>
          <torusGeometry args={[0.32, 0.014, 12, 96]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** A polished developer workstation: open laptop with live code, glowing React atom, props. */
export default function Workspace() {
  return (
    <group position={[0, -0.35, 0]}>
      {/* desk */}
      <RoundedBox args={[3.6, 0.08, 1.6]} radius={0.035} position={[0, -0.6, 0.2]} receiveShadow>
        <meshStandardMaterial color="#1c1533" roughness={0.35} metalness={0.4} />
      </RoundedBox>
      <mesh position={[0, -0.556, 1.0]}>
        <boxGeometry args={[3.56, 0.01, 0.01]} />
        <meshBasicMaterial color="#a78bfa" toneMapped={false} />
      </mesh>

      {/* laptop */}
      <group position={[0, -0.555, 0.25]} rotation={[0, -0.18, 0]}>
        <RoundedBox args={[1.5, 0.045, 1.0]} radius={0.02} position={[0, 0.0225, 0]} castShadow>
          <meshStandardMaterial color="#b8bfcc" roughness={0.28} metalness={0.9} />
        </RoundedBox>
        {/* keyboard well */}
        <mesh position={[0, 0.046, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.25, 0.45]} />
          <meshStandardMaterial color="#1f2433" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.046, 0.38]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.45, 0.22]} />
          <meshStandardMaterial color="#9aa1ae" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* lid */}
        <group position={[0, 0.045, -0.49]} rotation={[-0.22, 0, 0]}>
          <RoundedBox args={[1.5, 0.95, 0.035]} radius={0.02} position={[0, 0.475, 0]} castShadow>
            <meshStandardMaterial color="#b8bfcc" roughness={0.28} metalness={0.9} />
          </RoundedBox>
          <mesh position={[0, 0.475, 0.0185]}>
            <planeGeometry args={[1.44, 0.89]} />
            <meshBasicMaterial color="#05060f" />
          </mesh>
          <group position={[0, 0.475, 0.0195]}>
            <CodeScreen width={1.38} height={0.84} />
          </group>
          <pointLight position={[0, 0.45, 0.6]} intensity={2.5} distance={2.5} color="#7dd3fc" />
        </group>
      </group>

      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <group position={[-1.25, 0.7, 0.1]}>
          <ReactAtom />
        </group>
      </Float>

      {/* mug */}
      <group position={[-1.35, -0.43, 0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.1, 0.24, 32]} />
          <meshStandardMaterial color="#f472b6" roughness={0.35} />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.06, 0.018, 12, 24]} />
          <meshStandardMaterial color="#f472b6" roughness={0.35} />
        </mesh>
      </group>
      {/* phone */}
      <RoundedBox args={[0.26, 0.018, 0.5]} radius={0.01} position={[1.25, -0.55, 0.55]} rotation={[0, 0.4, 0]} castShadow>
        <meshStandardMaterial color="#111827" roughness={0.2} metalness={0.7} />
      </RoundedBox>
      <ContactShadows position={[0, -0.555, 0.2]} opacity={0.5} scale={5} blur={2.4} far={1.5} frames={1} />
    </group>
  );
}
