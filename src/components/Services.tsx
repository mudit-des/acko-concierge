import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Card } from "@acko/card";
import { Fastag, PollutionCentre, TrafficFines } from "@acko/icons";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { navigate } from "../router";
import { Icon, type IconType } from "./Icon";

/*
 * Services, in three tiers by how much they matter:
 *  1. Your car: Buy is the hero, Sell and Exchange sit beside each other under it.
 *  2. Insurance: its own full-width card. It will get a home of its own for the buy, renew and claim flows.
 *  3. Quick checks: challans, FASTag and PUC as quiet utility tiles.
 * Only Buy leads anywhere today; the rest are placeholders until their flows exist.
 * Copy is placeholder until the business confirms it.
 */

/** A tappable Card is a <button> whose own CSS resets fill, padding and overflow, so set them inline. */
const CARD_STYLE: CSSProperties = {
  overflow: "hidden",
  backgroundColor: "var(--surfaceCardDefault)",
  border: "1px solid var(--borderDefaultSoft)",
  padding: 0,
};

function Group({ label, children, index, revealed }: { label: string; children: ReactNode; index: number; revealed: boolean }) {
  return (
    <div className={`tile-reveal ${revealed ? "is-in" : ""} flex flex-col gap-8`} style={{ animationDelay: `${index * 80}ms` }}>
      <Typography textStyle="label-md-semibold" color="secondary" as="h3">
        {label}
      </Typography>
      {children}
    </div>
  );
}

/** A car service: picture on top (or an icon where the illustration isn't ready), then the title. */
function CarCard({ title, body, image, icon, to, tall = false }: { title: string; body?: string; image?: string; icon?: IconType; to?: string; tall?: boolean }) {
  return (
    <Card
      variant="primary"
      onTap={() => to && navigate(to)}
      semanticLabel={title}
      style={CARD_STYLE}
      className="h-full text-left transition-transform duration-200 active:scale-[0.98]"
    >
      <div className="flex h-full flex-col gap-12 p-8">
        <div className={`relative grid place-items-center overflow-hidden rounded-2xl bg-surface-page-secondary ${tall ? "h-120" : "h-88"}`}>
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
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
  // Groups fade up once as the section scrolls into view (off with reduced motion).
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="px-16 pt-40" id="services" aria-labelledby="services-title">
      <Typography textStyle="heading-xl" as="h2" id="services-title">
        One stop shop for all things car.
      </Typography>

      <div className="mt-24 flex flex-col gap-24">
        <Group label="Your car" index={0} revealed={revealed}>
          <CarCard title="Buy a car" body="Advice, a fair price, and we chase the rest." image={asset("/illustrations/tile-buy.webp")} to="/buy-car/received" tall />
          <div className="grid grid-cols-2 gap-8">
            <CarCard title="Sell" image={asset("/illustrations/tile-sell.webp")} />
            <CarCard title="Exchange" image={asset("/illustrations/tile-exchange.webp")} />
          </div>
        </Group>

        <Group label="Insurance" index={1} revealed={revealed}>
          <CarCard title="Car insurance" body="Buy, renew or claim in one place." image={asset("/illustrations/tile-insure.webp")} tall />
        </Group>

        <Group label="Quick checks" index={2} revealed={revealed}>
          <div className="grid grid-cols-3 gap-8">
            {QUICK.map((q) => (
              <Card
                key={q.title}
                variant="secondary"
                onTap={() => undefined}
                semanticLabel={q.title}
                style={{ overflow: "hidden", backgroundColor: "var(--surfacePageSecondary)", border: "none", padding: 0 }}
                className="text-left transition-transform duration-200 active:scale-[0.98]"
              >
                <div className="flex min-h-96 flex-col justify-between gap-16 p-12">
                  <span className="text-text-primary">
                    <Icon icon={q.icon} size={24} />
                  </span>
                  <Typography textStyle="body-md-regular">{q.title}</Typography>
                </div>
              </Card>
            ))}
          </div>
        </Group>
      </div>
    </section>
  );
}
