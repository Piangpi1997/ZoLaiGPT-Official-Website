# ZOLAI GPT V6 — build and test report

Date: 25 October 2026. Status: implemented and locally verified frontend; public push/deployment blocked pending explicit authorization. This is not a general-purpose live AI release.

## Build and source checks

- Next.js optimized static production build: passed.
- TypeScript `tsc --noEmit`: passed, including the final code-copy feedback change.
- Chat unit suite: 4/4 passed, including the final code-copy feedback change.
- JavaScript syntax and Python generation: passed.
- Static verification: 22 generated/retained HTML pages; 436 local references; zero missing targets or anchors; no duplicate IDs detected; one H1 on each new marketing route.
- Local Myanmar font inspected: contains 160 glyph mappings in U+1000–U+109F.
- Security configuration: local asset loading; no provider key; no provider requests; no account/payment form; restricted microphone/camera/geolocation; exact hashes for static Next.js hydration scripts.

## Browser QA actually performed

Browser: cloud Chromium, desktop viewport 1363×936. Responsive QA uses same-origin browser iframes, not physical devices or mobile browser emulation.

- Seven nominal frame widths: 320, 375, 390, 768, 1024, 1440, 1920. Standard content documents have a 15px scrollbar deduction; chat uses the full frame width.
- Home, features, tools, about, pricing, help, contact, privacy and chat: document scrollWidth did not exceed clientWidth at all seven widths.
- Myanmar homepage, tools, pricing and contact: no horizontal overflow at all seven sizes. Feature-page Myanmar checks also passed at all seven sizes after rerunning the first 320px case with initialization explicitly awaited.
- Header mobile menu opened; Escape closed it and aria-expanded became false.
- Website English/Myanmar switching changed the actual H1, descriptions and component labels; light theme changed the document theme and was visually inspected.
- Homepage sample buttons changed the demonstration response; FAQ expanded on click.
- Original orb used the Canvas 3D fallback in this browser, rotated automatically and entered paused state using the button. Its previous renderer implementation was retained.
- Tool category Productivity returned one entry. Searching an unmatched phrase showed the empty state. Reset restored eight tools/starters.
- Text counter for `Hello world မြန်မာ`: 3 whitespace-separated words; 18 Unicode code points. Myanmar word-segmentation limitation is disclosed.
- Writing starter incorporated the entered topic in an editable prompt, with explicit non-AI labeling.
- Chat at 320px: sidebar open/close, Myanmar UI, send, scripted Markdown/code reply, replay, conversation search, new conversation and light-theme state worked.
- Copy-code button click in an iframe did not establish clipboard success; browser clipboard restrictions apply. Failure feedback was improved to say “Select text to copy”. HTTPS preview clipboard testing remains pending.

## Verification limits

No physical Android/iPhone/Safari run, OS reduced-motion toggle, Lighthouse score, full screen-reader audit, live provider call, image/document AI, email delivery or paid service was tested. CSS and shared motion policy implement reduced-motion handling; that is a code fact, not a claimed OS test. The browser lacked WebGL, so Three.js hardware rendering was not validated. Legal draft approval and Zomi translation review remain outside this implementation.

## Final regressions and publication boundary

- Chat was loaded with a local meta-delivered Content Security Policy matching the deployable script restrictions. Hydration, composer and scripted code reply worked. This checks script policy locally, not Cloudflare response headers.
- At a 320×450 frame, the composer occupied y=301.8–396.8px and remained visible within the 450px height.
- Selected contrast pairs were calculated: dark text/background 17.65:1; dark secondary/surface 7.88:1; dark action 9.11:1; light text/background 15.50:1; light secondary/surface 6.36:1; light action 5.86:1. These checks are not a complete WCAG audit.
- GitHub push was rejected by automatic approval review: the current request authorized implementation but was judged not to explicitly authorize public source disclosure and external repository state. No alternative write route was attempted. The local feature-branch source and distributable ZIP are complete.
- Read-only Cloudflare inspection after the rejection still showed the previous production commit `562dbbc8648b467a12d2dc64ee2695019bc64936`. There is no V6 public preview URL and production was not updated.
- Contact whitespace-only message validation rejected the input locally; no email was prepared or sent during this check.
- Public push to `feature/v6-official-platform` and its automatic Cloudflare Preview require the user’s explicit authorization. Production promotion is a subsequent action after reviewing that preview.
