# Bookstore — Angular Demo

This is a small demo BookStore application built with Angular (CLI v20.x). It showcases searching, filtering, viewing details, and a minimal Add Book flow that persists demo entries into localStorage for the current browser.

This README provides a clear quick-start, common commands, project layout, implementation notes, and troubleshooting tips so you can run and contribute to the project quickly.

## Table of contents

- Requirements
- Quick start
- Commands
- Project structure
- Implementation notes
- Testing
- Troubleshooting

## Requirements

- Node.js 18+ (or the Node version used in your environment)
- npm (or pnpm/yarn) — this project uses the standard Angular CLI toolchain
- Angular CLI (optional; you can use the local CLI via npm scripts)

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start the dev server (uses the `start` npm script)

```bash
npm start
# or, to use the Angular CLI directly:
# npx ng serve
```

3. Open the app in your browser:

http://localhost:4200/

Notes:
- The app seeds demo books from `public/assets/books.json` on first load.
- Books you add using the Add Book flow are stored in the browser's localStorage for the current origin.

## Commands

- npm start — run development server (dev build + live reload)
- npm run build — create a production build
- npm test — run unit tests
- npm run lint — run linter (if configured in the project)

Run the local Angular CLI without a global install with:

```bash
npx ng <command>
```

## Project structure (important files)

- `src/app/` — application source
	- `components/` — UI components (search, details, create modal, landing, header/footer)
	- `models/` — domain models (e.g. `book.model.ts`)
	- `services/` — services for API/localStorage/search logic
- `public/assets/books.json` — seed dataset for demo books
- `src/main.ts`, `src/index.html` — Angular bootstrap and index

Tip: The codebase prefers small, focused components and keeps state/logic in services to make the app easy to test.

## Implementation notes

- Form arrays: The Create form stores `authors` and `categories` as arrays (FormArray + tag/chip UI). This avoids runtime issues when other parts of the app expect arrays.
- Defensive parsing: The search service includes guards to handle older data where `authors` or `categories` might be strings; if you ensure all inputs store arrays you can simplify that code.
- Images: The landing hero currently uses an external Unsplash placeholder image. If you want to avoid external requests, consider replacing it with an inline SVG or local image.

## Testing

- Unit tests are wired to the standard Angular test runner. Run them with:

```bash
npm test
```

- The repo includes specs for components and services under `src/app/` alongside the implementation.

## Troubleshooting

- Error: `(book.categories ?? []).forEach is not a function`
	- Cause: Some book entries (from localStorage or external sources) have `categories` as a string rather than an array.
	- Fix: Ensure saved books use arrays for `categories` and `authors`. The Create form already saves arrays; the search service also contains parsing guards.

- Template or compilation errors
	- Run `npm start` and inspect the terminal; Angular's compiler provides helpful template parsing errors with file/line references.

---

Last updated: 2025-10-19
