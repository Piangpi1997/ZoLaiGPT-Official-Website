# ZoLaiGPT V5.5 — VNext Premium Orb Preview

PREVIEW ONLY. Do not merge this branch into main or upload its noindex headers to the production project without separate approval and a production SEO review.

## Design
The owner-supplied orange glass orb artwork replaces the globe map and sticker-like emblem. Independent amber/blue orbit travelers, glass lighting, floating core, restrained particles and a luminous base create a dimensional CSS composition. This is a layered artwork/CSS experience, not a claimed real-time 3D/WebGL sphere. It works without WebGL or third-party runtime libraries.

Original logo.png, translations, ten social destinations, real app screenshots, legal drafts, canonical domain, sitemap and verification file remain intact. New editorial/preview labels stay in English until approved translations are available. Zomi source copy remains draft.

## Run
Serve the repository root: `python3 -m http.server 8080`. Open http://localhost:8080/. Modules need HTTP; file:// is unsupported. No build step or install is needed.

## Organization
- index.html: semantic content and reusable section/card markup.
- styles.css: CSS entry point; assets/css/{base,sections,orb,chatbot}.css.
- script.js: bootstrap/navigation/screenshot selection.
- assets/js/translations.js: original dictionaries; i18n.js: shared language state.
- assets/js/site-config.js: version/channel and future announcements. Change version here for V5.6/V6. Metadata title is separately editorial.
- assets/js/animation.js: system reduced motion, explicit pause, visibility and reveals.
- hero-orb.js: optional quiet atmosphere, artwork failure fallback and offscreen pause.
- chatbot.js: honest local scripted preview with source-based multilingual replies and quick prompts. No network calls, API keys, backend or persistent chat storage.
- qa.html: responsive test harness; optional and noindex.

## Motion and performance
Reduced motion disables CSS loops automatically. Pause/Resume applies across the page. Hidden tabs and offscreen orb stop relevant animations. Quiet atmosphere removes particles, reflection and floating motion; low-memory/CPU/save-data devices default to this lighter configuration. A CSS-lit original-logo fallback appears if orb artwork fails. Main illustration is the supplied artwork encoded as WebP (dimensions and transparency retained) and is prioritized. App screenshots are lazy-loaded. No Lighthouse or physical-device FPS score is claimed.

## Preview deployment
Branch: release/vnext-premium-orb-preview. Preferred: push this branch to the existing repository so its Cloudflare Pages Git integration creates a branch preview. Do not change the main/production branch mapping. If preview builds are disabled, enable only this branch's preview build in the intended preview project or direct-upload the ZIP to a dedicated preview project. Preserve `_headers` and robots meta noindex. Never assign zolaigptofficial.com to this preview.

Use the final report for actual branch/commit/deployment status; these instructions alone are not evidence of deployment.

## Rollback
Pre-change repository commit: e008d40f854e4ef325177ac194de67f30fa10e43. Changes are isolated to the preview branch; production can continue serving its existing deployment. Restore that commit on a separate preview branch or use the previous preview URL. No production rollback is needed because this task does not deploy to production.

## Future real AI (proposal, not deployed)
Use a separate server-side Worker proxy with provider credentials in secrets, authenticated sessions, per-user/IP rate and concurrency limits, bounded input/output, timeout handling, bot/abuse controls and minimal redacted logs. Cookie sessions need CSRF/origin protection. Validate that model output is a non-empty string and return a clear retryable error otherwise. Do not connect or alter the Android backend without authorization. Current UI is explicitly a local demo, not a secure production AI backend.
