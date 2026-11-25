# ACKO Concierge — sage style guide (temporary)

Working guide for the concierge look. It is temporary: fold it into the main design-system docs, or delete it, once the look is signed off. The same content is shown in the app at `/style-guide`.

## 1. How sage fits the ACKO design system

Sage is a **brand override**, not a second system.

- `src/theme/sage.css` defines `[data-brand="ackoconcierge"]`, built the same way as `[data-brand="ackodrive"]` in `@acko/tokens`.
- `index.html` sets `data-brand="ackoconcierge"` on `<html>`.
- Every `@acko/*` component reads the brand layer, so Button, Badge, Chip, Card, focus rings and selection controls turn sage with no component changes.
- Neutrals (greys, text, page surfaces), type, spacing, radii and shadows are untouched.

Token layering stays as in the DS: components use semantic tokens, semantic tokens use the brand scale, and raw hex lives only in the sage scale.

## 2. Principles

1. **One layer changes.** Only the brand tokens are overridden.
2. **One hue.** Sage is the only accent. Green, orange and red stay reserved for status.
3. **Calm over clever.** Soft surfaces, quiet motion, plain sentence-case copy.
4. **Tokens only.** If a value is missing, add a token to `sage.css` first.

### Calm commerce, as applied to pages

- One focal point per screen; the rest stays quiet.
- Open layouts over boxes: hairline dividers and whitespace instead of nested cards and shadows. Cards are for things scanned on their own (the car, a quote).
- Timelines are open: small dots, a dotted line for what is ahead, a solid sage line for what is done. No icon bubbles.
- One accent. Amber only as a tiny cue (a clock, a dot), never as a filled alert.
- Gentle motion only: a 300 ms reveal and a soft halo on the current step.
- Headlines use `text-balance`. Type stays within the ACKO scale, so the reference's light weights and serif accent are not used.

## 3. Sage scale

| Token | Hex | Use |
|---|---|---|
| `--brandPrimary50` | `#f5f9f7` | Faintest wash |
| `--brandPrimary100` | `#eaf2ed` | Tint surface, icon bubbles |
| `--brandPrimary150` | `#dfebe5` | Tint hover, progress track |
| `--brandPrimary200` | `#d6e6dd` | Light text on deep sage |
| `--brandPrimary300` | `#b7d0c3` | Ground lines, hairlines |
| `--brandPrimary400` | `#8fb3a0` | Selection on dark |
| `--brandPrimary500` | `#6b9a85` | Core sage, glows, dots |
| `--brandPrimary600` | `#4d7c68` | Primary action, selection |
| `--brandPrimary700` | `#3f6a57` | Action hover, brand text |
| `--brandPrimary800` | `#335646` | Action pressed |
| `--brandPrimary850` | `#2c4a3d` | Deep surface |
| `--brandPrimary900` | `#243d32` | Deep surface, alternate |
| `--brandPrimary950` | `#1b2e25` | Text on light sage |

Anchors come from the Calm Commerce reference (`#eaf2ed`, `#b7d0c3`, `#6b9a85`, `#4d7c68`, `#2c4a3d`). The in-between steps are interpolated.

## 4. Colour roles

Use the role token inside components, never a scale step.

| Role | Token | Maps to |
|---|---|---|
| Buttons (primary) | `--buttonFillPrimaryDefault` | grey 750 (near black), white label |
| Buttons (secondary, ghost, link) | `--buttonFillSecondary*`, `--buttonFillGhost*`, `--buttonFillLink*` | white fill with a black outline, or plain black label |
| Selection (checkbox, radio, switch, selected chip, progress) | `--brandSelectionDefault` | sage 600 |
| Tint surface | `--brandSurfaceSubtle` | sage 100 |
| Brand text | `--brandLabelDefault` | sage 700 |
| Deep surface | `--surfacePageBrand` | sage 850 |
| Focus ring | `--borderFocus` | sage 500 at 40% |
| Card accent fill | `--cardFillAccent` | sage 100 |

Buttons are black, not sage: sage is the accent for surfaces, selection and text, and the primary action is the strongest thing on the page. Contrast: white on sage 600 is about 4.9:1, which passes AA for normal text; do not put white text on sage 500 or lighter.

