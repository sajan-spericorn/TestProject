# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Full-stack calculator app — Node.js/Express REST API backend + Next.js 14 App Router frontend. All computation is server-side; the frontend is a pure UI layer. See [.claude/agent/README.md](agent/README.md) for full project docs.

## Quick Start

```bash
# Backend (port 3000)
npm install && npm start

# Frontend (port 3001) — in a separate terminal
cd frontend && npm install && npm run dev -- --port 3001
```

Both servers must run simultaneously. The frontend hard-codes `http://localhost:3000` as the API base URL.

## Key Files

| Path | Purpose |
|---|---|
| `index.js` | Express API server — all endpoints live here |
| `frontend/components/CalculatorUI.js` | Basic 4-function calculator component |
| `frontend/components/ScientificCalculator.js` | Scientific calculator component |
| `frontend/app/page.js` | Mode toggle (scientific ↔ basic) |
| `__tests__/calculator.test.js` | 84 backend integration tests (Jest + Supertest) |
| `frontend/__tests__/` | 107 frontend component tests (Jest + RTL) |

## Running Tests

```bash
npm test                   # backend
cd frontend && npm test    # frontend
```

## Agent Docs

Extended documentation lives in [.claude/agent/](agent/):

- [README.md](agent/README.md) — project overview and quick start
- [ARCHITECTURE.md](agent/ARCHITECTURE.md) — system design, component hierarchy, state model, data flow
- [API.md](agent/API.md) — full REST API reference with request/response shapes and error codes
- [CONTRIBUTING.md](agent/CONTRIBUTING.md) — local setup, test guide, how to add endpoints/components
- [CHANGELOG.md](agent/CHANGELOG.md) — version history

## Rules

Project-wide coding standards are enforced via [.claude/rules/general-coding-best-practices.md](rules/general-coding-best-practices.md). This rule file is always active and covers:

- TypeScript strict mode, type conventions, and forbidden patterns (`any`, non-null assertions)
- Next.js App Router conventions (Server vs Client Components, caching strategy, `next/image`, `next/link`)
- Node.js layered architecture, error handling, security (Zod validation, helmet, rate limiting, parameterized queries)
- REST API design (versioning, status codes, response envelope, pagination)
- React component rules (props interfaces, key props, custom hooks, form handling)
- State management (local → `useState`, server state → React Query/SWR, global → Zustand/Context)
- Styling (Tailwind CSS, `cn()`, responsive breakpoints, dark mode via `dark:` variants)
- Testing philosophy and structure (unit, integration, E2E with Playwright/Cypress)
- CI/CD pipeline order and branch strategy

## MCP Servers

The following MCP servers are configured for this project:

| Server | Plugin ID | Purpose |
|---|---|---|
| **Context7** | `plugin:context7:context7` | Fetch up-to-date library/framework docs — use before answering questions about any library, API, or CLI tool |
| **Google Calendar** | `claude_ai_Google_Calendar` | Read and write Google Calendar events (list, create, update, delete, respond, suggest times) |

### When to use Context7

Use `mcp__plugin_context7_context7__resolve-library-id` + `mcp__plugin_context7_context7__query-docs` any time the user asks about a library, framework, SDK, API, or CLI tool — even well-known ones (React, Next.js, Express, Tailwind, Jest). Prefer it over web search for library docs; training data may not reflect recent changes.

### When to use Google Calendar

Use the `mcp__claude_ai_Google_Calendar__*` tools when the user asks to check, create, update, or delete calendar events or meetings.
