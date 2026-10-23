# ZoLaiGPT — AdSense Production Content Release
Date: 2026-10-23 | Release branch: `release/adsense-ready-content-20261023`

## Approved scope
Owner authorized an AdSense-readiness **production content update**. This is an engineering/content release, **not** permission to claim Google site approval or to start serving ads without completing privacy and supported-language compliance.

### Changes prepared
- Five English informational guides and the linked guide hub (`/guides/`).
- New homepage educational section, learning navigation, and project identity clarification.
- Responsive, accessible guide styles; existing premium orb, multilingual selector and local chat demo preserved.
- Local SHA-256 tool using browser Web Crypto, no file upload code, 32 MiB memory-safety cap. The checker validates bytes against the published digest; it does **not** certify software provenance.
- Accurate statement that Melmuh Tongluan v1.6.2 is an Android **source ZIP**, not an installable APK.
- Source-download announcement now links to the real source-download details rather than a chat demo.
- `/sitemap.xml` includes homepage, developer download and English guides (8 URLs total).
- `/ads.txt` contains the Google-provided publisher ID in Google's officially documented format:
  `google.com, pub-7075005129832926, DIRECT, f08c47fec0942fa0`
  This does not activate ads or establish AdSense approval.
- Existing AdSense **ownership verification meta tag** remains in homepage.
- Draft Privacy Policy English copy updated with observed localStorage keys, route-specific Google Fonts and no ad-serving script; legal drafts remain clearly marked **DRAFT** and excluded from the sitemap.

### Verified / not verified
- GitHub source checks: headings, internal guide links, canonical URLs, stylesheet import, one ownership meta tag, syntax of ads.txt, sitemap URLs, source ZIP checksum reference, no production-wide noindex, no ad-serving script.
- Cloudflare candidate deployment: deployment status **success**; homepage rendered over HTTPS with guide section and ownership tag.
- **NOT verified:** phone/safari real-device visual QA, actual live archive hash calculation, publisher/operator full legal identity, analytics/cookie/account configurations, and independent human legal/content review.

## Blockers before Google site review
1. Confirm site owner/operator and editorial accountability; verify public contact and relationship between ZoLaiGPT and Melmuh Tongluan.
2. Finalize accurate Privacy Policy and Terms based on actual Cloudflare analytics, logs/cookies, retention, third-party requests and applicable law; qualified review of Myanmar and Zomi legal translations is necessary.
3. Human-check educational articles and source ZIP checksum with documented tests. Guides openly disclose AI assistance and limitations.
4. Test mobile/desktop responsiveness, keyboard navigation, reading comfort, source ZIP links and browser consent/privacy flows.
5. Keep Google ad-serving code **OFF the language-switching homepage** and pages primarily in Myanmar or Zomi; those are not on Google's listed supported-language inventory as of this release. Keep demos and download controls free from confusing ad placement.
6. Submit the real custom domain for review only after the owner's sign-off. Google alone controls approval and monetization.

## Critical preview/production separation
The prior AdSense Audit Preview branch has a `/*` global `X-Robots-Tag: noindex, nofollow` configuration and preview meta noindex.
**Those settings are NOT part of this production candidate**. Existing production Pages alias anti-indexing and draft legal exclusion remain. Do not merge the Audit Preview branch into production.
No AdSense JavaScript or ad units have been enabled.

## Official references
- Site review/content: https://support.google.com/adsense/answer/7299563
- Ads.txt format: https://support.google.com/adsense/answer/12171612
- Supported languages: https://support.google.com/adsense/answer/9727
- Privacy disclosures: https://support.google.com/publisherpolicies/answer/10437794

This report does not certify eligibility, Google acceptance, live ad delivery or payout.
