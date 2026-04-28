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
  const defaultPreset = presets["Neon Blue"];

  // 1. Always apply default preset first to ensure all required variables exist
  if (defaultPreset) {
    for (const key in defaultPreset) {
      document.documentElement.style.setProperty(key, defaultPreset[key]);
    }
  }

  // 2. Overlay saved theme values (if any)
  for (const key in saved) {
    if (saved[key]) {
      document.documentElement.style.setProperty(key, saved[key]);
    }
  }

  // 3. Ensure critical functional defaults exist if not in saved
  const docStyle = document.documentElement.style;
  if (!docStyle.getPropertyValue("--motion-intensity")) docStyle.setProperty("--motion-intensity", "100");
  if (!docStyle.getPropertyValue("--logo-glow")) docStyle.setProperty("--logo-glow", "0.6");
  if (!docStyle.getPropertyValue("--glass-strength")) docStyle.setProperty("--glass-strength", "0");

  // 4. Apply functional attributes
  const bg = document.getElementById("bgLayer");
  if (bg) {
    const motion = saved["--motion-mode"] || "static";
    bg.setAttribute("motion", motion);
  }

  const logo = document.getElementById("siteLogo");
  if (logo) {
    const pulse = saved["--logo-pulse"] || "off";
    logo.setAttribute("data-pulse", pulse);
  }

  const glass = saved["--glass-enabled"] || "off";
  document.documentElement.dataset.glass = glass;

  // 5. Update sources
  applyLogoSource();
  applyCogSource();
}

/* --------------------------------------------------
   BACK TO TOP FUNCTIONALITY
-------------------------------------------------- */

export function initBackToTop() {
  if (document.querySelector(".back-to-top")) return;

  // If called in <head>, wait for body to exist
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

// Automatically initialize Back to Top on all pages
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackToTop);
} else {
  initBackToTop();
}

/* --------------------------------------------------
   PWA SERVICE WORKER REGISTRATION
-------------------------------------------------- */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register if on a real host or specifically requested
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
       navigator.serviceWorker.register('./sw.js')
         .then(reg => console.log('Service Worker registered'))
         .catch(err => console.log('Service Worker registration failed', err));
    }
  });
}

/* --------------------------------------------------
   APPLY PRESET
-------------------------------------------------- */

export function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  // 1. Capture current persistent identity variables before clearing
  const currentSaved = loadSavedTheme();
  const style = document.documentElement.style;

  const persistent = {
    "--logo-src": currentSaved["--logo-src"] || style.getPropertyValue("--logo-src"),
    "--cog-src": currentSaved["--cog-src"] || style.getPropertyValue("--cog-src"),
    "--glass-enabled": currentSaved["--glass-enabled"] || document.documentElement.dataset.glass || "off",
    "--logo-pulse": currentSaved["--logo-pulse"] || document.getElementById("siteLogo")?.getAttribute("data-pulse") || "off",
    "--motion-mode": currentSaved["--motion-mode"] || document.getElementById("bgLayer")?.getAttribute("motion") || "static",
    "--motion-intensity": currentSaved["--motion-intensity"] || style.getPropertyValue("--motion-intensity") || "100",
    "--logo-glow": currentSaved["--logo-glow"] || style.getPropertyValue("--logo-glow") || "0.6",
    "--glass-strength": currentSaved["--glass-strength"] || style.getPropertyValue("--glass-strength") || "0"
  };

  // 2. Clear document style to remove custom color overrides
  document.documentElement.removeAttribute("style");

  // 3. Apply preset variables
  for (const key in preset) {
    document.documentElement.style.setProperty(key, preset[key]);
  }

  // 4. Re-apply persistent variables
  for (const key in persistent) {
    if (persistent[key] && persistent[key] !== "") {
      if (key === "--glass-enabled") {
        document.documentElement.dataset.glass = persistent[key];
      } else if (key === "--logo-pulse") {
        const logoEl = document.getElementById("siteLogo");
        if (logoEl) logoEl.setAttribute("data-pulse", persistent[key]);
      } else if (key === "--motion-mode") {
        const bgEl = document.getElementById("bgLayer");
        if (bgEl) bgEl.setAttribute("motion", persistent[key]);
      } else {
        document.documentElement.style.setProperty(key, persistent[key]);
      }
    }
  }

  applyLogoSource();
  applyCogSource();

  // 5. Save the merged state if saving is enabled
  if (isSavingEnabled()) {
    const toSave = { ...preset };
    for (const key in persistent) {
      if (persistent[key]) toSave[key] = persistent[key];
    }
    saveThemeVars(toSave);
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

  // Fix Hero Positioning based on nav placement
  const path = window.location.pathname;
  const isHome = path.endsWith("/") || path.endsWith("index.html") || path.split("/").pop() === "";

  if (isHome) {
    const hero = document.querySelector(".hero");
    if (hero) {
      // Use standard CSS margin if not top/bottom, adjust only for collision
      if (mode === "top") {
        hero.style.marginTop = "40px";
      } else if (mode === "bottom") {
        hero.style.marginTop = "-100px";
      } else {
        hero.style.marginTop = ""; // Revert to hero.css default (-180px)
      }
    }
  }

  localStorage.setItem("semsey-nav", mode);
}

