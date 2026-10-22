# ZoLaiGPT V5.7 — Official Website

Production release prepared on 2026-10-22 after the owner requested publishing to the website. This is the official brand website update; the app remains Coming Soon and both chat interfaces remain clearly labelled local demos. The original preview branch is retained separately.

## Run the complete project

```sh
python3 -m http.server 8080
```

Open http://localhost:8080/ for the homepage, /chat/ for the existing spatial chat workspace, and /qa-reference.html for the responsive testing harness. Serve the extracted root, not chat/ alone. JavaScript modules require HTTP; opening index.html via file:// is unsupported.

The homepage uses HTML/CSS/vanilla JavaScript and needs no installation/build. The independent Next.js chat workspace source remains in chat-workspace/; its complete compiled export is included at chat/. The chat source was not changed by this refinement. Rebuild instructions and dependency licenses are in chat-workspace/README.md.

## Design and maintenance

- assets/css/tokens.css is the single homepage token source, with local Archivo and Noto Sans Myanmar fonts. Original orange brand art is unchanged; UI accents use violet and cyan.
- assets/css/liquid-glass.css contains the final presentation and responsive rules. Overlay blur is limited to header/chat; large static cards use translucent gradients.
- assets/js/site-config.js manages the existing version, announcement identifier/message, and future update cards. Change announcement.id for a genuinely new announcement so earlier dismissals do not hide it.
- assets/js/announcement.js measures banner/header heights, adjusts anchor offsets, and remembers dismissals per announcement.
- assets/js/components.js handles the native FAQ disclosure ARIA state and keyboard/button gallery scrolling.
- assets/js/i18n.js and translations.js retain the original dictionaries. New editorial headings stay in English pending review; no new approved Zomi translations are claimed.
- assets/js/animation.js and hero-orb.js retain manual pause, system reduced motion, hidden/offscreen pause, and quiet-atmosphere fallback. The hero now uses a real Three.js sphere with the original orb artwork projected into its surface, amber/blue orbital geometry and a star field. A CPU ray-cast Canvas sphere provides real 3D Y rotation when WebGL is unavailable; it does not CSS-rotate an image. Both renderers auto-rotate in 30 active seconds per turn. Original artwork remains a static fallback if neither renderer works. See docs/UNIVERSE-ROTATION-REPORT.md for actual verification limits.
- chatbot.js keeps a clearly labelled local demo, prevents duplicate sends, and restores focus to the actual opener. /chat/ is also a local scripted demo, with no provider connection.

The original logo, orb artwork, real app screenshots, legal drafts, SEO/verification files and all ten original social/contact destinations remain intact. App pricing/release availability is not invented. No purchase/download transaction is offered.

## Verify

```sh
python3 tools/verify-preview.py
```

The script checks public local links, duplicate IDs, font references, the single homepage token root and solid-background text-token contrast. Actual browser results and remaining device checks are in docs/REFERENCE-UPDATE-REPORT.md. Earlier V5.6/V5.7 reports describe earlier revisions; the reference-update report supersedes their QA status for this revision.

## Deployment and rollback

Production uses `main` in the existing Cloudflare Pages project. Review `release/v57-universe-production` first; the preview branch remains `feature/v57-spatial-chat-preview`. See docs/PRODUCTION-RELEASE.md. The preceding refinement a033002 was successfully deployed by the Git integration at https://22af2765.zolaigpt-official-website.pages.dev/. The universe refinement needs its own deployment result; use the final response for the latest verified URL. Dashboard sign-in is not needed for the Git preview workflow. The Android backend remains separate. Production deployment is complete only after Cloudflare reports success for the main merge and the official domain serves it.

The input ZIP is preserved separately as a baseline. Previous preview source commit before the universe enhancement: a0330021a6ec5553f42376e7c50e0b8170c73628. Restore that source on a separate preview branch, or revert this refinement on the preview branch, if necessary. Do not reset or force-push main. The pre-release production commit is e008d40f854e4ef325177ac194de67f30fa10e43, retained on backup/production-20261022-e008d40.

## Production SEO
The official-domain homepage is indexable and retains its canonical, robots.txt, sitemap and Google verification file. Host-specific noindex headers protect Pages aliases. Legal drafts, /chat/, QA and source-report routes remain noindex. Chat is a local demo; no provider keys are embedded.
