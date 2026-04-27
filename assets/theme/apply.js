import { saveSettings } from "./storage.js";
import { presets } from "./presets.js";

export function updateVar(name, value) {
  document.documentElement.style.setProperty(name, value);

  if (saveSettings) {
    const saved = JSON.parse(localStorage.getItem("semsey-theme") || "{}");
    saved[name] = value;
    localStorage.setItem("semsey-theme", JSON.stringify(saved));
  }
}

export function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  localStorage.removeItem("semsey-theme");

  for (const key in preset) {
    document.documentElement.style.setProperty(key, preset[key]);
  }

  if (saveSettings) {
    localStorage.setItem("semsey-theme", JSON.stringify(preset));
  }
}
