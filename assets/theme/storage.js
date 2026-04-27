export let saveSettings = false;

const toggle = document.querySelector(".toggle");

// Load toggle state
saveSettings = localStorage.getItem("semsey-save-enabled") === "true";
if (saveSettings) toggle.classList.add("active");

// Toggle behavior
toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  saveSettings = toggle.classList.contains("active");

  localStorage.setItem("semsey-save-enabled", saveSettings);

  if (!saveSettings) {
    localStorage.removeItem("semsey-theme");
  }
});

// Clear saved settings
const clearBtn = document.getElementById("clearSettings");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("semsey-theme");
    localStorage.removeItem("semsey-save-enabled");

    toggle.classList.remove("active");
    saveSettings = false;

    location.reload();
  });
}
