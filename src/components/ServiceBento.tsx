import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Card } from "@acko/card";
import { ArrowRight } from "@acko/icons";
import { Typography } from "@acko/typography";
import { SERVICES, type ServiceId } from "../data/services";
import { Icon } from "./Icon";
import { navigate } from "../router";

/*
 * Bento tiles. Three layouts:
 *  - stack:   illustration on top, title and copy below (dusk scenes)
 *  - overlay: illustration full tile, white text over a deep sage fade (night scenes)
 *  - icon:    no illustration yet, icon bubble fallback
 */
type Layout = "stack" | "overlay" | "icon";
type Tone = "white" | "tint" | "deep";

const FILL: Record<Tone, string> = {
  white: "var(--cardFillDefault)",
  tint: "var(--cardFillAccent)",
  deep: "var(--surfacePageBrand)",
};
const VARIANT: Record<Tone, "primary" | "accent" | "ghost"> = { white: "primary", tint: "accent", deep: "ghost" };

const FADE = "linear-gradient(to bottom, #000 66%, transparent 98%)";

interface TileProps {
  id: ServiceId;
  tone: Tone;
  layout: Layout;
  image?: string;
  /** Where the picture sits inside its box, as a CSS object-position. */
  focus?: string;
  /** overlay only: fit the picture to the tile width at the top (square scenes). */
  fitWidth?: boolean;
  to?: string;
  className?: string;
  index: number;
  revealed: boolean;
}

function ArrowChip({ onDark }: { onDark?: boolean }) {
  return (
    <span
      className={`absolute top-8 right-8 grid size-32 place-items-center rounded-full shadow-s ${
        onDark ? "bg-surface-static-white/20 text-text-static-light" : "bg-surface-card-default/90 text-text-primary"
      }`}
      aria-hidden="true"
    >
      <Icon icon={ArrowRight} size={16} />
    </span>
  );
}

function Tile({ id, tone, layout, image, focus = "50% 50%", fitWidth = false, to, className = "", index, revealed }: TileProps) {
  const service = SERVICES[id];
  const onDark = tone === "deep";
  const style: CSSProperties = {
    overflow: "hidden", // component CSS sets overflow: visible, which beats the utility
    backgroundColor: FILL[tone], // tappable Card resets its fill to transparent
    animationDelay: `${index * 50}ms`,
  };

  return (
    <Card
      variant={VARIANT[tone]}
      onTap={() => to && navigate(to)}
      semanticLabel={service.title}
      style={style}
      className={`tile-reveal ${revealed ? "is-in" : ""} h-full transition-transform duration-200 active:scale-[0.98] ${className}`}
    >
      {layout === "stack" && image && (
        <div className="flex h-full flex-col text-left">
          <div className="relative min-h-112 flex-1 bg-surface-page-secondary">
            <img src={image} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: focus }} />
            <ArrowChip />
          </div>
          <div className="flex shrink-0 flex-col gap-4 p-12">
            <Typography textStyle="heading-xs" as="h3">
              {service.title}
            </Typography>
            <Typography textStyle="body-sm-regular" color="secondary">
              {service.body}
            </Typography>
          </div>
        </div>
      )}

      {layout === "overlay" && image && (
        <div className="relative flex h-full min-h-200 flex-col justify-end text-left">
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className={fitWidth ? "absolute inset-x-0 -top-16 h-auto w-full" : "absolute inset-0 size-full object-cover"}
            style={fitWidth ? { WebkitMaskImage: FADE, maskImage: FADE } : { objectPosition: focus }}
          />
          {!fitWidth && <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-surface-page-brand to-transparent" aria-hidden="true" />}
          <ArrowChip onDark />
          <div className="relative flex flex-col gap-4 p-16">
            <Typography textStyle="heading-xs" as="h3" color="static">
              {service.title}
            </Typography>
            <Typography textStyle="body-sm-regular" color="static" className="opacity-80">
              {service.body}
            </Typography>
          </div>
        </div>
      )}

      {layout === "icon" && (
        <div className="relative flex h-full min-h-158 flex-col items-start gap-4 p-16 text-left">
          <div className="flex w-full items-start justify-between">
            <span
              className={`grid size-44 place-items-center rounded-full ${
                onDark ? "bg-brand-alpha-light text-text-static-light" : "bg-brand-surface-subtle text-brand-label-default"
              }`}
            >
              <Icon icon={service.icon} size={24} />
            </span>
            <span className={onDark ? "text-brand-label-default-inverse" : "text-text-muted"}>
              <Icon icon={ArrowRight} size={16} />
            </span>
          </div>
          <div className="mt-auto flex flex-col gap-4 pt-16">
            <Typography textStyle="heading-xs" as="h3" color={onDark ? "static" : "primary"}>
              {service.title}
            </Typography>
            <Typography textStyle="body-sm-regular" color={onDark ? "static" : "secondary"} className={onDark ? "opacity-80" : undefined}>
              {service.body}
            </Typography>
          </div>
        </div>
      )}
    </Card>
  );
}

export function ServiceBento() {
  // Tiles fade up once as the grid scrolls into view (50 ms stagger, off with reduced motion).
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const node = gridRef.current;
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

  const common = { revealed };

  return (
    <section className="px-16 pt-32" id="services" aria-labelledby="services-title">
      <div className="flex flex-col gap-12">
        <Typography textStyle="label-md-semibold" color="brand">
          Services
        </Typography>
        <Typography textStyle="heading-xl" as="h2" id="services-title">
          One stop shop for all things car.
        </Typography>
        <Typography textStyle="body-md-regular" color="secondary">
          Whenever you need, for whatever task.
        </Typography>
      </div>

      <div ref={gridRef} className="mt-24 grid auto-rows-auto grid-cols-2 gap-12">
        <Tile {...common} index={0} id="repair" tone="deep" layout="overlay" image="/illustrations/tile-repair.webp" focus="50% 12%" className="col-span-2" />
        <Tile {...common} index={1} id="buy" tone="white" layout="stack" image="/illustrations/tile-buy.webp" to="/buy-car/received" />
        <Tile {...common} index={2} id="sell" tone="tint" layout="stack" image="/illustrations/tile-sell.webp" />
        <Tile {...common} index={3} id="maintain" tone="tint" layout="stack" image="/illustrations/tile-maintain.webp" focus="50% 38%" className="row-span-2" />
        <Tile {...common} index={4} id="insurance" tone="white" layout="stack" image="/illustrations/tile-insure.webp" />
        <Tile {...common} index={5} id="paperwork" tone="white" layout="stack" image="/illustrations/tile-paperwork.webp" />
        <Tile {...common} index={6} id="finance" tone="white" layout="stack" image="/illustrations/tile-finance.webp" />
        <Tile {...common} index={7} id="roadside" tone="deep" layout="overlay" image="/illustrations/tile-roadside.webp" fitWidth />
      </div>
    </section>
  );
}
