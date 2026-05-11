import { retroPresets } from './retro-presets.js';
import { loadUniversalMenu } from './menu-loader.js';

/**
 * RETRO 90S THEME ENGINE
 * A robust, modular system for early-web aesthetics.
 */
class Retro90sThemeEngine {
  constructor() {
    this.currentPreset = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the engine
   */
  init() {
    const isRetro = localStorage.getItem("semsey-retro-mode") === "true";
    if (!isRetro) {
      this.shutdown();
      return;
    }

    document.documentElement.dataset.themeEngine = "retro90s";

    // Load styles
    this.ensureStyles();

    // Determine initial preset
    const savedPreset = localStorage.getItem("semsey-retro-preset") || "GeoCities Deluxe";
    this.applyPreset(savedPreset);

    this.isInitialized = true;
  }

  /**
   * Shutdown engine and revert to default
   */
  shutdown() {
    document.documentElement.dataset.themeEngine = "default";
    document.documentElement.removeAttribute("data-retro-preset");
    document.body.removeAttribute("data-layout");

    const styles = document.getElementById("retroStyles");
    if (styles) styles.remove();

    // Clear the nav container so the modern menu can reload
    const nav = document.getElementById("nav-container");
    if (nav) nav.innerHTML = "";

    this.isInitialized = false;
  }

  /**
   * Apply a specific 90s preset
   */
  applyPreset(name) {
    const config = retroPresets[name];
    if (!config) {
      console.error(`Retro90sEngine: Preset "${name}" not found. Falling back to GeoCities.`);
      if (name !== "GeoCities Deluxe") this.applyPreset("GeoCities Deluxe");
      return;
    }

    this.currentPreset = name;
    document.documentElement.dataset.retroPreset = config.id;
    localStorage.setItem("semsey-retro-preset", name);

    // 1. Update Layout structure
    document.body.dataset.layout = config.layout;

    // 2. Apply CSS Tokens (Colors, Fonts, etc)
    for (const [key, val] of Object.entries(config.vars)) {
      document.documentElement.style.setProperty(key, val);
    }

    // 3. Load Menu Fragment via Universal Loader
    loadUniversalMenu();

    // 4. Load Textures & Sound profiles (Placeholders for future asset expansion)
    this.applyTextures(config.texturePack);
    this.loadSounds(config.soundProfile);
  }

  /**
   * Ensure the CSS engine is loaded
   */
  ensureStyles() {
    if (!document.getElementById("retroStyles")) {
      const link = document.createElement("link");
      link.id = "retroStyles";
      link.rel = "stylesheet";
      link.href = "assets/theme/retro90s.css";
      document.head.appendChild(link);
    }
  }

  /**
   * Placeholder for Sound Manager
   */
  loadSounds(profile) {
    // future implementation for mechanical clicks, midi tracks, etc.
  }

  /**
   * Placeholder for Texture Manager
   */
  applyTextures(pack) {
    // future implementation for animated gif backgrounds, etc.
  }
}

// Global instance
export const retroEngine = new Retro90sThemeEngine();

/**
 * Entry points for site-wide use
 */
export function initRetroEngine() {
  retroEngine.init();
}

export function applyRetroPreset(name) {
  retroEngine.applyPreset(name);
}
