# ZoLaiGPT Official Website

**Independent public-facing brand website for ZoLaiGPT.** The mobile app and existing production Workers remain separate and unchanged.

## Included
- `index.html` — responsive static one-page website, SEO/meta, sections for Home, Features, About, App, Updates, Contact
- `styles.css` — dark navy and orange premium style
- `script.js` — English / Myanmar / draft Zomi (Tedim) UI, mobile navigation
- `logo.png` — existing ZoLaiGPT logo supplied earlier by the project owner
- `.nojekyll` — useful if deploying to GitHub Pages

## Deployment to GitHub (new repository)
1. Create repository `Zolai-AI/zolaigpt-website` under the organization if you have organization permission. Prefer **Public** for the official public website.
2. On the repository's **Add file → Upload files**, extract the ZIP first, then upload these files at the repository **root**, not inside a nested folder. Commit to `main`.
3. In Cloudflare Pages, create a **new** project connected to that GitHub repo (do not edit existing projects). Use Framework preset **None**, build command **blank**, output directory **/** or root as supported by Pages UI. If the Pages UI requires a built output folder, use a simple build script to copy the root static files to `dist` and set output to `dist`.
4. Confirm all nav links, languages, and mobile layout before configuring a custom domain.

## Important editorial checks
- The Zomi localization in `script.js` is **draft**, must be reviewed by a fluent Tedim speaker before representing it as authoritative.
- The App download button intentionally goes to the App section, **not** an invented APK or Play Store URL.
- The official contact method and release date have **not** been supplied, so this starter doesn't invent them.
- Before presenting the site as publicly official, confirm branding, domain ownership, privacy policy and content with the project owner.
- All third-party resources: optional Google Fonts via CSS; page still works using device fonts if blocked.
- No AI chat, D1 or dataset storage features; the site is informational, independent of production and the app.

## Contact and Social Links update
Version 2 adds the user-provided Facebook, GitHub, WhatsApp, Threads, TikTok, Instagram, X, Discord, LinkedIn, Email, and telephone contacts to the Contact section. WhatsApp uses `https://wa.me/60189745031` rather than a generic app-install link. Verify any time-limited share/invite links periodically. All phone/email details here are public on the website by design.

To update the live Pages site: upload these files into the personal GitHub repo `Piangpi1997/ZoLaiGPT-Official-Website` root, replacing older files, and commit. The connected Cloudflare Pages project will automatically rebuild. Do this only when ready to publish the listed contacts publicly.
