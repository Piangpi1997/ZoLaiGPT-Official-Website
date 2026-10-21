# ZoLaiGPT V5.7 — Spatial Glass Chat Preview

Next.js App Router + React + Tailwind CSS + Framer Motion + Lucide. Static export mounted at `/chat/` beside the preserved vanilla multilingual homepage. All browser requests for runtime code, fonts and artwork remain on the preview's origin; no model, search, microphone, authentication or analytics integration is configured by this workspace.

## Run / rebuild

From this directory, run `npm ci`, then `npm run build` and `npm test`. Next.js requires a supported Node version; this build was produced with Node 24. The lockfile pins dependencies. No API key is required.

For development: `npm run dev`, then open http://localhost:3000/chat/.

To update the deploy-ready files after a build, replace the repository's `chat/` directory with the contents of `out/`. Serve the repository root to preview the complete package. The prebuild script copies the original website translations into a generated local module; edit the authoritative `assets/js/translations.js` only when owner-approved translations are available.

The final ZIP already includes `chat/`; no build or dependency install is needed to deploy it to Cloudflare Pages as static files. Source files and the lockfile are included for later development, while node_modules and build caches are omitted.

## What works

- Collapsible desktop sidebar and native mobile sidebar dialog.
- New/local threads, active-thread switching and thread search.
- Source-based demo responses with simulated progressive display, Stop and Replay.
- Markdown, a labelled prewritten JavaScript example, syntax colors and copy controls.
- Copy workspace URL (messages excluded), Markdown transcript export and personal canvas export.
- Original English/Myanmar/Zomi reply copy; new workspace labels remain English.
- Local text attachment preview, limited to .txt/.md/.json/.csv, 100 KB. Files are not analysed by AI.
- Browser speech synthesis for demo replies when available. Waveform button is a visual preview, not microphone capture.
- Session-only preferences for still atmosphere and solid glass, plus OS reduced motion/transparency/contrast support.

## Honest scope

This is a UI preview with deterministic replies. The response selector describes Source demo; it does not advertise imaginary model names or subscriptions. Web search and voice AI are explicitly unconnected. No Pro plan/profile is asserted. Refresh clears conversations, notes and attachments; the app caps 30 threads and 80 messages per thread. UI feedback stays local.

Clipboard, download and speech features depend on browser support/permissions. Unsupported clipboard operations show a message where supported. No HTML from user messages is interpreted. Markdown uses react-markdown without raw HTML and its default safe URL handling. No account or secure production AI backend is provided.

Future live AI must use a separately authorised server-side proxy: provider keys in Worker secrets, authentication, origin/CSRF checks, bounded requests, timeouts, rate/concurrency limits, abuse protection and explicit non-empty model-output validation. Do not wire the Android backend or publish a frontend provider key.

## Preview safety

Branch: `feature/v57-spatial-chat-preview`. Both homepage and chat metadata are noindex. Global `_headers` retains preview noindex. Do not merge these preview restrictions into production without a separate approved SEO/release review. The V5.6 baseline is d943bcc2c2ac1d75ab3d7858ceeb7b29c03f3daa; main remains outside this branch's changes.

Build success is not physical-device certification. The final report records only checks actually performed.
