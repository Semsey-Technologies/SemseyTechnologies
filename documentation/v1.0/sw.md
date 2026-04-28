# sw.js

## 1. What it does
`sw.js` (Service Worker) manages background tasks for the website, specifically asset caching and offline functionality. It acts as a proxy between the browser and the network.

## 2. Why it does it
The service worker is the backbone of the Progressive Web App (PWA) experience. It ensures the site remains functional without an internet connection, improves load times by serving static assets from a local cache, and prevents the "Page Unavailable" errors often seen in flaky network conditions.

## 3. How it does it
- **Installation:** During the `install` event, it pre-caches a list of critical assets (`index.html`, `theme.js`, etc.) using the Cache API. It uses `self.skipWaiting()` to ensure updates take effect immediately.
- **Activation:** During `activate`, it cleans up old cache versions to save device space and uses `self.clients.claim()` to take control of all open pages immediately.
- **Fetch Strategy (Network-First for HTML):** For navigation requests (pages), it attempts to fetch from the network first. If the network fails (offline), it falls back to the cached version. This ensures users always see the latest content when online.
- **Fetch Strategy (Cache-First for Assets):** For static assets like CSS and JS, it checks the cache first to maximize speed, falling back to the network only if the asset is missing.

## 4. Overall role
It transforms the website from a standard "tab in a browser" into an installable, reliable application that feels like a native part of the user's device.

## Version History
| Version | Change Description | Author |
| :--- | :--- | :--- |
| 1.0 | Initial implementation with offline support and basic caching. | Claude AI |
| 1.1 | Updated to "Network-First" for HTML to fix stale page issues and added immediate activation logic. | Claude AI |
