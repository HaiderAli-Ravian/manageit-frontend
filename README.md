# ManageIt Frontend

A task management UI built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind. Authentication, task CRUD with combinable filter/search/sort/pagination, optimistic UI for status toggles, activity log per task, file attachments, role-based admin view, and dark mode.

## Live

https://manageit-frontend-psi.vercel.app

> The backend runs on Railway's free tier and may take up to 60 seconds to wake from idle on the first request. The frontend itself is on Vercel and always-on.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Language:** TypeScript
- **Styling:** Tailwind v4, shadcn/ui (base-nova style), Geist Sans
- **Server state:** TanStack Query v5
- **Global state:** zustand (for auth only; everything else is server state via TanStack Query)
- **Forms:** react-hook-form + zod validation
- **HTTP client:** Axios with cookie-based auth and a refresh-token interceptor
- **File uploads:** Cloudinary (direct browser upload)
- **Animation:** motion (formerly Framer Motion; used sparingly for list enter/exit transitions)
- **Dark mode:** next-themes
- **Toasts:** Sonner
- **Date handling:** date-fns

## Features

**Auth flows**
- Signup and login with client-side zod validation matching the backend DTOs
- Session restored on page load by calling `GET /auth/me`
- Logout clears cookies and redirects
- Automatic refresh-then-retry on 401 responses, single-flight to handle concurrent expired requests

**Task management**
- List view with combinable filter (status), search (debounced 300ms), sort (created date, due date, priority, status), and pagination
- Filter/search/sort state lives in URL search params — shareable, survives reload, browser back button works
- Create and edit dialogs with full validation
- Mark complete via inline checkbox with **optimistic UI** — the checkbox flips instantly, rolls back on error
- Delete with confirmation dialog
- Activity log tab per task showing chronological history with humanized labels

**Attachments**
- Cloudinary direct upload — file bytes never touch the frontend's Next.js server or the backend
- Allowed: images, PDFs, Word documents; max 4 MB per file
- List of attachments with file type icons, formatted sizes, upload timestamps
- View opens the file in a new tab; delete removes the metadata row

**Admin (RBAC)**
- ADMIN role sees an extra "Admin" link in the header
- `/admin/tasks` shows all users' tasks across the system (read-only)
- Non-admin users hitting `/admin/*` get redirected back to `/tasks`

**Polish**
- Dark mode with system / light / dark options, preference persists
- Animated list items (motion) so creates, deletes, and re-sorts feel smooth without being decorative
- Loading skeletons in every list / form context, never spinners in dense UI
- Empty states with icon + heading + subtext + optional action
- Toasts for every successful and failed mutation

## Prerequisites

- Node 20+ and npm
- A running backend (locally on `:4000` or the deployed Railway instance)
- Docker + Docker Compose if you want the containerized local setup
- A Cloudinary account if you want attachment uploads to work (free tier is plenty)

## Setup — With Docker

```bash
git clone https://github.com/HaiderAli-Ravian/manageit-frontend.git
cd manageit-frontend
cp .env.example .env
# edit .env with real values — see the env vars table below
docker-compose up -d --build
```

Frontend will be available at `http://localhost:3000`.

