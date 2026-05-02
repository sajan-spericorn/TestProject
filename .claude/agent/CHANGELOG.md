# Changelog

All notable changes to this project are documented here.

---

## [1.0.0] — 2026-05-02

### Added

**Backend**
- Express REST API server (`index.js`) on configurable `PORT` (default 3000)
- CORS middleware — allows frontend on a separate port to call the API
- `GET /` — API metadata and endpoint listing
- `GET /health` — health check endpoint
- `POST /add`, `POST /subtract`, `POST /multiply`, `POST /divide` — individual arithmetic endpoints
- `POST /calculate` — generic arithmetic endpoint with case-insensitive operation names
- `POST /calculate-advanced` — unary scientific functions: `sqrt`, `square`, `cube`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `exp`, `factorial`, `reciprocal`, `percent`, `negate`, `abs`, `pi`, `e`; supports `degrees`/`radians` angle mode
- `POST /power` — binary power endpoint (`base ^ exponent`), returns result and expression string
- Full input validation and domain-violation errors on all endpoints (HTTP 400)
- 84 backend integration tests using Jest + Supertest

**Frontend**
- Next.js 14 App Router frontend
- `CalculatorUI` component — basic 4-function calculator with digit input, AC, backspace, chained operations, async fetch, loading state, and error banner
- `ScientificCalculator` component — extended calculator with all advanced functions, DEG/RAD angle toggle, two-step power (`xʸ`) operation, and constants (`π`, `e`)
- `app/page.js` — mode toggle between Scientific (default) and Basic calculators
- CSS Modules responsive styling with fluid `clamp()` scaling and breakpoints at 480px and 360px
- 107 frontend component tests using Jest + React Testing Library (mocked fetch)

---

> Entries inferred from git history. Commit: `3e7a1f2 Add full-stack calculator app with scientific mode, responsive UI, and tests`.
