import { useState, type ReactNode } from "react";
import { Badge } from "@acko/badge";
import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { Chip } from "@acko/chip";
import { ArrowRight, CalendarDays, Coverage, NewCar, PolicyDocument, PriceTag, SellCarBike1, Bank, Tools, Towing } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Icon } from "../components/Icon";
import { Mascot, type MascotMood } from "../components/Mascot";
import { Link } from "../components/Link";

/*
 * TEMPORARY sage style guide. Lives at /style-guide.
 * Mirrors docs/sage-style-guide.md. Replace or fold into the main
 * design-system docs once the concierge look is signed off.
 */

const SCALE: { step: string; hex: string; note: string }[] = [
  { step: "50", hex: "#f5f9f7", note: "Faintest wash" },
  { step: "100", hex: "#eaf2ed", note: "Tint surface, icon bubbles" },
  { step: "150", hex: "#dfebe5", note: "Tint hover, progress track" },
  { step: "200", hex: "#d6e6dd", note: "Light text on deep sage" },
  { step: "300", hex: "#b7d0c3", note: "Ground lines, hairlines" },
  { step: "400", hex: "#8fb3a0", note: "Selection on dark" },
  { step: "500", hex: "#6b9a85", note: "Core sage, glows, dots" },
  { step: "600", hex: "#4d7c68", note: "Primary action, selection" },
  { step: "700", hex: "#3f6a57", note: "Action hover, brand text" },
  { step: "800", hex: "#335646", note: "Action pressed" },
  { step: "850", hex: "#2c4a3d", note: "Deep surface" },
  { step: "900", hex: "#243d32", note: "Deep surface, alt" },
  { step: "950", hex: "#1b2e25", note: "Text on light sage" },
];

const ROLES: { role: string; token: string; maps: string; use: string }[] = [
  { role: "Primary button", token: "--buttonFillPrimaryDefault", maps: "grey 750 (near black)", use: "Main action, white label. One per screen." },
  { role: "Secondary, ghost, link buttons", token: "--buttonFillSecondary* / Ghost* / Link*", maps: "white with black outline, or black label", use: "Supporting actions." },
  { role: "Selection", token: "--brandSelectionDefault", maps: "sage 600", use: "Checkbox, radio, switch, selected chip, progress fill." },
  { role: "Tint surface", token: "--brandSurfaceSubtle", maps: "sage 100", use: "Icon bubbles, tint cards, art backgrounds." },
  { role: "Brand text", token: "--brandLabelDefault", maps: "sage 700", use: "Eyebrows, links, emphasis." },
  { role: "Deep surface", token: "--surfacePageBrand", maps: "sage 850", use: "Story slide, deep bento tiles. Text on it is white." },
  { role: "Focus ring", token: "--borderFocus", maps: "sage 500 at 40%", use: "Keyboard focus. Never use outline." },
  { role: "Card accent fill", token: "--cardFillAccent", maps: "sage 100", use: "Card variant accent. Re-pointed from purple." },
];

const TYPE_USED: { style: Parameters<typeof Typography>[0]["textStyle"]; where: string }[] = [
  { style: "display-md", where: "Story slide “why” line. Drops to 32px below 600px." },
  { style: "heading-xl", where: "Slide headings and section titles." },
  { style: "heading-xs", where: "Bento tile titles." },
  { style: "body-lg-regular", where: "Story slide what / how." },
  { style: "body-md-regular", where: "Descriptions and supporting copy." },
  { style: "body-sm-regular", where: "Bento tile descriptions." },
  { style: "label-md-semibold", where: "Eyebrows (Why, What, How, Services)." },
  { style: "helper-sm-regular", where: "Fine print, list rows, footer." },
];

const MOTION: { name: string; value: string; use: string }[] = [
  { name: "Major open", value: "500 to 600 ms · ease-out", use: "Pages and sheets opening. The intro image eases in at 300 ms." },
  { name: "Major exit", value: "350 to 450 ms · ease-out", use: "Sheets and pages closing." },
  { name: "Element reveal", value: "300 ms · +12 px to 0 · opacity 0 to 1", use: "Content entering. Stagger 50 to 60 ms, bottom to top." },
  { name: "Progress timer", value: "6 s · linear", use: "Story progress fill. Linear is allowed for real timers." },
  { name: "Reduced motion", value: "All animation off", use: "Autoplay off, progress shown full, no movement." },
];