> This compose setup only runs the frontend. The backend must be running separately, either via the [backend repo's Docker Compose](https://github.com/HaiderAli-Ravian/manageit-backend) or however else you choose.

## Setup — Without Docker

```bash
git clone https://github.com/HaiderAli-Ravian/manageit-frontend.git
cd manageit-frontend
npm install

cp .env.example .env
# edit .env with real values

npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL used by the browser (client-side fetch) | `http://localhost:4000/api/v1` (dev) / `https://...railway.app/api/v1` (prod) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (public, used in the client upload widget) | `your-cloud-name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset configured in Cloudinary dashboard | `manageit_unsigned` |

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint check |

## Architecture Notes

**Three-layer data flow.** API integration follows a strict service → hook → component separation:

- `src/services/*.service.ts` — raw axios calls, unwrap the response envelope, return typed domain objects
- `src/hooks/use-*.ts` — TanStack Query hooks wrapping the services, handling cache invalidation, optimistic updates, toasts, and post-mutation routing
- `src/components/**` — only consume hooks, never call services directly

This keeps components clean of HTTP concerns and means swapping out the API client (or moving to GraphQL, or whatever) only touches two layers, not every component.

**Route protection via App Router groups, not middleware.** Routes are split into `(public)` (login, signup) and `(private)` (everything else). Each group has a layout that checks auth state from the zustand store and redirects accordingly. Next.js middleware was considered and rejected because cross-domain cookies between Vercel and Railway make middleware-based auth unreliable in production — client-side auth gating works correctly in all environments.

**Auth state in zustand, not Context.** Auth lives in a tiny zustand store rather than React Context for one specific reason: the axios refresh interceptor needs to call `reset()` (clear user + redirect to login) from non-React code at module scope. Zustand exposes its actions globally via `useAuthStore.getState()`. Context can't do that cleanly.

**URL state for filters.** Filter, search, sort, and pagination state live in URL search params via a small `useTaskFilters` hook. Shareable, survives reload, native back button works.

**Optimistic UI only where it matters.** Only the mark-complete checkbox is optimistic — that's the highest-frequency interaction and the one where perceived latency hurts most. Create/edit/delete show pending states via the mutation hook's `isPending` flag rather than optimistically updating.

**Animations on purpose.** motion is used only for:
- Task list item enter/exit/reorder (so creates, deletes, and re-sorts feel smooth)
- Attachment list item enter/exit (in the attachments tab)

Hover effects, page transitions, and decorative animations are intentionally absent. Animations exist to communicate state change, not decorate.

## Project Structure

```
src/
├── app/
│   ├── (public)/                # login, signup — redirects to /tasks when already authenticated
│   ├── (private)/               # everything below requires auth
│   │   ├── layout.tsx           # auth guard, header with theme toggle + logout
│   │   ├── tasks/               # main task UI
│   │   └── admin/               # admin-only routes, role guard layout
│   ├── api/                     # Next.js route handlers (e.g. Cloudinary signing if needed)
│   ├── layout.tsx               # root layout — fonts, providers
│   ├── page.tsx                 # root redirect to /tasks or /login
│   └── providers.tsx            # QueryClient, ThemeProvider, AuthHydrator, Toaster
├── components/
│   ├── auth/                    # login + signup forms
│   ├── tasks/                   # list, row, filters, form dialog, attachments, activity log, pagination, badges
│   ├── common/                  # theme toggle, loading screen
│   └── ui/                      # shadcn primitives (base-nova style)
├── services/                    # raw API service layer
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── attachment.service.ts
├── hooks/                       # TanStack Query hooks
│   ├── use-auth.ts
│   ├── use-tasks.ts
│   ├── use-task-filters.ts      # URL state hook
│   └── use-attachments.ts
├── store/
│   └── auth.store.ts            # zustand store (user, isHydrated, reset)
└── lib/
    ├── api/
    │   ├── client.ts            # axios instance + refresh interceptor
    │   └── types.ts             # ApiSuccessResponse / ApiErrorResponse envelope types
    ├── validations/             # zod schemas for forms
    └── format-file-size.ts
```

## Assumptions and Trade-offs

A few decisions made deliberately, with the reasoning.

**Cookies, not localStorage.** Tokens live in httpOnly cookies set by the backend. JavaScript can't read them, mitigating XSS impact. The frontend never handles the token directly. The trade-off is more deployment plumbing (CORS with credentials, `withCredentials: true` on axios, cross-origin cookie config in production) but the security improvement is worth it.

**Single-flight refresh.** The axios response interceptor catches 401s, attempts `/auth/refresh` once, then retries the original request. Concurrent 401s queue against a single in-flight refresh so multiple expired requests don't fire multiple refreshes. If refresh fails, the store is cleared and the user is redirected to login.

**Server state vs client state separation.** TanStack Query owns everything that came from the API — users, tasks, activities, attachments. Zustand owns nothing except the current user object and a hydration flag. There's no manual caching, no `useState` for server data anywhere.

**3-layer pattern, strictly.** Components never call services directly. This is enforced by convention rather than tooling, but it's consistent across the codebase and pays off the first time anyone needs to change how mutations behave — there's one place to look (the hook), not dozens.

**Cloudinary chosen over UploadThing.** UploadThing was the initial choice for its tight Next.js integration but ran into middleware reliability issues during late-stage testing. Swapped to Cloudinary's direct upload (using an unsigned upload preset) which is simpler and just as direct: file bytes go browser → Cloudinary, the resulting URL gets sent to the backend for metadata persistence.

**Uppercase enum string values throughout.** `'PENDING'`, `'HIGH'`, etc., matching the backend's wire format exactly. No transformation in the service layer. Display labels are humanized at the component level via small label maps. The trade-off is `?status=PENDING` URLs look slightly less polished than lowercase, but no mapping bugs.

**Animations only where they help, not where they look cool.** motion is bounded to task list items and attachment list items. No hover scaling, no page transitions, no stagger animations on mount. The goal was a SaaS dashboard feel (Linear, Vercel) not a portfolio site feel.

**No frontend tests.** The build (`npm run build`) is the quality gate — TypeScript catches the failure modes that matter most in a strongly-typed React + TanStack Query stack. Three meaningful tests on the backend service layer cover the highest-value business logic. Adding frontend Testing Library + Playwright tests would be meaningful work for limited additional signal in this scope.

## Known Limitations

- The admin task view shows truncated user IDs (first 8 chars) instead of the owner's email or name. The backend's admin endpoint doesn't enrich tasks with the owner's user object — would require either populating the relation server-side or a separate users-by-id batch lookup on the frontend.
- Deleting an attachment removes the metadata row but doesn't clean up the underlying file on Cloudinary. Orphaned files accumulate over time. A production app would call Cloudinary's destroy API in the same flow or run a scheduled cleanup job.
- No real-time updates. TanStack Query's refetch-on-window-focus provides "semi-live" data when the user switches back to the tab, which is enough for this use case. A WebSocket layer was on the bonus list but skipped.
- No frontend tests. See the trade-offs section.
- Free tier services have spin-down behavior. First request after idle on the Railway backend may take up to 60s, which means the very first signup/login attempt after a long idle may feel slow.

## Backend Repo

The NestJS backend that powers this UI:
https://github.com/HaiderAli-Ravian/manageit-backend

Setup, environment variables, and API documentation live there.

## Author

Built by **Haider Ali**.

GitHub: [HaiderAli-Ravian](https://github.com/HaiderAli-Ravian)
