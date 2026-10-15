# Verification — 15 October 2026

Tested using Chromium 156, Playwright 1.64.1 and axe-core/playwright 4.13.0 against a local static server. Viewport widths: 320, 375, 768 and 1440 pixels, height 960 pixels.

- HTTP 200 at every tested viewport.
- No horizontal document overflow or failed images.
- No browser page errors.
- First keyboard Tab exposes the skip-to-content link.
- All WhatsApp links target the official user-supplied number 6287884363963 with contextual messages.
- Zero axe violations under WCAG 2 A/AA and WCAG 2.1 AA rule tags after correcting artwork caption contrast.
- Desktop and mobile full-page screenshots manually inspected.
- SEO source inspection: Indonesian document language, viewport, one h1, description, canonical URL, Open Graph metadata, Organization JSON-LD, robots.txt and sitemap.xml present.
- Favicon 32×32 and Apple icon 180×180 generated from the supplied transparent logo.

Automated checks do not establish complete WCAG conformance. No full screen-reader, Safari/iOS, real-device, Lighthouse, public indexing, WhatsApp delivery, or authenticated ERP flow test was performed. ERP URL is retained from the supplied reference; destination ownership/availability was not independently confirmed. Production is not deployed. Social image absolute URLs become available when this source is approved and hosted on kasapink.com.

Raw viewport results are in validation.json. Test tooling was kept outside the website repo to preserve its buildless setup.
