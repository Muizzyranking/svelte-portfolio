import { writable } from "svelte/store";
import { browser } from "$app/environment";

export type Accent = "green" | "blue" | "purple" | "amber";

export interface AccentConfig {
  name: Accent;
  label: string;
  hex: string;
  hexDim: string;
  hexBright: string;
  rgb: string;
}

export const ACCENTS: AccentConfig[] = [
  {
    name: "green",
    label: "Phosphor",
    hex: "#9fbf6b",
    hexDim: "#7a9e4a",
    hexBright: "#b5d47a",
    rgb: "159,191,107",
  },
  {
    name: "blue",
    label: "Cyan",
    hex: "#6b9fbf",
    hexDim: "#4a7a9e",
    hexBright: "#7ab5d4",
    rgb: "107,159,191",
  },
  {
    name: "purple",
    label: "Violet",
    hex: "#9f6bbf",
    hexDim: "#7a4a9e",
    hexBright: "#b47ad4",
    rgb: "159,107,191",
  },
  {
    name: "amber",
    label: "Amber",
    hex: "#c3a868",
    hexDim: "#a08840",
    hexBright: "#d4bd82",
    rgb: "195,168,104",
  },
];

function createThemeStore() {
  const saved = browser
    ? (localStorage.getItem("accent") as Accent | null)
    : null;
  const initial = ACCENTS.find((a) => a.name === saved) ?? ACCENTS[0];
  const { subscribe, set } = writable<AccentConfig>(initial);

  function applyAccent(acc: AccentConfig) {
    if (!browser) return;
    const r = document.documentElement;
    r.style.setProperty("--green", acc.hex);
    r.style.setProperty("--green-dim", acc.hexDim);
    r.style.setProperty("--green-bright", acc.hexBright);
    r.style.setProperty("--green-glow", `rgba(${acc.rgb},0.15)`);
    r.style.setProperty("--green-faint", `rgba(${acc.rgb},0.06)`);
    r.style.setProperty("--green-mid", `rgba(${acc.rgb},0.10)`);
    r.style.setProperty("--border", `rgba(${acc.rgb},0.10)`);
    r.style.setProperty("--border2", `rgba(${acc.rgb},0.20)`);
    r.style.setProperty("--border3", `rgba(${acc.rgb},0.35)`);
    localStorage.setItem("accent", acc.name);
  }

  if (browser) applyAccent(initial);

  return {
    subscribe,
    setAccent(acc: AccentConfig) {
      set(acc);
      applyAccent(acc);
    },
  };
}

export const theme = createThemeStore();
