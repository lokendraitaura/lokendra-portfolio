"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, HEX_RE, THEME_STORAGE_KEY, type StoredTheme } from "@/data/themes";

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): StoredTheme {
  try {
    const t = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || "null") as StoredTheme | null;
    if (t && [t.c1, t.c2, t.c3, t.bg].every((c) => HEX_RE.test(c))) return t;
  } catch {
    /* storage blocked */
  }
  return { ...DEFAULT_THEME };
}

let current: StoredTheme | null = null;

function apply(t: StoredTheme) {
  const s = document.documentElement.style;
  s.setProperty("--c1", t.c1);
  s.setProperty("--c2", t.c2);
  s.setProperty("--c3", t.c3);
  s.setProperty("--bg-tint", t.bg);
  document.documentElement.dataset.theme = t.id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.bg);
}

export function setTheme(t: StoredTheme) {
  current = t;
  apply(t);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(t));
  } catch {
    /* storage blocked: theme still applies for this visit */
  }
  listeners.forEach((l) => l());
}

export function resetTheme() {
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  setTheme({ ...DEFAULT_THEME });
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const getSnapshot = () => (current ??= read());
const getServerSnapshot = () => DEFAULT_THEME as StoredTheme;

/** Current theme colours; components (incl. 3D scenes) re-render on change. */
export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ───────────── light / dark mode ───────────── */
export type Mode = "dark" | "light";
export const MODE_STORAGE_KEY = "lk-mode";
const modeListeners = new Set<Listener>();
let currentMode: Mode | null = null;

function readMode(): Mode {
  try {
    return localStorage.getItem(MODE_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function setMode(m: Mode) {
  currentMode = m;
  document.documentElement.classList.toggle("light", m === "light");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", m === "light" ? "#f5f6fb" : "#05060f");
  try {
    localStorage.setItem(MODE_STORAGE_KEY, m);
  } catch {
    /* ignore */
  }
  modeListeners.forEach((l) => l());
}

export function useMode() {
  return useSyncExternalStore(
    (l) => {
      modeListeners.add(l);
      return () => modeListeners.delete(l);
    },
    () => (currentMode ??= readMode()),
    () => "dark" as Mode
  );
}

/** Opens the theme studio panel from anywhere (navbar button, mobile menu…). */
export const openThemeStudio = () => window.dispatchEvent(new Event("lk:theme-studio"));
