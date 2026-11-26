import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Card } from "@acko/card";
import { Fastag, PollutionCentre, TrafficFines } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { navigate } from "../router";
import type { IntentId } from "../data/chat";
import { Icon, type IconType } from "./Icon";

/*
 * Services, in three tiers by how much they matter:
 *  1. Buy is the large tile, with Sell and Exchange stacked beside it.
 *  2. Insurance: its own full-width card. It will get a home of its own for the buy, renew and claim flows.
 *  3. Quick checks: challans, FASTag and PUC as quiet utility tiles.
 * Only Buy leads anywhere today; the rest are placeholders until their flows exist.
 * Copy is placeholder until the business confirms it.
 *
 * It is the page "Learn more" leads to: the tiles arrive one after another as it opens.
 */

const EASE = "cubic-bezier(.22,.8,.2,1)";
/** Tiles that arrive one at a time: Buy, Sell, Exchange, Insurance, Quick checks. */
const STAGES = 5;

/** A tappable Card is a <button> whose own CSS resets fill, padding and overflow, so set them inline. */
const CARD_STYLE: CSSProperties = {
  overflow: "hidden",
  backgroundColor: "var(--surfaceCardDefault)",
  border: "1px solid var(--borderDefaultSoft)",
  padding: 0,
};

/** Fades a tile up when its stage has been reached. */
function Reveal({ on, className = "", children }: { on: boolean; className?: string; children: ReactNode }) {
  return (
    <div
      className={`h-full ${className}`}
      style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: `opacity 500ms ${EASE}, transform 500ms ${EASE}` }}
    >
      {children}
    </div>
  );
}

/** A car service: picture on top (or an icon where the illustration isn't ready), then the title. */
function CarCard({
  title,
  body,
  image,
  icon,
  to,
  onPress,
  tall = false,
  fill = false,
  position,
  className = "",
}: {
  title: string;
  body?: string;
  image?: string;
  icon?: IconType;
  to?: string;
  /** what a tap does when there is no page to open yet */
  onPress?: () => void;
  tall?: boolean;
  /** picture grows to fill the tile's height */
  fill?: boolean;
  /** CSS object-position for the picture, to keep the subject inside the crop */
  position?: string;
  className?: string;
}) {
  return (
    <Card
      variant="primary"
      onTap={() => (to ? navigate(to) : onPress?.())}
      semanticLabel={title}
      style={CARD_STYLE}
      className={`h-full text-left transition-transform duration-200 active:scale-[0.98] ${className}`}
    >
      <div className="flex h-full flex-col gap-12 p-8">
        <div
          className={`relative grid place-items-center overflow-hidden rounded-2xl bg-surface-page-secondary ${
            fill ? "min-h-0 flex-1" : tall ? "aspect-[5/2]" : "h-[clamp(48px,6svh,80px)]"
          }`}
        >
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: position }} />
          ) : (
            icon && (
              <span className="text-text-muted">
                <Icon icon={icon} size={32} />
              </span>
            )
          )}
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <Typography textStyle="label-lg-semibold" as="h4">
            {title}
          </Typography>
          {body && (
            <Typography textStyle="body-md-regular" color="secondary">
              {body}
            </Typography>
          )}
        </div>
      </div>
    </Card>
  );
}

const QUICK: { title: string; icon: IconType; intent: IntentId }[] = [
  { title: "Check challans", icon: TrafficFines, intent: "challans" },
  { title: "Recharge FASTag", icon: Fastag, intent: "fastag" },
  { title: "See PUC validity", icon: PollutionCentre, intent: "puc" },
];

export function Services({ onAsk }: { onAsk: (text: string, intent: IntentId) => void }) {
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLElement>(null);

  // The tiles arrive one after another when the section first scrolls into view (all at once with reduced motion).
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(STAGES);
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        for (let k = 0; k < STAGES; k++) timers.push(window.setTimeout(() => setStage(k + 1), 100 + k * 180));
      },
      { threshold: 0.15 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <section ref={ref} id="services" aria-labelledby="services-title" className="px-16 pt-24 pb-24">
      <div className="flex items-center gap-12" id="services-title">
        <span className="h-px flex-1 bg-border-default-soft" aria-hidden="true" />
        <Typography textStyle="label-md-semibold" color="secondary" as="h2">
          Or browse what we do
        </Typography>
        <span className="h-px flex-1 bg-border-default-soft" aria-hidden="true" />
      </div>

      <div className="mt-16 flex flex-col gap-8">
        {/* One bento: Buy large on the left, Sell and Exchange stacked beside it, Insurance full width below, same 8px gap throughout */}
        <div className="grid grid-cols-2 gap-8">
          <Reveal on={stage >= 1} className="row-span-2">
            <CarCard
              title="Buy a car"
              body="Advice, a fair price, and we chase the rest."
              image={asset("/illustrations/tile-buy.webp")}
              to="/buy-car/received"
              fill
              position="36% 50%"
            />
          </Reveal>
          <Reveal on={stage >= 2}>
            <CarCard title="Sell" body="A fair price and a verified buyer." image={asset("/illustrations/tile-sell.webp")} position="50% 40%" onPress={() => onAsk("I'd like to sell my car", "sell")} />
          </Reveal>
          <Reveal on={stage >= 3}>
            <CarCard title="Exchange" body="Trade in your old car for a new one." image={asset("/illustrations/tile-exchange.webp")} position="50% 40%" onPress={() => onAsk("I'd like to exchange my car", "exchange")} />
          </Reveal>
        </div>

        <Reveal on={stage >= 4}>
          <CarCard title="Car insurance" body="Buy, renew or claim in one place." image={asset("/illustrations/tile-insure.webp")} tall onPress={() => onAsk("I need help with car insurance", "insurance")} />
        </Reveal>

        <Reveal on={stage >= 5} className="mt-8">
          <Typography textStyle="heading-md" as="h3">
            Quick checks
          </Typography>
          <div className="mt-8 grid grid-cols-3 gap-8">
            {QUICK.map((q) => (
              <Card
                key={q.title}
                variant="primary"
                onTap={() => onAsk(q.title, q.intent)}
                semanticLabel={q.title}
                style={CARD_STYLE}
                className="text-left transition-transform duration-200 active:scale-[0.98]"
              >
                <div className="flex min-h-80 flex-col justify-between gap-12 p-12">
                  <span className="text-text-primary">
                    <Icon icon={q.icon} size={24} />
                  </span>
                  <Typography textStyle="body-md-regular">{q.title}</Typography>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
