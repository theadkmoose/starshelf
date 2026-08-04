# AI Rules & Architecture Guidelines

## Tech Stack Overview

- **Frontend Core**: Vanilla HTML5 and JavaScript (ES6+ IIFE and utility modules) designed for serverless static hosting (GitHub Pages under `docs/`).
- **Styling**: Native CSS3 with CSS Custom Properties (design tokens), CSS Grid, and Flexbox (`docs/css/style.css`), featuring Google Fonts (`Fraunces` and `Space Grotesk`).
- **Data Format & Storage**: Client-side state in `localStorage` (favorites, completed list, queue state, notes, cover cache) paired with `docs/books.json` for catalog dataset rendering.
- **Backend / Data Pipeline**: Python 3 scripts in `scripts/` (`refresh_catalog.py`, `export_json.py`, `enrich_missing_metadata.py`) utilizing SQLite (`data/books.db`) and raw CSV inputs (`data/raw/`).
- **External Metadata Integrations**: REST queries to Open Library API, Google Books API, and Apple iTunes Audiobook Search API for dynamic cover art and narrator enrichment.

## Library & Tool Usage Rules

### 1. Frontend Logic & DOM
- Use **Vanilla JavaScript** DOM APIs (`document.querySelector`, `addEventListener`, template literals) without build bundlers or frontend frameworks.
- Separate reusable calculations and utility functions into modular scripts in `docs/js/` (e.g., `window.BookMetaUtils`, `window.ScoreUtils`).
- Ensure all dynamic UI components handle missing or null data fields safely with user-friendly fallbacks (e.g., placeholder SVG covers).

### 2. Styling & Design
- Main application pages in `docs/` must use the centralized `docs/css/style.css` stylesheet and maintain custom property variables (`--brand`, `--surface`, `--radius-lg`).
- Maintain mobile-first responsive grid layouts using `@media (max-width: 980px)` and `@media (max-width: 700px)` breakpoints.
- CDN-based Tailwind CSS is permitted only for standalone documentation or utility pages located in `scripts/*.html`.

### 3. State & Storage Persistence
- User interactions (favorite toggles, read status, queue order, custom notes) must be persisted immediately to `localStorage`.
- All `localStorage` keys must follow the established naming conventions (`spec-fiction-preferences`, `spec-fiction-favorites`, `spec-fiction-completed`, `spec-fiction-next-best-queue`).

### 4. Data Processing & Python Scripts
- Python scripts under `scripts/` should prioritize standard library modules (`sqlite3`, `json`, `urllib.request`, `re`, `pathlib`).
- When performing external API lookups, always handle network failures, timeouts, and missing fields gracefully without breaking the catalog build process.