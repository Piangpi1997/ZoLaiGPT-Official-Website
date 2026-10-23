# AdSense Content Review Handoff — ZoLaiGPT / Melmuh Tongluan
**Prepared:** 2026-10-23 · **Preview only** · **NOT AdSense approved**

## Snapshot
- Branch: `audit/adsense-readiness-preview-20261023`, cloned from current `main` V5.7 (Melmuh Tongluan source download + ZoLaiGPT information).
- No production merge and no ad code.
- Human review has not been completed. The first three guides are useful technical drafts but do not contain first-hand owner testing evidence.
- Current Google primary language policy lists English and Malay, **not** Myanmar/Burmese or Zomi/Tedim. Do not inject Google ads on pages whose primary content is unsupported.

## Owner review actions (required before production release)

| Priority | What to check | Evidence to save | Sign-off |
| --- | --- | --- | --- |
| P0 | Verify who legally publishes Melmuh Tongluan and ZoLaiGPT, and explain their relationship without ambiguity | Genuine business/person info approved for publication | [ ] |
| P0 | Verify existing `privacy-policy.html` data practices: cookies, analytics, logs, providers, retention, readers' rights, current/possible advertising | A factual privacy notice reviewed for the operator's legal context | [ ] |
| P0 | Review `terms-of-use.html`, and any Myanmar/Zomi legal copy by qualified reviewers | Reviewed approved text and a genuine review record | [ ] |
| P0 | Validate `Melmuh-Tongluan-Android-Source-v1.6.2-public.zip`: accessible download, actual SHA-256, README, signing-key exclusion | Actual hash command output and file provenance | [ ] |
| P0 | Keep Google ad code OFF from Myanmar/Zomi-primary pages and local chat/demo. Plan page-specific exclusions and Auto Ads controls before any real ad integration | Written ad placement and language-exclusion plan | [ ] |
| P1 | Personally follow all four guide pages; correct grammar, outdated claims, original examples and misleading interpretations | Annotated editorial revisions by a named, real reviewer | [ ] |
| P1 | Confirm HTTPS, file downloads, legal links, social links, 404s and mobile menu behavior | Android Chrome/Safari screenshots and link test log | [ ] |
| P1 | Test accessibility: keyboard focus, visible headings, body contrast, 320px layout, 200% zoom and reduced motion | Browser/device result log | [ ] |
| P1 | Confirm SEO/indexing decisions, final canonical paths and sitemap for the **approved production build** | Google Search Console and live HTTP header checks | [ ] |
| P1 | Check whether AdSense account is approved/eligible, and obtain authentic publisher ID if and when Google instructs | AdSense dashboard result; NEVER share private credentials | [ ] |
| P2 | Add meaningful first-hand product demos, verified tutorials, FAQs based on real user needs | Authentic screenshots, reproducible examples, update notes | [ ] |

## Content review form (repeat for each article)

- Guide URL:
- Reviewer (real name/role if approved to publish):
- Review date:
- Goal for a real visitor:
- Which instructions did you personally test? What environment?
- Source links independently confirmed (yes/no):
- Project-specific download/hash claims independently confirmed (yes/no):
- Was AI used to draft? (yes; disclosed):
- Any accessibility or translation concerns:
- Decision: **draft / revise / approved** (default draft)
- Verified last-reviewed date for published content (leave blank unless actually reviewed):

## Readiness release gates

1. **Gate A — Content:** Operator verifies tech examples and confirms that every article provides unique value to users; do not publish automatically generated text as finished expertise.
2. **Gate B — Trust:** Operator identity/relationship, draft privacy/legal policies and translations resolved truthfully.
3. **Gate C — Language & ads:** The website retains multilingual support; ad implementation must explicitly avoid unsupported primary-language pages. Homepage dynamic language switching requires special assessment, not blanket Auto Ads.
4. **Gate D — Production-safe release:** Build a new approved candidate branch from the latest `main`. Bring across only reviewed page/UI changes. DO NOT copy preview `_headers` global noindex or preview-only meta robots. Review production sitemap/canonicals before release.
5. **Gate E — AdSense:** Only then submit the actual production domain for review. Google owns the decision; no automated audit can promise acceptance.

## Official supporting documentation

- Site readiness: https://support.google.com/adsense/answer/7299563
- Policy on supported publisher languages: https://support.google.com/adsense/answer/9727
- Privacy disclosures: https://support.google.com/publisherpolicies/answer/10437794
- Helpful/people-first content (Google Search): https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Microsoft `Get-FileHash`: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash
- Android app signing: https://developer.android.com/studio/publish/app-signing

## For repeatable source checks

Run from the repository root:

```sh
python3 tools/verify-adsense-preview.py
```

This test checks new guide HTML references, duplicate IDs, source-level noindex/metadata, CSS imports and the absence of simple AdSense script tags. It does **not** run browser rendering, externally fetch links, prove HTTP headers, confirm a real ZIP hash, or verify an AdSense account.

## Release safety warning

Production is connected to GitHub `main`. As of this handoff, the audit branch has not been merged to it. The preview `_headers` deliberately sets `X-Robots-Tag: noindex, nofollow` globally. Copying that file into production would risk making the official website disappear from Google search. Never deploy an audit draft to production without explicit owner approval and a separate SEO configuration review.
