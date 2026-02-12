# lunar-calendar - AGENTS.md

## Project Overview

This is a Cloudflare Worker that displays the Chinese Lunar Calendar (农历) with traditional calendar information including stems & branches (天干地支), zodiac (生肖), and daily activities (宜忌).

## Tech Stack

- **Runtime**: Cloudflare Workers with Node.js compatibility
- **Language**: TypeScript (ES2024 target)
- **Main Dependency**: `lunar-javascript` - Lunar calendar library
- **Testing**: Vitest with Cloudflare Workers pool
- **Deployment**: Wrangler CLI

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` or `npm start` | Local development server with Wrangler |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm test` | Run Vitest test suite |
| `npm run cf-typegen` | Generate TypeScript types from `wrangler.jsonc` bindings |

**Note**: Run `npm run cf-typegen` after changing bindings in `wrangler.jsonc` to keep types in sync.

## Code Style Guidelines

### Formatting (Prettier + EditorConfig)

- **Indentation**: Tabs (NOT spaces)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line width**: 140 characters
- **Line endings**: LF (Unix-style)
- **Charset**: UTF-8
- **Whitespace**: Trim trailing whitespace
- **Files**: Insert final newline

### Naming Conventions

```typescript
// Variables and functions: camelCase
const gregorianDate = solar.toString();
const lunarDate = lunar.toString();

// Type parameters: PascalCase
export interface Env { }

// Constants: UPPER_SNAKE_CASE or camelCase depending on scope
```

### Import Patterns

```typescript
// Named imports from external packages
import { Solar } from 'lunar-javascript';

// Default export for Workers
export default {
	async fetch(request, env, ctx): Promise<Response> {
		// ...
	},
} satisfies ExportedHandler<Env>;
```

### TypeScript Configuration

- Target: ES2024
- Module: ES2022
- Strict mode: **enabled**
- Module resolution: Bundler
- All `.d.ts` files excluded from type checking (skipLibCheck)

### Error Handling

```typescript
// Workers return Response objects for success
return new Response(html, {
	headers: { 'content-type': 'text/html;charset=UTF-8' },
});

// For errors, return appropriate HTTP status codes
return new Response('Error message', { status: 500 });
```

### HTML/Template Literals

- Use template literals for HTML generation
- Indent template literal content with tabs (matching codebase style)
- Use semantic HTML5 elements
- Include proper meta tags for SEO

## Testing

- Test files: Located in `test/` directory
- Test runner: Vitest with `@cloudflare/vitest-pool-workers`
- Configuration: `vitest.config.mts`

**To run a single test**:
```bash
npx vitest run path/to/test.spec.ts
```

## Cloudflare Workers Specifics

### Wrangler Configuration

- Main entry: `src/index.ts`
- Compatibility date: `2026-02-10`
- Node.js compatibility: enabled via `nodejs_compat` flag
- Route: `lunar.tie.pub/*`
- Observability: enabled

### Type Generation

After modifying `wrangler.jsonc`, always regenerate types:
```bash
npm run cf-typegen
```

This updates `worker-configuration.d.ts` with correct binding types.

### Environment & Bindings

- Check `wrangler.jsonc` for configured bindings (KV, R2, D1, Durable Objects, etc.)
- Use `worker-configuration.d.ts` for type-safe binding access

## Deployment Route

Deployed at: `https://lunar.tie.pub`

---

## Cloudflare Workers Documentation

**STOP.** Your knowledge of Cloudflare Workers APIs and limits may be outdated. Always retrieve current documentation before any Workers, KV, R2, D1, Durable Objects, Queues, Vectorize, AI, or Agents SDK task.

### Official Docs

- https://developers.cloudflare.com/workers/
- MCP: `https://docs.mcp.cloudflare.com/mcp`

### Limits & Quotas

Always retrieve from product's `/platform/limits/` page: https://developers.cloudflare.com/workers/platform/limits/

### Node.js Compatibility

https://developers.cloudflare.com/workers/runtime-apis/nodejs/

### Common Errors

- **Error 1102** (CPU/Memory exceeded): Check limits at `/workers/platform/limits/`
- **All errors**: https://developers.cloudflare.com/workers/observability/errors/

### Product References

API references and limits: `/kv/` · `/r2/` · `/d1/` · `/durable-objects/` · `/queues/` · `/vectorize/` · `/workers-ai/` · `/agents/`
