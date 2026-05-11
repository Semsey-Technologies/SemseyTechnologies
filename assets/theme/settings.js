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
  setNavType,
  applySavedNav,
  setLogoSource,
  setCogSource,
  applyRetroPreset
} from "./theme.js";

/**
 * Settings initialization
 */

// 1. Immediate theme application
applySavedTheme();

// 2. Wait for DOM to bind UI
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSettingsPage);
} else {
  initSettingsPage();
}

function initSettingsPage() {
  applySavedNav();
  syncSettingsUI();
  initScrollSpy();
  initListeners();
}

// -----------------------------
// UI SYNCHRONIZATION
// -----------------------------
function syncSettingsUI() {
  const style = getComputedStyle(document.documentElement);
  const getProp = (name) => style.getPropertyValue(name).trim();

  // Sync Colors
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

  // Sync Typography
  if (document.getElementById("fontFamily")) document.getElementById("fontFamily").value = getProp("--font-main") || "system-ui";
  if (document.getElementById("fontSize")) document.getElementById("fontSize").value = parseInt(getProp("--font-size")) || 18;
  if (document.getElementById("fontWeight")) document.getElementById("fontWeight").value = getProp("--font-weight") || "400";
  if (document.getElementById("fontStyle")) document.getElementById("fontStyle").value = getProp("--font-style") || "normal";

  // Sync Glass
  if (document.getElementById("glassMode")) document.getElementById("glassMode").value = document.documentElement.dataset.glass || "off";
  if (document.getElementById("glassStrength")) {
    const strength = parseFloat(getProp("--glass-strength")) || 0;
    document.getElementById("glassStrength").value = strength * 100;
  }

  // Sync Motion
  if (document.getElementById("motionSelect")) {
    const mode = document.getElementById("bgLayer")?.getAttribute("motion") || "static";
    const formatted = mode.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    document.getElementById("motionSelect").value = formatted;
  }
  if (document.getElementById("motionIntensity")) {
    document.getElementById("motionIntensity").value = getProp("--motion-intensity") || 100;
  }

  // Sync Logo Glow & Pulse
  if (document.getElementById("logoGlow")) {
    document.getElementById("logoGlow").value = getProp("--logo-glow") || 0.6;
  }
  if (document.getElementById("logoPulse")) {
    const saved = loadSavedTheme();
    document.getElementById("logoPulse").value = saved["--logo-pulse"] || "off";
  }

  // Sync Navigation Placement
  const currentNav = document.documentElement.dataset.navPlacement || "left";
  document.querySelectorAll("input[name='navPlace']").forEach(radio => {
    const isActive = radio.value === currentNav;
    radio.checked = isActive;
    radio.parentElement.classList.toggle("active", isActive);
  });

  const currentType = document.documentElement.dataset.navType || "bottom";
  document.querySelectorAll("input[name='navType']").forEach(radio => {
    const isActive = radio.value === currentType;
    radio.checked = isActive;
    radio.parentElement.classList.toggle("active", isActive);
  });

  // Sync Identity Images
  const logoSrc = getProp("--logo-src").replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  const cleanLogoSrc = logoSrc.replace(/^\.\.\/\.\.\//, "assets/theme/").replace(/^\.\.\//, "assets/");
  document.querySelectorAll("#logoSelector .img-option").forEach(opt => {
    const optPath = opt.getAttribute("data-path");
    opt.classList.toggle("active", optPath === cleanLogoSrc || optPath === logoSrc);
  });

  const cogSrc = getProp("--cog-src").replace(/^url\(["']?/, "").replace(/["']?\)$/, "");
  const cleanCogSrc = cogSrc.replace(/^\.\.\/\.\.\//, "assets/theme/").replace(/^\.\.\//, "assets/");
  document.querySelectorAll("#cogSelector .img-option").forEach(opt => {
    const optPath = opt.getAttribute("data-path");
    opt.classList.toggle("active", optPath === cleanCogSrc || optPath === cogSrc);
  });

  // Sync Toggles
  const retroToggle = document.getElementById("retroToggle");
  if (retroToggle) {
    const isRetro = localStorage.getItem("semsey-retro-mode") === "true";
    retroToggle.classList.toggle("active", isRetro);

    // Conditional Rendering of Presets based on Engine
    renderPresetsList(isRetro);
  }

  const saveToggle = document.getElementById("saveToggle");
  if (saveToggle) {
    saveToggle.classList.toggle("active", isSavingEnabled());
  }
}

// -----------------------------
// PRESET RENDERING
// -----------------------------
function renderPresetsList(isRetro) {
  const container = document.querySelector("#presets .section-grid");
  if (!container) return;
  container.innerHTML = "";

  if (isRetro) {
    import('./retro-presets.js').then(m => {
      Object.keys(m.retroPresets).forEach(name => {
        const btn = document.createElement("button");
        btn.className = "preset";
        btn.textContent = name;
        btn.onclick = () => {
          applyRetroPreset(name);
          syncSettingsUI();
        };
        container.appendChild(btn);
      });
    });
  } else {
    import('./presets.js').then(m => {
      Object.keys(m.presets).forEach(name => {
        const btn = document.createElement("button");
        btn.className = "preset";
        btn.textContent = name;
        btn.onclick = () => {
          applyPreset(name);
          syncSettingsUI();
        };
        container.appendChild(btn);
      });
    });
  }
}

// -----------------------------
// EVENT LISTENERS
// -----------------------------
function initListeners() {
  // Site-Wide Saving Toggle
  const saveToggle = document.getElementById("saveToggle");
  if (saveToggle) {
    saveToggle.onclick = () => {
      const active = saveToggle.classList.toggle("active");
      localStorage.setItem("semsey-save-enabled", active);
    };
  }

  // Retro 90s Mode Toggle
  const retroToggle = document.getElementById("retroToggle");
  if (retroToggle) {
    retroToggle.onclick = (e) => {
      e.stopPropagation();
      const active = retroToggle.classList.toggle("active");
      localStorage.setItem("semsey-retro-mode", active);
      setTimeout(() => location.reload(), 150);
    };
  }

  // Clear All Settings
  const clearBtn = document.getElementById("clearSettings");
  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem("semsey-theme");
      localStorage.removeItem("semsey-save-enabled");
      localStorage.removeItem("semsey-nav");
      localStorage.removeItem("semsey-nav-type");
      localStorage.removeItem("semsey-retro-mode");
      location.reload();
    };
  }

  // Preset Buttons
  // Managed by renderPresetsList

  // Color Inputs
  const bindColor = (id, varName) => {
    const el = document.getElementById(id);
    if (el) el.oninput = e => updateVar(varName, e.target.value);
  };
  bindColor("accentColor", "--accent");
  bindColor("bg1", "--bg1");
  bindColor("bg2", "--bg2");
  bindColor("bg3", "--bg3");
  bindColor("fontColor", "--fg");

  // Typography
  const bindChange = (id, varName) => {
    const el = document.getElementById(id);
    if (el) el.onchange = e => updateVar(varName, e.target.value);
  };
  bindChange("fontFamily", "--font-main");
  bindChange("fontWeight", "--font-weight");
  bindChange("fontStyle", "--font-style");

  const fontSize = document.getElementById("fontSize");
  if (fontSize) fontSize.oninput = e => updateVar("--font-size", e.target.value + "px");

  // Navigation Desktop
  document.querySelectorAll("input[name='navPlace']").forEach(radio => {
    radio.onchange = e => {
      setNavPlacement(e.target.value);
      syncSettingsUI();
    };
  });

  // Navigation Mobile
  document.querySelectorAll("input[name='navType']").forEach(radio => {
    radio.onchange = e => {
      setNavType(e.target.value);
      syncSettingsUI();
    };
  });

  // Glass Mode
  const glassMode = document.getElementById("glassMode");
  if (glassMode) glassMode.onchange = e => setGlassMode(e.target.value);

  const glassStrength = document.getElementById("glassStrength");
  if (glassStrength) glassStrength.oninput = e => setGlassStrength(e.target.value / 100);

  // Motion
  const motionSelect = document.getElementById("motionSelect");
  if (motionSelect) motionSelect.onchange = e => {
    const mode = e.target.value.toLowerCase().replace(" ", "-");
    setMotionMode(mode);
  };

  const motionIntensity = document.getElementById("motionIntensity");
  if (motionIntensity) motionIntensity.oninput = e => setMotionIntensity(e.target.value);

  // Logo
  const logoGlow = document.getElementById("logoGlow");
  if (logoGlow) logoGlow.oninput = e => setLogoGlow(e.target.value);

  const logoPulse = document.getElementById("logoPulse");
  if (logoPulse) logoPulse.onchange = e => setLogoPulse(e.target.value);

  // Identity
  document.querySelectorAll("#logoSelector .img-option").forEach(opt => {
    opt.onclick = () => {
      setLogoSource(opt.getAttribute("data-path"));
      syncSettingsUI();
    };
  });

  document.querySelectorAll("#cogSelector .img-option").forEach(opt => {
    opt.onclick = () => {
      setCogSource(opt.getAttribute("data-path"));
      syncSettingsUI();
    };
  });
}

// -----------------------------
// SCROLL SPY
// -----------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll(".card[id]");
  const navLinks = document.querySelectorAll("#nav-container a[href^='#'], .sidebar a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}
