# settings.html

## 1. What it does
`settings.html` is the "Control Center" of the website. it allows users to customize every visual aspect of their experience, from theme colors and logos to navigation placement and animation intensity.

## 2. Why it does it
To fulfill the project goal of "user-driven branding." It empowers the user to become the designer, ensuring the interface meets their personal accessibility needs and aesthetic preferences. It also serves as the management hub for the site's privacy-first local storage.

## 3. How it does it
- **Preset Buttons:** Triggers a batch update of CSS variables via `settings.js`.
- **Image Selectors:** Allows users to pick between different site logos and settings cogs. Selecting an image updates the `--logo-src` or `--cog-src` variable.
- **Range Sliders:** Provides fine-grained control over motion intensity, glow levels, and font sizes.
- **Persistence Toggle:** A custom switch that determines whether changes are saved to `localStorage`.
- **Privacy Link:** Includes a direct link to `privacy.html` to explain the local-first storage philosophy.

## 4. Overall role
It is the configuration engine for the site. It doesn't just change the look of the settings page—it broadcasts these changes to every other page on the site via the shared `localStorage` and `theme.js` architecture.

## Version History
| Version | Change Description | Author |
| :--- | :--- | :--- |
| 1.0 | Initial documentation; added Brand Identity selectors and Privacy & Transparency link. | Claude AI |
