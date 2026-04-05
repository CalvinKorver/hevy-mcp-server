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

## Deploy troubleshooting (Cloudflare)

**Error 10211 — “migrations must be fully applied by running wrangler deploy”**

If the build log contains **`Executing user deploy command: npx wrangler versions upload`**, that command **cannot** apply Durable Object migrations. This project’s `wrangler.jsonc` includes a DO migration (`MyMCP` / `v1`), so the upload will always fail until a **full deploy** runs.

**Fix in Cloudflare (Workers Builds):**

1. **Workers & Pages** → select **hevy-mcp-server** → **Settings** → **Build**.
2. **Deploy command** (production branch): should be **`npm run deploy`** or **`npx wrangler deploy`** (not `versions upload`).
3. **Non-production branch deploy command** (if branch previews are enabled): change from **`npx wrangler versions upload`** to **`npm run deploy`**. That runs a real deploy for preview branches too (same Worker); only use if you accept that.

Optional: turn off **non-production branch builds** if you do not need preview uploads.

**Alternative — GitHub Actions:** This repo includes [`.github/workflows/deploy-worker.yml`](.github/workflows/deploy-worker.yml). Add repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, merge to `main`, and either disable Cloudflare Workers Builds for this Worker or align both to avoid double deploys.

**Local one-shot:** `npm run deploy` from a machine with Wrangler authenticated to the target account (applies migrations on first success).

Docs: [Gradual deployments — Migrations](https://developers.cloudflare.com/workers/configuration/versions-and-deployments/gradual-deployments/#migrations).
