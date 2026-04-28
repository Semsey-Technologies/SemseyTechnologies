// assets/theme/settings.js
import {
  applyPreset,
  updateVar,
  applySavedTheme,
  isSavingEnabled,
  loadSavedTheme,
  setGlassMode,
  setGlassStrength,
  setMotionMode,
  setMotionIntensity,
  setLogoGlow,
  setLogoPulse,
  setNavPlacement,
  applySavedNav,
  setLogoSource,
  setCogSource
} from "./theme.js";

// -----------------------------
// INITIAL LOAD BEHAVIOR
// -----------------------------

// 1. If a saved theme exists, auto-load it
applySavedTheme();

// 2. Apply saved nav placement
applySavedNav();

// 3. Sync UI controls to current state
syncSettingsUI();

// -----------------------------
// UI SYNCHRONIZATION
// -----------------------------
function syncSettingsUI() {
  const style = getComputedStyle(document.documentElement);
  const getProp = (name) => style.getPropertyValue(name).trim();

  // Color inputs
  const colors = {
    "accentColor": "--accent",
    "bg1": "--bg1",
    "bg2": "--bg2",
    "bg3": "--bg3",
    "fontColor": "--fg"
  };
  for (const [id, prop] of Object.entries(colors)) {
    const el = document.getElementById(id);
    if (el) el.value = getProp(prop);
  }

  // Typography
  if (document.getElementById("fontFamily")) document.getElementById("fontFamily").value = getProp("--font-main") || "system-ui";
  if (document.getElementById("fontSize")) document.getElementById("fontSize").value = parseInt(getProp("--font-size")) || 18;
  if (document.getElementById("fontWeight")) document.getElementById("fontWeight").value = getProp("--font-weight") || "400";
  if (document.getElementById("fontStyle")) document.getElementById("fontStyle").value = getProp("--font-style") || "normal";

  // Glass
  if (document.getElementById("glassMode")) document.getElementById("glassMode").value = document.documentElement.dataset.glass || "off";
  if (document.getElementById("glassStrength")) {
    const strength = parseFloat(getProp("--glass-strength")) || 0;
    document.getElementById("glassStrength").value = strength * 100;
  }

  // Motion
  if (document.getElementById("motionSelect")) {
    const mode = document.getElementById("bgLayer")?.getAttribute("motion") || "static";
    const formatted = mode.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    document.getElementById("motionSelect").value = formatted;
  }
  if (document.getElementById("motionIntensity")) {
    document.getElementById("motionIntensity").value = getProp("--motion-intensity") || 100;
  }

  // Logo
  if (document.getElementById("logoGlow")) {
    document.getElementById("logoGlow").value = getProp("--logo-glow") || 0.6;
  }
  if (document.getElementById("logoPulse")) {
    const saved = loadSavedTheme();
    document.getElementById("logoPulse").value = saved["--logo-pulse"] || "off";
  }

  // Navigation
  const savedNav = localStorage.getItem("semsey-nav") || "left";
  document.querySelectorAll(".nav-option").forEach(opt => {
    const radio = opt.querySelector("input");
    const isActive = radio.value === savedNav;
    radio.checked = isActive;
    opt.classList.toggle("active", isActive);
  });

  // Identity (Logo/Cog)
  const logoSrc = getProp("--logo-src").replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  document.querySelectorAll("#logoSelector .img-option").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-path") === logoSrc);
  });

  const cogSrc = getProp("--cog-src").replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  document.querySelectorAll("#cogSelector .img-option").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-path") === cogSrc);
  });
}

// -----------------------------
// SAVE SETTINGS TOGGLE
// -----------------------------
const saveToggle = document.getElementById("saveToggle");

if (isSavingEnabled()) {
  saveToggle.classList.add("active");
}

saveToggle.addEventListener("click", () => {
  saveToggle.classList.toggle("active");
  const enabled = saveToggle.classList.contains("active");
  localStorage.setItem("semsey-save-enabled", enabled);
});

// -----------------------------
// CLEAR SETTINGS
// -----------------------------
document.getElementById("clearSettings").addEventListener("click", () => {
  localStorage.removeItem("semsey-theme");
  localStorage.removeItem("semsey-save-enabled");
  localStorage.removeItem("semsey-nav");
  location.reload();
});

// -----------------------------
// PRESET BUTTONS
// -----------------------------
document.querySelectorAll(".preset").forEach(btn => {
  btn.addEventListener("click", () => {
    applyPreset(btn.dataset.preset);
    syncSettingsUI(); // Refresh UI after preset
  });
});

// -----------------------------
// CUSTOM THEME CONTROLS
// -----------------------------
document.getElementById("accentColor").addEventListener("input", e => {
  updateVar("--accent", e.target.value);
});

document.getElementById("bg1").addEventListener("input", e => {
  updateVar("--bg1", e.target.value);
});

document.getElementById("bg2").addEventListener("input", e => {
  updateVar("--bg2", e.target.value);
});

document.getElementById("bg3").addEventListener("input", e => {
  updateVar("--bg3", e.target.value);
});

// -----------------------------
// TYPOGRAPHY
// -----------------------------
document.getElementById("fontFamily").addEventListener("change", e => {
  updateVar("--font-main", e.target.value);
});

document.getElementById("fontSize").addEventListener("input", e => {
  updateVar("--font-size", e.target.value + "px");
});

document.getElementById("fontColor").addEventListener("input", e => {
  updateVar("--fg", e.target.value);
});

document.getElementById("fontWeight").addEventListener("change", e => {
  updateVar("--font-weight", e.target.value);
});

document.getElementById("fontStyle").addEventListener("change", e => {
  updateVar("--font-style", e.target.value);
});

// -----------------------------
// NAVIGATION PLACEMENT
// -----------------------------
document.querySelectorAll("input[name='navPlace']").forEach(radio => {
  radio.addEventListener("change", e => {
    setNavPlacement(e.target.value);
    syncSettingsUI();
  });
});

// -----------------------------
// GLASS MODE
// -----------------------------
document.getElementById("glassMode").addEventListener("change", e => {
  setGlassMode(e.target.value);
});

document.getElementById("glassStrength").addEventListener("input", e => {
  setGlassStrength(e.target.value / 100);
});

// -----------------------------
// MOTION
// -----------------------------
document.getElementById("motionSelect").addEventListener("change", e => {
  const mode = e.target.value.toLowerCase().replace(" ", "-");
  setMotionMode(mode);
});

document.getElementById("motionIntensity").addEventListener("input", e => {
  setMotionIntensity(e.target.value);
});

// -----------------------------
// LOGO GLOW + PULSE
// -----------------------------
document.getElementById("logoGlow").addEventListener("input", e => {
  setLogoGlow(e.target.value);
});

document.getElementById("logoPulse").addEventListener("change", e => {
  setLogoPulse(e.target.value);
});

// -----------------------------
// BRAND IDENTITY (LOGO/COG)
// -----------------------------
document.querySelectorAll("#logoSelector .img-option").forEach(opt => {
  opt.addEventListener("click", () => {
    setLogoSource(opt.getAttribute("data-path"));
    syncSettingsUI();
  });
});

document.querySelectorAll("#cogSelector .img-option").forEach(opt => {
  opt.addEventListener("click", () => {
    setCogSource(opt.getAttribute("data-path"));
    syncSettingsUI();
  });
});
