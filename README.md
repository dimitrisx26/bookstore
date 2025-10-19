# Bookstore

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

# Bookstore (Angular demo)

A small demo BookStore application built with Angular and Bootstrap. It includes searching, filtering, viewing details, and a minimal Add Book flow that persists demo entries into localStorage for the current browser.

This README covers getting started, running the app locally, and a few implementation notes specific to this repo.

Table of contents

- Requirements
- Quick start
- Useful commands
- Project structure
- Notable implementation details
- Troubleshooting

## Requirements

- Node.js 18+ (or the Node version used in the project)
- npm or pnpm (the repo uses the standard Angular CLI toolchain)
- Angular CLI (optional for running `ng` commands globally)

## Quick start

1.  Install dependencies:

```bash
npm install
```

2.  Start the dev server:

```bash
npm start
# or
# ng serve
```

3.  Open http://localhost:4200/ in your browser.

The app uses `public/assets/books.json` as a seed dataset. Added books from the Add Book modal are saved to localStorage in the current browser.

## Useful commands

- `npm start` / `ng serve` — run dev server
- `npm run build` / `ng build` — create production build
- `npm test` / `ng test` — run unit tests
- `npm run lint` / `ng lint` — run linter (if configured)

## Project structure (important files)

- `src/app/components` — UI components (search, details, create modal, landing, etc.)
- `src/app/services` — API/local storage services and search/filter logic
- `public/assets/books.json` — seed book dataset used by the demo
- `src/app/models/book.model.ts` — IBook interface

## Notable implementation details

- Authors and categories in the Create form now use `FormArray` and a tag/chip UI so newly-created books store arrays (not comma strings). This avoids runtime errors when the search/filter code expects arrays.
- The search service includes defensive parsing to handle older or external entries where `categories` or `authors` may be strings; that code can be simplified if you ensure all inputs always provide arrays.
- The landing page was improved with a hero and feature cards; it uses an Unsplash placeholder image for the hero so you don't need to add an asset locally.

## Troubleshooting

- Runtime error "(book.categories ?? []).forEach is not a function": ensure that books saved to localStorage have `categories` as an array. The Create form uses FormArray so new entries will be arrays. The search service also guards against string values.
- If you see template errors after edits, run `ng serve` and check the terminal; Angular's build tools will print template parsing errors and helpful locations.

## Contributing

Small, focused PRs are welcome. When adding features, prefer small components and keep logic in services where possible.

---

If you'd like, I can:

- Add a small CONTRIBUTING.md and code style/linting setup
- Add unit tests for the Create form and BooksSearchService
- Replace the Unsplash hero with an inline SVG placeholder to avoid external requests

Tell me what you'd prefer and I can add it.
