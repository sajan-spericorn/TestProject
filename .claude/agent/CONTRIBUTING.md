# Contributing

## Prerequisites

- Node.js v18+ (project developed on v24.x)
- npm

---

## Running Locally

### Backend

```bash
# From project root
npm install
npm run dev       # node --watch index.js — auto-reloads on file changes
```

Server starts on `http://localhost:3000`. Override the port:

```bash
PORT=4000 npm run dev
```

### Frontend

The backend must be running first. The frontend hard-codes `http://localhost:3000` as the API base URL — if the backend is on a different port, update `API_BASE_URL` in both component files before starting.

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

Open `http://localhost:3001`.

> **Why port 3001?** Both Next.js dev server and Express default to port 3000. If they share a port, frontend API calls return HTML instead of JSON. Express holds 3000; Next.js runs on 3001.

---

## Running Tests

### Backend tests

```bash
# From project root
npm test              # run once
npm run test:watch    # watch mode — re-runs on file changes
```

- Framework: Jest + Supertest
- Test file: [`__tests__/calculator.test.js`](../../__tests__/calculator.test.js)
- Supertest mounts the Express app directly — no running server needed
- Coverage collected from `index.js`

### Frontend tests

```bash
cd frontend
npm test              # run once
npm run test:watch    # watch mode
```

- Framework: Jest + React Testing Library
- Test files: [`frontend/__tests__/`](../../frontend/__tests__/)
- All `fetch` calls are mocked — no real network requests are made
- Uses `jest-environment-jsdom` and `@testing-library/jest-dom` matchers

---

## Test Count Reference

| Suite | File | Tests |
|---|---|---|
| Backend API | `__tests__/calculator.test.js` | 84 |
| Basic calculator component | `frontend/__tests__/CalculatorUI.test.js` | 66 |
| Scientific calculator component | `frontend/__tests__/ScientificCalculator.test.js` | 41 |
| **Total** | | **191** |

---

## Making Changes

### Adding a new API endpoint

1. Add the route handler in `index.js`
2. Validate all inputs at the top of the handler (type-check with `typeof`, check for `undefined`)
3. Return `400` with `{ "error": "..." }` for all validation and domain errors
4. Export the `app` (already done) — tests import it directly
5. Add tests in `__tests__/calculator.test.js` covering success, validation errors, and domain errors

### Adding a new frontend function

1. If it calls a new endpoint, add the fetch call in the appropriate component (`CalculatorUI.js` or `ScientificCalculator.js`)
2. Follow the existing pattern: `setLoading(true)` → fetch → `setDisplay(String(result))` → catch → `setError(err.message)`
3. Add a button in the JSX
4. Add tests in the corresponding `__tests__/` file; mock `global.fetch` for the new endpoint

### Changing the API base URL

Update `API_BASE_URL` at the top of both:
- `frontend/components/CalculatorUI.js`
- `frontend/components/ScientificCalculator.js`

---

## Code Style

- No build step on the backend — plain Node.js CommonJS (`require`/`module.exports`)
- Frontend uses `'use client'` React components with React hooks
- CSS Modules only — no global stylesheets beyond the inline body reset in `layout.js`
- No TypeScript — plain JavaScript throughout
- No linter or formatter is configured; follow the conventions visible in the existing files
