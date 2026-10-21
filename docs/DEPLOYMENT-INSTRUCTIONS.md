# Preview deployment and rollback

## Deployed preview

- Repository: Piangpi1997/ZoLaiGPT-Official-Website
- Branch: release/vnext-premium-orb-preview
- Tested code commit: 2a043309d8614c5ba1bef21781eee76525cc70e1
- Cloudflare Pages project: zolaigpt-official-website
- Deployment: edb2b57f-c355-4a51-8413-5b4086b6c513
- Tested preview URL: https://edb2b57f.zolaigpt-official-website.pages.dev/
- Branch alias reported by Cloudflare: https://release-vnext-premium-orb-pr.zolaigpt-official-website.pages.dev

The existing GitHub integration created a branch preview. Its Cloudflare Pages check reported success. The production branch mapping, domain, main ref, Android app and backend were not changed by this work. Documentation may be committed after the tested code without modifying application behavior; use the pinned URL above to inspect the tested version.

## Local setup

Extract the ZIP, then serve its root:

```sh
python3 -m http.server 8080
```

Visit http://localhost:8080/. No package install or build command is required. JavaScript ES modules require HTTP rather than file://.

## Future preview updates

Commit only to release/vnext-premium-orb-preview. The connected Pages project creates another preview. Inspect its GitHub Cloudflare Pages check and test the deployment URL before sharing it. Do not merge to main or change the production branch setting as part of a preview update.

For manual deployment, extract the ZIP and upload the root files to a dedicated preview project. index.html and _headers must be at the deployed root. Do not upload to the live production environment or attach the official domain.

## SEO boundary

This package is preview-only: index.html has noindex/nofollow, and _headers applies X-Robots-Tag: noindex, nofollow globally. Keep both for previews. robots.txt, sitemap, verification file and canonical production domain are preserved from baseline. Legal drafts retain their existing notices and noindex behavior.

Before any separately approved production release, review legal status, metadata, canonical, sitemap and indexing policy; remove only preview-specific blocking rules in that approved production build. Never blindly merge preview noindex headers into production.

## Backup / rollback

The baseline remains in Git history at e008d40f854e4ef325177ac194de67f30fa10e43. No production rollback is necessary. To compare or restore a preview safely, create another preview branch from that commit; do not reset main. Existing pinned preview URLs provide earlier review states.

The ZIP contains all active assets and documentation. Unused legacy globe.js, Three.js vendor library, world map data and globe fallback SVG are omitted from the ZIP to keep it small; they remain in repository history/current branch. All assets referenced by the VNext homepage and legal pages are included.
