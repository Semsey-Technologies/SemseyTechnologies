# assets/theme/media.css

## 1. What it does
`media.css` provides the styling for the "Media Showcase" components. It defines the layout and visual language for displaying images, app demo videos, AI-generated explainer videos, and NotebookLM podcast audio.

## 2. Why it does it
To create a unified and immersive way to showcase project outputs. By separating media styles from the main theme, we can provide specific "Cyber Neon" treatments to media elements—like glowing borders on hover and themed audio players—ensuring that external media content feels native to the Semsey Technologies brand.

## 3. How it does it
- **Media Grid:** Uses `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` to create a responsive, masonry-style layout that adapts from desktop to mobile.
- **Card Hover Effects:** Implements `transition` and `transform` to scale cards and add an accent-colored `box-shadow` (glow) on hover.
- **Themed Labels:** Uses absolute positioning to overlay metadata tags (e.g., "APP DEMO", "PODCAST") on top of media assets.
- **Audio Styling:** Customizes the container for the `<audio>` tag to include a microphone icon and themed background, making standard audio files look like a "Data Terminal" input.
- **Glassmorphism:** Leverages `var(--card-bg)` and `color-mix` to ensure the media containers maintain the site's translucent aesthetic.

## 4. Overall role
It acts as the "Gallery Engine" for the site. It is used primarily on detailed project pages (like RTS Device Suite Pro) to turn raw files into an interactive, high-tech showcase.

## Version History
| Version | Change Description | Author |
| :--- | :--- | :--- |
| 1.0 | Initial creation; defined grid layouts for App Demos, AI explainers, and Podcasts. | Claude AI |
