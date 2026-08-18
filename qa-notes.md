# Olive Beacon verification notes

Desktop and mobile full-page previews were reviewed after implementation. The responsive layout preserves the hero hierarchy, section rhythm, product presentation, NFC demonstration, FAQ, and lead form at a 390px mobile viewport.

The rendered preview exposes semantic navigation links, tab controls for the interactive NFC flow and enquiry mode, an operable keyboard-focused NFC demonstration control, labelled form fields, FAQ buttons, and legal links. Keyboard focus was verified in the live preview: the first tab stop visibly focuses the Olive Beacon home link.

The CSS contains a `prefers-reduced-motion: reduce` rule that suppresses non-essential animations and transitions. Automated tests cover validation, successful persistence and notification dispatch, owner-notification failure handling, safe persistence failures, honeypot handling, and server-side rate limiting. The production build completed successfully.

No customer reviews, testimonials, ratings, customer names, business results, or unearned case-study outcomes are displayed. The work area is explicitly labelled as future-facing and states that customer stories are coming soon.

The expanded industry route exposes twelve keyboard-operable tab controls. Selecting Hotels successfully updated the visible customer moment, recommended placement, service set, and digital opportunity without a route reload. All twelve industry detail routes are represented in the public navigation model and sitemap.

The Concept Lab preview control was verified through its accessible labelled trigger. The focused dialog displays the selected concept, a clear statement that it is an Olive Beacon concept / demonstration design rather than customer work, and keyboard-operable links to discuss a website or close the preview.

On the refined quote route, the first keyboard Tab press visibly focused the Olive Beacon home link in the header. An empty quote submission was prevented by the browser’s required-field validation; the form remained invalid, an input was identified as invalid, and no success confirmation appeared. Server-side lead validation, persistence, notification, error, honeypot, and rate-limit paths remain covered by the automated test suite.

The shared `Reveal`, `Stagger`, `StaggerItem`, `PageEnter`, and `AnimatedLogo` components all read Framer Motion’s reduced-motion preference and replace animated initial/transition states with static visible presentation when the preference is active.

With explicit user approval, a clearly marked QA quote enquiry was submitted through the live public form using a reserved `.invalid` email address. The valid form redirected to `/thank-you` and displayed the intended acknowledgement. Its associated `leads` and `quoteRequests` records were then removed using the exact QA email and business-name markers; no test customer content remains in the system.

The same live form was checked for its client error path before submission: an incomplete request remained invalid, focused an invalid input, and did not show a success acknowledgement. The browser-level code path reports `prefers-reduced-motion` correctly when enabled, while the shared Framer Motion components and the CSS `prefers-reduced-motion` rule provide the static reduced-motion presentation.

For rendered browser-level confirmation, the Chrome media emulation protocol was used to load the refined homepage with `prefers-reduced-motion: reduce`. The page reported the reduced-motion preference as active, the animated-logo beam rendered with `transform: none` and `opacity: 1`, and a matching CSS reduced-motion rule was present. The browser media override was then restored to its default state.

The same rendered reduced-motion procedure was run for `/industries`, `/work`, and `/quote`. Each route reported the preference as active, contained the expected CSS reduced-motion rule, and had zero running browser animations after rendering. The only remaining transforms were static structural values on the decorative `route-signal` and one fixed quote-layout offset, rather than active motion. The browser media override was restored after the pass.

The Website Examples portfolio was reviewed on desktop and mobile. The landing page provides thirteen category routes, category pages expose only curated concept cards, and every displayed card names itself as a concept / demonstration design. A Restaurant card successfully opened its individual three-page preview. Switching from Home to Menu changed the selected tab and its PAGE 02 caption while preserving the source-board context, disclosure, route integrity, and CTA to discuss a real website.

The Website Examples landing, Café category gallery, and Café concept preview were also checked at a 768px tablet viewport. The navigation collapses to the mobile menu at this width, typography remains readable, concept cards retain proportional browser framing, and the three-page preview remains usable without horizontal layout breakage. Source-audit records confirm that all uploaded references are desktop/multi-page landscape boards rather than mobile-only assets.

After explicit source-family mapping was added, the Restaurant example `The Supper Room` was rechecked. Home and Menu used distinct horizontal crop positions from source board 05 at the same source-family row, and the browser exposed PAGE 01 then PAGE 02 with the matching crop description. The automated portfolio suite additionally verifies each public concept has an explicit source family, three unique page focus positions, and a shared source-family row.

DOM-level crop checks were completed for three independent mapped concept families. The selected Menu tabs set the actual image `object-position` to `50% 18%` on Restaurant `The Supper Room` from board 05, Beauty `Luxe Aura` from board 13, and Café `Morning Ritual` from board 17. Each retained its own managed source-board URL while switching from its Home crop to the same-family Menu crop. This confirms the preview uses mapped source imagery and changing tabs changes the rendered crop rather than only the caption.
