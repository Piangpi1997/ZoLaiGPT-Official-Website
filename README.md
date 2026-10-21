# ZoLaiGPT V5.7 — Liquid Glass Website Preview

Preview only. This refinement keeps the existing V5.7 version and the V5.6 source assets. It does not announce an app release. Do not merge to `main` or deploy to the official production domain.

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
- assets/js/animation.js and hero-orb.js retain manual pause, system reduced motion, hidden/offscreen pause, and quiet-atmosphere fallback. The orb is supplied artwork + CSS layers, not a native WebGL globe.
- chatbot.js keeps a clearly labelled local demo, prevents duplicate sends, and restores focus to the actual opener. /chat/ is also a local scripted demo, with no provider connection.

The original logo, orb artwork, real app screenshots, legal drafts, SEO/verification files and all ten original social/contact destinations remain intact. App pricing/release availability is not invented. No purchase/download transaction is offered.

## Verify

```sh
python3 tools/verify-preview.py
```

The script checks public local links, duplicate IDs, font references, the single homepage token root and solid-background text-token contrast. Actual browser results and remaining device checks are in docs/REFERENCE-UPDATE-REPORT.md. Earlier V5.6/V5.7 reports describe earlier revisions; the reference-update report supersedes their QA status for this revision.

## Deployment and rollback

Use only `feature/v57-spatial-chat-preview`. See docs/REFERENCE-DEPLOYMENT.md. Cloudflare deployment is not verified; the current connector fails and the Google sign-in attempt returned a generic Cloudflare error. Local browser verification does not prove public deployment. Production/main/Android backend were not changed.

The input ZIP is preserved separately as a baseline. Previous preview source commit: 59526d045a53a02bcdc76b9587679d3b30f244db. Restore that source on a separate preview branch, or revert this refinement on the preview branch, if necessary. Do not reset or force-push main.
