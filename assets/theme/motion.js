export function applyMotion() {
  const saved = JSON.parse(localStorage.getItem("semsey-theme") || "{}");
  const bgLayer = document.getElementById("bgLayer");

  if (!bgLayer) return;

  const mode = saved["--motion-mode"] || "static";
  const intensity = saved["--motion-intensity"] || 100;

  bgLayer.setAttribute("motion", mode);
  document.documentElement.style.setProperty("--motion-intensity", intensity);
}

document.addEventListener("DOMContentLoaded", applyMotion);
