# VNext implementation and fixes

The main baseline is e008d40f854e4ef325177ac194de67f30fa10e43. Work is isolated to release/vnext-premium-orb-preview.

## Hero change

The previous sphere/map and tangent logo-emblem composition has been replaced in the active homepage with the owner-supplied glass orb artwork, encoded as transparent WebP. Its identity stays readable while independent CSS light layers create atmosphere. There is no third-party runtime dependency or WebGL requirement. Existing legacy globe files remain in the repository as historical assets and are not imported by the new homepage.

The supplied old homepage screenshot visibly reports reduced motion. The previous globe source contains a requestAnimationFrame loop, delta clamp and 30-second rotation update; its policy intentionally stops for reduced motion, manual pause, hidden/offscreen state or lost context. A screenshot cannot establish the exact cause on that handset, and no physical Android root-cause claim is made. The VNext design replaces that rendering path rather than claiming an unverified correction to the old WebGL engine.

## Bugs found and corrected during browser QA

1. Transformed orbital lights extended beyond their stage. Stage overflow now clips decorative light geometry.
2. At 320px the three language cards were too narrow, the long coming-soon heading overflowed, and footer content could shrink excessively. Mobile language cards now stack; narrow typography and footer wrapping preserve readable content.
3. A mobile chat max-width based on 100vw included the desktop scrollbar and placed its left edge at -3px in the iframe test. Percentage sizing now leaves 12px on both sides: measured left 12px, width 281px at 305px client width.
4. Low-capability startup could show the wrong atmosphere button state. The initial aria-pressed value and label now match the selected mode.
5. A delayed demo reply could focus the input after the dialog closed. Input focus is now restored only while the panel is open.

## Shared motion policy

assets/js/animation.js owns explicit pause, OS reduced motion, document visibility and pageshow. Manual pause is not persisted. hero-orb.js handles artwork failure, device capability, quiet mode and offscreen animation suspension. The reduced-motion media query also stops all CSS animations and transitions independently of JavaScript.

## Chat architecture

The upgraded interface remains an explicitly labelled local scripted demo. Messages are rendered with textContent, limited in length/count and retained only in the current tab. It makes no AI/provider request and includes no credentials. Existing Android backend and billing are untouched. README describes a future authenticated Worker proxy with server-side secrets, quotas, timeouts and abuse protection; that proposal is not deployed.
