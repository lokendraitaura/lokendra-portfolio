"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clone as skeletonClone } from "three/examples/jsm/utils/SkeletonUtils.js";

/*
 * Brings a realistic, rigged avatar (Avaturn / MetaPerson / Mixamo-style GLB) to life
 * without any animation files:
 *  - relaxes the T-pose into a natural standing pose
 *  - breathing + subtle weight shift
 *  - head and eyes follow the visitor's mouse
 *  - blinking, a soft smile and lip movement while "talking" (ARKit blendshapes, if present)
 *  - waves hello on load, on click and every few seconds
 */

// Window-level pointer so the avatar tracks the mouse anywhere on the page.
const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}

const norm = (s: string) => s.toLowerCase().replace(/mixamorig|armature|cc_base_|bip01|def[-_]?/g, "").replace(/[^a-z0-9]/g, "");

const BONE_ALIASES: Record<string, string[]> = {
  hips: ["hips", "pelvis", "hip"],
  spine: ["spine", "spine01", "spinelower"],
  chest: ["spine2", "spine03", "upperchest", "chest", "spine1", "spine02"],
  spine1: ["spine1", "spine02"],
  neck: ["neck", "neck01", "necktwist01"],
  lShoulder: ["leftshoulder", "claviclel", "lclavicle", "shoulderl"],
  rShoulder: ["rightshoulder", "clavicler", "rclavicle", "shoulderr"],
  head: ["head"],
  lArm: ["leftarm", "leftupperarm", "upperarml", "lupperarm", "arml", "upperarmleft"],
  lFore: ["leftforearm", "leftlowerarm", "lowerarml", "forearml", "lforearm", "lowerarmleft"],
  lHand: ["lefthand", "handl", "lhand", "handleft"],
  rArm: ["rightarm", "rightupperarm", "upperarmr", "rupperarm", "armr", "upperarmright"],
  rFore: ["rightforearm", "rightlowerarm", "lowerarmr", "forearmr", "rforearm", "lowerarmright"],
  rHand: ["righthand", "handr", "rhand", "handright"],
  lMid: ["lefthandmiddle1", "middle01l", "lmid1", "leftmiddle1"],
  rMid: ["righthandmiddle1", "middle01r", "rmid1", "rightmiddle1"],
  lUpLeg: ["leftupleg", "leftthigh", "thighl", "lthigh", "upperlegl", "leftupperleg"],
  lLeg: ["leftleg", "leftshin", "calfl", "lcalf", "lowerlegl", "leftlowerleg"],
  lFoot: ["leftfoot", "footl", "lfoot"],
  lToe: ["lefttoebase", "lefttoe", "toel", "ltoe", "balll"],
  rUpLeg: ["rightupleg", "rightthigh", "thighr", "rthigh", "upperlegr", "rightupperleg"],
  rLeg: ["rightleg", "rightshin", "calfr", "rcalf", "lowerlegr", "rightlowerleg"],
  rFoot: ["rightfoot", "footr", "rfoot"],
  rToe: ["righttoebase", "righttoe", "toer", "rtoe", "ballr"],
};

type BoneKey = keyof typeof BONE_ALIASES;

function findBones(root: THREE.Object3D) {
  const all: THREE.Bone[] = [];
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone) all.push(o as THREE.Bone);
  });
  const out: Partial<Record<BoneKey, THREE.Bone>> = {};
  (Object.keys(BONE_ALIASES) as BoneKey[]).forEach((key) => {
    for (const alias of BONE_ALIASES[key]) {
      const hit = all.find((b) => norm(b.name) === alias);
      if (hit) {
        out[key] = hit;
        break;
      }
    }
  });
  return out;
}

const MORPHS = {
  blinkL: ["eyeBlinkLeft", "eyeBlink_L", "EyeBlink_L", "Blink_Left", "eyesClosedLeft"],
  blinkR: ["eyeBlinkRight", "eyeBlink_R", "EyeBlink_R", "Blink_Right", "eyesClosedRight"],
  blink: ["blink", "Blink", "eyesClosed", "EyesClosed"],
  jaw: ["jawOpen", "JawOpen", "mouthOpen", "MouthOpen", "viseme_aa"],
  smileL: ["mouthSmileLeft", "mouthSmile_L", "MouthSmile_L"],
  smileR: ["mouthSmileRight", "mouthSmile_R", "MouthSmile_R"],
  smile: ["mouthSmile", "Smile", "smile"],
};
type MorphKey = keyof typeof MORPHS;
type MorphRef = { mesh: THREE.Mesh; index: number };

