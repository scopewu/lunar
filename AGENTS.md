# lunar-calendar - AGENTS.md

## What This Is

Single-file Cloudflare Worker that renders a Traditional Chinese Calendar (农历) page with stems & branches (天干地支), zodiac (生肖), solar terms (节气), and daily activities (宜忌). Deployed at `https://lunar.tie.pub`.

## Architecture

- **`src/index.ts`** — the entire app. Exports `generateHtml(date?)` and the default Worker handler. HTML, CSS, and JS are inlined in a template literal.
- **`src/lunar-javascript.d.ts`** — manual type declarations. The `lunar-javascript` library ships no TS types; this file is the single source of truth for its API surface. Update it if you use new library methods.
- **`test/index.spec.ts`** — tests use `cloudflare:test` helpers (`env`, `createExecutionContext`, `SELF`) with a fixed date (`2026-04-03`) for deterministic assertions.
- **`test/env.d.ts`** + **`test/tsconfig.json`** — separate tsconfig for tests extending root config.
- **`test.mjs`** — throwaway 1-liner for quick manual checks. Not part of the test suite.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server (Wrangler, default port 8787) |
| `npm test` | Run Vitest with Cloudflare Workers pool |
| `npx vitest run test/index.spec.ts` | Run a single test file |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run cf-typegen` | Regenerate `worker-configuration.d.ts` after `wrangler.jsonc` changes |

## Key Gotchas

- **`lunar-javascript` has no TS types.** All type info lives in `src/lunar-javascript.d.ts`. When adding new library API calls, update that file first.
- **`generateHtml()` is exported** specifically for testability. The Worker handler calls it; tests call it directly to assert HTML content without spinning up the Worker.
- **`?date=` query parameter** on the Worker URL accepts a date string (e.g. `?date=2025-02-12`) to render a specific day. Useful for manual testing.
- **No bindings configured.** `Env` is currently empty (`worker-configuration.d.ts` → `Cloudflare.Env {}`).
- **`@cloudflare/workerd-darwin-64`** is an explicit dependency (platform-specific workerd binary).

## Code Style

Enforced by Prettier + EditorConfig:

- **Tabs** for indentation (not spaces)
- **Single quotes**, semicolons required
- **140 char** print width
- **LF** line endings, UTF-8, trailing whitespace trimmed, final newline inserted

YAML files (`.yml`) use spaces per EditorConfig override.

## Testing

- Runner: Vitest + `@cloudflare/vitest-pool-workers` (pool: `workers`)
- Config: `vitest.config.mts` — uses `cloudflareTest()` plugin with `wrangler.jsonc` path
- Tests use a **fixed date** for deterministic output — check the `FIXED_DATE` constant when writing new assertions
- Two test styles: unit (`worker.fetch()` with `createExecutionContext`) and integration (`SELF.fetch()`)

## Wrangler Config (`wrangler.jsonc`)

- Main: `src/index.ts`
- Compatibility date: `2026-02-10`
- Compatibility flag: `nodejs_compat`
- Route: `lunar.tie.pub/*` (zone: `tie.pub`)
- Observability: enabled
