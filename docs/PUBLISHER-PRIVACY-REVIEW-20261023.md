# ZoLaiGPT — Individual Publisher / Privacy Review
Reviewed date: 2026-10-23
Status: **PRODUCTION CANDIDATE ONLY / NOT A FINAL LEGAL APPROVAL**

## Publication identity decision
- Public brand: **ZoLaiGPT**
- Project status supplied by owner: independent project, **no SSM business registration currently claimed**
- Website operator: **Thang Piang** (individual website operator name as displayed in the account screenshot; do not infer a separate business registration)
- Existing public contact: `thangdeihpiang21@gmail.com`
- Never copy screenshots of AdSense payment settings, address, tax details, phone number, or payment profile IDs to the public website.
- Owner selected the option to publicly show an individual operator name. The displayed spelling should match the publisher's chosen public identity; do not publish address, tax or banking information.

## Source-backed privacy observations
- Cloudflare Pages hosts the production domain `zolaigptofficial.com`.
- Cloudflare Pages project build configuration returned `web_analytics_tag: null` and `web_analytics_token: null` as inspected today. This is **not** evidence that zone analytics, security logs, Cloudflare request metadata, external tools or retention are absent.
- Homepage `assets/js/i18n.js`: localStorage key `zolaigpt-language`.
- Homepage `assets/js/announcement.js`: localStorage key prefix `zolaigpt-announcement:`.
- Existing home/space chat labels show a **local scripted demo**; review the full chat workspace separately before promising any storage/processing guarantee.
- Previous `legal-original.css` imported Google Fonts. Candidate serves existing local Archivo and Noto Sans Myanmar font files instead; verify the requests and font appearance on the preview before release.
- Public Melmuh Tongluan source downloads use a Google Drive link; social/contact links lead to third-party platforms.
- Homepage carries the owner-supplied `google-adsense-account` ownership tag; root `ads.txt` uses a real Google publisher ID, but **no AdSense ads script or units** are enabled. Site has been ownership-verified, NOT reviewed/approved.

## Candidate files changed
- `legal-original.css`: replace external Google Fonts import with local, appropriately already-present font assets.
- `privacy-policy.html`: English-only technical revisions on publisher contact, storage, local fonts, AdSense conditional disclosures, external services. Explicit DRAFT warnings and translated text remain.
- `terms-of-use.html`: English-only description of the independent publisher, downloads, and the demo's limits. Explicit DRAFT warnings remain.
- `guides/about-this-website.html`: transparent brand versus individual-publisher distinction without public personal identifying details.

## Bahasa Malaysia privacy readiness (important)
- Malaysia's Personal Data Protection Commissioner guidance for PDPA section 7 indicates that a qualifying personal-data notice should be provided in **the national language (Bahasa Malaysia) and English**. English, Myanmar and Zomi are not the same as English and Bahasa Malaysia.
- Added `privacy-bm.html` as a **DRAFT Bahasa Malaysia** notice linked from the existing English privacy page and website footer.
- `_headers` and the draft's HTML meta tag exclude it from indexing until operator and legal review.
- The new notice is not an approved legal translation. A competent Bahasa Malaysia/privacy reviewer must confirm phrasing, actual practices and applicability before the legal draft label is removed.
- Official source: https://www.pdp.gov.my/ppdpv1/en/akta/guidance-on-the-preparation-of-personal-data-protection-notices/

## Not yet known or approved
- Legal-name consistency with any applicable official documentation, and requirements for other public contact details.
- Final law-specific Privacy Policy/Terms review and translations by qualified reviewers.
- Cloudflare zone analytics/security logging, actual retention periods, processing agreements, third-party cookie requests.
- Actual AdSense ads and the legally applicable consent management requirements; Google policy for unsupported primary languages.
- Business registration and tax compliance as required by the owner's actual status and activities.

## Release gates
- [ ] Compare code changes to `main`; make sure only intended files changed.
- [ ] Confirm previews render, no Google Fonts request from legal pages, local font assets exist.
- [ ] Maintain no ad-serving script; don't add global `noindex` to production.
- [ ] Decide whether the owner wants to make an individual name public. If no, review whether verified contact details meet applicable legal requirements.
- [ ] Confirm Cloudflare analytics/security/retention and third parties from account settings.
- [ ] Human legal/editorial review and owner approval before changing Privacy/Terms from DRAFT to finalized.
- [ ] Only then consider the AdSense `Request review` step with the user.

## Official references
- https://support.google.com/adsense/answer/1348695
- https://support.google.com/publisherpolicies/answer/10437794
- https://support.google.com/adsense/answer/9727
- https://www.pdp.gov.my/ppdpv1/en/introduction/

No account credentials, personal address or government/tax IDs are stored in this report.
