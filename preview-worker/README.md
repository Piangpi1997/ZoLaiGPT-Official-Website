# V5.5 OpenRouter Preview Worker (NOT production)

This Worker is preview-only and fails closed if either its API key or rate limiter is missing.

1. Create a dedicated Cloudflare Worker named `zolaigpt-v55-openrouter-preview`.
2. Paste `worker.js` as the Worker code and deploy to its own workers.dev endpoint.
3. Worker Settings > Variables and Secrets > Add **Secret** `OPENROUTER_API_KEY`; enter your key only in Cloudflare. Never commit it.
4. Set text variable `ALLOWED_ORIGIN` to the **exact** V5.5 branch preview origin (no trailing slash). The production domain must not be listed.
5. Add a Cloudflare Rate Limiting binding with variable name `RATE_LIMITER` (for example 5 requests per 60 seconds, using Cloudflare's available rate-limit options). Worker will return HTTP 503 until the binding exists.
6. Frontend must call the Worker from the allowed preview origin, using POST JSON `{message, language, history:[]}`. Worker responds `{reply,model}`.
7. Test HTTP 403 for non-preview origins, HTTP 429 for excessive requests, and HTTP 503 without secret/binding before enabling public users.

Security notes: CORS is browser-origin separation, not authentication. Rate limiting alone does not stop distributed abuse. For public launch add Cloudflare Turnstile and server-side validation, observability, explicit quotas/spend limits. Do not use on production until approved. OpenRouter free models have quotas and variable availability.
