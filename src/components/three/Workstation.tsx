"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/layout/ThemeStore";
import { useLiteDevice } from "@/hooks/usePerf";
import { CodeScreen } from "./Workspace";
import { SEAT_HEIGHT } from "./RealAvatar";

const STANDING_DESK = 0.93;
const SITTING_DESK = 0.74;

function LaptopKeyboard() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#2b2f3a"; ctx.fillRect(0, 0, 512, 256);
    for (let row = 0; row < 4; row++) for (let col = 0; col < 12; col++) {
      ctx.fillStyle = "#11151f"; ctx.fillRect(10 + col * 41, 8 + row * 38, 35, 30);
      ctx.fillStyle = "#8e99ad"; ctx.fillRect(22 + col * 41, 18 + row * 38, 9, 2);
    }
    ctx.fillStyle = "#161b28"; ctx.fillRect(140, 170, 230, 22);
    ctx.strokeStyle = "#626b7e"; ctx.lineWidth = 2; ctx.strokeRect(175, 204, 160, 45);
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.36, 0.24]} /><meshStandardMaterial map={texture} roughness={0.65} /></mesh>;
}

/** Ergonomic office chair, facing +z, seat surface at SEAT_HEIGHT. */
function OfficeChair() {
  const th = useTheme();
  const shell = <meshStandardMaterial color="#1a1b26" roughness={0.55} metalness={0.25} />;
  const metal = <meshStandardMaterial color="#3b3f4c" roughness={0.3} metalness={0.9} />;
  return (
    <group position={[0, 0, -0.02]}>
      {/* seat cushion */}
      <RoundedBox args={[0.5, 0.08, 0.48]} radius={0.035} position={[0, SEAT_HEIGHT - 0.04, 0.06]}>
        {shell}
      </RoundedBox>
      {/* backrest with lumbar curve + accent stitching */}
      <group position={[0, SEAT_HEIGHT + 0.36, -0.22]} rotation={[-0.12, 0, 0]}>
        <RoundedBox args={[0.46, 0.6, 0.07]} radius={0.04}>
          {shell}
        </RoundedBox>
        <mesh position={[0, 0.0, 0.037]}>
          <boxGeometry args={[0.02, 0.5, 0.002]} />
          <meshBasicMaterial color={th.c1} toneMapped={false} />
        </mesh>
      </group>
      {/* backrest spine */}
      <mesh position={[0, SEAT_HEIGHT + 0.06, -0.24]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.06, 0.2, 0.03]} />
        {metal}
      </mesh>
      {/* armrests */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0.27 * s, SEAT_HEIGHT + 0.12, 0.02]}>
          <mesh position={[0, -0.07, 0]}>
            <boxGeometry args={[0.03, 0.16, 0.03]} />
            {metal}
          </mesh>
          <RoundedBox args={[0.06, 0.03, 0.26]} radius={0.012}>
            {shell}
          </RoundedBox>
        </group>
      ))}
      {/* gas lift */}
      <mesh position={[0, (SEAT_HEIGHT - 0.08) / 2 + 0.06, 0.04]}>
        <cylinderGeometry args={[0.025, 0.03, SEAT_HEIGHT - 0.12, 16]} />
        {metal}
      </mesh>
      {/* 5-star base with casters */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} position={[0, 0.06, 0.04]} rotation={[0, a, 0]}>
            <mesh position={[0.15, 0, 0]}>
              <boxGeometry args={[0.3, 0.025, 0.04]} />
              {metal}
            </mesh>
            <mesh position={[0.29, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.03, 16]} />
              <meshStandardMaterial color="#0d0e14" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Desk in front of the avatar: laptop (screen facing him) plus a large monitor angled
 * towards the camera showing live code. `seated` lowers it to a normal desk and adds a chair.
 * Slides in/out with `show`.
 */
