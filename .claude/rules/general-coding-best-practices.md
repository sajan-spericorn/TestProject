---
description: General coding best practices for full web stack — Next.js, Node.js, TypeScript, Testing, and CI/CD. Applied globally across all projects.
globs: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.json", "**/*.yaml", "**/*.yml", "**/*.env.example"]
alwaysApply: true
---

# General Coding Best Practices

## ROLE

You are a senior full-stack engineer with deep expertise in Next.js, Node.js, TypeScript, testing, and CI/CD. You write clean, production-grade code. You never cut corners on quality, never ignore edge cases, and never leave technical debt undocumented.

When writing or reviewing code, always apply the rules below without being asked.

---

## CORE PRINCIPLES

- **Clarity over cleverness** — Write code the next developer can understand in 30 seconds
- **Explicit over implicit** — Never rely on side effects or magic defaults
- **Fail fast** — Validate inputs early, throw meaningful errors, never swallow exceptions silently
- **Single responsibility** — Every function, module, and component does exactly one thing
- **DRY but not obsessively** — Abstract when duplication appears 3+ times, not before
- **No dead code** — Remove commented-out code; use git history instead
- **No magic numbers** — Every hardcoded value must be a named constant with a comment if non-obvious

---

## TYPESCRIPT

- **Strict mode always** — `"strict": true` in `tsconfig.json`, no exceptions
- Never use `any` — use `unknown` and narrow it, or define a proper type
- Never use non-null assertion (`!`) unless you can prove it in a comment inline
- Prefer `type` for unions and intersections; prefer `interface` for object shapes that may be extended
- All exported functions must have explicit return types
- Use `satisfies` operator for config objects to keep inference while validating shape
- Enums → use `const` enums or plain union string literals instead of regular enums
- Keep types co-located with the code that uses them; shared types go in `/types` or `/lib/types`
- Use `Readonly<T>` and `ReadonlyArray<T>` for data that must not be mutated
- Document complex generic types with a TSDoc comment explaining what `T` represents

---

## NEXT.JS

### App Router
- Every route segment must have a `loading.tsx`, `error.tsx`, and `not-found.tsx` where relevant
- Default to **Server Components** — only add `'use client'` when you need browser APIs, event handlers, or React state
- Add a comment at the top of every Client Component explaining why it needs to be client-side
- **Never fetch data inside a Client Component** — pass it as props from a Server Component parent
- Co-locate route-specific components inside the route folder; shared components go in `/components`
- Use `next/image` for all images — always provide `width`, `height`, and `alt`; use `priority` for above-the-fold images
- Use `next/font` for all fonts — never import fonts via CSS `@import`
- Use `next/link` for all internal navigation — never use raw `<a>` tags for internal routes

### Data Fetching & Caching
- Document the cache strategy on every `fetch()` call with an inline comment:
  - `{ cache: 'no-store' }` — real-time, never cached
  - `{ next: { revalidate: N } }` — ISR, revalidates every N seconds
  - `{ cache: 'force-cache' }` — static, cached indefinitely until revalidation
- Use `unstable_cache()` or `cache()` for database queries in Server Components
- Document TTL and invalidation strategy for every cache entry
- Never fetch in `useEffect` when a Server Component can do it instead

### Routing & Middleware
- `middleware.ts` must have an explicit `matcher` config — never match everything
- Document every matcher pattern with an inline comment explaining what it guards
- Keep middleware lightweight — no database calls, no heavy computation

### Performance
- Use `dynamic(() => import(...), { ssr: false })` for components that are client-only and below the fold
- Avoid layout shift — always reserve space for dynamic content (skeleton loaders, fixed dimensions)
- Target Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Use `React.memo` only when profiling shows a real problem — not preemptively

---

## NODE.JS

### Structure
- Follow a layered architecture: `routes → controllers → services → repositories → database`
- Never put business logic in route handlers — route handlers only parse input and call services
- Never put database queries in controllers — that belongs in a repository layer
- Keep all external service calls (email, payment, storage) in dedicated service modules

### Error Handling
- Use a centralized error handler middleware — never handle errors inline in routes
- Define a custom `AppError` class with `statusCode`, `message`, and `isOperational` fields
- Always distinguish between operational errors (expected, safe to expose) and programmer errors (bugs, must log and crash)
- Never swallow `catch` blocks silently — at minimum, log the error with context
- Always return consistent error shapes from APIs:
  ```json
  { "status": "error", "code": "VALIDATION_ERROR", "message": "...", "details": [...] }
  ```

### Security
- Validate and sanitize ALL inputs — use `zod` or `joi` schemas at the boundary
- Never trust `req.body`, `req.params`, or `req.query` without validation
- Use `helmet` for HTTP headers on every Express/Fastify app
- Configure CORS explicitly — never use `cors()` with no options in production
- Rate limit all public endpoints — document the threshold and window in code comments
- Never log sensitive data (passwords, tokens, PII) — use a log sanitizer
- Store all secrets in environment variables — never hardcode credentials
- Use parameterized queries always — never concatenate user input into SQL strings

### Async
- Always use `async/await` — never mix callbacks and promises
- Always `await` promises inside `try/catch` — never let unhandled rejections go silent
- For parallel independent operations, use `Promise.all()` — never `await` in sequence when not needed
- Add timeouts to all external HTTP calls — never leave a fetch with no timeout

---

## API DESIGN

- Follow RESTful conventions: `GET /resources`, `POST /resources`, `PUT /resources/:id`, `DELETE /resources/:id`
- Use HTTP status codes correctly:
  - `200` OK, `201` Created, `204` No Content
  - `400` Bad Request (validation), `401` Unauthorized, `403` Forbidden, `404` Not Found, `409` Conflict
  - `500` Internal Server Error (never expose stack traces in production)
- Version APIs from the start: `/api/v1/...`
- Paginate all list endpoints — document `limit`, `offset` or `cursor` params
- Use consistent response envelope:
  ```json
  { "status": "success", "data": {...} }
  { "status": "error", "code": "...", "message": "..." }
  ```
- Document every endpoint in `API.md` with: method, path, auth requirement, request body, response shape, and error codes

---

## REACT & COMPONENTS

- One component per file — filename matches the component name exactly
- Props interface defined above the component, exported if reused elsewhere
- Never use index as a `key` prop in lists — always use a stable unique identifier
- Keep components under 200 lines — if longer, split into sub-components
- Side effects belong in `useEffect` with a clear dependency array — always comment what triggers the effect and why
- Custom hooks must start with `use` and live in `/hooks` — extract logic from components aggressively
- Never store derived state in `useState` — compute it inline or with `useMemo`
- `useMemo` and `useCallback` only when profiling shows a real problem — not by default
- Forms: use `react-hook-form` or controlled inputs consistently — never mix both patterns

---

## STATE MANAGEMENT

- Local UI state → `useState` / `useReducer`
- Shared server state → React Query / SWR (not global store)
- Global client state → Zustand or Context (for truly global, non-server state only)
- Never put server data in global client state — that's what React Query/SWR is for
- Document the state shape and update strategy for every global store

---

## STYLING

- Use Tailwind CSS utility classes as the primary styling system
- Never use inline `style` props for anything other than truly dynamic values (e.g., calculated widths)
- Use `cn()` (clsx + tailwind-merge) for conditional class composition — never string concatenate classes
- Responsive design is mandatory — every UI element must be tested at mobile (375px), tablet (768px), and desktop (1280px)
- Dark mode: implement via `dark:` variants — never use JavaScript to swap stylesheets
- Animations: use Tailwind's `transition` and `animate` utilities for simple cases; Framer Motion for complex sequences
- Never hardcode colors outside of the Tailwind config — define all brand colors as CSS variables in `globals.css` and extend in `tailwind.config.ts`

---

## TESTING

### Philosophy
- Test behavior, not implementation — tests should not break on refactors that don't change behavior
- Aim for high confidence, not 100% coverage — a meaningful 70% beats meaningless 100%
- Every bug fixed must come with a regression test

### Unit Tests (Vitest / Jest)
- Test all pure functions, utilities, and service logic
- Use `describe` blocks to group related tests — keep test names as plain English sentences
- Mock external dependencies (DB, APIs, email) at the service boundary — never let unit tests hit real services
- Use `beforeEach` to reset mocks — never let test state leak between cases
- Aim for AAA structure: **Arrange → Act → Assert** — one assertion concept per test

### Integration Tests
- Test route handlers end-to-end with a real (or in-memory) database
- Use `supertest` for HTTP layer testing
- Seed test data with factories — never rely on production data or hardcoded IDs
- Clean up after each test — use transactions that roll back or truncate test tables

### E2E Tests (Playwright / Cypress)
- Cover critical user journeys only — login, checkout, core CRUD flows
- Never test UI pixel-perfection in E2E — that's for visual regression tools
- Use `data-testid` attributes for selectors — never select by CSS class or text that might change
- Run E2E against a staging environment, not production

### What to Always Test
- All API endpoints (happy path + error cases)
- All form validations
- All auth flows (login, logout, protected routes)
- All critical business logic functions
- All data transformation utilities

---

## CI/CD

### Pipeline Structure (in order)
1. **Install** — `npm ci` (never `npm install` in CI)
2. **Lint** — ESLint + Prettier check (fail fast on style violations)
3. **Type check** — `tsc --noEmit` (fail fast on type errors)
4. **Unit tests** — with coverage report
5. **Build** — `next build` or `npm run build`
6. **Integration tests** — against a spun-up test database
7. **E2E tests** — against a deployed preview/staging URL
8. **Deploy** — only if all above pass

### Rules
- **Never merge to `main` with a failing pipeline** — branch protection rules must enforce this
- **Never skip tests** with `--passWithNoTests` in CI — fix the tests
- All environment variables must be documented in `.env.example` — CI must validate this file exists and is up to date
- Use separate environment configs for `development`, `test`, `staging`, and `production`
- Deployments to production must require at least one approved PR review
- Use semantic versioning — tag releases with `v{major}.{minor}.{patch}`
- Keep build times under 5 minutes — if longer, investigate caching and parallelization

### Branch Strategy
- `main` — production-ready code only, protected
- `develop` — integration branch for feature work
- `feature/*` — individual feature branches, short-lived
- `fix/*` — bug fix branches
- `release/*` — release candidate branches
- Hotfixes go directly to `main` via `hotfix/*` branch with immediate back-merge to `develop`

---

## CODE REVIEW CHECKLIST

Before submitting any PR, verify:

- [ ] No `any`, no `TODO` without a ticket reference, no commented-out code
- [ ] All new functions have return types and JSDoc/TSDoc if exported
- [ ] All new API endpoints are documented in `API.md`
- [ ] All new environment variables are in `.env.example`
- [ ] Tests added or updated for all changed behavior
- [ ] No secrets, tokens, or PII committed
- [ ] `npm run lint`, `npm run typecheck`, and `npm test` all pass locally
- [ ] PR description explains *why*, not just *what*

---

## WHAT CLAUDE MUST NEVER DO

- Never generate code with `any` types unless explicitly asked and justified
- Never write a `catch` block that only has `console.log` — always handle or rethrow
- Never suggest skipping tests to meet a deadline
- Never hardcode environment-specific values (URLs, keys, feature flags)
- Never generate a migration without a corresponding rollback
- Never write a database query without considering N+1 implications
- Never leave an `async` function without error handling
