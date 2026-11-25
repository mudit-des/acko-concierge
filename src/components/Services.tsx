import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Card } from "@acko/card";
import { Fastag, PollutionCentre, TrafficFines } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { navigate } from "../router";
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
      onTap={() => to && navigate(to)}
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

const QUICK: { title: string; icon: IconType }[] = [
  { title: "Check challans", icon: TrafficFines },
  { title: "Recharge FASTag", icon: Fastag },
  { title: "See PUC validity", icon: PollutionCentre },
];

export function Services() {
  const [stage, setStage] = useState(0);

  // The tiles arrive one after another when the page opens (all at once with reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(STAGES);
      return;
    }
    const timers = Array.from({ length: STAGES }, (_, k) => window.setTimeout(() => setStage(k + 1), 250 + k * 220));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <section id="services" aria-labelledby="services-title" className="px-16 pt-16 pb-24">
      <Typography textStyle="heading-xl" as="h2" id="services-title">
        One stop shop for all things car.
      </Typography>

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
            <CarCard title="Sell" body="A fair price and a verified buyer." image={asset("/illustrations/tile-sell.webp")} position="50% 40%" />
          </Reveal>
          <Reveal on={stage >= 3}>
            <CarCard title="Exchange" body="Trade in your old car for a new one." image={asset("/illustrations/tile-exchange.webp")} position="50% 40%" />
          </Reveal>
        </div>

        <Reveal on={stage >= 4}>
          <CarCard title="Car insurance" body="Buy, renew or claim in one place." image={asset("/illustrations/tile-insure.webp")} tall />
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
                onTap={() => undefined}
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