export function setNavType(type) {
  document.documentElement.dataset.navType = type;

  // Ensure trigger exists if switching to hamburger/orb
  if (type === "hamburger" || type === "orb") {
    initNavTrigger();
  }

  localStorage.setItem("semsey-nav-type", type);
}

export function applySavedNav() {
  const savedPlacement = localStorage.getItem("semsey-nav") || "left";
  const savedType = localStorage.getItem("semsey-nav-type") || "bottom";
  setNavPlacement(savedPlacement);
  setNavType(savedType);
  initNavScrollIndicators();
  initNavTrigger();
}

/* --------------------------------------------------
   MOBILE NAV SCROLL INDICATORS
-------------------------------------------------- */

function initNavScrollIndicators() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  const updateIndicators = () => {
    const scrollLeft = sidebar.scrollLeft;
    const maxScroll = sidebar.scrollWidth - sidebar.clientWidth;

    sidebar.classList.toggle("scrolled-left", scrollLeft > 10);
    sidebar.classList.toggle("scrolled-right", scrollLeft < maxScroll - 10);
  };

  sidebar.addEventListener("scroll", updateIndicators);
  window.addEventListener("resize", updateIndicators);
  // Initial check
  setTimeout(updateIndicators, 100);
}

/* --------------------------------------------------
   NAV TRIGGER (Hamburger/Orb)
-------------------------------------------------- */

export function initNavTrigger() {
  // Check if trigger already exists
  if (document.querySelector(".nav-trigger")) {
     bindSidebarLinks();
     return;
  }

  const trigger = document.createElement("button");
  trigger.className = "nav-trigger";
  trigger.innerHTML = "<span>+</span>";
  document.body.appendChild(trigger);

  trigger.addEventListener("click", () => {
    document.documentElement.classList.toggle("nav-open");
  });

  bindSidebarLinks();
}

function bindSidebarLinks() {
  const links = document.querySelectorAll(".sidebar a");
  links.forEach(link => {
    link.removeEventListener("click", closeMenu);
    link.addEventListener("click", closeMenu);
  });
}

function closeMenu() {
  document.documentElement.classList.remove("nav-open");
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
    if (src.startsWith("http") || src.startsWith("assets/")) {
      logo.src = src;
    }
    else if (src.startsWith("../")) {
      logo.src = "assets/" + src.replace(/^\.\.\//, "");
    } else {
      logo.src = src;
    }

    // Update Favicon and Apple Touch Icon to match
    applyFavicon(logo.src);
  }
}

function applyFavicon(src) {
  // Update standard favicon
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = src;

  // Update Apple touch icon
  let appleLink = document.querySelector("link[rel='apple-touch-icon']");
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.getElementsByTagName('head')[0].appendChild(appleLink);
  }
  appleLink.href = src;
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
  let src = style.getPropertyValue("--cog-src").trim();

  if (src && src !== "initial") {
    // If it doesn't already have url() around it, add it
    if (!src.startsWith("url(")) {
      src = `url("${src}")`;
    }
    cog.style.backgroundImage = src;
  }
}
