# Architecture

## System Overview

```
Browser
  │
  │  User interaction (button presses)
  ▼
Next.js Frontend  — localhost:3001
  │
  │  HTTP POST (JSON) — every calculation triggers a fetch
  ▼
Express Backend   — localhost:3000
  │
  │  Math.* operations (Node.js built-ins)
  ▼
JSON response → update React state → re-render display
```

The frontend is a **pure UI layer**. It holds no math logic. Every button press that produces a result triggers an HTTP request to the backend. The backend validates inputs, computes the result using native `Math.*` functions, and returns JSON.

---

## Backend

**Entry point:** [`index.js`](../../index.js)

Single-file Express application. No database, no sessions, no auth. All endpoints are stateless — every request is fully self-contained.

### Request lifecycle

```
POST /add  { a: 5, b: 3 }
  → express.json() middleware parses body
  → route handler validates types (typeof check)
  → computes result
  → res.json({ result: 8 })
```

### Error strategy

All errors return HTTP `400` with `{ "error": "..." }`. No `500` errors are expected; all domain violations (divide by zero, sqrt of negative, etc.) are caught and returned as `400`.

### Module export

```js
// index.js
if (require.main === module) {
  app.listen(PORT, ...);
}
module.exports = app;
```

The `app` is exported so tests can import it directly via Supertest without starting a real HTTP server.

---

## Frontend

**Framework:** Next.js 14 App Router (`'use client'` components)

### Component hierarchy

```
app/layout.js          — HTML shell, metadata, global body styles
  └── app/page.js      — mode state ('scientific' | 'basic'), toggle UI
        ├── ScientificCalculator.js  — default mode
        └── CalculatorUI.js          — basic mode (shown on toggle)
```

### State model (both components)

| State | Type | Purpose |
|---|---|---|
| `display` | `string` | Current number on screen |
| `firstOperand` | `number \| null` | Left-hand value of pending binary op |
| `operation` | `string \| null` | Pending operation name |
| `shouldResetDisplay` | `boolean` | Next digit clears display first |
| `loading` | `boolean` | Fetch in progress |
| `error` | `string \| null` | Error banner text |

`ScientificCalculator` adds:

| State | Type | Purpose |
|---|---|---|
| `angleMode` | `'degrees' \| 'radians'` | Trig input/output unit |

### Data flow — button press to result

```
User presses "+"
  → handleOperation('add')
  → stores firstOperand, sets operation, sets shouldResetDisplay=true

User presses "5"
  → handleNumber(5)
  → display resets to '5' (shouldResetDisplay was true)

User presses "="
  → handleEquals()
  → fetch POST /add { a: firstOperand, b: 5 }
  → setDisplay(String(result))
  → clear firstOperand, operation
```

### Scientific function flow

```
User presses "sin"
  → handleAdvancedFunction('sin')
  → fetch POST /calculate-advanced { operation: 'sin', value: display, angle: angleMode }
  → setDisplay(String(result))
  → clears firstOperand and operation (result is a fresh value)
```

### Power operation (two-step)

```
Press "xʸ" (first time)  → stores base in firstOperand, sets operation='power'
Press "xʸ" (second time) → fetch POST /power { base: firstOperand, exponent: display }
```

---

## Styling

All styles use **CSS Modules** — class names are locally scoped. No global CSS reset; base styles are applied inline in `layout.js`.

| File | Scope |
|---|---|
| `styles/page.module.css` | Full-viewport gradient, centered container, mode toggle |
| `styles/calculator.module.css` | Basic calculator card, 4-column button grid |
| `styles/scientific-calculator.module.css` | Scientific card, 4-column grid, angle toggle |

**Responsive breakpoints:**
- Fluid scaling: `clamp()` on display and button font sizes
- `≤ 480px`: reduced padding, smaller gaps, smaller button heights
- `≤ 360px`: further reduced for very small phones

---

## Deployment Considerations

- The frontend `API_BASE_URL` constant (`http://localhost:3000`) must be updated in both component files for any non-local deployment.
- CORS is enabled globally on the backend (`cors()` middleware with default config — allows all origins).
- No environment-specific config files exist; this project targets local development only.
