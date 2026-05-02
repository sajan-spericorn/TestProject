# Calculator App

A full-stack calculator with a **Node.js/Express REST API** backend and a **Next.js 14** frontend. Supports basic arithmetic and a full suite of scientific math functions. All computation happens server-side — the frontend holds no math logic.

---

## Quick Start

### 1. Backend

```bash
# From project root
npm install
npm start
# → http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev -- --port 3001
# → http://localhost:3001
```

> Both servers must run simultaneously. The backend **must** use port 3000 (the frontend hard-codes `http://localhost:3000` as its API base URL).

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the Express backend binds to |

No `.env` file is needed. The frontend has no runtime environment configuration — see `API_BASE_URL` in [Configuration](#configuration).

---

## Project Structure

```
TestProject/
├── index.js                        # Express API server
├── package.json
├── jest.config.js
├── __tests__/
│   └── calculator.test.js          # Backend API tests (84 tests)
│
├── frontend/
│   ├── app/
│   │   ├── layout.js               # Root HTML layout
│   │   └── page.js                 # Home page — mode toggle
│   ├── components/
│   │   ├── CalculatorUI.js         # Basic 4-function calculator
│   │   └── ScientificCalculator.js # Full scientific calculator
│   ├── styles/                     # CSS Modules per component
│   └── __tests__/                  # Frontend component tests (107 tests)
│
├── PROJECT.md                      # Full project documentation
├── README.md                       # Backend quick-start
└── TESTING.md                      # Testing guide
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend runtime | Node.js | v24.x |
| Backend framework | Express | ^4.18.2 |
| CORS middleware | cors | ^2.8.5 |
| Frontend framework | Next.js (App Router) | ^14.0.0 |
| Frontend UI | React | ^18.2.0 |
| Styling | CSS Modules | — |
| Backend testing | Jest + Supertest | ^29.7.0 / ^6.3.3 |
| Frontend testing | Jest + React Testing Library | ^29.7.0 / ^14.1.2 |

---

## Configuration

### API Base URL (frontend)

Hard-coded at the top of each component:

```js
// frontend/components/CalculatorUI.js
// frontend/components/ScientificCalculator.js
const API_BASE_URL = 'http://localhost:3000';
```

Update both files when deploying to a non-local environment.

### Path Aliases (frontend)

`@/` maps to `frontend/` root, configured in `jsconfig.json` and Jest's `moduleNameMapper`.

```js
import styles from '@/styles/calculator.module.css';
```

---

## Development

```bash
# Backend — auto-reload on file changes
npm run dev

# Frontend — Next.js hot-reloads automatically
cd frontend && npm run dev -- --port 3001
```

---

## Testing

```bash
# Backend (from project root)
npm test

# Frontend (from frontend/)
cd frontend && npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full testing details and [API.md](API.md) for endpoint reference.
