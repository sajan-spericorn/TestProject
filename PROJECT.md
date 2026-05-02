# Calculator App — Full Project Documentation

A full-stack calculator application with a **Node.js/Express REST API backend** and a **Next.js 14 React frontend**. Supports basic arithmetic and a full suite of scientific math functions. The frontend communicates with the backend exclusively through HTTP API calls — no computation is done client-side.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Tech Stack](#tech-stack)
4. [Backend](#backend)
   - [Setup](#backend-setup)
   - [Running the Server](#running-the-server)
   - [API Reference](#api-reference)
   - [Error Handling](#error-handling)
5. [Frontend](#frontend)
   - [Setup](#frontend-setup)
   - [Running the Dev Server](#running-the-dev-server)
   - [Pages & Layout](#pages--layout)
   - [Components](#components)
   - [Styling & Responsiveness](#styling--responsiveness)
6. [Running Both Servers Together](#running-both-servers-together)
7. [Testing](#testing)
   - [Backend Tests](#backend-tests)
   - [Frontend Tests](#frontend-tests)
   - [Test Coverage Summary](#test-coverage-summary)
8. [Configuration](#configuration)
9. [Known Behaviours & Notes](#known-behaviours--notes)

---

## Architecture Overview

```
Browser (localhost:3001)
        │
        │  HTTP fetch (POST/GET)
        ▼
Next.js Frontend  (localhost:3001)
        │
        │  REST API calls — all math computed server-side
        ▼
Express Backend  (localhost:3000)
```

The frontend holds no math logic. Every button press that requires a calculation (including addition, sin, factorial, etc.) triggers a `POST` request to the backend. The backend validates inputs, performs the computation, and returns a JSON result.

---

## Directory Structure

```
TestProject/
├── index.js                        # Express API server entry point
├── package.json                    # Backend dependencies & scripts
├── jest.config.js                  # Backend Jest config
├── __tests__/
│   └── calculator.test.js          # Backend API integration tests (84 tests)
│
├── frontend/
│   ├── package.json                # Frontend dependencies & scripts
│   ├── jest.config.js              # Frontend Jest config (Next.js aware)
│   ├── jest.setup.js               # jest-dom matchers setup
│   ├── jsconfig.json               # Path alias: @/ → ./
│   │
│   ├── app/
│   │   ├── layout.js               # Root HTML layout (metadata, body styles)
│   │   └── page.js                 # Home page — mode toggle + calculator render
│   │
│   ├── components/
│   │   ├── CalculatorUI.js         # Basic 4-operation calculator component
│   │   └── ScientificCalculator.js # Full scientific calculator component
│   │
│   ├── styles/
│   │   ├── page.module.css         # Page layout & mode toggle styles
│   │   ├── calculator.module.css   # Basic calculator styles
│   │   └── scientific-calculator.module.css  # Scientific calculator styles
│   │
│   └── __tests__/
│       ├── CalculatorUI.test.js         # Basic calculator component tests (66 tests)
│       └── ScientificCalculator.test.js # Scientific calculator component tests (41 tests)
│
├── PROJECT.md                      # This file
├── README.md                       # Backend quick-start
├── TESTING.md                      # Testing guide
└── CLAUDE.md                       # Claude Code project instructions
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Backend runtime | Node.js | v24.x |
| Backend framework | Express | ^4.18.2 |
| CORS middleware | cors | ^2.8.5 |
| Frontend framework | Next.js (App Router) | ^14.0.0 |
| Frontend UI library | React | ^18.2.0 |
| Styling | CSS Modules | — |
| Backend testing | Jest + Supertest | ^29.7.0 / ^6.3.3 |
| Frontend testing | Jest + React Testing Library | ^29.7.0 / ^14.1.2 |
| Test DOM matchers | @testing-library/jest-dom | ^6.1.4 |
| Test environment | jest-environment-jsdom | ^29.7.0 |

---

## Backend

### Backend Setup

```bash
# From project root
npm install
```

Dependencies installed:
- `express` — HTTP server & routing
- `cors` — Cross-origin request headers (allows frontend on :3001 to call :3000)
- `jest` + `supertest` — Testing (devDependencies)

### Running the Server

```bash
# Production / standard start
npm start
# → node index.js

# Development (auto-reload on file changes)
npm run dev
# → node --watch index.js
```

The server binds to `PORT` environment variable or defaults to **3000**.

```bash
# Override port example
PORT=4000 npm start
```

### API Reference

All endpoints accept and return `application/json`. All `POST` endpoints require a `Content-Type: application/json` header.

---

#### `GET /`

Returns API metadata and available endpoint descriptions.

**Response `200`:**
```json
{
  "message": "Calculator API",
  "endpoints": {
    "health": "GET /health",
    "calculate": "POST /calculate - { operation, a, b }",
    "add": "POST /add - { a, b }",
    "subtract": "POST /subtract - { a, b }",
    "multiply": "POST /multiply - { a, b }",
    "divide": "POST /divide - { a, b }"
  }
}
```

---

#### `GET /health`

Health check endpoint.

**Response `200`:**
```json
{ "status": "ok" }
```

---

#### `POST /add`

**Request body:**
```json
{ "a": 10, "b": 5 }
```

**Response `200`:**
```json
{ "result": 15 }
```

---

#### `POST /subtract`

**Request body:**
```json
{ "a": 10, "b": 3 }
```

**Response `200`:**
```json
{ "result": 7 }
```

---

#### `POST /multiply`

**Request body:**
```json
{ "a": 4, "b": 7 }
```

**Response `200`:**
```json
{ "result": 28 }
```

---

#### `POST /divide`

**Request body:**
```json
{ "a": 20, "b": 4 }
```

**Response `200`:**
```json
{ "result": 5 }
```

**Error `400`** (division by zero):
```json
{ "error": "Cannot divide by zero" }
```

---

#### `POST /calculate`

Generic arithmetic endpoint. Operation name is **case-insensitive**.

**Request body:**
```json
{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

Supported operations: `add`, `subtract`, `multiply`, `divide`

**Response `200`:**
```json
{
  "operation": "add",
  "a": 10,
  "b": 5,
  "result": 15
}
```

---

#### `POST /calculate-advanced`

Performs unary scientific math operations. The `angle` field is optional and defaults to `"degrees"` — it only affects trigonometric functions.

**Request body:**
```json
{
  "operation": "sin",
  "value": 90,
  "angle": "degrees"
}
```

**Response `200`:**
```json
{
  "operation": "sin",
  "value": 90,
  "result": 1
}
```

**Supported operations:**

| Operation | Description | Domain restrictions |
|---|---|---|
| `sqrt` | Square root √x | x ≥ 0 |
| `square` | x² | — |
| `cube` | x³ | — |
| `sin` | Sine (degrees or radians) | — |
| `cos` | Cosine (degrees or radians) | — |
| `tan` | Tangent (degrees or radians) | — |
| `asin` | Inverse sine → result in degrees or radians | −1 ≤ x ≤ 1 |
| `acos` | Inverse cosine → result in degrees or radians | −1 ≤ x ≤ 1 |
| `atan` | Inverse tangent → result in degrees or radians | — |
| `log` | Base-10 logarithm | x > 0 |
| `ln` | Natural logarithm | x > 0 |
| `exp` | eˣ | — |
| `factorial` | n! | n ≥ 0, integer only |
| `reciprocal` | 1/x | x ≠ 0 |
| `percent` | x ÷ 100 | — |
| `negate` | −x | — |
| `abs` | \|x\| | — |
| `pi` | Returns π (ignores value) | — |
| `e` | Returns e (ignores value) | — |

**Angle mode:** `"degrees"` (default) or `"radians"`. Affects `sin`, `cos`, `tan` (input) and `asin`, `acos`, `atan` (output).

---

#### `POST /power`

Computes `base ^ exponent` using `Math.pow`.

**Request body:**
```json
{ "base": 2, "exponent": 10 }
```

**Response `200`:**
```json
{
  "result": 1024,
  "expression": "2^10"
}
```

---

### Error Handling

All endpoints return `400` with an `{ "error": "..." }` body for:
- Missing required fields
- Non-numeric inputs where numbers are required
- Domain violations (e.g., sqrt of negative, log of zero, asin out of range)
- Division by zero
- Unknown operation names

Example:
```json
{ "error": "Cannot take square root of negative number" }
{ "error": "Missing required fields: operation, value" }
{ "error": "Value must be a number" }
{ "error": "Factorial only for non-negative integers" }
```

---

## Frontend

### Frontend Setup

```bash
cd frontend
npm install
```

Dependencies installed:
- `next`, `react`, `react-dom` — UI framework
- `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom` — testing (devDependencies)

### Running the Dev Server

The backend must be running on port 3000 before starting the frontend. The frontend must use a different port (3001 is the convention used in this project).

```bash
# Backend first (from project root)
npm start

# Then frontend (from frontend/ directory)
npm run dev -- --port 3001
```

Visit `http://localhost:3001` in the browser.

**Why separate ports?**
Both the Next.js dev server and Express default to port 3000. If they share a port, frontend API calls hit the Next.js server instead of Express, returning HTML and causing JSON parse errors. Express must hold port 3000; Next.js runs on 3001.

```bash
# Build for production
npm run build

# Serve production build (also needs --port 3001 if backend is on 3000)
npm run start -- --port 3001
```

### Pages & Layout

**[`app/layout.js`](frontend/app/layout.js)**
Root layout component. Sets page metadata (`title: 'Calculator'`) and applies global body styles (no margin/padding, system font stack).

**[`app/page.js`](frontend/app/page.js)**
Home page. Manages the `mode` state (`'scientific'` | `'basic'`), renders a toggle button bar, and conditionally renders either `<ScientificCalculator />` or `<CalculatorUI />`.

The default mode on load is **scientific**.

### Components

#### `CalculatorUI` — Basic Calculator

**File:** [`frontend/components/CalculatorUI.js`](frontend/components/CalculatorUI.js)

A standard 4-function calculator. Layout: 4 columns × 5 rows of buttons.

**State:**
| State variable | Type | Purpose |
|---|---|---|
| `display` | `string` | Current number shown on screen (starts `'0'`) |
| `firstOperand` | `number \| null` | Stored left-hand value for a pending operation |
| `operation` | `string \| null` | Pending operation: `'add'`, `'subtract'`, `'multiply'`, `'divide'` |
| `shouldResetDisplay` | `boolean` | When `true`, next digit input clears the display first |
| `loading` | `boolean` | Shows "Calculating…" overlay during fetch |
| `error` | `string \| null` | Shows error banner when set |

**Behaviour:**
- Number buttons append digits; if `shouldResetDisplay` is true, the display resets to just that digit first
- Pressing an operator while a previous operation is pending triggers `handleEquals` with the new operator as `nextOp` (chained calculation)
- `=` calls `handleEquals(null)`, which POSTs to `http://localhost:3000/{operation}` with `{ a, b }` and displays the result
- If `=` is pressed with no second operand entered, the current display value is reused as the second operand (standard calculator behaviour: `5 + =` computes `5 + 5`)
- `AC` resets all state to initial values
- `←` removes the last character; resets to `'0'` if only one character remains
- Errors clear automatically on the next number or AC press

**Buttons rendered:**
`AC`, `←`, `÷`, `×`, `7`–`9`, `−`, `4`–`6`, `+`, `1`–`3`, `=`, `0` (wide), `.`

**API calls made:** `POST /add`, `POST /subtract`, `POST /multiply`, `POST /divide`

---

#### `ScientificCalculator` — Scientific Calculator

**File:** [`frontend/components/ScientificCalculator.js`](frontend/components/ScientificCalculator.js)

Extended calculator with trigonometry, logarithms, factorials, power, and mathematical constants. Layout: 4 columns × 10 rows.

**State:** Same as `CalculatorUI` plus:
| State variable | Type | Purpose |
|---|---|---|
| `angleMode` | `'degrees' \| 'radians'` | Controls trig input/output unit; toggled via DEG/RAD button |

**Behaviour:**
- All scientific functions call `POST /calculate-advanced` with `{ operation, value, angleMode }`
- The `±` button calls `negate`, `%` calls `percent`, `|x|` calls `abs`
- `π` and `e` buttons fetch their constant values from the API (ignoring the current display value)
- Power (`xʸ`): first press stores the current display as `firstOperand` and sets `operation = 'power'`; second press sends `POST /power` with `{ base, exponent }`
- The four arithmetic operators (`+`, `−`, `×`, `÷`) and `=` behave identically to `CalculatorUI`, calling `/add`, `/subtract`, `/multiply`, `/divide`
- After any advanced function completes, `firstOperand` and `operation` are cleared so the result can be used as a fresh starting value

**Additional buttons over basic calculator:**
`±`, `%`, `√`, `x²`, `x³`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `eˣ`, `n!`, `1/x`, `xʸ`, `π`, `e`, `|x|`, angle toggle (`DEGREES`/`RADIANS`)

**API calls made:**
- `POST /calculate-advanced` — all scientific functions
- `POST /power` — xʸ operation
- `POST /add`, `/subtract`, `/multiply`, `/divide` — basic arithmetic

**API base URL:** Hard-coded to `http://localhost:3000` in both components. To change it, update `API_BASE_URL` at the top of each component file.

---

### Styling & Responsiveness

All styles use **CSS Modules** (`.module.css`). Class names are locally scoped per component.

**Files:**
- [`styles/page.module.css`](frontend/styles/page.module.css) — full-viewport gradient background, centered container, mode toggle buttons
- [`styles/calculator.module.css`](frontend/styles/calculator.module.css) — basic calculator card, 4-column grid, operator/equals/zero button variants
- [`styles/scientific-calculator.module.css`](frontend/styles/scientific-calculator.module.css) — scientific card, 4-column grid, angle toggle button, function button variant

**Responsive design:** All three CSS files implement fluid scaling and explicit breakpoints:

| Breakpoint | Changes applied |
|---|---|
| Fluid (all sizes) | `clamp()` for font sizes on display and buttons (scales between viewport widths) |
| `≤ 480px` | Reduced padding on cards and grids, smaller gaps, smaller button heights |
| `≤ 360px` | Further reduced button height/padding and display padding for very small phones |

The page container uses `max-width: 540px` with `width: 100%` so it never overflows narrow viewports. The scientific calculator card caps at `max-width: 500px`; the basic calculator at `max-width: 320px`.

---

## Running Both Servers Together

**Terminal 1 — Backend:**
```bash
cd /path/to/TestProject
npm start
# Calculator API listening on port 3000
```

**Terminal 2 — Frontend:**
```bash
cd /path/to/TestProject/frontend
npm run dev -- --port 3001
# ▲ Next.js 14
# - Local: http://localhost:3001
```

Open `http://localhost:3001` in the browser.

**Auto-reload during development:**
```bash
# Backend with watch mode
npm run dev

# Frontend (Next.js hot reloads automatically)
npm run dev -- --port 3001
```

---

## Testing

### Backend Tests

**File:** [`__tests__/calculator.test.js`](__tests__/calculator.test.js)  
**Framework:** Jest + Supertest  
**Run from:** project root (`/TestProject`)

```bash
npm test             # Run once
npm run test:watch   # Watch mode
```

Supertest mounts the Express `app` directly — no server port is needed, tests run in isolation.

**Jest config** ([`jest.config.js`](jest.config.js)):
- `testEnvironment: 'node'`
- Excludes `/frontend/` directory
- Coverage collected from `index.js`

**Test suite breakdown (84 tests total):**

| Suite | Tests | What is covered |
|---|---|---|
| `GET /health` | 1 | Status ok response |
| `GET /` | 1 | API info shape |
| `POST /add` | 7 | Positive, negative, decimal inputs; missing `a`, missing `b`, non-numeric `a`, non-numeric `b` |
| `POST /subtract` | 3 | Correct result, negative result, non-numeric input |
| `POST /multiply` | 4 | Correct result, multiply by zero, negative, non-numeric |
| `POST /divide` | 4 | Correct result, decimal result, divide by zero, non-numeric |
| `POST /calculate` | 9 | All four operations, case-insensitive op names, missing fields, unknown op, divide-by-zero |
| `POST /calculate-advanced` — Algebraic | 12 | sqrt (valid + negative error), square (positive + negative), cube, reciprocal (valid + zero error), percent, negate (positive + negative), abs (negative + positive) |
| `POST /calculate-advanced` — Trig (degrees) | 5 | sin(0), sin(90), cos(0), cos(90), tan(45) |
| `POST /calculate-advanced` — Trig (radians) | 2 | sin(π/2), cos(π) |
| `POST /calculate-advanced` — Inverse trig | 6 | asin(1)→90°, asin domain error, acos(1)→0°, acos domain error, atan(1)→45°, asin in radians mode |
| `POST /calculate-advanced` — Logarithms & exp | 8 | log(100), log(1), log(0) error, log(−1) error, ln(e), ln(0) error, exp(1), exp(0) |
| `POST /calculate-advanced` — Factorial | 5 | 0!, 5!, 10!, negative error, non-integer error |
| `POST /calculate-advanced` — Constants | 2 | pi → Math.PI, e → Math.E |
| `POST /calculate-advanced` — Validation | 6 | Missing value, missing operation, non-number value, unknown operation, case-insensitive op names, default angle mode |
| `POST /power` | 9 | 2^3=8, n^0=1, negative base odd exponent, fractional exponent, response shape, missing base, missing exponent, non-number base, non-number exponent |

---

### Frontend Tests

**Framework:** Jest + React Testing Library  
**Run from:** `frontend/` directory

```bash
cd frontend
npm test             # Run once
npm run test:watch   # Watch mode
```

All fetch calls are mocked via `global.fetch = jest.fn()`. No real network requests are made.

**Jest config** ([`frontend/jest.config.js`](frontend/jest.config.js)):
- Uses `next/jest` wrapper (handles Next.js transforms, CSS module mocking, etc.)
- `testEnvironment: 'jest-environment-jsdom'`
- Path alias `@/` → `./` (matches `jsconfig.json`)
- Setup file: `jest.setup.js` (imports `@testing-library/jest-dom`)

---

#### CalculatorUI Tests

**File:** [`frontend/__tests__/CalculatorUI.test.js`](frontend/__tests__/CalculatorUI.test.js)  
**Total: 66 tests**

| Suite | Tests | What is covered |
|---|---|---|
| Rendering | 5 | Initial display `'0'`; all number buttons 0–9; operator buttons `+`, `−`, `×`, `÷`; equals button; AC and backspace buttons |
| Number Input | 6 | Single digit, multi-digit append, decimal, no double decimal, display unchanged after operator, display resets on next digit after operator |
| Clear and Backspace | 3 | AC resets to `'0'`; backspace removes last char; backspace on single char → `'0'` |
| API Integration | 5 | Fetch called with correct URL + body for addition; result displayed after success; API error shown in error banner; network error shown in error banner; all four operations map to correct endpoints |
| Chained Operations | 1 | Second operator press triggers intermediate calculation (fetch called once) |
| Decimal edge cases | 2 | Decimal after operator resets display to `'0.'`; decimal after operator then digit shows `'0.5'` |
| Error state | 3 | Error clears on AC; display resets to `'0'` after failed operation; error clears on new number input |
| Does not call API prematurely | 2 | No fetch when `=` pressed with no operation set; second operand defaults to display value when `=` pressed without entering one |

---

#### ScientificCalculator Tests

**File:** [`frontend/__tests__/ScientificCalculator.test.js`](frontend/__tests__/ScientificCalculator.test.js)  
**Total: 41 tests**

| Suite | Tests | What is covered |
|---|---|---|
| Rendering | 5 | Initial display; angle toggle shows `DEGREES`; all number buttons 0–9; all scientific function buttons; operators and AC/backspace/equals |
| Number Input | 6 | Single digit, multi-digit append, no leading zero, decimal, no double decimal, display resets after operator |
| Clear and Backspace | 4 | AC resets display; backspace removes last char; backspace on single char → `'0'`; AC clears error message |
| Angle Mode Toggle | 4 | DEGREES → RADIANS toggle; RADIANS → DEGREES toggle; API receives `angle: 'degrees'` by default; API receives `angle: 'radians'` after toggle |
| Advanced Functions | 8 | `sqrt` (fetch + result displayed), `sin`, `cos`, `log`, `n!` (factorial), `±` (negate), `π` (pi constant), `1/x` (reciprocal) — all verified with exact fetch payload and display result; state reset after advanced function |
| Power Operation | 2 | First `xʸ` press stores base without calling API; second `xʸ` press calls `/power` with correct base/exponent and displays result |
| Basic Arithmetic | 4 | `+`, `−`, `×`, `÷` all call correct endpoints with correct payloads and show results; chained operation triggers intermediate fetch |
| Error Handling | 4 | API error message displayed; error clears on next number input; display resets to `'0'` after failed arithmetic; network failure shows error message |

---

### Test Coverage Summary

| Area | Test file | Tests |
|---|---|---|
| Backend API endpoints | `__tests__/calculator.test.js` | **84** |
| Basic calculator component | `frontend/__tests__/CalculatorUI.test.js` | **66** |
| Scientific calculator component | `frontend/__tests__/ScientificCalculator.test.js` | **41** |
| **Total** | | **191** |

---

## Configuration

### Path Aliases

The frontend uses `@/` as an alias for the `frontend/` root, configured in both [`jsconfig.json`](frontend/jsconfig.json) and the Jest `moduleNameMapper`.

```js
// Usage in components
import styles from '@/styles/calculator.module.css';
import CalculatorUI from '@/components/CalculatorUI';
```

### API Base URL

Defined as a constant at the top of each component:

```js
// frontend/components/CalculatorUI.js
// frontend/components/ScientificCalculator.js
const API_BASE_URL = 'http://localhost:3000';
```

Change this constant in both files if the backend runs on a different host or port.

### Backend Port

Controlled via the `PORT` environment variable:

```bash
PORT=8080 npm start
```

Default: `3000`.

---

## Known Behaviours & Notes

- **`=` with no second operand entered** — the current display value is reused as the second operand. Pressing `5 → + → =` computes `5 + 5 = 10`. This is standard calculator behaviour.

- **Trig domain: `tan` near ±90°** — `Math.tan(90° in radians)` returns a very large finite number (not `Infinity`) due to floating-point precision. No special handling is applied; results may be very large.

- **Factorial is integer-only** — passing a decimal to `/calculate-advanced` with `operation: 'factorial'` returns a `400` error. The frontend does not prevent non-integer input before calling the API.

- **`π` and `e` constant buttons ignore the current display** — they always fetch the constant from the API regardless of what number is shown. The current display value is sent as `value` in the request body but the server ignores it for those operations.

- **Frontend `API_BASE_URL` is hard-coded** — there is no `.env` file or runtime configuration for the API URL. Update both component files manually when deploying to a non-local environment.

- **No global CSS reset** — base styles are applied inline in `layout.js` (`margin: 0`, `padding: 0`, `font-family: system-ui`). All other styles are scoped CSS Modules.