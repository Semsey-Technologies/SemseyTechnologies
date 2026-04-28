# Website Documentation Protocol (v1.0)

This document outlines the mandatory mirroring system for documenting the Semsey Technologies website architecture.

## 1. Storage & Versioning
- **Location:** All documentation is stored in the `/documentation/v[X.X]/` directory.
- **Structure:** The folder structure within the version folder must exactly mirror the website root directory.
    - Example: `index.html` → `documentation/v1.0/index.md`
    - Example: `assets/theme/theme.js` → `documentation/v1.0/assets/theme/theme.md`

## 2. Documentation Format
Each `.md` file must contain the following four sections:
1. **What it does:** A high-level description of the component's functionality.
2. **Why it does it:** The architectural or user-experience reasoning behind the component's existence.
3. **How it does it:** A technical breakdown of the logic, specific HTML/CSS/JS features used, and key algorithms.
4. **Overall role:** How this component fits into the broader site ecosystem.

## 3. The "Version History" Table
Every file must conclude with a `## Version History` section in the following format:

| Version | Change Description | Author |
| :--- | :--- | :--- |
| [Current Version] | [Specific summary of changes made] | [Author Name/AI] |

## 4. The "Documentation-Sync" Trigger
- **Surgical Updates:** Whenever a file (`.html`, `.js`, `.css`, `.json`) is modified, its corresponding `.md` file must be updated immediately.
- **New Files:** If a new file is created, a matching `.md` file must be generated instantly.
- **Audit Requirement:** Updates must reflect recent logic changes (e.g., if a new PWA feature is added, the "How it does it" section must explain the service worker integration).

## 5. Maintenance Protocol
- If the site undergoes a major architectural shift, a new version folder (e.g., `v1.1`) must be created in `documentation/`.
- The baseline should be copied forward before making new changes.
