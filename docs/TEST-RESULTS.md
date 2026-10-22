# V5.5 Premium Orb Preview — verification

Date: 21 October 2026. Environment: cloud desktop Chrome. Tests use the real Cloudflare branch deployment, plus its same-origin iframe viewport harness. These are browser layout tests, not Android/iOS device emulation or physical-device certification.

Tested application commit: `2a043309d8614c5ba1bef21781eee76525cc70e1`.
Tested deployment: https://edb2b57f.zolaigpt-official-website.pages.dev/

## Browser results

| Check | Result and evidence |
| --- | --- |
| Hero loads | PASS: supplied orange glass orb displays with integrated ZoLai identity, orbit trails and pedestal; desktop and mobile screenshots inspected internally. |
| Automatic ambient motion | PASS: without dragging, front traveler computed transform changed from `matrix(0.9939, 0.110285, -0.110285, 0.9939, 0, 0)` to `matrix(-0.902556, 0.430573, -0.430573, -0.902556, 0, 0)`. Animation state was running. |
| Pause / Resume | PASS: button changed to Resume motion; computed animation state paused. Resume returned it to running and transform changed again. |
| Quiet atmosphere | PASS: control toggled the `low-power` class and could restore full atmosphere. |
| English / Myanmar / Zomi | PASS: switching updates source-driven navigation and hero; Myanmar heading and Zomi `ZoLaiGPT / Zomi tawh AI` observed. New editorial labels are deliberately English. No new Zomi translation is certified. |
| Mobile navigation | PASS: menu opens with aria-expanded true; Escape closes it with false. |
| Chat open / close / minimize | PASS: dialog opens, closes and minimizes; launcher focus returns. |
| Chat expand | PASS: expanded desktop panel width measured 640px; Compact control available. |
| Chat send / typing / reply | PASS: quick prompt and typed `app release` create a message, show Preparing a demo reply, then return source-content replies. Buttons disable during reply preparation. |
| Myanmar / Zomi replies | PASS: Myanmar About reply matches the existing source paragraph. Zomi language reply: `English, Myanmar leh Zomi (Tedim).` |
| Chat at 320px | PASS: panel left 12px, right 293px, width 281px within a 305px content viewport (15px desktop scrollbar). Zomi selector width 118px; full option retained. |
| Browser console | No application-origin error observed during inspection. Cloud browser extension metadata errors came from chrome-extension://, outside the website. |

## Responsive measurements

Final build; each iframe is 850px high. A desktop scrollbar consumes 15px.

| Requested width | HTML client width | HTML scroll width | Horizontal overflow |
| --- | --- | --- | --- |
| 320 | 305 | 305 | None |
| 390 | 375 | 375 | None |
| 768 | 753 | 753 | None |
| 1024 | 1009 | 1009 | None |
| 1440 | 1425 | 1425 | None |

## Local verification

- All seven active JavaScript modules pass `node --check`.
- Local HTML asset and JavaScript import references resolve.
- Original logo, two app screenshots, legal stylesheet, both legal HTML pages, robots.txt, sitemap.xml and Google verification HTML are byte-identical to baseline commit e008d40.
- Ten external social/contact destinations and the complete original translation dictionaries are preserved.
- Preview meta robots and `_headers` explicitly declare noindex/nofollow. Original robots.txt and production canonical remain preserved. Header delivery is configured, not independently measured here.

## Not tested / limitations

Physical Android Chrome, iOS Safari, phone touch/keyboard behavior, GPU/FPS, memory profiling, Lighthouse/Core Web Vitals, screen-reader testing, a timed uninterrupted 90-second animation recording, OS reduced-motion switching, image-error fallback injection and page lifecycle restoration were not independently tested. Reduced motion, visibility, fallback and low-capability behavior were inspected in code. No performance score or physical-device PASS is claimed.

External social account availability and invitation expiry were not validated; URLs are preserved exactly. Local legal links resolve and legal content remains unchanged.

The latest brief selects a dimensional CSS/artwork orb. It is not a WebGL sphere and does not claim globe-surface Y-axis rotation or drag controls. Ambient light travelers loop independently at 18/26 seconds; core floating, light and glow have separate loops.

## Phone acceptance checklist

- [ ] On an Android phone, open the preview and check smooth amber/blue light movement without touching.
- [ ] Test Pause, Resume and Quiet atmosphere, then background/foreground the browser.
- [ ] Enable OS Reduce Motion; verify still presentation and disabled motion control.
- [ ] Select Myanmar/Zomi; verify menu, selector text and paragraph readability.
- [ ] Open chat with keyboard visible; send a demo prompt, minimize, expand and close.
- [ ] Repeat in Safari on iPhone, including portrait/landscape and browser toolbar changes.
- [ ] Profile representative mobile hardware before approving production release.
