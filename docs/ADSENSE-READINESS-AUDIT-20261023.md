# ZoLaiGPT website — AdSense readiness audit
**Audit date:** 2026-10-23  
**Scope:** GitHub `main` baseline as inspected on 2026-10-23; isolated preview branch `audit/adsense-readiness-preview-20261023`.  
**Verdict:** **NOT READY TO SUBMIT / NOT APPROVED**. This is a technical/editorial checklist, not a Google review result.

## Basis and current project status

The actual `main` branch no longer matches earlier V5.4 summaries. It currently identifies as **V5.7 Official** and its homepage is primarily titled **Melmuh Tongluan — Android Source Download**. The homepage promotes a public Melmuh Tongluan **v1.6.2 developer source ZIP, not an APK**. It also retains the ZoLaiGPT brand mission, demo chatbot, multilingual UI, screenshots, and draft legal pages. **Do not assume older preview/production status is still current.**

Baseline `main` homepage blob SHA: `f9dcdf86f14f1de074d805265c27e297ea26890f`. The source download page was separately read. This preview was branched from `main`, not from older V5.4/V5.6 state. No edits were made to `main`, the live custom domain, or the Android backend.

## Critical issues (must resolve before application)

### 1) Unsupported AdSense primary content languages
- Google publisher products' current supported list includes **English** and **Malay**, but does **not list Myanmar (Burmese) or Zomi (Tedim)**.
- Google's policy prohibits running Google ad code on pages primarily in unsupported languages.
- **Keep the multilingual ZoLaiGPT interface**; do not remove languages to chase approval. Keep ad code OFF on primarily Myanmar/Zomi content. If future ads are implemented, explicitly exclude unsupported-language routes/pages and carefully assess the language-switching homepage and Auto ads settings.
- The preview guide pages are **English-only**, separate from the multilingual home UI. This is a preparation step, not guaranteed acceptance.

Official sources:
- https://support.google.com/adsense/answer/9727
- https://support.google.com/publisherpolicies/answer/10436912

### 2) Quality, originality and substance
- Current home is a product presentation/download page, with much of its main text being marketing/feature copy and release-status notes.
- Google's site readiness guidance emphasizes **unique useful content, substantive text and good navigation** rather than number of pages or any guaranteed minimum word count.
- Added an English guide hub and three practical guides; **all are explicitly marked AI-assisted editorial drafts awaiting human verification**.
- A human publisher should personally test commands, write or substantially improve authentic examples, verify the actual ZIP hash/files, check links on real devices, remove generic filler and sign off before releasing. Do not mass-publish generated pages solely for search traffic.

Official sources:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/81904
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### 3) Privacy transparency not final
- The current `privacy-policy.html` explicitly says **Draft — verification needed** and asks for operator identity, analytics, retention and hosting verification.
- `terms-of-use.html` is also explicitly a draft; Zomi legal translation needs native-speaker review.
- Before adding AdSense, finalize real operator details and actual data practices, including disclosures required for Google ads (cookies, IP identifiers, third parties), and assess consent/CMP rules in applicable regions.
- **Do not insert a fake privacy declaration or claim a legal review that never happened.**

Official source:
- https://support.google.com/publisherpolicies/answer/10437794

### 4) Brand / product identity needs editorial clarity
- Homepage title/hero currently emphasize **Melmuh Tongluan**, while other sections describe **ZoLaiGPT** app/vision/credits. The site should clearly explain which project publishes what, and whether screenshots belong to the same app; existing download page/section includes some distinctions already.
- The publisher/author identity and real-world accountability need genuine verification, not invented personas.

### 5) AdSense account and actual review status unknown
- No connected AdSense account status, approval decision, publisher ID, payment information or crawl report was supplied.
- Google determines acceptance; this checklist cannot verify approval, eligibility of the publisher's account, traffic sources, SSL/crawler visibility or any other account-only facts.
- Only add AdSense verification code and the real publisher `ads.txt` after a verified account/publisher ID is available and after independent production approval. Never invent a publisher ID.

Official sources:
- https://support.google.com/adsense/answer/9724
- https://support.google.com/adsense/answer/12176698

## Changes made on this PREVIEW branch

| Area | Preview-only action |
| --- | --- |
| Guide Hub | `guides/index.html` with linked, reader-oriented explanations |
| Android Source | `guides/source-zip-verification.html`: SHA-256 PowerShell/macOS/Linux, provenance, no APK claims |
| Multilingual AI | `guides/multilingual-ai-review.html`: review workflow, language accuracy, native Zomi verification |
| App availability | `guides/check-app-availability.html`: source versus installable release and scam red flags |
| Transparency | `guides/editorial-standards.html`: AI-assisted draft disclosure, corrections, publisher contact |
| Homepage | `index.html`: Learn nav, guide cards, footer links; original Melmuh/download/app/chat preserved |
| UI | `assets/css/knowledge-guides.css` for standalone reading and homepage cards |
| Stylesheet | `styles.css` imports guide CSS |
| Version display | `assets/js/site-config.js` labels branch `Audit Preview` |
| SEO boundary | Preview `index.html` noindex; preview `_headers` global `X-Robots-Tag: noindex, nofollow` |

No ads, affiliate links, fabricated publisher identifiers, tracking scripts, consent popups or downloads were added. No production sitemap, robots.txt, original legal drafts, source ZIP or app backend was changed.

## Acceptance checklist (owner sign-off required)

- [ ] Read every new article; correct errors and add first-hand, useful material.
- [ ] Confirm the public developer ZIP SHA-256 is current and downloadable from the stated host.
- [ ] Confirm who is legally operating ZoLaiGPT and Melmuh Tongluan; make business/brand relationship clear.
- [ ] Verify publisher email/contact responsiveness and fix broken external links.
- [ ] Finalize policy text based on actual data collection, hosting, logs, analytics, advertising, retention and local legal requirements; have suitable reviewer check translated policies.
- [ ] Keep ads off unsupported-language pages, including consideration for language-switching behavior and Auto Ads exclusions.
- [ ] Test Chrome Android and Safari iOS, English/Myanmar/Zomi navigation, focus states and accessibility; record results.
- [ ] Before real publication, copy approved guides only into a production candidate branch and remove preview-only `noindex` settings **in that candidate**, not blindly.
- [ ] Update production sitemap and canonical URLs for newly published and reviewed articles; submit Search Console sitemap after owner approval.
- [ ] Verify Google ownership and AdSense account eligibility; follow Google's own onboarding instructions.
- [ ] Provide real AdSense publisher ID before discussing `ads.txt`. Do not create fake or empty `ads.txt`.
- [ ] Never place ads in the local AI demo chat or build deceptive click behavior.
- [ ] Verify server response headers, crawl access, HTTPS and core site usability on the **final approved production deployment**, not just a preview.
- [ ] Request Google site review only when the publisher believes content and legal practices are ready.

## Preview safety — critical
This branch was **not merged** into `main`. Its `_headers` file **globally sets noindex** for preview safety. **DO NOT MERGE preview `_headers` directly into production**; that would block indexing on the official domain. The original production SEO/verification configuration must be preserved or reviewed separately in an explicitly approved release.

Google sources are current at audit time; policies can change. The site remains **not verified as AdSense-approved**.