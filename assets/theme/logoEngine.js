// logoEngine.js — unified logo style + glow + pulse loader

// Apply a specific logo style (logo1.png, logo2.png, etc.)
export function setLogoStyle(styleIndex) {
  const logo = document.getElementById("siteLogo");
  if (!logo) return;

  const src =
    styleIndex >= 1 && styleIndex <= 3
      ? `assets/images/logo/logo${styleIndex}.png`
      : `assets/images/logo/logo.png`;

  logo.src = src;

  // Save selected style
  localStorage.setItem("selectedLogo", styleIndex);
}

// Load saved logo style + glow + pulse
export function loadSavedLogo() {
  const savedTheme = JSON.parse(localStorage.getItem("semsey-theme") || "{}");
  const savedStyle = localStorage.getItem("selectedLogo");
  const logo = document.getElementById("siteLogo");

  if (!logo) return;

  // 1. Apply saved logo style
  if (savedStyle !== null) {
    const index = parseInt(savedStyle);
    const src =
      index >= 1 && index <= 3
        ? `assets/images/logo/logo${index}.png`
        : `assets/images/logo/logo.png`;
    logo.src = src;
  }

  // 2. Apply glow intensity (bulletproof)
  if (savedTheme.hasOwnProperty("--logo-glow")) {
    const glowValue = savedTheme["--logo-glow"].toString();
    document.documentElement.style.setProperty("--logo-glow", glowValue);
  }

  // 3. Apply pulse state
  if (savedTheme.hasOwnProperty("--logo-pulse")) {
    logo.dataset.pulse = savedTheme["--logo-pulse"];
  }
}
