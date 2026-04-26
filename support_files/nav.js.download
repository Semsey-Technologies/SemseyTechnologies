// nav.js

const THEME_KEY = "semsey-theme";
const NAV_STYLE_KEY = "semsey-nav-style";
const CONSENT_KEY = "semsey-consent";

let consentGranted = false;

function safeSetItem(key, value) {
  if (!consentGranted) return;
  try {
    localStorage.setItem(key, value);
  } catch (_) {}
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
}

fetch("nav.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("nav-container").innerHTML = html;
    initConsentAndNav();
  });

function initConsentAndNav() {
  const consentSheet = document.getElementById("consent-sheet");
  const consentAccept = document.getElementById("consent-accept");
  const consentDecline = document.getElementById("consent-decline");

  const storedConsent = safeGetItem(CONSENT_KEY);
  if (storedConsent === "accepted") {
    consentGranted = true;
  } else if (storedConsent === "declined") {
    consentGranted = false;
  } else {
    if (consentSheet) consentSheet.classList.add("visible");
  }

  if (consentAccept) {
    consentAccept.addEventListener("click", () => {
      consentGranted = true;
      safeSetItem(CONSENT_KEY, "accepted");
      if (consentSheet) consentSheet.classList.remove("visible");
      initNavAndTheme();
    });
  }

  if (consentDecline) {
    consentDecline.addEventListener("click", () => {
      consentGranted = false;
      safeSetItem(CONSENT_KEY, "declined");
      if (consentSheet) consentSheet.classList.remove("visible");
      initNavAndTheme();
    });
  }

  if (storedConsent === "accepted" || storedConsent === "declined") {
    initNavAndTheme();
  }
}

function initNavAndTheme() {
  const body = document.body;

  const backdrop = document.getElementById("appearance-backdrop");
  const openBtn = document.getElementById("open-appearance");
  const closeBtn = document.getElementById("close-appearance");
  const applyBtn = document.getElementById("apply-theme");
  const selectEl = document.getElementById("theme-select");
  const navStyleEl = document.getElementById("nav-style-select");
  const previewRow = document.getElementById("theme-preview");

  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const drawer = document.getElementById("drawer");
  const hamburgerBtn = document.getElementById("nav-hamburger");

  const chipLinks = document.querySelectorAll(".nav-links-chip a");
  const drawerLinks = document.querySelectorAll(".drawer-links a");

  function setBodyTheme(theme) {
    body.classList.remove(
      "theme-neon",
      "theme-minimal",
      "theme-light",
      "theme-solarized",
      "theme-mono",
      "theme-terminal",
      "theme-blue"
    );
    body.classList.add(theme);
    updateHamburgerIcon(theme);
  }

  function updateHamburgerIcon(theme) {
    if (!hamburgerBtn) return;
    if (theme === "theme-light") {
      hamburgerBtn.textContent = "⋮";
    } else {
      hamburgerBtn.textContent = "▦";
    }
  }

  function applyNavStyle(navStyle) {
    body.classList.remove("nav-auto", "nav-chip", "nav-drawer", "nav-system");

    switch (navStyle) {
      case "chip":
        body.classList.add("nav-chip");
        break;
      case "drawer":
        body.classList.add("nav-drawer");
        break;
      case "system":
        body.classList.add("nav-system");
        break;
      case "auto":
      default:
        body.classList.add("nav-auto");
        break;
    }
  }

  function loadThemeAndNavStyle() {
    const savedTheme = safeGetItem(THEME_KEY);
    const theme = savedTheme || "theme-neon";
    setBodyTheme(theme);
    if (selectEl) selectEl.value = theme;

    const savedNavStyle = safeGetItem(NAV_STYLE_KEY) || "auto";
    if (navStyleEl) navStyleEl.value = savedNavStyle;
    applyNavStyle(savedNavStyle);
    updatePreview();
  }

  function openModal() {
    if (backdrop) backdrop.classList.add("visible");
  }

  function closeModal() {
    if (backdrop) backdrop.classList.remove("visible");
  }

  function updatePreview() {
    if (!selectEl || !previewRow) return;

    const tempTheme = selectEl.value;
    const prevTheme =
      Array.from(body.classList).find(c => c.startsWith("theme-")) || "theme-neon";

    setBodyTheme(tempTheme);

    const styles = getComputedStyle(document.documentElement);
    const bg = styles.getPropertyValue("--bg").trim();
    const card = styles.getPropertyValue("--card").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    const accent2 = styles.getPropertyValue("--accent2").trim();

    previewRow.querySelector('[data-role="bg"]').style.background = bg;
    previewRow.querySelector('[data-role="card"]').style.background = card;
    previewRow.querySelector('[data-role="accent"]').style.background = accent;
    previewRow.querySelector('[data-role="accent2"]').style.background = accent2;

    setBodyTheme(prevTheme);
  }

  function openDrawer() {
    if (!drawerBackdrop || !drawer) return;
    drawerBackdrop.classList.add("visible");
    drawer.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!drawerBackdrop || !drawer) return;
    drawerBackdrop.classList.remove("visible");
    drawer.classList.remove("visible");
    document.body.style.overflow = "";
  }

  function highlightActiveLinks() {
    const path = window.location.pathname.split("/").pop() || "index.html";

    function markActive(links) {
      links.forEach(link => {
        if (link.getAttribute("href") === path) {
          link.classList.add("active");
        }
      });
    }

    markActive(chipLinks);
    markActive(drawerLinks);
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const theme = selectEl ? selectEl.value : "theme-neon";
      const navStyle = navStyleEl ? navStyleEl.value : "auto";

      setBodyTheme(theme);
      applyNavStyle(navStyle);

      safeSetItem(THEME_KEY, theme);
      safeSetItem(NAV_STYLE_KEY, navStyle);

      closeModal();
      closeDrawer();
    });
  }

  if (selectEl) {
    selectEl.addEventListener("change", updatePreview);
  }

  if (backdrop) {
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) closeModal();
    });
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", () => {
      if (drawerBackdrop && drawerBackdrop.classList.contains("visible")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", e => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  loadThemeAndNavStyle();
  highlightActiveLinks();
}