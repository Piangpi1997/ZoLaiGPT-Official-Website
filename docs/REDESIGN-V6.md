# ZoLaiGPT website redesign (V6 preview)

Branch: `feature/zolaigpt-ultimate-website-redesign` (based on `main` at 0626c0f).
Production (`main`, zolaigptofficial.com) is unchanged until this branch is approved and merged.

## What changed

- **Globe/orb removed.** The Three.js sphere, canvas ray-cast fallback, orbit rings,
  motion controls and their assets were deleted: `hero-orb.js`, `globe.js`,
  `assets/js/universe-orb.js`, `assets/js/software-orb.js`, `assets/js/animation.js`,
  `assets/css/orb.css`, `vendor/three.module.js`, `assets/world.geojson`,
  `assets/globe-fallback.svg`, `assets/zolaigpt-orb.webp`. The chat workspace's welcome orb
  and orbit ring were replaced by the logo tile.
- **New logo** supplied by the owner (line-art mark), exported as white mark, app tile,
  favicon, touch icon, manifest icons and Open Graph image (`assets/brand/`). `logo.png` now
  holds the new app tile; the previous orange logo remains in git history.
- **Typography-first hero** with CSS aurora, spotlight, grid and an original SVG line field.
  Motion is transform/opacity only and stops under `prefers-reduced-motion`.
- **Design system**: `assets/css/tokens.css` (tokens + self-hosted fonts) and
  `assets/css/site.css` (components). Fonts: Space Grotesk (display), Geist (UI/body),
  Noto Sans Myanmar (Burmese), all SIL OFL 1.1, variable WOFF2, `font-display: swap`.
- **New routes**: `/apps/`, `/apps/<slug>/`, `/about/`, `/contact/`; `/learn` redirects to
  `/guides/`. Guides and legal drafts keep their URLs and text but use the shared layout.
- **Static generator** `scripts/build-site.mjs` (Node, no dependencies) renders all pages.
  Generated HTML is committed because the Cloudflare Pages project deploys the repository
  root without a build step.
- **Chat** (`/chat/`) rebuilt from `chat-workspace/` with the new palette, fonts, larger
  text sizes and Next.js 16.4.6 (patch update; `npm audit` reports 0 vulnerabilities).
  It remains a clearly labelled local demo.

## Architecture decision

The existing site is buildless static HTML deployed by Cloudflare Pages' Git integration.
A framework migration (Astro etc.) would require changing the Pages build settings in the
dashboard and adds risk without a clear benefit for a mostly static site. Instead, a small
zero-dependency generator gives shared layout, a content model and an SEO sitemap while the
deploy pipeline stays exactly the same. Rollback = revert the merge commit.

## Edit and build

```sh
node scripts/build-site.mjs          # regenerate HTML, sitemap.xml, site.webmanifest
python3 tools/verify-site.py         # links, anchors, IDs, alt text, contrast, AdSense, sitemap, release rules
# Chat workspace (only when changing chat):
cd chat-workspace && npm ci && npm run build && npm test && npm run typecheck
rm -rf ../chat && cp -r out ../chat
```

Edit page templates in `scripts/build-site.mjs`, apps in `content/apps/`, updates in
`content/updates.json`, social links in `content/social.json`, guide/legal bodies in
`src/legacy/`, translations in `assets/js/translations.js`.

Do not edit generated HTML (`index.html`, `apps/`, `about/`, `contact/`, `guides/*.html`,
legal pages, `404.html`) directly; it is overwritten by the build.

## SEO, AdSense and domain status

- Canonicals point to `https://zolaigptofficial.com/…`; `robots.txt` and `sitemap.xml` keep
  working; Pages preview aliases send `X-Robots-Tag: noindex`.
- The AdSense ownership meta tag, the AdSense loader script (homepage and guides, as stated
  in the privacy policy) and `ads.txt` are unchanged. No ad units were added and Auto ads
  were not configured. Auto ads are controlled in the AdSense dashboard by the owner.
- Before enabling ads, the owner should re-check Google's current list of supported
  languages: Myanmar (Burmese) and Zomi (Tedim) content may not be eligible, and the
  language switcher changes visible text client-side. Keep ads on English-primary pages.
- Domain registration/renewal, Cloudflare DNS/SSL, Search Console verification, AdSense site
  approval, SSM business registration and app-store developer registration are separate
  processes that require the owner. ZoLaiGPT is **not** SSM-registered; pages say so.

## QA performed (local, Chromium via Playwright)

- `tools/verify-site.py`: 22 pages, ~880 references, 0 errors.
- Widths 320, 360, 390, 430, 768, 1024, 1440, 1920 on 14 routes: no horizontal page
  overflow (after one fix for long text at 320px) and no clipped h1/h2.
- Interactions: mobile menu (open/Escape), Myanmar language switch, quick-demo dialog
  (send, reply, Escape, focus return), app filters, no JavaScript errors.
- Chat workspace: `npm test`, `npm run typecheck`, `npm run build` pass.
- Not performed: physical Android/iPhone testing, screen-reader testing, Lighthouse on the
  deployed preview. Browser emulation is not device evidence.
