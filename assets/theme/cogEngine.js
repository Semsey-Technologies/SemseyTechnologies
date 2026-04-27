export function setCogStyle(styleIndex) {
  const cogImg = document.querySelector(".settings-cog img, .settings-cog");
  if (!cogImg) return;

  const src =
    styleIndex >= 1 && styleIndex <= 5
      ? `assets/images/cog/cog${styleIndex}.png`
      : `assets/images/cog/cog.png`;

  cogImg.src = src;

  // Save preference
  localStorage.setItem("selectedCog", styleIndex);
}

export function loadSavedCog() {
  const saved = localStorage.getItem("selectedCog");
  if (saved !== null) setCogStyle(saved);
}
