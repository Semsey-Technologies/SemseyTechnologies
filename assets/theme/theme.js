// assets/theme/theme.js
import { presets } from "./presets.js";

/* --------------------------------------------------
   SAVING HELPERS
-------------------------------------------------- */

export function isSavingEnabled() {
  return localStorage.getItem("semsey-save-enabled") === "true";
}

export function loadSavedTheme() {
  return JSON.parse(localStorage.getItem("semsey-theme") || "{}");
}

export function saveThemeVars(obj) {
  localStorage.setItem("semsey-theme", JSON.stringify(obj));
}

/* --------------------------------------------------
   APPLY SAVED THEME (with default fallback)
-------------------------------------------------- */

export function applySavedTheme() {
  const saved = loadSavedTheme();

  // If saved theme has values, apply them
  if (Object.keys(saved).length > 0) {
    for (const key in saved) {
      document.documentElement.style.setProperty(key, saved[key]);
    }

    // Apply functional attributes
    if (saved["--motion-mode"]) {
      const bg = document.getElementById("bgLayer");
      if (bg) bg.setAttribute("motion", saved["--motion-mode"]);
    }
    if (saved["--logo-pulse"]) {
      const logo = document.getElementById("siteLogo");
      if (logo) logo.setAttribute("data-pulse", saved["--logo-pulse"]);
    }

    // Apply sources immediately
    applyLogoSource();
    applyCogSource();

    return;
  }

  // Otherwise apply default preset (Neon Blue)
  const defaultPreset = presets["Neon Blue"];
  if (defaultPreset) {
    for (const key in defaultPreset) {
      document.documentElement.style.setProperty(key, defaultPreset[key]);
    }
    // Also reset any functional attributes to defaults
    document.documentElement.dataset.glass = "off";
    const bg = document.getElementById("bgLayer");
    if (bg) bg.setAttribute("motion", "static");
    const logo = document.getElementById("siteLogo");
    if (logo) logo.setAttribute("data-pulse", "off");
  }
}

/* --------------------------------------------------
   APPLY PRESET
-------------------------------------------------- */

export function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  // Clear saved theme before applying a new preset
  localStorage.removeItem("semsey-theme");

  // Reset document style before applying new variables to clear old state
  document.documentElement.removeAttribute("style");
  document.documentElement.dataset.glass = "off";

  // Re-apply critical identity vars that aren't in presets
  const logo = loadSavedTheme()["--logo-src"];
  const cog = loadSavedTheme()["--cog-src"];
  if (logo) updateVar("--logo-src", logo);
  if (cog) updateVar("--cog-src", cog);

  applyLogoSource();
  applyCogSource();

  // Apply preset variables
  for (const key in preset) {
    document.documentElement.style.setProperty(key, preset[key]);
  }

  // Update functional attributes if they are in the preset
  if (preset["--motion-mode"]) setMotionMode(preset["--motion-mode"]);
  if (preset["--logo-pulse"]) setLogoPulse(preset["--logo-pulse"]);

  // Save if enabled
  if (isSavingEnabled()) {
    saveThemeVars(preset);
  }
}

/* --------------------------------------------------
   VARIABLE UPDATER
-------------------------------------------------- */

export function updateVar(name, value) {
  document.documentElement.style.setProperty(name, value);

  if (isSavingEnabled()) {
    const saved = loadSavedTheme();
    saved[name] = value;
    saveThemeVars(saved);
  }
}

/* --------------------------------------------------
   GLASS MODE
-------------------------------------------------- */

export function setGlassMode(val) {
  document.documentElement.dataset.glass = val;

  if (isSavingEnabled()) {
    const saved = loadSavedTheme();
    saved["--glass-enabled"] = val;
    saveThemeVars(saved);
  }
}

export function setGlassStrength(val) {
  updateVar("--glass-strength", String(val).trim());
}

/* --------------------------------------------------
   MOTION ENGINE
-------------------------------------------------- */

export function setMotionMode(mode) {
  const bg = document.getElementById("bgLayer");
  if (!bg) return;

  bg.setAttribute("motion", mode);

  if (isSavingEnabled()) {
    const saved = loadSavedTheme();
    saved["--motion-mode"] = mode;
    saveThemeVars(saved);
  }
}

export function setMotionIntensity(val) {
  updateVar("--motion-intensity", String(val).trim());
}

/* --------------------------------------------------
   LOGO GLOW + PULSE
-------------------------------------------------- */

export function setLogoGlow(val) {
  updateVar("--logo-glow", String(val).trim());
}

export function setLogoPulse(val) {
  updateVar("--logo-pulse", String(val).trim());
  const logo = document.getElementById("siteLogo");
  if (logo) logo.setAttribute("data-pulse", val);
}

/* --------------------------------------------------
   NAVIGATION PLACEMENT
-------------------------------------------------- */

export function setNavPlacement(mode) {
  document.documentElement.dataset.navPlacement = mode;
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  sidebar.classList.remove("right", "top", "bottom");
  if (mode === "right") sidebar.classList.add("right");
  if (mode === "top") sidebar.classList.add("top");
  if (mode === "bottom") sidebar.classList.add("bottom");

  // Detect if we are on the homepage (works for local / and GitHub /repo/)
  const path = window.location.pathname;
  const isHome = path.endsWith("/") || path.endsWith("index.html") || path.split("/").pop() === "";

  if (isHome) {
    const hero = document.querySelector(".hero");
    if (hero) {
      if (mode === "top") hero.style.marginTop = "0";
      else if (mode === "bottom") hero.style.marginTop = "-120px";
      else hero.style.marginTop = "-180px";
    }
  }

  if (isSavingEnabled()) {
    localStorage.setItem("semsey-nav", mode);
  }
}

export function applySavedNav() {
  const saved = localStorage.getItem("semsey-nav") || "left";
  setNavPlacement(saved);
}

/* --------------------------------------------------
   LOGO SOURCE LOADER
-------------------------------------------------- */

export function setLogoSource(path) {
  const url = `url("${path}")`;
  updateVar("--logo-src", url);
  applyLogoSource();
}

export function applyLogoSource() {
  const logo = document.getElementById("siteLogo");
  if (!logo) return;

  const style = getComputedStyle(document.documentElement);
  let src = style.getPropertyValue("--logo-src").trim();

  // Clean up url("...") or url('...')
  src = src.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");

  if (src) {
    // If it's already an absolute URL or starts with assets/, don't touch it
    if (src.startsWith("http") || src.startsWith("assets/")) {
      logo.src = src;
    }
    // If it's the CSS-relative path, convert it to HTML-relative
    else if (src.startsWith("../")) {
      // ../images/logo/logo.png -> assets/images/logo/logo.png
      logo.src = "assets/" + src.replace(/^\.\.\//, "");
    } else {
      logo.src = src;
    }
  }
}

/* --------------------------------------------------
   COG SOURCE LOADER
-------------------------------------------------- */

export function setCogSource(path) {
  const url = `url("${path}")`;
  updateVar("--cog-src", url);
  applyCogSource();
}

export function applyCogSource() {
  const cog = document.querySelector(".settings-cog");
  if (!cog) return;

  const style = getComputedStyle(document.documentElement);
  const src = style.getPropertyValue("--cog-src").trim();

  if (src) {
    cog.style.backgroundImage = src;
  }
}
