# ZoLaiGPT Official Website · V5.8

**ZoLaiGPT is a standalone multilingual AI learning and information website**, focused on English, Myanmar (Burmese) and Zomi (Tedim). It is not an Android app download portal or a paid AI product.

The public website includes:
- A premium responsive homepage with the existing 3D amber/orange orb, liquid glass UI and language selector.
- English educational guides and a getting-started article.
- A clearly identified local scripted chat demo and optional browser workspace; neither uses a live AI API.
- Publisher contact, editorial standards, draft Privacy Policy and Terms.
- Existing Google AdSense account-ownership verification meta tag and `ads.txt` file. **Google AdSense approval and ad serving have not been established.** No AdSense JS or ad units are enabled.

## Run locally

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/`. The static homepage uses HTML, CSS and modern JavaScript modules. An optional Next.js workspace source remains under `chat-workspace/`, with a separately built static export in `chat/`. The local demos use scripted responses; refresh may clear the demo state.

## Relevant files

- `index.html`, `styles.css` — homepage, guide section, CSS module imports.
- `assets/js/translations.js` — English and Myanmar copy, with some Zomi/English fallback. **Tedim Zomi content must be reviewed by a fluent native speaker.**
- `assets/js/site-config.js` — public version, announcements and future update cards.
- `assets/zolaigpt-orb.webp`, `logo.png` — existing branded artwork; not changed in this release.
- `guides/` — free website learning content.
- `privacy-policy.html`, `privacy-bm.html`, `terms-of-use.html` — draft legal notices; human confirmation required.
- `sitemap.xml`, `robots.txt`, `_headers` — public crawl/indexing policy.
- `_redirects` — routes retired from the former unrelated Android-source presentation.
- `ads.txt` — existing Google AdSense seller entry. This does not activate advertising.

## Removed from public website in V5.8

The previous **Melmuh Tongluan Android developer source download**, APK language, image gallery, plan/credit pricing cards, and unrelated download-oriented guides are no longer part of ZoLaiGPT.

Historical source repositories or external Google Drive files are **not deleted** by this change; `_redirects` sends previous website visitors to the relevant ZoLaiGPT information instead. Earlier commits and historical files in Git remain part of project history.

## Deployment and rollback

Cloudflare Pages builds the production `main` branch and generates previews for feature/release branches. Always review a candidate deployment before merging to `main`, verify the live domain and keep `main` free of preview-only `noindex` headers. To roll back, revert the V5.8 release commit and redeploy.

## Publishing and monetization caution

ZoLaiGPT's Google AdSense ownership tag is not proof of review or approval. Advertising is not enabled. The operator must verify actual privacy/data-handling practices, obtain appropriate legal/editorial review and follow Google's supported-language policies before applying for or enabling ads on eligible pages. Avoid auto ads on the multilingual homepage and in demos.

Updated 2026-10-23.