function findMorphs(root: THREE.Object3D) {
  const out: Partial<Record<MorphKey, MorphRef[]>> = {};
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const dict = mesh.morphTargetDictionary;
    if (!dict || !mesh.morphTargetInfluences) return;
    (Object.keys(MORPHS) as MorphKey[]).forEach((k) => {
      const name = MORPHS[k].find((n) => n in dict);
      if (name !== undefined) (out[k] ||= []).push({ mesh, index: dict[name] });
    });
  });
  return out;
}

const setMorph = (refs: MorphRef[] | undefined, v: number) => refs?.forEach(({ mesh, index }) => (mesh.morphTargetInfluences![index] = v));

// ── tiny IK helpers (world-space, rig-agnostic) ──
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _qw = new THREE.Quaternion();
const _qp = new THREE.Quaternion();

/** Rotate `bone` so the direction bone→child points along `dirWorld`. */
function aimBone(bone: THREE.Bone, child: THREE.Object3D, dirWorld: THREE.Vector3) {
  bone.updateWorldMatrix(true, false);
  child.updateWorldMatrix(false, false);
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  const cur = _b.sub(_a).normalize();
  _q.setFromUnitVectors(cur, dirWorld.clone().normalize());
  bone.getWorldQuaternion(_qw);
  _qw.premultiply(_q);
  bone.parent!.getWorldQuaternion(_qp);
  bone.quaternion.copy(_qp.invert().multiply(_qw));
  bone.updateWorldMatrix(false, true);
}

/** Aim with weight: 0 keeps the current (animated) direction, 1 fully aims at dirWorld. */
function aimBoneBlend(bone: THREE.Bone, child: THREE.Object3D, dirWorld: THREE.Vector3, w: number) {
  if (w <= 0.001) return;
  bone.updateWorldMatrix(true, false);
  child.updateWorldMatrix(false, false);
  bone.getWorldPosition(_a);
  child.getWorldPosition(_b);
  const cur = _b.sub(_a).normalize();
  const desired = cur.clone().lerp(dirWorld.clone().normalize(), w).normalize();
  aimBone(bone, child, desired);
}

/** Apply a world-space rotation (axis/angle) on top of the bone's current pose. */
function rotateWorld(bone: THREE.Bone, axis: THREE.Vector3, angle: number) {
  if (!angle) return;
  bone.updateWorldMatrix(true, false);
  _q.setFromAxisAngle(axis, angle);
  bone.getWorldQuaternion(_qw);
  _qw.premultiply(_q);
  bone.parent!.getWorldQuaternion(_qp);
  bone.quaternion.copy(_qp.invert().multiply(_qw));
  bone.updateWorldMatrix(false, true);
}

const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);
const damp = THREE.MathUtils.damp;

export type AvatarPose = "relaxed" | "type" | "sit" | "point" | "present";

/** Seat surface height (m) used by the "sit" pose and the office chair. */
export const SEAT_HEIGHT = 0.48;

