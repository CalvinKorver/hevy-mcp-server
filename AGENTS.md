# Hevy MCP Server — agent notes

Remote MCP on **Cloudflare Workers** exposing the **Hevy API** as tools.

## Stack

- **Hono** (`src/app.ts`) — routes, CORS, error handling  
- **MCP** — `src/mcp-agent.ts` (`MyMCP` extends `McpAgent`), `src/mcp-handlers.ts`  
- **Hevy client** — `src/lib/client.ts`; validation — `src/lib/schemas.ts`, `src/lib/transforms.ts`

## Auth (multi-user)

- **GitHub OAuth** + KV sessions: `src/github-handler.ts`  
- **Bearer token** on `/mcp` (and legacy `/sse`): `src/middleware/auth.ts` — token is the session id in KV  
- **Per-user Hevy API key** (encrypted): `src/lib/key-storage.js`; configured at **`/setup`** after login

## Adding a tool

1. Method on `HevyClient` in `src/lib/client.ts`  
2. Register in `MyMCP.init()` in `src/mcp-agent.ts`  
3. Tests in `test/` (e.g. integration MCP tests)

## Commands

- `npm start` — local dev (Wrangler)  
- `npm test` / `npm run type-check`

## Config

- **Wrangler**: `wrangler.jsonc` (DO `MyMCP`, KV `OAUTH_KV`)  
- Secrets: GitHub OAuth, `COOKIE_ENCRYPTION_KEY`; Hevy keys are per-user via `/setup`, not a single worker secret for normal multi-user use.  
- Optional: `ALLOWED_GITHUB_LOGINS` (comma-separated); `STATS_ACCESS_TOKEN` (Bearer required for `GET /stats` when set). See `.dev.vars.example`.
