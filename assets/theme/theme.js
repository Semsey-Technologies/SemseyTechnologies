// assets/theme/theme.js
import { presets } from "./presets.js";
import { initRetroEngine, applyRetroPreset } from "./retro90s.js";
import { loadUniversalMenu } from "./menu-loader.js";

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
   APPLY SAVED THEME (Dispatcher)
-------------------------------------------------- */

export function applySavedTheme() {
  const isRetro = localStorage.getItem("semsey-retro-mode") === "true";

  // High-level switch between engines
  if (isRetro) {
    initRetroEngine(); // Let retro engine take full control
    return;
  }

  // Modern Engine Application
  const saved = loadSavedTheme();
  const defaultPreset = presets["Neon Blue"];

  // 1. Initial Reset to Base Preset
  if (defaultPreset) {
    for (const key in defaultPreset) {
      document.documentElement.style.setProperty(key, defaultPreset[key]);
    }
  }

  // 2. Apply Custom Overrides
  for (const key in saved) {
    if (saved[key]) {
      document.documentElement.style.setProperty(key, saved[key]);
    }
  }

  // 3. Guarantee critical variable defaults
  const docStyle = document.documentElement.style;
  if (!docStyle.getPropertyValue("--motion-intensity")) docStyle.setProperty("--motion-intensity", "100");
  if (!docStyle.getPropertyValue("--logo-glow")) docStyle.setProperty("--logo-glow", "0.6");
  if (!docStyle.getPropertyValue("--glass-strength")) docStyle.setProperty("--glass-strength", "0");

  // 4. Force Dataset Attributes for CSS logic
  const glass = saved["--glass-enabled"] || "off";
  document.documentElement.dataset.glass = glass;

  // 5. Update Asset Sources
  applyLogoSource();
  applyCogSource();

  // 6. Universal Menu Initialization
  loadUniversalMenu();

  // Listen for menu load to re-apply placement
  document.addEventListener('menuLoaded', () => {
    applySavedNav();
  });

  // 7. Initialize Reading Level State
  const isSimple = localStorage.getItem("semsey-simple-mode") === "true";
  if (isSimple) {
    document.documentElement.classList.add("simple-mode");
  } else {
    document.documentElement.classList.remove("simple-mode");
  }

  // 8. Ensure Retro Engine is purged if we just came from it
  initRetroEngine();
}

/* --------------------------------------------------
   READING LEVEL (Academic vs Simple)
-------------------------------------------------- */

export function initReadingLevel() {
  const isSimple = localStorage.getItem("semsey-simple-mode") === "true";
  const toggleBtn = document.getElementById("readingLevelToggle");

  if (toggleBtn && !toggleBtn.dataset.initialized) {
    toggleBtn.dataset.initialized = "true";
    updateToggleText(toggleBtn, isSimple);

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isNowSimple = document.documentElement.classList.toggle("simple-mode");

      // Update local storage and UI
      localStorage.setItem("semsey-simple-mode", isNowSimple);
      updateToggleText(toggleBtn, isNowSimple);
    });
  }
}

function updateToggleText(btn, isSimple) {
  if (!btn) return;
  btn.innerHTML = isSimple
    ? '<span class="icon">🧬</span> View Academic Version'
    : '<span class="icon">💡</span> View Simple Version';
}

/* --------------------------------------------------
   BACK TO TOP (Guaranteed Placement)
-------------------------------------------------- */

export function initBackToTop() {
  if (document.querySelector(".back-to-top")) return;

  if (!document.body) {
    window.addEventListener('DOMContentLoaded', initBackToTop);
    return;
  }

  const btn = document.createElement("div");
  btn.className = "back-to-top";
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
  document.body.appendChild(btn);

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });
}

// Global auto-init for utility components
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
  initBackToTop();
}

/* --------------------------------------------------
   PRESET CONTROLLER (NORMAL MODE)
-------------------------------------------------- */

