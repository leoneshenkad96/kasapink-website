# Kasapink background research and decision

## Brief

Replace the plain white canvas with a more expressive background, without repeating the previous cream-on-pale-logo problem. Keep the page a concise brand introduction, not a catalogue. Preserve original universal and Food logo artwork, the existing layout, and the WhatsApp flow. Work remains local; publication is not authorized.

## Sources reviewed

1. Work & Co, Aesop case study: https://work.co/clients/aesop/
   Read the case study. Takeaway: derive the digital visual language from the existing brand rather than copy a fashionable template. Adapt only the principle of restraint, not Aesop's proprietary layout, fonts, or branding.
2. Clay, How to Add Depth to Your Website with Web Textures: https://clay.global/blog/web-design-guide/website-texture
   Read the article's texture, readability and performance sections. Takeaway: microtexture can add material character; it must not compete with text or impose large asset downloads.
3. Nodlume, Background textures: https://nodlume.dev/textures
   Read the reference. Takeaway: weave/grain should recede, be tintable, and disappear in print and forced-color modes. Its suggested opacity ranges are design guidance, not a standard.
4. Silphium Design, Botanical & Floral Motifs: https://silphiumdesign.com/botanical-floral-motifs-for-engaging-web-design/
   Read the motif types and hierarchy discussion. Takeaway: use restrained framing rather than busy floral wallpaper. Kasapink does not receive fabricated botanical, organic or sustainability product claims.
5. W3C, Understanding Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
   Official search excerpt retrieved; the direct browser page was bot-blocked. Text minimum: 4.5:1 for normal text and 3:1 for large text. Logos are exempt from this text requirement, so actual logo legibility was separately reviewed in rendered screenshots.

The configured extraction backend could not fetch pages; browser DOM reads were used for sources 1–4. No downloaded stock texture or third-party artwork is used.

## Actual assets

Both transparent PNGs were inspected. Dominant opaque universal colors include #EFE9D4 (pale cream), #D9CDA7 (sand), #949F85 (sage), #8C7650 (brown), and #C0A36C. Food includes #819075 (sage), #CDB88E (sand), and #8C6B42 (brown). These are measured from the actual image files, not inferred from a template.

## Three rendered palette studies

- Warm Linen: #F4F0E8 with warmer sand washes. Rejected as primary because it moves back toward the pale universal logo's cream/sand family.
- Sage Atelier: #EEF2ED with muted #DCE7DE and a restrained #F3EAE4 warm wash. Selected: a cooler canvas supports both earthy marks while giving the two-business umbrella a calm shared identity.
- Rose Stone: #F5EEEC with rose and stone washes. Viable but adds a pink-led identity that is not present in either supplied mark; less direct fit than sage.

The variants were rendered locally with `tests/background-study.cjs`; screenshots and a comparison board are under `work/background-study/`. Final live page screenshots are `work/redesign-*.png` and `work/food-*.png`.

## Implementation

`background.css` is a separate reversible skin loaded after `redesign.css`.
- Sage canvas and muted corner color washes, not neon gradients.
- Original thin abstract contour curves near the edges in `assets/contours.svg`.
- Fine static cross-weave made from CSS, masked toward the margins so text remains quiet.
- Soft white radial clear-space behind the original logos. No solid cream cards, color modification, watermark, or artwork replacement. The universal halo uses closest-side sizing so it fades before the element boundary instead of producing a rectangular cutoff.
- Darker text tokens #4F594D and #645030 retain readability on the new palette.
- Solid clean dropdown and contact-dialog surfaces.
- No canvas animation, parallax, external fonts, or new runtime dependencies.
- Decorative layers ignore pointer events, have no semantic meaning, and disappear in print/forced-color modes.

## Verification

Browser regression passed at 360, 768 and 1440px: navigation, Service dropdown, required fields, exact encoded WhatsApp URL, original Food logo loading, image/title non-overlap, automatic WCAG A/AA scan, no horizontal overflow, no runtime JS errors, and print/forced-color background safeguards. The WhatsApp launch is intercepted; no real message is sent.

`python tests/contrast.py` checks a conservative composited background budget: full contour stroke + both weave strokes on every base/wash color stop, even where text does not physically overlap those edges. Minimum text contrast: primary ink 8.01:1, muted 4.56:1, accent 4.79:1. This complements rather than replaces screenshot inspection and automated accessibility scans.

Desktop and mobile screenshots were inspected for both marks. Original logo files are unchanged. Anti-slop review: no tech gradient, feature-card grid, icon toppers, invented metrics, accent rails, glass panels, or wrong-surface composition. Soft logo clear-space has a specific legibility purpose, not decorative blur.

## Local preview

Open `index.html`, then inspect Home and Service → Kasapink Food. No commit, push, deployment, ERP or database changes were made for this background revision.
