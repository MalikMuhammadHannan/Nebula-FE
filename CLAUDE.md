# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This is the frontend for a blog app, built with React 19 + Vite. It is currently at an early scaffold stage (default Vite template content still present in `src/App.jsx`/`src/App.css`) with the UI toolchain (Tailwind, shadcn primitives, routing, data-fetching, state) wired up but not yet used to build actual blog features.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`).

- `pnpm dev` — start the Vite dev server
- `pnpm build` — production build
- `pnpm preview` — preview the production build locally
- `pnpm lint` — run oxlint

There is no test suite configured in this repo yet.

## Architecture

- **JavaScript, not TypeScript** — despite `jsconfig.json` and `@types/react*` devDependencies (present only for editor intellisense), source files are `.jsx`/`.js`. Do not introduce `.tsx`/`.ts` files unless the user explicitly asks to migrate.
- **Path alias**: `@/*` maps to `src/*` (configured in both `vite.config.js` and `jsconfig.json`). Use `@/...` imports for anything under `src`, matching the existing shadcn component imports.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 uses CSS-based config). All theme tokens (colors, radius, sidebar/chart palette, dark mode overrides) live in `src/index.css` under `:root`, `.dark`, and `@theme inline`. Dark mode is class-based (`.dark`) combined with a `@custom-variant dark (&:is(.dark *))`.
- **UI components**: shadcn/ui components (style `base-nova`, base color `neutral`, icon library `lucide`) live in `src/components/ui/`, built on `@base-ui/react` primitives and `class-variance-authority` for variants. `components.json` defines the shadcn aliases (`@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/lib/utils`) — use the shadcn CLI conventions rather than hand-rolling equivalents when adding new primitives. `cn()` in `src/lib/utils.js` (clsx + tailwind-merge) is the standard way to compose conditional class names.
- **Routing**: `react-router-dom` is a dependency but no routes are defined yet — `src/App.jsx` is still the unmodified Vite starter page.
- **Data fetching**: `@tanstack/react-query` is installed for server state; no `QueryClientProvider` is set up yet in `src/main.jsx`.
- **Client state**: `zustand` is installed for local/global client state.
- **Linting**: oxlint (`.oxlintrc.json`) with `react` and `oxc` plugins; `react/rules-of-hooks` is an error, `react/only-export-components` is a warn (with `allowConstantExport` allowed, so files can export both a component and small constants).
