# Inspiration: home carousel cards

Saved for later. Not built yet.

**Source:** Muse (Meta), "Share my avatar" sheet and profile, from Mobbin. File: `muse-share-cards.webp`.
Use as a pattern reference only. Do not borrow the character, the name or the colours.

## What the cards do

- **Tall portrait cards** that swipe sideways, with pagination dots underneath. Each card has its own full-bleed pastel colour (pink, peach, mint).
- **Hero picture in a rounded inset panel**, centred in the card with a clear margin of colour around it.
- **A tilted note under the picture** (about -2 degrees), overlapping the bottom of the panel. It is a speech bubble with a small tail made of two dots (a thought-bubble). The message sits in it in a deep accent colour.
- Soft, large shadows on the card and on the floating close button. Lots of breathing room.
- The sheet has a rounded top, a title, a close button and a row of circular share targets below the cards.

## How it could map to our `/home` carousel

- One card per slide, each with its own tint from the sage family plus a warm peach and a mist grey, so the set feels related but not flat.
- The scene illustration (the clay-style dioramas) goes in the rounded inset panel.
- The slide's customer quote or headline goes in the tilted speech-bubble note, using our chat-bubble language and the design-system type scale.
- Keep the peek of the next card and the segmented progress, or switch to pagination dots below.
- Optional later: the same card format for sharing a booking ("My Hyundai Creta is booked") with circular share targets.

## Check before building

- Card tilt and overlap need a reduced-motion-safe treatment (static is fine).
- Tints must stay inside the sage brand layer or be added as tokens in `src/theme/sage.css`. No raw hex in components.
- Contrast of the note text on each tint.
