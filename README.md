# Nebula — Blog App (Frontend)

Nebula is a blogging platform with AI features. Users can read public posts, sign up, manage their own blogs, generate posts with AI, chat with uploaded documents to produce grounded blog content, like and comment on posts, and buy AI tokens through Stripe. Admins can find and activate/deactivate users through a natural-language assistant.

This repo is the **React frontend**. It talks to a separate backend API (sibling `../BE` folder) configured through `VITE_API_BASE_URL`.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Getting started](#getting-started)
3. [Project structure](#project-structure)
4. [Architecture](#architecture)
5. [Build log — every step, in order](#build-log--every-step-in-order)
6. [Features walkthrough](#features-walkthrough)
7. [Routes](#routes)
8. [API endpoints used](#api-endpoints-used)
9. [Known gaps / next steps](#known-gaps--next-steps)

---

## Tech stack

| Concern | Library |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-based config), `tw-animate-css` |
| UI primitives | shadcn/ui (`base-nova` style) on `@base-ui/react`, `class-variance-authority`, `lucide-react` icons |
| Routing | `react-router-dom` v7 |
| Server state | Redux Toolkit **RTK Query** |
| Client state | Redux Toolkit slices + `redux-persist` (localStorage) |
| Animation | `motion` (Framer Motion) |
| Toasts | `sonner` |
| Dates | `dayjs` |
| HTML safety | `dompurify` |
| Font | Geist Variable (`@fontsource-variable/geist`) |
| Linting | `oxlint` |

> `@tanstack/react-query` and `zustand` are installed but not used. All data fetching goes through RTK Query and all client state through Redux.

---

## Getting started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- The backend API running (see `../BE`)

### Install and run

```bash
pnpm install
# create .env (see below)
pnpm dev
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
```

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API. Every RTK Query request is prefixed with it. |

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check (`tsc -b`) then build for production |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run oxlint |

There is no test suite yet.

---

## Project structure

```
src/
├── api/                  # RTK Query endpoint modules (one per backend resource)
│   ├── auth.api.ts       # login, register
│   ├── blog.api.ts       # blog CRUD, public blogs, image upload
│   ├── comment.api.ts    # list / create / delete comments
│   ├── like.api.ts       # like / unlike
│   ├── document.api.ts   # document upload, Q&A, sessions, chat history
│   ├── ai-blog.api.ts    # AI blog generation
│   ├── user.api.ts       # admin: list users, AI user finder, (de)activate
│   └── billing.api.ts    # token balance, packages, Stripe checkout
├── components/
│   ├── auth/             # AuthCard, FormField
│   ├── home/             # Hero, BlogSection, BlogCard (public landing page)
│   ├── layout/           # Public Layout/Header/Footer, PageTransition
│   │   └── dashboard-layout/   # ProtectedLayout, SideBar, dashboard Header
│   ├── modals/           # AddEditBlog, ViewBlog, BuyTokens
│   └── ui/               # shadcn primitives + custom ones (TableStructure, Modal, ActionButton, …)
├── constants/            # ROUTES, API_METHODS, EMAIL_REGEX, formatDate, env settings
├── helper/               # ScrollToTop
├── hooks/                # useTheme
├── lib/                  # cn(), API error parsing, HTML strip/sanitize
├── pages/                # Route-level screens
├── router/               # Dashboard route config with role-based access
├── service/              # Base RTK Query api (auth header, 401 handling, tags)
├── store/                # Redux store, persist config, auth + theme slices
├── App.tsx               # Route tree
├── main.tsx              # Providers (Redux, PersistGate, Router, Toaster)
└── index.css             # Tailwind v4 theme tokens, brand gradient, dark mode
```

---

## Architecture

### Provider tree (`src/main.tsx`)

```
<Provider store>            Redux
  <PersistGate>             waits for auth/theme to rehydrate from localStorage
    <BrowserRouter>
      <Toaster />           sonner, top-center, 3s
      <App />
```

### Routing (`src/App.tsx`, `src/router/app-routes.tsx`)

- **Public routes** (home, sign-in, sign-up, blog detail) render inside `Layout` (public header and footer).
- **Dashboard routes** render inside `ProtectedLayout`. It redirects to `/sign-in` when no token is present, and wraps pages in the sidebar, the dashboard header and a `Suspense` boundary.
- Dashboard routes are declared once in `appRoutes`. Each entry holds its path, a lazy component, optional sidebar metadata (icon, label, group) and the allowed `roles`. `getAccessibleRoutes(role)` filters this list, so the router and the sidebar always agree on what a user can see.
- Every page is `React.lazy`-loaded. `AnimatePresence` + `PageTransition` animate route changes, and `ScrollToTop` resets the scroll position on navigation.

### Data layer (`src/service/api.ts` + `src/api/*`)

- A single `createApi` instance with `endpoints: () => ({})`. Each feature file adds its endpoints with `api.injectEndpoints`, which keeps one cache and one middleware.
- `prepareHeaders` attaches `Authorization: Bearer <token>` from the Redux auth state.
- A wrapping `baseQuery` catches **401** responses, dispatches `logout()` and redirects to `/sign-in`.
- Cache tags (`blog`, `comment`, `document`, `user`, `billing`, `auth`) drive automatic refetching. For example, generating an AI blog invalidates `blog` **and** `billing`, so the token balance in the header refreshes on its own.

### State (`src/store/*`)

- `auth` slice: `{ user, token }` with `setCredentials` and `logout`.
- `theme` slice: `light` / `dark`, initialized from `prefers-color-scheme`.
- Both are persisted with `redux-persist` through a small Promise-based localStorage adapter (`store/storage.ts`). The RTK Query cache is not persisted.

### Error handling (`src/lib/apiError.ts`)

- `getApiErrorMessage(err)` normalizes FastAPI-style errors (`detail`, `message`, field-error objects, plain strings) into one message for toasts.
- `isInsufficientTokensError(err)` checks for HTTP **402**, which the AI features use to open the Buy Tokens modal.

### Theming (`src/index.css`, `src/hooks/use-theme.ts`)

- Tailwind v4 tokens live in `:root` / `.dark` / `@theme inline`.
- The brand palette (`--brand-1…4`) feeds the `.text-gradient-brand` / `.bg-gradient-brand` utilities and a `--brand-glow` shadow color.
- `useTheme()` reads the Redux theme and toggles the `dark` class on `<html>`.

---

## Build log — every step, in order

This section follows the git history, one step per commit.

### Step 1 — Project scaffold and landing page (`9057d78`, 2026-07-26)

- Created the Vite + React + TypeScript project with pnpm, oxlint and the `@/` path alias (`vite.config.ts`, `tsconfig*.json`, `jsconfig.json`).
- Set up Tailwind CSS v4 and shadcn/ui (`components.json`), and added the first primitives: `button`, `input`, `label`, `textarea`.
- Defined the brand theme in `index.css`: purple-to-pink gradient, light/dark tokens, Geist font.
- Built the public site:
  - `Layout` with `Header` (logo, nav, theme toggle) and `Footer`.
  - Landing page `Hero` with an animated WebGL **dithering shader** sphere (`ui/dithering-shader.tsx`). Its color comes from the current `--primary` CSS variable, so it follows the theme.
  - `BlogSection` / `BlogCard` grid, fed at this point by static mock data (`src/data/blog-posts.ts`).
  - `PageTransition` wrapper for animated page enter/exit.
- Built the **Sign In** and **Sign Up** pages with `AuthCard` and `FormField`, including client-side validation (required fields, email regex, password length, password confirmation).
- Added the `ROUTES` constants and a first `useTheme` hook.

### Step 2 — API and state architecture (`32a2af0`, 2026-07-26)

- Added Redux Toolkit, RTK Query and redux-persist.
- Created the store (`store/store.ts`) with persisted `auth` and `theme` slices and a custom localStorage adapter.
- Created the base RTK Query `api` (`service/api.ts`) with the `VITE_API_BASE_URL` base URL and Bearer token header.
- Added the first endpoints (`login`, `register`) and wired Sign In/Sign Up to the real backend. A successful login stores `{ user, token }` via `setCredentials`.
- Moved the theme from local state into Redux, so it persists across reloads.
- Added `constants/index.ts` (`API_METHODS`, `EMAIL_REGEX`), `constants/env-settings.ts` and a full-screen `Loading` component.
- Wrapped the app in `Provider`, `PersistGate` and the `sonner` `Toaster`.

### Step 3 — Modal and scroll-to-top (`147bd83`, 2026-07-26)

- Added the shadcn `dialog` primitive and a reusable `Modal` wrapper (title, sizes, loading state, optional close icon).
- Added `ScrollToTop`, which scrolls smoothly to the top on every route change.

### Step 4 — Dashboard shell and role-based routing (`d70ee98`, 2026-07-31)

- Created `ProtectedLayout`, which redirects unauthenticated users to sign-in, plus a collapsible desktop **SideBar**, a slide-in mobile drawer and a dashboard **Header** with a user avatar menu and logout.
- Introduced `router/app-routes.tsx`, a single config of dashboard routes with lazy components, sidebar icon/label/group, and allowed roles (`ADMIN`, `EDITOR`, `USER`). `getAccessibleRoutes()` filters both the routes and the sidebar by the logged-in user's role.
- Sidebar items are grouped into *Content*, *AI Tools*, *Account* and *Admin* sections.
- Added placeholder pages: Dashboard, Blogs, AI Blogs, Document Blogs, Profile.
- Added **401 handling** to the base query (auto-logout and redirect).
- Added `lib/apiError.ts` for consistent error messages in toasts.
- Moved `auth.api.ts` into the dedicated `src/api/` folder.

### Step 5 — Blog CRUD (`5466d93`, 2026-08-04)

- Added `blog.api.ts` with list/get/create/update/delete and `blog` cache tags.
- Built reusable UI pieces:
  - `TableStructure`: generic typed table with columns, custom renderers, tooltips, loading shimmer, refresh button and pagination.
  - `ActionButton`: view/edit/delete icon buttons.
  - `DeleteConfirmationModal`: confirm dialog with `delete` / `verify` variants.
  - `Shimmer`, `card`, `pagination` and `tooltip` primitives.
- Built the **Blogs** dashboard page: paginated table (10 per page), "Add Blog" button, and View / Edit / Delete actions. Edit and Delete only appear on blogs the current user wrote.
- Added the `AddEditBlog` and `ViewBlog` modals.
- Added the `formatDate` helper (dayjs, `MM/DD/YYYY`).

### Step 6 — Public blog detail and image upload (`6087167`, 2026-08-07)

- Removed the mock data. The landing page now loads real posts from `GET /blogs/public`.
- Added the public **Blog Detail** page (`/dashboard/blogs/:id`, rendered in the public layout) with cover image, date, title, description and content.
- `BlogCard` links to the detail page.
- `AddEditBlog` gained **image upload**. The file is sent to `POST /upload/image` first, and the returned `image_url` is saved with the blog. When editing, the existing image is kept unless a new one is chosen.

### Step 7 — Document upload and Q&A (`380222d`, 2026-09-01)

- Added `document.api.ts` (upload, query, list sessions, delete session, chat history).
- Built the **Document Blogs** page as a chat UI:
  - Left panel: list of uploaded document *sessions*, with "New" and delete.
  - Main panel: upload a file to start a session, then ask questions. Each answer comes back as a blog post grounded in the document.
  - Chat history is loaded per session from the backend.
- Opened the AI routes to all roles.

### Step 8 — Likes and comments (`6e53ad6`, 2026-09-14)

- Added `like.api.ts` and `comment.api.ts`.
- Blog Detail now supports:
  - **Like / Unlike** with the total like count.
  - **Comments**: list, post, and delete your own. Comments are cached per blog with tag ids.
  - Guests who try to like or comment are sent to sign-in with a toast.
- Improved the Document Blogs chat with optimistic display of the pending question and a "Thinking…" bubble.

### Step 9 — Chat scroll fix (`f78fd44`, 2026-09-15)

- The document chat auto-scrolls to new messages only when the user is already near the bottom.
- Added a floating "scroll to latest" button when scrolled up.
- Enter sends, Shift+Enter adds a new line. Added custom scrollbar styling (`.scroll-container`).

### Step 10 — UI polish (`dc0a5f8`, 2026-09-16)

- Fixed sidebar collapse-toggle positioning and public header layout issues.

### Step 11 — AI blog generation (tool calling) (`0cf0c69`, 2026-09-16)

- Added `ai-blog.api.ts` → `POST /ai-blogs/generate`.
- Built the **AI Blogs** page: describe a topic, the backend's LLM writes and publishes a post, and the result shows as a `BlogCard`.
- AI output can contain HTML, so `lib/html.ts` was added:
  - `stripHtml()` for titles and descriptions in cards and tables.
  - `sanitizeHtml()` (DOMPurify) for rendering full content safely on the detail page, styled with Tailwind arbitrary selectors (`[&_h2]`, `[&_ul]`, …).

### Step 12 — Admin user management (`32bc96f`, 2026-09-17)

- Added `user.api.ts`.
- Built the **Admin Users** page (route restricted to `ADMIN`):
  - Paginated table of all users with role and active/inactive badges.
  - "Find a user" **AI assistant**. An admin types a natural-language request (e.g. "deactivate Jane Doe"), the backend returns the matching users and a suggested action, and the admin confirms it in a modal before it runs.

### Step 13 — Stripe token billing (`f1fdc8b`, 2026-09-27)

- Added `billing.api.ts` (token balance, token packages, Stripe checkout session).
- The dashboard header shows the user's **token balance**. Clicking it opens the **Buy Tokens** modal.
- `BuyTokensModal` lists packages. Choosing one creates a Stripe Checkout session and redirects to Stripe.
- Added **Billing Success** (shows refreshed balance) and **Billing Cancel** pages as Stripe return URLs.
- AI Blogs and Document Blogs open the Buy Tokens modal automatically when the backend returns **402 Payment Required**.
- AI generation and document queries invalidate the `billing` tag, so the balance updates right after tokens are spent.

---

## Features walkthrough

| Feature | Where | Who |
| --- | --- | --- |
| Landing page with animated hero and latest posts | `/` | Everyone |
| Read a blog, see comments | `/dashboard/blogs/:id` | Everyone |
| Like / comment on a blog | Blog detail | Signed-in users |
| Sign up / sign in | `/sign-up`, `/sign-in` | Guests |
| Light/dark theme (persisted) | Both headers | Everyone |
| Manage own blogs (create, edit, delete, image upload) | `/dashboard/blogs` | USER, EDITOR, ADMIN |
| Generate a blog with AI | `/dashboard/ai-blogs` | USER, EDITOR, ADMIN |
| Chat with an uploaded document | `/dashboard/document-blogs` | USER, EDITOR, ADMIN |
| Token balance and Stripe top-up | Dashboard header | Signed-in users |
| Find users and activate/deactivate them via AI assistant | `/dashboard/admin/users` | ADMIN |

---

## Routes

| Path | Page | Layout | Access |
| --- | --- | --- | --- |
| `/` | Home | Public | All |
| `/sign-in` | Sign In | Public | All |
| `/sign-up` | Sign Up | Public | All |
| `/dashboard/blogs/:id` | Blog Detail | Public | All |
| `/dashboard` | Dashboard | Protected | Any signed-in user |
| `/dashboard/blogs` | Blogs | Protected | USER, EDITOR, ADMIN |
| `/dashboard/ai-blogs` | AI Blogs | Protected | USER, EDITOR, ADMIN |
| `/dashboard/document-blogs` | Document Blogs | Protected | USER, EDITOR, ADMIN |
| `/dashboard/profile` | Profile | Protected | USER, EDITOR, ADMIN |
| `/dashboard/admin/users` | Admin Users | Protected | ADMIN |
| `/billing/success` | Billing Success | Protected | Any signed-in user |
| `/billing/cancel` | Billing Cancel | Protected | Any signed-in user |

To add a dashboard page: create it in `src/pages/`, then add one entry to `appRoutes` in `src/router/app-routes.tsx`. The route, sidebar link and role check all come from that one entry.

---

## API endpoints used

| Method | Endpoint | Hook | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | `useLoginMutation` | Sign in, returns token and user |
| POST | `/auth/register` | `useSignUpMutation` | Create account |
| GET | `/blogs/public` | `useGetPublicBlogsQuery` | Landing page posts |
| GET | `/blogs/public/:id` | `useGetPublicBlogByIdQuery` | Blog detail |
| GET | `/blogs/` | `useGetBlogsQuery` | Dashboard blog list |
| GET | `/blogs/:id` | `useGetBlogQuery` | Single blog (auth) |
| POST | `/blogs/` | `useCreateBlogMutation` | Create blog |
| PATCH | `/blogs/:id` | `useUpdateBlogMutation` | Update blog |
| DELETE | `/blogs/:id` | `useDeleteBlogMutation` | Delete blog |
| POST | `/upload/image` | `useUploadImageMutation` | Upload cover image |
| POST / DELETE | `/blogs/:id/like` | `useLikeBlogMutation` / `useUnlikeBlogMutation` | Like / unlike |
| GET / POST | `/blogs/:id/comments` | `useGetCommentsQuery` / `useCreateCommentMutation` | List / add comments |
| DELETE | `/comments/:id` | `useDeleteCommentMutation` | Delete comment |
| POST | `/document/upload` | `useUploadDocumentMutation` | Upload document, returns `session_id` |
| POST | `/document/query` | `useQueryDocumentMutation` | Ask a question about a document |
| GET | `/document/all` | `useGetAllSessionsQuery` | List document sessions |
| GET | `/document/:session_id/history` | `useGetChatHistoryQuery` | Session chat history |
| DELETE | `/document/:session_id` | `useDeleteSessionMutation` | Delete session |
| POST | `/ai-blogs/generate` | `useGenerateAiBlogMutation` | Generate blog with AI |
| GET | `/users/` | `useGetAllUsersQuery` | Admin: list users |
| POST | `/users/assistant` | `useFindUsersByQueryMutation` | Admin: AI user finder |
| POST | `/users/:id/activate` | `useActivateUserMutation` | Admin: activate user |
| POST | `/users/:id/deactivate` | `useDeactivateUserMutation` | Admin: deactivate user |
| GET | `/billing/tokens` | `useGetTokenBalanceQuery` | Current token balance |
| GET | `/billing/packages` | `useGetTokenPackagesQuery` | Token packages for sale |
| POST | `/billing/checkout-session` | `useCreateCheckoutSessionMutation` | Create Stripe Checkout session |

---

## Known gaps / next steps

- **Dashboard** and **Profile** pages are still placeholders.
- `ROUTES` already defines forgot/reset password, subscription, billing, history and several admin pages (blogs, plans, payments, logs, settings) that have no screens yet.
- The blog detail page lives at `/dashboard/blogs/:id` but is public. A path like `/blogs/:id` would be clearer.
- Like state is not loaded from the server on page load. The like button starts as "Like" and the count only appears after the first click.
- Comments show `User #id` rather than the author's name.
- The AI routes are open to `USER`, with the stricter `["EDITOR", "ADMIN"]` rule commented out.
- Minimum password length on sign-up is 4 characters.
- The `sonner` Toaster is fixed to the light theme.
- `@tanstack/react-query` and `zustand` are unused dependencies.
- `CLAUDE.md` is out of date. It describes a JavaScript + React Query setup, but the app uses TypeScript + RTK Query.
- No automated tests.