## 5. Surfaces and cards

- **White** (`Card variant="primary"`): default tile, `--shadowXs`.
- **Tint** (`Card variant="accent"`): sage 100, no shadow. Needs the `--cardFillAccent` override.
- **Deep** (`Card variant="ghost"` + `bg-surface-page-brand`): the tile that should lead. White text only.
- Mix tones in a grid. Never put two deep tiles side by side.
- Radius: cards `--radius5xl`, buttons and pills `--radiusFull`, icon bubbles circular.
- Gap between cards: 12px minimum.

## 6. Typography

Euclid Circular B through `<Typography textStyle="…">` only.

| Style | Where |
|---|---|
| `display-md` | Story slide "why" line |
| `heading-xl` | Slide headings, section titles |
| `heading-xs` | Bento tile titles |
| `body-lg-regular` | Story slide what and how |
| `body-md-regular` | Supporting copy |
| `body-sm-regular` | Bento tile descriptions |
| `label-md-semibold` | Eyebrows |
| `helper-sm-regular` | Fine print, footer |

The reference used extralight weights and an italic serif accent. Neither exists in the ACKO type system, so both are dropped.

## 7. Icons and illustration

- Icons come from `@acko/icons` only, sized with the wrapper in `src/components/Icon.tsx` (16 / 24 / 32).
- Service icons: Buy `PriceTag`, Sell `SellCarBike1`, Repair `Tools`, Maintain `CalendarDays`, Insurance `Coverage`, Paperwork `PolicyDocument`, Finance `Bank`, Roadside `Towing`.
- Direction: soft painterly miniature scenes, tilt-shift depth, misty sage with a touch of warm dusk peach (reference: Crew's tiles, adapted). Scenes carry no text.
- Scenes: `intro-street`, `scene-chasing`, `scene-fair`, `scene-peace`, `scene-lifecycle` in `public/illustrations/`. One recurring advisor in a green vest, one sage hatchback, no text in any image. Shown at 4:3 and cropped to about 1.6:1, so keep key props in the middle 60% of the height.

## 7a. Logo

Logos in `public/brand/`: `acko-drive-wide-black.svg` (light surfaces, used in the header), `acko-drive-wide-white.svg` (dark surfaces), `acko-drive-wide-secondary.svg` (green mark with a white wordmark, dark surfaces only) and `acko-drive-mark.svg` (favicon). Keep clear space of half the logo height.

## 8. Motion

From `acko-motion-system`. Transform and opacity only.

| Motion | Value |
|---|---|
| Major open | 500 to 600 ms, ease-out |
| Major exit | 350 to 450 ms, ease-out |
| Element reveal | 300 ms, +12 px to 0, opacity 0 to 1, stagger 50 to 60 ms bottom to top |
| Story progress | 6 s, linear (real timer) |
| Reduced motion | Everything off. Autoplay off, progress shown full. |

Easing curves in CSS (`--motionEaseOut`, `--motionEaseInOut`) are approximations of the velocity curves in the motion system. Durations are exact.

## 8a. Mascot

A sage hatchback with a face (`src/components/Mascot.tsx`, `mascot.css`). Inputs are `mood` (`idle`, `happy`, `driving`, `thinking`, `asking`, `working`, `celebrating`) and `talking`. Colours come from brand tokens plus small literal face accents (peach cheeks, warm headlights). Never use on claims or payment errors. Under reduced motion the mood still shows through props and eyes, with no movement.

## 8b. Routes and pages

| Path | Page |
|---|---|
| `/home` | Landing: carousel and bento. The Buy tile links to `/buy-car/received` |
| `/buy-car` | Redirects to `/buy-car/received` |
| `/buy-car/received` | Booked: big car card, deadline notice, next steps. Button: Let's do the paperwork |
| `/buy-car/documents` | Upload Aadhaar and PAN: quick check, document rows, privacy line |
| `/buy-car/documents/received` | Documents tick through verification. Button: What's next? |
| `/buy-car/processing` | Finding a dealer: reassurance, searching card, heads-up |
| `/buy-car/dealer-assigned` | Dealer assigned, car details |
| `/buy-car/finance` | Choose how to pay. `?choice=us` or `?choice=bank` shows the reply |
| `/buy-car/insurance` | Insurance and registration handled |
| `/buy-car/ready` | Pre-delivery check passed, slot confirmed |
| `/buy-car/on-the-way` | The car is on its way |
| `/buy-car/delivered` | Delivered. Button: Back to the start (demo) |
| `/states` | Reviewer index of every screen (temporary) |
| `/style-guide` | This guide |

The address alone decides the state: nothing is remembered between pages. Each page shows the conversation so far plus its own update. The finance choice is carried forward as `?choice=` so later pages show the same reply. Old `/booking` addresses redirect to `/buy-car`. The list of states lives in `STEPS` in `src/data/booking.ts`.

History-API routing in `src/router.ts`. Production hosting must rewrite unknown paths to `index.html`.

### Header (car purchase pages)

A regular bar: a back button, the mascot as a small avatar (44px, with a green online dot) right beside it, and "Get help" on the right (opens a bottom sheet with a call-back request). The concierge's name is not shown; it is available to screen readers (`CONCIERGE_NAME` in `src/data/booking.ts`, "Your concierge" until one is chosen). At the top of a page the bar is flat and transparent. Once the page scrolls it becomes a white bar with a soft shadow (`shadow-m`) and a light blur, so it only reads as floating when content moves beneath it.

After the car is booked, a miniature car card is pinned beneath the bar: a small car photo, the car name and its live status. The status ends in a static dot: orange while in progress, green when finished (no animation, to keep it calm). A five-segment progress line runs along its bottom edge and a chevron opens the full next-steps timeline as a panel over the chat (Escape, tapping outside or a new page closes it). The full car card and the in-chat steps bubble are shown only on the booked screen. The ACKO Drive logo lives on `/home` only. A message box and a bottom tab bar are deliberately left for later: tabs only on top-level screens, hidden inside flows.

## 9. Layout and touch

- Mobile first, one column up to 480px (`--conciergeColumnMax`), centred on larger screens.
- 16px gutters. Tap targets at least 44px. Hover styles only inside `@media (hover: hover)`.
- Safe-area padding on the sticky bottom action and the header.
- One primary action per screen: "Talk to your concierge".

## 10. Copy

- Sentence case. Brand names keep their casing (`ACKO Drive`).
- Say what happens next. No jokes, no hype, no all-caps outside Badge.
- Placeholder details (chips, due dates, the four extra services) are illustrative until confirmed.

## 11. Deviations and open decisions

1. `[data-brand="ackoconcierge"]` is a new brand. Propose adding it to `@acko/tokens` if the concierge ships.
2. `--cardFillAccent` is re-pointed because the shipped token is tied to purple.
3. The story progress bar is built from plain buttons because `Progress` is value based with no timed segments.
4. Illustration: all five carousel scenes are generated images (`public/illustrations/*.webp`), shown edge to edge with a faded bottom. They need sign-off as illustration assets.
   Chat bubbles on the carousel are composed from divs and Typography. No chat component exists in the packages.
5. Easing curves in CSS are approximations of the velocity curves.
7. Tappable `Card` (`onTap`) renders a `<button>` and `@acko/css` resets its fill to transparent and sets `overflow: visible`. Bento tiles re-apply the variant fill and overflow inline. Report upstream.
8. Documents step: files are read in the browser only (the name is shown, nothing is uploaded) and the verification is scripted. Aadhaar and PAN handling needs a compliance review before any real copy ships. The call-back link does nothing yet.
9. Car purchase pages: the next-steps card, hero bubble, chat bubbles and mascot are custom compositions (no timeline or chat component). "Show next update (demo)" is a prototype control. The deadline is a static calm notice, not a ticking countdown, pending a decision. Every name, amount, date and promise is a placeholder. The mascot has no name. The car (Hyundai Creta SX) and its photo are supplied for the prototype only; production needs the OEM or dealer image licence.
10. `@acko/card` ships only `Card`, so the starter's `CardBody`, `CardTitle` and `CardAction` do not exist. Tiles are composed inside `Card`.
