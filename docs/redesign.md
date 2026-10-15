# Kasapink — compact redesign

## Scope

Brand-site redesign. Publication is owner-authorized; ERP and databases remain outside this release.
Home is a Decide/Learn brand surface, not a storefront. A short editorial heading is paired with the original Kasapink logo and two service links. Navigation remains Home, About Us, and Service (Food / Fragrance TBA). No catalogue, pricing, invented testimonials, or checkout.

The original brand palette and logo are retained. `redesign.css` is the active stylesheet; `styles.css` is retained as the previous design reference. Runtime remains plain HTML/CSS/JavaScript with no frontend dependencies. Deployment runs `npm run build`, which copies an explicit public-file allowlist into `public/`; Vercel publishes only that directory. `background.css` supplies the sage textured skin.

About Us and both business descriptions use the owner's supplied final copy, with justified prose and separate sections for identity and approach. The public ERP link was removed to keep the public site focused; the ERP itself is untouched.

## Contact

The bottom-right WhatsApp icon opens the existing accessible dialog. The form requires name, telephone and message. Send opens `https://wa.me/6287884363963` with URL-encoded text. The visitor must confirm sending in WhatsApp. The form has no server submission or local storage.

## Verification

Install optional development-only tools with `npm install`, then run `npm test`. Tests use installed Microsoft Edge, Playwright and axe-core; they open the site locally and do not send a WhatsApp message. They intercept `window.open` to check the generated URL and message.

Coverage: 360, 768 and 1440px; page navigation, Service dropdown/Escape, required form fields, encoded message with ampersands and newlines, close-on-Escape, WCAG A/AA automated checks on the homepage and contact dialog, horizontal overflow, and JavaScript runtime errors. Screenshots are written under `work/`.

Visual audit: desktop and mobile screenshots reviewed. No clipping identified. Anti-slop score: 0/10 of the skill's listed tells; asymmetrical editorial composition, brand-led warm neutrals, existing logo, no invented product artwork or decorative metrics. Automated accessibility checks do not replace a full manual accessibility audit.

Open `index.html` directly for preview. Existing hash routes are preserved.
