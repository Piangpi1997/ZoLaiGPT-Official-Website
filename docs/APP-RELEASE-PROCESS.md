# App publishing and release process

The Apps directory (`/apps/`) is generated from JSON files in `content/apps/`. Adding or
updating an app never requires a redesign: edit JSON, rebuild, review the preview, merge.

## Add a new app

1. Copy an existing file in `content/apps/` to `content/apps/<slug>.json`.
2. Fill in the fields (see the model below). Keep `status` honest:
   `in-development` → `preview` → `beta` → `live` → `archived`.
3. Add images to `assets/apps/` (screenshots, WebP, ~1200×750) and the icon (256×256 WebP).
   Screenshots must come from a real build. Do not use mock-ups as screenshots.
4. Run `node scripts/build-site.mjs` and `python3 tools/verify-site.py`.
5. Commit on a feature branch, push, check the Cloudflare Pages preview, then open a PR.

Only include apps that belong to ZoLaiGPT. Separate products (for example Melmuh Tongluan)
keep their own pages and releases and are not rebranded.

## Content model

| Field | Notes |
|---|---|
| `id`, `slug` | Stable identifiers. `slug` becomes `/apps/<slug>/`. |
| `name`, `tagline`, `description`, `category` | Official display text. |
| `status` | `in-development`, `preview`, `beta`, `live`, `archived`. |
| `pricing` | `free`, `paid` or `null` (not announced). Only set when real pricing exists. |
| `platforms` | `android` / `ios` / `web`: `available`, `beta`, `planned`, `not-planned`, `not-applicable`. |
| `icon` / `glyph` | Path to icon image, or an icon name if no image exists. |
| `screenshots[]` | `{src, alt, caption}`; missing files are skipped automatically. |
| `releases[]` | Newest first: `{version, date (YYYY-MM-DD), channel (stable/beta/preview), notes[]}`. |
| `downloads[]` | `{label, url, type: "store" \| "apk" \| "file", signed: true, sha256}` — see rules below. |
| `launchUrl`, `launchLabel` | For web apps. |
| `requirements[]`, `installation[]`, `faq[]` | Shown on the detail page. |
| `supportEmail`, `privacyUrl`, `termsUrl`, `privacyNote` | Per-app support and privacy links. |

## Download safety rules (enforced by `tools/verify-site.py`)

- An entry in `downloads` must have `signed: true`.
- Every non-store download must include a 64-character lowercase SHA-256 checksum.
- An app with status `in-development` must not list downloads.
- The page never shows a download button unless such an entry exists.

## Hosting signed builds

Recommended: **GitHub Releases** on the app's own repository.
1. Build a release APK/AAB signed with your private upload key (never commit keystores).
2. `sha256sum app-release.apk` and record the value.
3. Create a GitHub Release (tag `v1.2.3`), attach the APK and a `SHA256SUMS.txt` file.
4. Add the release URL and checksum to the app JSON, rebuild, preview, merge.

Alternative: **Cloudflare R2** with a public bucket on a custom subdomain
(e.g. `downloads.zolaigptofficial.com`). Uploads must be done with Wrangler or the dashboard
by the account owner; this website has **no public upload endpoint** and must not get one
without authentication, authorization, file-type validation and size limits.

Archive old builds by keeping their release entry and setting the channel/notes accordingly;
do not delete published checksums.

## Store publishing prerequisites (owner action required)

- **Google Play**: Google Play Console developer account (one-time fee, identity
  verification), app signing via Play App Signing, a privacy policy URL for the app, Data
  safety form, content rating, and for new personal accounts a closed test with testers
  before production access.
- **Apple App Store**: Apple Developer Program membership (annual fee), signing
  certificates/provisioning profiles, App Store Connect listing, privacy "nutrition labels",
  and App Review.
- Each requires the owner's identity, payment and approval. Nothing is submitted to any store
  without explicit owner approval.