type ArmDirs = { up: THREE.Vector3; fore: THREE.Vector3; hand: THREE.Vector3 };
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Arm directions in "outward space" (x>0 = away from the body). */
const POSES: Record<AvatarPose, { l: ArmDirs; r: ArmDirs; yaw: number; pitch: number }> = {
  relaxed: {
    l: { up: V(0.16, -1, 0.04), fore: V(0.04, -1, 0.22), hand: V(0.02, -1, 0.12) },
    r: { up: V(0.16, -1, 0.04), fore: V(0.04, -1, 0.22), hand: V(0.02, -1, 0.12) },
    yaw: 0,
    pitch: 0,
  },
  type: {
    l: { up: V(0.12, -0.85, 0.5), fore: V(-0.45, -0.2, 1), hand: V(-0.35, -0.45, 1) },
    r: { up: V(0.12, -0.85, 0.5), fore: V(-0.45, -0.2, 1), hand: V(-0.35, -0.45, 1) },
    yaw: 0,
    pitch: 0.28,
  },
  // seated at a desk: elbows by the sides, forearms level and slightly inward onto the keyboard
  sit: {
    l: { up: V(0.1, -0.9, 0.38), fore: V(-0.38, -0.08, 1), hand: V(-0.3, -0.3, 1) },
    r: { up: V(0.1, -0.9, 0.38), fore: V(-0.38, -0.08, 1), hand: V(-0.3, -0.3, 1) },
    yaw: 0,
    pitch: 0.24,
  },
  point: {
    l: { up: V(0.16, -1, 0.04), fore: V(0.04, -1, 0.22), hand: V(0.02, -1, 0.12) },
    r: { up: V(1, 0.08, 0.35), fore: V(1, 0.15, 0.4), hand: V(1, 0.12, 0.35) },
    yaw: 0.22,
    pitch: 0,
  },
  present: {
    l: { up: V(0.3, -0.9, 0.3), fore: V(0.2, -0.1, 1), hand: V(0.15, 0.1, 1) },
    r: { up: V(0.3, -0.9, 0.3), fore: V(0.25, 0.05, 1), hand: V(0.2, 0.25, 1) },
    yaw: 0,
    pitch: 0,
  },
};

const cloneDirs = (d: ArmDirs): ArmDirs => ({ up: d.up.clone(), fore: d.fore.clone(), hand: d.hand.clone() });

export interface RealAvatarProps {
  url: string;
  /** Final standing height in scene units. */
  height?: number;
  /** "greet" waves periodically, "wave" keeps waving, "talk" keeps talking/nodding, "still" never waves on its own. */
  mode?: "greet" | "wave" | "talk" | "still";
  pose?: AvatarPose;
  waveSignal?: number;
  talkSignal?: number;
  /** How strongly the head follows the mouse (0..1). */
  follow?: number;
  paused?: boolean;
}

