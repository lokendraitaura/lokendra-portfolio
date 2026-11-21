export interface ThemeColors {
  /** primary (replaces violet / purple / fuchsia / indigo) */
  c1: string;
  /** secondary (replaces cyan / sky) */
  c2: string;
  /** accent (replaces pink) */
  c3: string;
  /** deep background tint */
  bg: string;
}

export interface ThemePreset extends ThemeColors {
  id: string;
  name: string;
  emoji: string;
}

export const themePresets: ThemePreset[] = [
  { id: "aurora", name: "Aurora", emoji: "🌌", c1: "#8b5cf6", c2: "#22d3ee", c3: "#f472b6", bg: "#1b1446" },
  { id: "ocean", name: "Deep Ocean", emoji: "🌊", c1: "#3b82f6", c2: "#2dd4bf", c3: "#818cf8", bg: "#0b1f44" },
  { id: "emerald", name: "Emerald", emoji: "💎", c1: "#10b981", c2: "#a3e635", c3: "#22d3ee", bg: "#062b22" },
  { id: "sunset", name: "Sunset", emoji: "🌅", c1: "#f97316", c2: "#facc15", c3: "#f43f5e", bg: "#2e130b" },
  { id: "neon", name: "Cyber Neon", emoji: "⚡", c1: "#ec4899", c2: "#22d3ee", c3: "#facc15", bg: "#2a0a2e" },
  { id: "crimson", name: "Crimson", emoji: "🔥", c1: "#ef4444", c2: "#fb923c", c3: "#f472b6", bg: "#2b0b10" },
  { id: "gold", name: "Royal Gold", emoji: "👑", c1: "#d4a017", c2: "#fde68a", c3: "#f59e0b", bg: "#1f1708" },
  { id: "mono", name: "Graphite", emoji: "🖤", c1: "#a1a1aa", c2: "#e4e4e7", c3: "#71717a", bg: "#18181b" },
];

export const DEFAULT_THEME = themePresets.find((t) => t.id === "sunset")!;
export const THEME_STORAGE_KEY = "lk-theme";

export interface StoredTheme extends ThemeColors {
  id: string; // preset id or "custom"
}

export const HEX_RE = /^#[0-9a-f]{6}$/i;

/** Inline, render-blocking script: applies the saved theme before first paint (no flash). */
export const themeBootScript = `(function(){try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)})||"null");var h=/^#[0-9a-f]{6}$/i;if(t&&h.test(t.c1)&&h.test(t.c2)&&h.test(t.c3)&&h.test(t.bg)){var s=document.documentElement.style;s.setProperty("--c1",t.c1);s.setProperty("--c2",t.c2);s.setProperty("--c3",t.c3);s.setProperty("--bg-tint",t.bg);document.documentElement.dataset.theme=t.id}if(localStorage.getItem("lk-mode")==="light")document.documentElement.classList.add("light");try{if(sessionStorage.getItem("lk-intro")==="1")document.documentElement.classList.add("no-intro")}catch(e){}}catch(e){}})();`;
