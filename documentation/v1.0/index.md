# index.html

## 1. What it does
`index.html` serves as the primary landing page (Home) for Semsey Technologies. It introduces the brand, displays the core tagline and philosophy, and provides high-level navigation to the rest of the site's ecosystem (About, Projects, etc.).

## 2. Why it does it
The homepage is designed to establish the "Cyber Neon" aesthetic immediately. It uses a minimalist "Hero" layout to focus the user's attention on the brand identity (the dynamic logo) and the mission statement ("I build systems, theories, and tools"). It also acts as the entry point for PWA installation.

## 3. How it does it
- **Dynamic Logo:** Uses an `<img>` tag with an ID of `siteLogo`. The source and filters (glow/pulse) are injected at runtime by `theme.js` based on user preferences.
- **Theme Integration:** Imports `theme.css`, `hero.css`, and `animations.css`. It executes an immediate "flash-prevention" script in the `<head>` to apply the user's saved theme before the body renders.
- **PWA Logic:** Includes a script to handle the `beforeinstallprompt` event, which unhides the "Add to Device" button if the site is installable.
- **Background Layer:** Contains a `#bgLayer` div which is targeted by the theme's motion engine to create animated backgrounds (Drift, Pulse, etc.).

## 4. Overall role
It is the "Root" of the application. Every other page is a branch from this file. It sets the technical and visual baseline for the entire user experience.

## Version History
| Version | Change Description | Author |
| :--- | :--- | :--- |
| 1.0 | Initial documentation; added PWA "Add to Device" button logic and modular theme loading. | Claude AI |