export default function RealAvatar({ url, height = 1.75, mode = "greet", pose = "relaxed", waveSignal = 0, talkSignal = 0, follow = 1, paused = false }: RealAvatarProps) {
  const { scene, animations } = useGLTF(url, false, true);
  const model = useMemo(() => {
    const m = skeletonClone(scene);
    m.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && "envMapIntensity" in mat) {
          mat.envMapIntensity = 0.9;
          // Lokendra's hair is jet black; the scan reads a little brown/red, so deepen it.
          if (/hair/i.test(mesh.name) || /hair/i.test(mat.name)) {
            const m2 = mat.clone();
            m2.color.multiplyScalar(0.32);
            m2.roughness = Math.min(1, (m2.roughness ?? 0.8) + 0.05);
            mesh.material = m2;
          }
        }
      }
    });
    return m;
  }, [scene]);

  const rig = useMemo(() => {
    // Normalise size and put the feet on y=0
    model.position.set(0, 0, 0);
    model.scale.setScalar(1);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const s0 = height / (size.y || 1);
    // a touch taller and leaner than the scan (+4% height)
    model.scale.set(s0 * 0.99, s0 * 1.04, s0 * 0.99);
    model.updateMatrixWorld(true);
    const box2 = new THREE.Box3().setFromObject(model);
    const center = box2.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -box2.min.y, -center.z);
    model.updateMatrixWorld(true);

    const bones = findBones(model);
    const morphs = findMorphs(model);
    const hipsX = bones.hips ? bones.hips.getWorldPosition(new THREE.Vector3()).x : 0;
    const side = (b?: THREE.Bone) => (b ? Math.sign(b.getWorldPosition(new THREE.Vector3()).x - hipsX) || 1 : 1);

    const bind = new Map<THREE.Bone, THREE.Quaternion>();
    (Object.values(bones) as THREE.Bone[]).forEach((b) => bind.set(b, b.quaternion.clone()));

    // Motion-captured idle (e.g. Avaturn "Idle") drives the whole body when available.
    const idleClip = animations.find((a) => /idle/i.test(a.name)) ?? animations[0];
    let mixer: THREE.AnimationMixer | null = null;
    let action: THREE.AnimationAction | null = null;
    let facing = 0;
    if (idleClip) {
      mixer = new THREE.AnimationMixer(model);
      action = mixer.clipAction(idleClip);
      action.play();
      // The idle stands slightly turned; measure its average facing over the clip and square it to camera.
      if (bones.lArm && bones.rArm) {
        let sx = 0;
        let sz = 0;
        const steps = 12;
        for (let i = 0; i < steps; i++) {
          mixer.setTime((idleClip.duration * i) / steps);
          model.updateMatrixWorld(true);
          const l = bones.lArm.getWorldPosition(new THREE.Vector3());
          const r = bones.rArm.getWorldPosition(new THREE.Vector3());
          const v = l.sub(r).multiplyScalar(side(bones.lArm));
          sx += v.x;
          sz += v.z;
        }
        facing = Math.atan2(sz, sx);
        mixer.setTime(0);
        model.updateMatrixWorld(true);
      }
    }
    // how far the body must drop so the hip joint rests ~10 cm above the chair seat
    const hipsY = bones.hips ? bones.hips.getWorldPosition(new THREE.Vector3()).y : height * 0.53;
    const sitDrop = Math.max(0, hipsY - (SEAT_HEIGHT + 0.1));
    const hipsBindPos = bones.hips ? bones.hips.position.clone() : null;
    return { bones, morphs, bind, mixer, action, sitDrop, facing, hipsBindPos, lOut: side(bones.lArm), rOut: side(bones.rArm) };
  }, [model, height, animations]);

  useEffect(() => {
    // de-sync multiple instances (hero / about / contact) so they don't move in lockstep
    const { mixer, action } = rig;
    if (mixer && action) mixer.setTime(Math.random() * action.getClip().duration);
    return () => {
      mixer?.stopAllAction();
    };
  }, [rig]);

  const cleanRef = useRef(new Map<THREE.Bone, THREE.Quaternion>());
  const root = useRef<THREE.Group>(null);
  const lastPose = useRef<AvatarPose | null>(null);

  const state = useRef({
    wave: 0,
    waveUntil: 0,
    talkUntil: 0,
    yaw: 0,
    pitch: 0,
    nextBlink: 2,
    blinkT: -1,
    t: 0,
    // start already in the requested pose (no stand-up → sit-down animation on first load)
    lw: pose === "relaxed" || pose === "point" ? 0 : 1,
    rw: pose === "relaxed" ? 0 : 1,
    sw: pose === "sit" ? 1 : 0,
    l: cloneDirs(POSES[pose].l),
    r: cloneDirs(POSES[pose].r),
  });

  useEffect(() => {
    // greet/wave modes say hi when they start; "talk" and "still" never wave on their own
    if (mode === "wave" || mode === "greet") state.current.waveUntil = state.current.t + 3.4;
  }, [mode]);
  useEffect(() => {
    if (waveSignal) state.current.waveUntil = state.current.t + 3.4;
  }, [waveSignal]);
  useEffect(() => {
    if (talkSignal) state.current.talkUntil = state.current.t + 1.5;
  }, [talkSignal]);

  useFrame((frame, dt) => {
    if (paused && lastPose.current === pose) return;
    lastPose.current = pose;
    const st = state.current;
    const d = Math.min(dt, 0.05);
    // Advance only rendered time so a paused/offscreen avatar resumes without a jump.
    st.t += d;
    const t = st.t;
    const { bones, morphs, bind, mixer, lOut, rOut, sitDrop, facing, hipsBindPos } = rig;
    const clean = cleanRef.current;
    const target = POSES[pose];
    const k = 1 - Math.exp(-5 * d);

    // 1. base layer: mocap idle, or bind pose + procedural breathing
    if (mixer) {
      // Three's mixer only writes a bone when its sampled value changes, so first undo last
      // frame's procedural layer, then let the mixer advance, then snapshot the clean pose.
      clean.forEach((q, b) => b.quaternion.copy(q));
      mixer.update(d);
      bind.forEach((_, b) => {
        const q = clean.get(b);
        if (q) q.copy(b.quaternion);
        else clean.set(b, b.quaternion.clone());
      });
      model.updateMatrixWorld(true);
    } else {
      bind.forEach((q, b) => b.quaternion.copy(q));
      model.updateMatrixWorld(true);
      if (bones.hips) rotateWorld(bones.hips, Y, Math.sin(t * 0.5) * 0.04);
      if (bones.chest) rotateWorld(bones.chest, X, Math.sin(t * 1.6) * 0.018);
      if (bones.spine) rotateWorld(bones.spine, Z, Math.sin(t * 0.5 + 1) * 0.015);
    }

    // 1b. Seated: the standing idle twists the hips/spine and sways sideways. Square the whole torso
    // to the desk (hips → head, shoulders) so he sits straight, not "tirchha".
    const swNow = st.sw;
    if (swNow > 0.001) {
      (["hips", "spine", "spine1", "chest", "neck", "head", "lShoulder", "rShoulder"] as const).forEach((key) => {
        const b = bones[key];
        const q = b && bind.get(b);
        if (b && q) b.quaternion.slerp(q, swNow);
      });
      if (bones.hips && hipsBindPos) bones.hips.position.lerp(hipsBindPos, swNow);
      model.updateMatrixWorld(true);
    }

    // 2. arms: blend from the base layer towards the requested pose / wave
    if (mode === "greet" && t > 5 && t % 12 < d * 1.5) st.waveUntil = t + 2.6;
    const waving = mode === "wave" || t < st.waveUntil;
    st.wave = damp(st.wave, waving ? 1 : 0, 8, Math.max(d, Math.min(dt, 0.1)));
    // with a mocap idle, "relaxed" means: let the animation drive the arms
    const overrides = (sideKey: "l" | "r") => !mixer || (pose !== "relaxed" && !(pose === "point" && sideKey === "l"));
    const seated = pose === "sit";
    st.sw = damp(st.sw, seated ? 1 : 0, 4, d);
    st.lw = damp(st.lw, overrides("l") ? 1 : 0, 4, d);
    st.rw = damp(st.rw, overrides("r") ? 1 : 0, 4, d);
    // Natural "hi": elbow ~45° out and slightly forward, forearm up, small swing that reads as
    // shoulder rotation (an elbow never bends sideways) plus a little wrist motion.
    const sway = Math.sin(t * 6.2) * 0.2;
    const typing = pose === "type" || seated ? Math.sin(t * 18) * 0.05 * (1 - st.wave) : 0;

    (["l", "r"] as const).forEach((sideKey) => {
      const cur = st[sideKey];
      const tgt = target[sideKey];
      cur.up.lerp(tgt.up, k);
      cur.fore.lerp(tgt.fore, k);
      cur.hand.lerp(tgt.hand, k);
      const out = sideKey === "l" ? lOut : rOut;
      const arm = sideKey === "l" ? bones.lArm : bones.rArm;
      const fore = sideKey === "l" ? bones.lFore : bones.rFore;
      const hand = sideKey === "l" ? bones.lHand : bones.rHand;
      const mid = sideKey === "l" ? bones.lMid : bones.rMid;
      const waveW = sideKey === "r" ? st.wave : 0;
      const poseW = sideKey === "l" ? st.lw : st.rw;
      const w = Math.max(poseW, waveW);
      if (w <= 0.001) return;
      if (swNow > 0.001 && waveW < 0.5) {
        [arm, fore, hand].forEach((b) => {
          const q = b && bind.get(b);
          if (b && q) b.quaternion.slerp(q, swNow * (1 - waveW));
        });
        model.updateMatrixWorld(true);
      }
      const jitter = sideKey === "l" ? typing : -typing;
      const up = cur.up.clone().lerp(V(0.6, -0.5, 0.55), waveW);
      const fo = cur.fore.clone().lerp(V(0.18 + sway, 1, 0.28), waveW);
      const ha = cur.hand.clone().lerp(V(0.12 + sway * 1.6, 1, 0.15), waveW);
      fo.y += jitter;
      ha.y += jitter * 1.5;
      if (arm && fore) aimBoneBlend(arm, fore, V(up.x * out, up.y, up.z), w);
      if (fore && hand) aimBoneBlend(fore, hand, V(fo.x * out, fo.y, fo.z), w);
      if (hand && mid) aimBoneBlend(hand, mid, V(ha.x * out, ha.y, ha.z), w);
    });

    // 2b. sitting: lower the body onto the chair, thighs forward, shins down, feet flat
    if (root.current) {
      root.current.position.y = -sitDrop * st.sw;
      root.current.rotation.y = facing * (1 - st.sw);
    }
    if (st.sw > 0.001) {
      const sw = st.sw;
      if (bones.spine) rotateWorld(bones.spine, X, 0.07 * sw);
      (["l", "r"] as const).forEach((sk) => {
        const out = sk === "l" ? lOut : rOut;
        const up = sk === "l" ? bones.lUpLeg : bones.rUpLeg;
        const leg = sk === "l" ? bones.lLeg : bones.rLeg;
        const foot = sk === "l" ? bones.lFoot : bones.rFoot;
        const toe = sk === "l" ? bones.lToe : bones.rToe;
        // a little foot tap while thinking
        const tap = sk === "r" ? Math.max(0, Math.sin(t * 1.3)) * 0.05 : 0;
        if (up && leg) aimBoneBlend(up, leg, V(out * 0.12, -0.06, 1), sw);
        if (leg && foot) aimBoneBlend(leg, foot, V(out * 0.04, -1, 0.1 + tap), sw);
        if (foot && toe) aimBoneBlend(foot, toe, V(out * 0.05, -0.2 + tap, 1), sw);
      });
    }

    // 3. head + neck: follow the pointer (additive on top of the idle), pose bias, talking nods
    // Coding = focused: eyes on the laptop, no mouse-following, no chatter.
    // Waving = stops and looks straight at the viewer (the camera), then goes back to work.
    const coding = pose === "type" || seated;
    const w = st.wave;
    const talking = !coding && (mode === "talk" || t < st.talkUntil);
    const nod = talking ? Math.sin(t * 6) * 0.04 + Math.sin(t * 2.3) * 0.03 : 0;
    const fol = coding ? 0 : follow;
    st.yaw = damp(st.yaw, (pointer.x * 0.35 * fol + target.yaw * rOut) * (1 - w), 4, d);
    st.pitch = damp(st.pitch, (-pointer.y * 0.15 * fol + target.pitch) * (1 - w), 4, d);
    const tilt = 0; // keep the head upright: no sideways tilt
    if (bones.neck) {
      rotateWorld(bones.neck, Y, st.yaw * 0.4);
      rotateWorld(bones.neck, X, st.pitch * 0.4);
    }
    if (bones.head) {
      rotateWorld(bones.head, Y, st.yaw * 0.6);
      rotateWorld(bones.head, X, st.pitch * 0.6 + nod);
      rotateWorld(bones.head, Z, tilt);
    }

    // 4. face (only if the avatar ships ARKit-style blendshapes)
    if (t > st.nextBlink) {
      st.blinkT = t;
      st.nextBlink = t + 2.5 + Math.random() * 3;
    }
    const bp = st.blinkT < 0 ? 1 : (t - st.blinkT) / 0.16;
    const blink = bp < 1 ? Math.sin(bp * Math.PI) : 0;
    setMorph(morphs.blinkL, blink);
    setMorph(morphs.blinkR, blink);
    setMorph(morphs.blink, blink);
    const smile = 0.25 + st.wave * 0.35;
    setMorph(morphs.smileL, smile);
    setMorph(morphs.smileR, smile);
    setMorph(morphs.smile, smile);
    const jaw = talking ? (0.5 + 0.5 * Math.sin(t * 17)) * (0.25 + 0.15 * Math.sin(t * 5.3)) : 0;
    setMorph(morphs.jaw, jaw);
  });

  return (
    <group ref={root}>
      <primitive object={model} />
    </group>
  );
}

export function preloadAvatar(url: string) {
  useGLTF.preload(url);
}
