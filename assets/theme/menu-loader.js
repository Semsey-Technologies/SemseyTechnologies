/**
 * Universal Menu Loader
 * Guaranteed to attach a menu to the DOM in any mode/preset.
 */
export async function loadUniversalMenu() {
    const container = document.getElementById("nav-container");
    if (!container) {
        console.error("CRITICAL: #nav-container not found on this page. Menu cannot attach.");
        return;
    }

    const isRetro = localStorage.getItem("semsey-retro-mode") === "true";
    let menuPath = "menus/default.html";

    if (isRetro) {
        const presetName = localStorage.getItem("semsey-retro-preset") || "GeoCities Deluxe";
        const presetMap = {
            "GeoCities Deluxe": "geocities",
            "Neon Cyber Arcade": "arcade",
            "ShapeShifter UI": "shapeshifter",
            "Retro Dial Navigator": "dial",
            "Applet Control Panel": "applet"
        };
        const presetId = presetMap[presetName] || "geocities";
        menuPath = `menus/90s/${presetId}.html`;
    }

    try {
        const response = await fetch(menuPath);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch menu fragment.`);

        const html = await response.text();
        if (!html.trim()) throw new Error("Empty menu fragment received.");

        container.innerHTML = html;

        // Post-load initialization
        if (!isRetro) {
            highlightActiveLink(container);

            // Re-apply navigation placement now that .sidebar exists
            // We use a custom event to avoid circular dependencies with theme.js
            document.dispatchEvent(new CustomEvent('menuLoaded', { detail: { container } }));
        } else {
            init90sMenuBehaviors(container);
        }

    } catch (err) {
        console.error(`MenuLoader Failure: [${menuPath}]`, err);
        renderRecoveryMenu(container);
    }
}

/**
 * Fallback menu in case of total failure
 */
function renderRecoveryMenu(container) {
    container.innerHTML = `
        <div class="recovery-menu" style="
            position: fixed; top: 0; left: 0; width: 100%; z-index: 99999;
            background: #c0c0c0; border-bottom: 3px outset #fff;
            padding: 10px; font-family: 'Courier New', monospace; color: #000;
            display: flex; justify-content: space-around; align-items: center;
        ">
            <strong>[SYSTEM RECOVERY MENU]</strong>
            <a href="index.html" style="color: blue; text-decoration: underline;">HOME.HTM</a>
            <a href="settings.html" style="color: blue; text-decoration: underline;">SETUP.BAT</a>
            <button onclick="localStorage.setItem('semsey-retro-mode', 'false'); location.reload();"
                    style="background:#c0c0c0; border:2px outset #fff; padding:2px 10px; cursor:pointer;">
                RESET_ENGINE
            </button>
        </div>
    `;
}

/**
 * Modern mode active link highlighting
 */
function highlightActiveLink(container) {
    const path = window.location.pathname.split("/").pop() || "index.html";
    const links = container.querySelectorAll("a");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === path) {
            link.classList.add("active");
        }
    });
}

/**
 * Special 90s interaction logic (sounds, specific preset hacks)
 */
function init90sMenuBehaviors(container) {
    // Ensure 90s exit button works immediately without global scripts
    const exitBtn = container.querySelector(".exit-btn, .quit, .exit");
    if (exitBtn) {
        exitBtn.onclick = (e) => {
            if (exitBtn.tagName === 'A') e.preventDefault();
            localStorage.setItem("semsey-retro-mode", "false");
            location.reload();
        };
    }
}
