# ZOLAI GPT V6 — setup and deployment

## Source and architecture

Repository: https://github.com/Piangpi1997/ZoLaiGPT-Official-Website . Development branch: `feature/v6-official-platform`. Baseline: `562dbbc8648b467a12d2dc64ee2695019bc64936`.

The existing hybrid architecture is preserved. Marketing pages are static HTML generated with Python standard-library components. The chat application remains Next.js, React, TypeScript, Tailwind, Framer Motion, Lucide and react-markdown. Migrating working marketing pages to a new application framework was unnecessary. No backend credentials or user accounts are introduced.

- `scripts/build-platform.py`: editable EN/MY content, reusable header/footer, feature cards, pricing, FAQ, preview and route generation.
- `assets/css/platform.css`: reusable theme tokens, responsive layout and visual components.
- `assets/js/platform.js`: navigation, preferences, tools, samples, validation and enhancement.
- `chat-workspace/`: editable Next.js application source and its lockfile.
- `chat/`: generated static application output used by the existing Cloudflare Git deployment.
- `hero-orb.js`, `assets/js/universe-orb.js`, `assets/js/software-orb.js`: preserved Three.js sphere and bounded Canvas fallback.
- `guides/`, legal pages, social destinations, verification file and `ads.txt`: retained, with navigation repairs and updated privacy technical details.
- `dist/`: generated deployable files. This directory is ignored by Git.

## Build from source

Use a current Node runtime compatible with the pinned Next.js release and Python 3. The verified environment used Node 24.22.1 and Python 3.12.

```sh
npm --prefix chat-workspace ci
npm run build
npm run check
npm --prefix chat-workspace run typecheck
npm test
```

On Windows, if `python3` is unavailable, run these equivalent steps in PowerShell:

```powershell
python scripts/build-platform.py
npm --prefix chat-workspace run build
python scripts/sync-chat.py
python scripts/csp-hashes.py
python scripts/package-static.py
python scripts/verify-platform.py
```

The checked-in compiled `chat/` permits the existing buildless Cloudflare setup to continue. After changing workspace source, rebuild and commit its generated output together. `csp-hashes.py` regenerates exact CSP allowances for Next.js inline hydration code; do not replace them with broad inline script permission.

## Cloudflare Pages

Verified project: `zolaigpt-official-website`. Existing Git source: the repository above. Production branch: `main`. The existing configuration uses an empty build command and repository root output. Preview branches are enabled for all branches. No hosting configuration change is required for this branch.

Push the feature branch to create a reviewable Pages preview. Validate that exact deployment, including theme, language and chat hydration under the actual CSP. Promote only a reviewed commit to `main` when authorized. Preserve a backup branch at the current production SHA before any promotion. The prior production snapshot can be restored through normal Git/Pages rollback controls.

For a clean direct static upload, deploy `dist/`; retain `_headers`, `_redirects`, `robots.txt`, sitemap and verification files. Preview aliases carry noindex response headers. Canonical URLs refer to `https://zolaigptofficial.com/`.

## Functional boundaries

- No live provider integration is configured. No private provider keys appear in the frontend. A model dropdown only explains source-demo mode.
- The text counter and prompt starters run locally. Prompt starters assemble editable instructions; they do not generate AI answers.
- Chat replies are prewritten. Threads, attachments and notes are memory-only and clear on refresh. Markdown export and copy controls preserve user-selected text.
- File attachment is a bounded local text interface, not document AI. Image understanding, document analysis and web research are Coming Soon.
- Contact prepares a `mailto:` draft. Visitors review and send in their email application. The site does not submit contact messages.
- Language and theme use localStorage; announcement dismissal uses sessionStorage.
- Legal pages retain their previous draft status and existing translations. A verified EN/MY technical update describes the new interface behavior. No claim of final legal approval is made.

## Future secure AI integration

Provide a server-side gateway only after valid integrations are available. Keep credentials in server-managed secrets, enforce request limits and authentication as appropriate, validate file types/sizes, restrict outbound source fetches, avoid logging message content by default, define retention, and expose real error states. Update privacy text and feature availability together. Never request or store private provider keys in public HTML, browser localStorage, client bundles or this repository.

Model names, service costs and paid plans must be verified when implementation is authorized. Nothing in this release creates subscriptions or consumes paid inference.
