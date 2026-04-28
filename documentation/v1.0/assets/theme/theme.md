# assets/theme/theme.js

## 1. What it does
`theme.js` is the core logic engine for the website's dynamic styling and personalization. It handles the application of theme presets, user-defined color overrides, brand identity assets (logos/cogs), and PWA service worker registration.

## 2. Why it does it
To provide a cohesive and persistent user experience. By centralizing the theme logic, the site can ensure that a user's chosen aesthetic is maintained across every sub-page without requiring a server-side backend. It also enables the site to behave as a PWA by registering the service worker.

## 3. How it does it
- **Persistence:** Uses `localStorage` to save and retrieve a JSON object containing CSS variable overrides.
- **Theme Application:** The `applySavedTheme` function reads from storage and uses `document.documentElement.style.setProperty` to inject variables directly into the `:root` scope.
- **Brand Sync:** `applyLogoSource` and `applyCogSource` handle the path resolution for dynamic images and automatically update the browser's favicon and Apple Touch Icon to match the user's selected logo.
- **Navigation Engine:** Manages desktop and mobile navigation layouts (Sidebar, Top, Bottom, Hamburger, Orb) by manipulating data-attributes on the `<html>` element and adding/removing helper classes.
- **PWA Registration:** Detects service worker support and registers `sw.js` on page load.

## 4. Overall role
It is the "Brain" of the website's front-end. It bridges the gap between the static HTML/CSS files and the user's personal preferences, turning a static site into a dynamic, personalized application.

## Version History
| Version | Change Description | Author |
| :--- | :--- | :--- |
| 1.0 | Initial documentation; added support for dynamic favicons and comprehensive navigation management. | Claude AI |