const MOODS: { mood: MascotMood; use: string }[] = [
  { mood: "idle", use: "Waiting. Gentle bob and blink." },
  { mood: "happy", use: "Good news: booked, ready." },
  { mood: "driving", use: "Pickup and delivery. Ground lines move." },
  { mood: "thinking", use: "Working on it. Eyes up, dots." },
  { mood: "asking", use: "Needs the customer. Head tilts." },
  { mood: "working", use: "Repair under way. Wrench swings." },
  { mood: "celebrating", use: "Delivered. Three hops, sparkles." },
];

function Section({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-16 px-16 pt-48">
      <div className="flex flex-col gap-8">
        <Typography textStyle="heading-xl" as="h2">
          {title}
        </Typography>
        {intro && (
          <Typography textStyle="body-md-regular" color="secondary">
            {intro}
          </Typography>
        )}
      </div>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-12">{children}</div>;
}

export default function StyleGuide() {
  const [chip, setChip] = useState("Repair");

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main className="mx-auto min-h-svh w-full max-w-480 bg-surface-page-primary pb-64">
        {/* Intro */}
        <header className="flex flex-col gap-12 px-16 pt-[max(24px,env(safe-area-inset-top))]">
          <Row>
            <Badge color="orange" size="md">
              Temporary
            </Badge>
            <Link to="/home" className="inline-flex min-h-44 items-center">
              <Typography textStyle="label-md-medium" color="brand">
                Back to landing page
              </Typography>
            </Link>
          </Row>
          <Typography textStyle="display-md" as="h1">
            Sage style guide
          </Typography>
          <Typography textStyle="body-lg-regular" color="secondary">
            How ACKO Concierge uses the ACKO design system with a sage brand. Mirrors docs/sage-style-guide.md.
          </Typography>
        </header>

        <Section
          title="Principles"
          intro="Sage is a brand override on the ACKO design system, not a parallel system."
        >
          <Card variant="secondary" className="flex flex-col gap-16 p-20">
            {[
              ["One layer changes.", "Only the brand tokens are overridden in src/theme/sage.css. Components, neutrals, type and spacing stay as shipped."],
              ["One hue.", "Sage is the only accent. Status colours (green, orange, red) keep their meaning and are not decoration."],
              ["Calm over clever.", "Soft surfaces, quiet motion, plain sentence-case copy. No playful or witty text."],
              ["Tokens only.", "No hex values in components. If a value is missing, add a token in sage.css first."],
            ].map(([lead, rest]) => (
              <div key={lead} className="flex flex-col gap-4">
                <Typography textStyle="label-lg-semibold">{lead}</Typography>
                <Typography textStyle="body-sm-regular" color="secondary">
                  {rest}
                </Typography>
              </div>
            ))}
          </Card>
        </Section>

        <Section title="Sage scale" intro="Set on html with data-brand=&quot;ackoconcierge&quot;. Anchors come from the Calm Commerce reference.">
          <div className="grid grid-cols-1 gap-8">
            {SCALE.map((s) => (
              <div key={s.step} className="flex items-center gap-12">
                <span
                  className="size-44 shrink-0 rounded-2xl border border-border-default-soft"
                  style={{ backgroundColor: `var(--brandPrimary${s.step})` }}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-col">
                  <Typography textStyle="label-md-medium">
                    {`--brandPrimary${s.step}`} · {s.hex}
                  </Typography>
                  <Typography textStyle="helper-sm-regular" color="secondary">
                    {s.note}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Colour roles" intro="Use the role token, never the scale step, inside components.">
          <div className="flex flex-col gap-8">
            {ROLES.map((r) => (
              <Card key={r.role} variant="secondary" className="flex flex-col gap-4 p-16">
                <Typography textStyle="label-lg-semibold">{r.role}</Typography>
                <Typography textStyle="helper-sm-medium" color="brand">
                  {r.token} → {r.maps}
                </Typography>
                <Typography textStyle="body-sm-regular" color="secondary">
                  {r.use}
                </Typography>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Typography" intro="Euclid Circular B through the Typography component only. No raw text tags, no clamp().">
          <div className="flex flex-col gap-16">
            {TYPE_USED.map((t) => (
              <div key={t.style} className="flex flex-col gap-4 border-b border-border-default-soft pb-16">
                <Typography textStyle="helper-sm-medium" color="brand">
                  {t.style}
                </Typography>
                <Typography textStyle={t.style}>Looking after a car</Typography>
                <Typography textStyle="helper-sm-regular" color="secondary">
                  {t.where}
                </Typography>
              </div>
            ))}
          </div>
          <Typography textStyle="body-sm-regular" color="secondary">
            The reference page used extralight weights and an italic serif accent. Neither exists in the ACKO type system, so both are dropped.
          </Typography>
        </Section>

        <Section title="Buttons" intro="One primary per view. Sentence case. Arrow on the right for go, left for back.">
          <Row>
            <Button iconRight={<ArrowRight aria-hidden="true" />}>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </Row>
          <Row>
            <Button size="xs">xs 32</Button>
            <Button size="sm">sm 40</Button>
            <Button size="md">md 48</Button>
            <Button size="lg">lg 56</Button>
          </Row>
          <Typography textStyle="body-sm-regular" color="secondary">
            Buttons are black, not sage. Landing page CTA: size lg, full width on mobile, pinned to the bottom with safe-area padding.
          </Typography>
        </Section>

        <Section title="Badges and chips" intro="Badge hues carry meaning. Green is positive, grey is neutral. Do not use a badge as decoration.">
          <Row>
            <Badge color="green" size="md">
              Quote approved
            </Badge>
            <Badge color="grey" size="md">
              Pickup at 10:30 am
            </Badge>
            <Badge color="orange" size="md">
              Service due
            </Badge>
            <Badge color="red" size="md">
              Overdue
            </Badge>
          </Row>
          <Row>
            {["Buy", "Sell", "Repair", "Maintain"].map((c) => (
              <Chip key={c} label={c} selected={chip === c} onSelect={() => setChip(c)} />
            ))}
          </Row>
        </Section>

        <Section title="Cards and surfaces" intro="Tone decides emphasis. Mix tones in a grid so the eye has somewhere to land.">
          <div className="grid grid-cols-2 gap-12">
            <Card variant="primary" className="flex min-h-96 flex-col justify-end gap-4 p-16">
              <Typography textStyle="label-lg-semibold">White</Typography>
              <Typography textStyle="helper-sm-regular" color="secondary">
                Card primary. Default tile.
              </Typography>
            </Card>
            <Card variant="accent" className="flex min-h-96 flex-col justify-end gap-4 p-16">
              <Typography textStyle="label-lg-semibold">Tint</Typography>
              <Typography textStyle="helper-sm-regular" color="secondary">
                Card accent. Sage 100.
              </Typography>
            </Card>
            <Card variant="ghost" className="col-span-2 flex min-h-96 flex-col justify-end gap-4 bg-surface-page-brand p-16">
              <Typography textStyle="label-lg-semibold" color="static">
                Deep
              </Typography>
              <Typography textStyle="helper-sm-regular" color="static" className="opacity-80">
                Card ghost on --surfacePageBrand. White text only. Use for the one tile that should lead.
              </Typography>
            </Card>
          </div>
          <Typography textStyle="body-sm-regular" color="secondary">
            Radius: cards use --radius5xl (brand card). Buttons and pills use --radiusFull. Icon bubbles are circles. Shadow: --shadowXs on primary cards only.
          </Typography>
        </Section>

        <Section title="Icons" intro="@acko/icons only. Sized by a wrapper: 16 small, 24 normal, 32 large.">
          <Row>
            {[PriceTag, SellCarBike1, Tools, CalendarDays, Coverage, PolicyDocument, Bank, Towing, NewCar].map((g, i) => (
              <span key={i} className="grid size-44 place-items-center rounded-full bg-brand-surface-subtle text-brand-label-default">
                <Icon icon={g} size={24} />
              </span>
            ))}
          </Row>
          <Typography textStyle="body-sm-regular" color="secondary">
            Service map: Buy PriceTag · Sell SellCarBike1 · Repair Tools · Maintain CalendarDays · Insurance Coverage · Paperwork PolicyDocument · Finance Bank · Roadside Towing. Use an arrow when a tap leaves the screen, a chevron when content opens in place.
          </Typography>
        </Section>

        <Section title="Mascot" intro="A sage hatchback with a face. Mood and talking are the only inputs. Never used on claims or payment errors.">
          <div className="grid grid-cols-2 gap-12">
            {MOODS.map((m) => (
              <Card key={m.mood} variant="secondary" className="flex flex-col items-center gap-8 p-16 text-center">
                <Mascot mood={m.mood} size={96} />
                <Typography textStyle="label-md-semibold">{m.mood}</Typography>
                <Typography textStyle="helper-sm-regular" color="secondary">
                  {m.use}
                </Typography>
              </Card>
            ))}
            <Card variant="secondary" className="flex flex-col items-center gap-8 p-16 text-center">
              <Mascot mood="idle" talking size={96} />
              <Typography textStyle="label-md-semibold">talking</Typography>
              <Typography textStyle="helper-sm-regular" color="secondary">
                Mouth moves and headlights pulse while a message arrives.
              </Typography>
            </Card>
          </div>
          <Typography textStyle="body-sm-regular" color="secondary">
            Reduced motion keeps the mood visible through its props and eyes but stops all movement.
          </Typography>
        </Section>

        <Section title="Motion" intro="From acko-motion-system. Transform and opacity only. Reduced motion always has a fallback.">
          <div className="flex flex-col gap-8">
            {MOTION.map((m) => (
              <Card key={m.name} variant="secondary" className="flex flex-col gap-4 p-16">
                <Typography textStyle="label-lg-semibold">{m.name}</Typography>
                <Typography textStyle="helper-sm-medium" color="brand">
                  {m.value}
                </Typography>
                <Typography textStyle="body-sm-regular" color="secondary">
                  {m.use}
                </Typography>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Copy" intro="Clear first. Warm but controlled.">
          <Card variant="secondary" className="flex flex-col gap-8 p-16">
            <Typography textStyle="body-sm-regular">Sentence case everywhere: “Talk to your concierge”, not “Talk To Your Concierge”.</Typography>
            <Typography textStyle="body-sm-regular">Brand names keep their casing: ACKO Drive.</Typography>
            <Typography textStyle="body-sm-regular">Say what happens next. “We collect the car, handle the work and keep you updated.”</Typography>
            <Typography textStyle="body-sm-regular">No jokes, no hype words, no all-caps emphasis outside Badge.</Typography>
          </Card>
        </Section>

        <Section title="Deviations and open decisions" intro="Places where this build steps outside the shipped system. Each needs a decision.">
          <Card variant="secondary" className="flex flex-col gap-12 p-16">
            {[
              "Brand override: [data-brand=\"ackoconcierge\"] is a new brand in src/theme/sage.css. Proposed for @acko/tokens if the concierge ships.",
              "Card accent: shipped tokens tie it to purple, so sage.css re-points --cardFillAccent. This is a token gap, not a design choice.",
              "Story progress: built from plain buttons, since Progress is value based with no timed segments.",
              "Illustration: all five carousel scenes are generated images (public/illustrations/*.webp), edge to edge with a faded bottom. Needs sign-off as illustration assets, and a plan for who produces the next set.",
              "Booking page: the mascot is hand-built SVG (an illustration, not an icon). The journey card, status card and chat bubbles are custom compositions because no timeline or chat component exists. The deadline is a static notice, not a countdown, pending a decision. All names, amounts and dates are placeholders.",
              "Chat bubbles: customer quote and concierge reply on carousel slides are composed from plain divs and Typography. No chat component exists in the packages.",
              "Tappable cards: Card with onTap renders a button, and @acko/css resets its fill to transparent and sets overflow visible. Bento tiles re-apply the variant fill and overflow inline. Report upstream.",
              "Easing: CSS cubic-béziers approximate the 100 to 0 and 0 to 100 to 0 velocity curves. Durations are exact.",
              "Placeholder content: slide chips, due dates and the four extra services are illustrative.",
            ].map((d) => (
              <Typography key={d} textStyle="body-sm-regular">
                {d}
              </Typography>
            ))}
          </Card>
        </Section>
      </main>
    </div>
  );
}