export function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  const currentSaved = loadSavedTheme();
  const style = document.documentElement.style;

  // Capture current non-color variables to prevent reset of core settings
  const persistent = {
    "--logo-src": currentSaved["--logo-src"] || style.getPropertyValue("--logo-src"),
    "--cog-src": currentSaved["--cog-src"] || style.getPropertyValue("--cog-src"),
    "--glass-enabled": currentSaved["--glass-enabled"] || document.documentElement.dataset.glass || "off",
    "--logo-pulse": currentSaved["--logo-pulse"] || "off",
    "--motion-mode": "static",
    "--motion-intensity": style.getPropertyValue("--motion-intensity") || "100",
    "--logo-glow": style.getPropertyValue("--logo-glow") || "0.6",
    "--glass-strength": style.getPropertyValue("--glass-strength") || "0"
  };

  // Wipe current style sheet clean
  document.documentElement.removeAttribute("style");

  // Load new preset
  for (const key in preset) {
    document.documentElement.style.setProperty(key, preset[key]);
  }

  // Restore persistent settings
  for (const key in persistent) {
    if (persistent[key]) document.documentElement.style.setProperty(key, persistent[key]);
  }

  applyLogoSource();
  applyCogSource();

  if (isSavingEnabled()) {
    const toSave = { ...preset, ...persistent };
    saveThemeVars(toSave);
  }
}

/* --------------------------------------------------
   VARIABLE UPDATERS
-------------------------------------------------- */

export function updateVar(name, value) {
  document.documentElement.style.setProperty(name, value);
  if (isSavingEnabled()) {
    const saved = loadSavedTheme();
    saved[name] = value;
    saveThemeVars(saved);
  }
}

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

export function setLogoGlow(val) {
  updateVar("--logo-glow", String(val).trim());
}

export function setLogoPulse(val) {
  updateVar("--logo-pulse", String(val).trim());
  const logo = document.getElementById("siteLogo");
  if (logo) logo.setAttribute("data-pulse", val);
}

/* --------------------------------------------------
   NAVIGATION PLACEMENT (NORMAL MODE ONLY)
-------------------------------------------------- */

export function setNavPlacement(mode) {
  document.documentElement.dataset.navPlacement = mode;
  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  // The actual sidebar is inside the container
  const sidebar = navContainer.querySelector(".sidebar");
  if (!sidebar) return;

  sidebar.classList.remove("right", "top", "bottom");
  if (mode === "right") sidebar.classList.add("right");
  if (mode === "top") sidebar.classList.add("top");
  if (mode === "bottom") sidebar.classList.add("bottom");

  localStorage.setItem("semsey-nav", mode);
}

export function setNavType(type) {
  document.documentElement.dataset.navType = type;
  if (type === "hamburger" || type === "orb") initNavTrigger();
  localStorage.setItem("semsey-nav-type", type);
}

export function applySavedNav() {
  const savedPlacement = localStorage.getItem("semsey-nav") || "left";
  const savedType = localStorage.getItem("semsey-nav-type") || "bottom";
  setNavPlacement(savedPlacement);
  setNavType(savedType);
  initReadingLevel();
}

export function initNavTrigger() {
  if (document.querySelector(".nav-trigger")) return;
  const trigger = document.createElement("button");
  trigger.className = "nav-trigger";
  trigger.innerHTML = "<span>+</span>";
  document.body.appendChild(trigger);
  trigger.onclick = () => document.documentElement.classList.toggle("nav-open");
}

/* --------------------------------------------------
   ASSET DYNAMIC SOURCE LOADING
-------------------------------------------------- */

export function applyLogoSource() {
  const logo = document.getElementById("siteLogo");
  if (!logo) return;
  const style = getComputedStyle(document.documentElement);
  let src = style.getPropertyValue("--logo-src").trim();
  src = src.replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  if (src) {
    if (src.startsWith("http") || src.startsWith("assets/")) {
      logo.src = src;
    } else if (src.startsWith("../")) {
      logo.src = "assets/" + src.replace(/^\.\.\//, "");
    } else {
      logo.src = src;
    }
  }
}

export function setLogoSource(path) {
  updateVar("--logo-src", `url("${path}")`);
  applyLogoSource();
}

export function applyCogSource() {
  const cog = document.querySelector(".settings-cog");
  if (!cog) return;
  const style = getComputedStyle(document.documentElement);
  let src = style.getPropertyValue("--cog-src").trim();
  if (src && src !== "initial") {
    if (!src.startsWith("url(")) src = `url("${src}")`;
    cog.style.backgroundImage = src;
  }
}

export function setCogSource(path) {
  updateVar("--cog-src", `url("${path}")`);
  applyCogSource();
}

// Export for site-wide use
export { applyRetroPreset };
