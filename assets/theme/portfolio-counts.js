/* Automatically calculate project and domain counts from topic pages. */
document.addEventListener("DOMContentLoaded", async () => {
  const directoryCards = [
    ...document.querySelectorAll(".topic-directory-card[href]")
  ];

  const totalDisplay = document.querySelector(".portfolio-count");

  if (!directoryCards.length || !totalDisplay) {
    console.warn("Portfolio counts: directory cards or total display not found.");
    return;
  }

  try {
    const results = await Promise.all(
      directoryCards.map(async (card) => {
        const url = new URL(card.getAttribute("href"), document.baseURI);
        const response = await fetch(url, { cache: "no-cache" });

        if (!response.ok) {
          throw new Error(`Could not load ${url.pathname}: HTTP ${response.status}`);
        }

        const pageHTML = await response.text();
        const page = new DOMParser().parseFromString(pageHTML, "text/html");
        const projectCount = page.querySelectorAll("article.portfolio-card").length;

        return { card, projectCount };
      })
    );

    const totalProjects = results.reduce(
      (total, result) => total + result.projectCount, 0
    );

    const totalDomains = results.length;

    totalDisplay.textContent =
      `${totalProjects} projects across ${totalDomains} domains`;

    for (const { card, projectCount } of results) {
      const footer = card.querySelector(".topic-directory-footer");
      if (!footer) continue;

      const countText = [...footer.childNodes].find(
        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );

      if (countText) {
        countText.textContent =
          `\n          ${projectCount} project${projectCount === 1 ? "" : "s"}\n          `;
      }
    }

    console.info(
      `Portfolio counts updated: ${totalProjects} projects across ${totalDomains} domains.`
    );
  } catch (error) {
    console.error("Portfolio counts were not updated; existing displayed counts remain.", error);
  }
});
