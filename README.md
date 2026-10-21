# ZoLaiGPT V5.7 — Spatial Glass Workspace Preview

Open `/chat/` for the new React/Next.js spatial chat workspace. See `chat-workspace/README.md` for source, rebuilding, demo limitations and secure future integration. Deploy-ready compiled assets are included in `chat/`; the original homepage and legal assets remain available at the root.

## Retained V5.6 homepage foundation

PREVIEW ONLY. Do not merge this branch into main or upload its noindex headers to the production project without separate approval and a production SEO review.


## V5.6 Liquid Glass interface
The original VNext Premium Orb stays intact. The new last-loaded `assets/css/liquid-glass.css` adds frosted glass, layered specular highlights, translucent dark surfaces, glowing amber accents and refined outlines to navigation, cards, buttons, future updates and the chat panel. Mobile blur is reduced and unsupported backdrop-filter/high contrast/reduced motion all have fallbacks. The version and preview updates are managed in `assets/js/site-config.js`.

This remains an explicitly labelled **local demo** chatbot. Any earlier OpenRouter/Worker endpoint must be independently verified before integration; it is not connected in this branch. Never add or expose API keys in source control.

## Design
The owner-supplied orange glass orb artwork replaces the globe map and sticker-like emblem. Independent amber/blue orbit travelers, glass lighting, floating core, restrained particles and a luminous base create a dimensional CSS composition. This is a layered artwork/CSS experience, not a claimed real-time 3D/WebGL sphere. It works without WebGL or third-party runtime libraries.

Original logo.png, translations, ten social destinations, real app screenshots, legal drafts, canonical domain, sitemap and verification file remain intact. New editorial/preview labels stay in English until approved translations are available. Zomi source copy remains draft.

## Run
Serve the repository root: `python3 -m http.server 8080`. Open http://localhost:8080/. Modules need HTTP; file:// is unsupported. No build step or install is needed.

## Organization
- index.html: semantic content and reusable section/card markup.
- styles.css: CSS entry point; assets/css/{base,sections,orb,chatbot,liquid-glass}.css.
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
Branch: feature/v56-liquid-glass-preview. Preferred: push this branch to the existing repository so its Cloudflare Pages Git integration creates a branch preview. Do not change the main/production branch mapping. If preview builds are disabled, enable only this branch's preview build in the intended preview project or direct-upload the ZIP to a dedicated preview project. Preserve `_headers` and robots meta noindex. Never assign zolaigptofficial.com to this preview.

Use the final report for actual branch/commit/deployment status; these instructions alone are not evidence of deployment.

## Rollback
Pre-change repository commit: e008d40f854e4ef325177ac194de67f30fa10e43. Changes are isolated to the preview branch; production can continue serving its existing deployment. Restore that commit on a separate preview branch or use the previous preview URL. No production rollback is needed because this task does not deploy to production.

## Future real AI (proposal, not deployed)
Use a separate server-side Worker proxy with provider credentials in secrets, authenticated sessions, per-user/IP rate and concurrency limits, bounded input/output, timeout handling, bot/abuse controls and minimal redacted logs. Cookie sessions need CSRF/origin protection. Validate that model output is a non-empty string and return a clear retryable error otherwise. Do not connect or alter the Android backend without authorization. Current UI is explicitly a local demo, not a secure production AI backend.
