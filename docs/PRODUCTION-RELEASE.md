# ZoLaiGPT V5.7 — Production website release

Owner instruction on 2026-10-22 (Asia/Kuala_Lumpur): publish the completed website. This release promotes the reviewed universe orb design to the existing official website. It does not release the Android app or connect a new AI backend.

## Source and destination

- Preview source: 4d7728709c45e4a2b9c4c6dbdab4cd4da2e34108.
- Release branch: release/v57-universe-production.
- Production branch: main.
- Cloudflare Pages project: zolaigpt-official-website.
- Official URL: https://zolaigptofficial.com/.
- Existing ten social/contact URLs, original assets, translation dictionaries, legal documents and Google verification are retained.

## Production-only changes

Homepage title and website version label use the official website identity. Homepage preview noindex metadata is removed. The global X-Robots-Tag is replaced by host-specific rules for Pages aliases and path-specific rules for legal drafts, chat demos, QA and source-report routes. robots.txt, sitemap.xml and the canonical official domain remain unchanged. The chat workspace stays noindex and its demo disclosure remains visible.

Renderer code is unchanged from the tested universe preview. Canvas 3D auto rotation was observed hands-free for 123.54 seconds / 4.118 complete turns, with desktop pause/resume/drag and seven responsive widths checked. Actual WebGL rendering, physical Android/iOS and OS reduced-motion testing remain unverified. Refer to UNIVERSE-ROTATION-REPORT.md for precise limits. These limits were disclosed before the owner requested publication.

## Backup and rollback

Pre-release production commit: e008d40f854e4ef325177ac194de67f30fa10e43.
Backup branch: backup/production-20261022-e008d40.
Previous successful Cloudflare production deployment: 5b9360d9-9933-4c8d-acbc-10006dbbab4a.

If post-deployment verification fails, Cloudflare's deployment rollback operation can restore that known successful production deployment. To align source afterward, revert the release merge with a new commit or PR; do not force-reset main. Preview snapshots remain independently available.

## Acceptance

Before merge: validate the production local links, homepage canonical/indexing policy, noindex rules on preview/demo/legal pages and byte preservation of original brand/legal data. Build the release branch as a Cloudflare preview. After merge: require a successful production deployment for the main merge, then verify the official domain, automatic orb phase advancement, /chat/, sitemap, robots, Google verification and response headers. Do not infer publication from a submitted merge alone.
