import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
 * On a phone tall enough to hold it all, the section pins to the screen while you scroll and the
 * tiles arrive one by one; then the page carries on. If the screen is too short, or the person
 * prefers reduced motion, it is an ordinary section with everything showing.
 */

const EASE = "cubic-bezier(.22,.8,.2,1)";
/** Room kept free at the bottom for the docked nav pill, and at the top. */
const RESERVE_BOTTOM = 84;
const RESERVE_TOP = 16;
/** How far you scroll (in screens) while the section is pinned. */
const PIN_SCREENS = 1.1;
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
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const wrapRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(false); // tall enough to pin
  const [stage, setStage] = useState(reduce ? STAGES : 0);

  const pinned = !reduce && fits;

  // Measure the content against the screen: pin only when it all fits with the nav dock free.
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const measure = () => setFits(node.offsetHeight + RESERVE_TOP + RESERVE_BOTTOM <= window.innerHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // While pinned, the scroll position decides how many tiles have arrived.
  useEffect(() => {
    if (!pinned) {
      setStage(STAGES);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const vh = window.innerHeight;
      const top = wrap.getBoundingClientRect().top;
      const dist = wrap.offsetHeight - vh;
      // Start a little before the section pins so the first tile is already arriving.
      const t = Math.min(1, Math.max(0, (vh * 0.35 - top) / (dist + vh * 0.35)));
      setStage(Math.min(STAGES, Math.floor(t * (STAGES + 0.6))));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pinned]);

  return (
    <section ref={wrapRef} id="services" aria-labelledby="services-title" style={pinned ? { height: `${100 + PIN_SCREENS * 100}svh` } : undefined}>
      <div className={pinned ? "sticky top-0 h-svh overflow-hidden px-16" : "px-16 pt-40 pb-24"} style={pinned ? { paddingTop: RESERVE_TOP } : undefined}>
        <div ref={contentRef}>
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
        </div>
      </div>
    </section>
  );
}
