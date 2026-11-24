/* ==========================================================================
   SemseyTechnologies - Universal Menu Loader (Complete Replacement)
   Loads menus/default.html into #nav-container and dispatches 'menuLoaded'.
   ========================================================================== */

export async function loadUniversalMenu() {
  const container = document.getElementById("nav-container");

  const emitLoaded = () => {
    document.dispatchEvent(new CustomEvent("menuLoaded", { bubbles: true }));
  };

  if (!container) {
    emitLoaded();
    return;
  }

  // Avoid duplicate injection if already populated
  if (container.dataset.menuLoaded === "true" && container.children.length > 0) {
    emitLoaded();
    return;
  }

  const candidates = ["menus/default.html", "/menus/default.html"];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const html = await res.text();
      if (html && html.trim()) {
        container.innerHTML = html;
        container.dataset.menuLoaded = "true";
        emitLoaded();
        return;
      }
    } catch (_) {
      // Try next path
    }
  }

  emitLoaded();
}
