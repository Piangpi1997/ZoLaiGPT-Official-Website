# ZOLAI GPT — official platform V6

An original, bilingual AI project website with an interactive demo workspace. Built on the existing official site rather than replacing its working framework, guides or rotating universe logo.

**Live AI is not connected.** The chat uses prewritten replies. Browser-local text tools work without an account or payment. Planned AI capabilities are labeled Coming Soon.

## Included

- Homepage, Features, Tools, About, Pricing, Help and Contact pages.
- English/Myanmar UI, shared dark/light preferences, responsive navigation and native FAQ.
- Preserved Next.js chat with conversation sidebar/search, Markdown/code, copy/export, replay, notes and bounded local attachments.
- Categorized/searchable tool library with working text counter and editable prompt builders.
- Local fonts, original project artwork, preserved guides/social destinations/legal drafts and verification.
- Canonical metadata, Open Graph, sitemap, robots, CSP hashes and security headers.

```sh
npm --prefix chat-workspace ci
npm run build
npm run check
npm --prefix chat-workspace run typecheck
npm test
```

- [Design research](docs/V6-DESIGN-RESEARCH.md)
- [Setup and deployment](docs/V6-SETUP-DEPLOYMENT.md)
- [Build/test report and limitations](docs/V6-BUILD-TEST-REPORT.md)

Edit website content/components in `scripts/build-platform.py`, behavior in `assets/js/platform.js`, tokens in `assets/css/platform.css`, and chat source in `chat-workspace/`. The build produces `dist/` and synchronizes generated `chat/` output for the existing Cloudflare Pages Git integration. See the deployment guide for Windows commands and secure future integration requirements.
