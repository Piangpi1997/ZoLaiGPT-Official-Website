# ZoLaiGPT — Official Website

Source for https://zolaigptofficial.com/, deployed by Cloudflare Pages from `main`
(repository root, no build step). Feature branches get automatic Pages preview deployments.

ZoLaiGPT is an independent multilingual AI and technology project (English, Myanmar,
Zomi (Tedim)) operated by an individual publisher. The AI chat is a local scripted demo;
no live AI provider is connected and no API keys are in this repository.

## Run locally

```sh
node scripts/build-site.mjs        # regenerate pages from templates/content
python3 -m http.server 8080        # then open http://localhost:8080/
python3 tools/verify-site.py       # static QA checks
```

(`python3 -m http.server` does not map `/guides/x` to `x.html` like Cloudflare Pages does;
use the `.html` URL locally.)

## Structure

| Path | Purpose |
|---|---|
| `scripts/build-site.mjs` | Zero-dependency static generator (layout, pages, sitemap). |
| `content/apps/*.json` | Apps directory data — see `docs/APP-RELEASE-PROCESS.md`. |
| `content/updates.json`, `content/social.json` | Verified updates and social links. |
| `src/legacy/` | Bodies of the learning guides and draft legal pages. |
| `assets/css/tokens.css`, `assets/css/site.css` | Design tokens and components. |
| `assets/js/` | `site.js` (nav, reveal, filters), `i18n.js` + `translations.js`, `quick-chat.js`. |
| `assets/brand/` | Logo mark, app icon, favicons, OG image. |
| `chat-workspace/` → `chat/` | Next.js source and static export of the `/chat/` demo. |
| `_headers`, `_redirects` | Cloudflare Pages security/noindex headers and redirects. |
| `ads.txt`, `google27cd9c0b1b99680c.html` | AdSense and Search Console verification (do not change). |

See `docs/REDESIGN-V6.md` for the redesign notes, architecture decision and QA, and
`docs/APP-RELEASE-PROCESS.md` for publishing apps safely. Older files in `docs/` describe
earlier versions.

## Deployment and rollback

Never push directly to `main`. Work on a branch, check the Pages preview, open a PR, and merge
only with the owner's approval. Roll back by reverting the merge commit on `main`.