export default function Workstation({ show = true, monitor = true, seated = false, paused = false }: { show?: boolean; monitor?: boolean; seated?: boolean; paused?: boolean }) {
  const th = useTheme();
  const lite = useLiteDevice();
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    const targetY = show ? 0 : -1.4;
    g.current.position.y = THREE.MathUtils.damp(g.current.position.y, targetY, 6, Math.min(dt, 0.05));
    g.current.visible = g.current.position.y > -1.35;
  });
  const dy = (seated ? SITTING_DESK : STANDING_DESK) - STANDING_DESK;

  return (
    <group ref={g}>
      {seated && <OfficeChair />}
      <group position={[0, dy, 0]}>
        {/* desk top + glowing edge */}
        <RoundedBox args={[1.9, 0.05, 0.7]} radius={0.02} position={[0, 0.93, 0.55]}>
          <meshStandardMaterial color="#1b1a2b" roughness={0.4} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.957, 0.905]}>
          <boxGeometry args={[1.88, 0.006, 0.006]} />
          <meshBasicMaterial color={th.c1} toneMapped={false} />
        </mesh>
        {/* legs */}
        {[-0.85, 0.85].map((x) => (
          <mesh key={x} position={[x, 0.93 / 2 - dy / 2, 0.55]}>
            <boxGeometry args={[0.05, 0.93 + dy, 0.5]} />
            <meshStandardMaterial color="#14131f" roughness={0.6} metalness={0.4} />
          </mesh>
        ))}

        {/* laptop: screen faces the avatar, lid back faces the camera */}
        <group position={[0.05, 0.955, 0.42]} rotation={[0, Math.PI, 0]}>
          <RoundedBox args={[0.4, 0.016, 0.27]} radius={0.007} position={[0, 0.008, 0]}>
            <meshStandardMaterial color="#2b2f3a" roughness={0.5} metalness={0.6} />
          </RoundedBox>
          <LaptopKeyboard />
          <group position={[0, 0.016, -0.13]} rotation={[-0.38, 0, 0]}>
            <RoundedBox args={[0.4, 0.26, 0.01]} radius={0.007} position={[0, 0.13, 0]}>
              <meshStandardMaterial color="#2b2f3a" roughness={0.5} metalness={0.6} />
            </RoundedBox>
            <group position={[0, 0.13, 0.0065]}><CodeScreen width={0.365} height={0.224} paused={paused} /></group>
            <mesh position={[0, 0.13, -0.0065]} rotation={[0, Math.PI, 0]}>
              <circleGeometry args={[0.025, 24]} />
              <meshBasicMaterial color="#e5e7eb" toneMapped={false} />
            </mesh>
            {!lite && <pointLight position={[0, 0.2, 0.3]} intensity={1.4} distance={1.2} color="#bfdbfe" />}
          </group>
        </group>

        {/* coffee mug */}
        <mesh position={[-0.62, 1.0, 0.62]}>
          <cylinderGeometry args={[0.045, 0.04, 0.1, 24]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.35} />
        </mesh>

        {/* external monitor, angled to the camera, showing live code */}
        {monitor && (
          <group position={[0.6, 1.3, 0.62]} rotation={[0, -0.5, 0]}>
            <RoundedBox args={[0.86, 0.54, 0.03]} radius={0.015}>
              <meshStandardMaterial color="#0f1018" roughness={0.4} metalness={0.6} />
            </RoundedBox>
            <group position={[0, 0, 0.0165]}>
              <CodeScreen width={0.82} height={0.5} paused={paused} />
            </group>
            <mesh position={[0, -0.36, -0.05]}>
              <boxGeometry args={[0.04, 0.2, 0.04]} />
              <meshStandardMaterial color="#1f2030" metalness={0.6} roughness={0.4} />
            </mesh>
            {!lite && <pointLight position={[0, 0, 0.5]} intensity={1.2} distance={1.6} color={th.c2} />}
          </group>
        )}
      </group>
    </group>
  );
}
