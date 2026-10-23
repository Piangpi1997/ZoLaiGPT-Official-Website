# Privacy and Publisher Readiness — Evidence Inventory
Date: 2026-10-23  
Status: **Implementation-source observations only**; **NOT a finalized privacy policy, legal determination, or proof of AdSense eligibility.**  
Scope: Audit preview branch `audit/adsense-readiness-preview-20261023`, checked against source files, not private Cloudflare/Google account settings.

## Evidence from inspected source

| Data or connection | File / route | What the code shows | What is NOT established |
|---|---|---|---|
| Language preference | `assets/js/i18n.js` | Saves `zolaigpt-language` in browser localStorage. | Cross-browser retention policies / user settings not audited. |
| Announcement dismissal | `assets/js/announcement.js` | Saves `zolaigpt-announcement:<announcement ID>` in localStorage to remember a dismissed banner. | Does not imply server-side tracking or personal identity. |
| Homepage chat demo | `chatbot.js` | Scripted source-text replies, DOM messages kept in tab; no external model call in this file. | Does not prove extensions, provider logs, or the separate spatial chat never process data. |
| Spatial chat page | `chat/index.html` / separate compiled chat bundle | Page describes local scripted workspace and no live AI; source README should be checked for storage implementation. | No audit of every minified compiled module or independent device storage. |
| Local ZIP checksum widget | `guides/local-sha256.js` | Browser file input and `crypto.subtle.digest('SHA-256', bytes)`; no `fetch` or upload API in inspected widget. File currently capped at 32 MiB. | Checksum agreement does not prove software security, source provenance or that website-published hash is verified. |
| Fonts on main site | `assets/css/tokens.css` | Local font files `assets/fonts/archivo-latin-variable.woff2` and `assets/fonts/noto-sans-myanmar-400.woff2`. | Cannot generalize to all routes or dynamic dependencies. |
| Fonts on legal pages | `legal-original.css` | **External `@import` to Google Fonts** (`fonts.googleapis.com`). | Actual network delivery/cookies need live inspection; privacy copy must be route-specific. |
| Contact / downloads | `index.html` and `downloads/melmuh-tongluan/index.html` | Social and email links; download points to Google Drive; clicking external services leaves this domain. | Third-party usage, storage and retention belong to the providers and may differ by user. |
| Website hosting | Cloudflare Pages project in deployment reports | Pages serves public site and previews. | Exact IP log retention, analytics and cookie configuration are **unverified** without account-level settings. |
| Google advertising | Audit preview source / `_headers` | No AdSense integration, no fake ads.txt, preview globally `noindex`. | Actual AdSense account eligibility/status and final production ad integrations unverified. |

## First-party browser storage keys worth documenting

- `zolaigpt-language` — selected site interface language;
- `zolaigpt-announcement:<id>` — whether a specific banner was dismissed;
- Other chat-workspace localStorage/IndexedDB keys: **not yet verified**; do not claim none until source/build/runtime audit.

## Operator confirmation required

1. Confirm who operates/publishes ZoLaiGPT and Melmuh Tongluan. Document any different legal owners accurately; do not invent registration numbers or legal names.
2. Confirm active Cloudflare Web Analytics, Cloudflare security/bot tools, IP logs, third-party services, active cookies and retention practices from account settings.
3. Confirm which services receive messages, contact emails, downloads or analytics events; identify processor/controller responsibilities as appropriate.
4. Decide whether externally hosted Google Fonts should remain on legal pages or be replaced with properly licensed local fonts; update actual policy to match actual implementation. **Do not silently replace legal policy text with guesses.**
5. Review the Terms/Privacy draft under appropriate law and get fluent review for Burmese and Tedim Zomi legal text.
6. If advertising is later approved: add accurate Google privacy/cookie disclosures, assess required consent choices for relevant visitors, use an authentic AdSense publisher ID and `ads.txt` provided by Google, and keep ads off pages primarily in unsupported languages.
7. Only after review, approve and publish an accurate `Privacy Policy` and suitable page links.

## Release blockers

- Operator and actual analytics/log retention remain unverified.
- Current privacy and terms pages are explicitly marked **DRAFT**.
- Some routes still request Google Fonts; source code and route-specific privacy descriptions need reconciliation.
- Unsupported-language AdSense policy: English supported; Myanmar/Burmese and Zomi/Tedim not listed as primary-language choices at audit time.
- No AdSense approval is claimed.

## Official references

- Google Publisher Privacy Disclosures: https://support.google.com/publisherpolicies/answer/10437794
- Google AdSense supported languages: https://support.google.com/adsense/answer/9727
- Google AdSense site readiness: https://support.google.com/adsense/answer/7299563

This document is kept in **preview only**. Production and `main` remain unchanged.
