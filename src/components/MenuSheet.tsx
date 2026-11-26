import { useEffect } from "react";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import type { IntentId } from "../data/chat";
import { GLOVE_BOX } from "../data/home";

/*
 * The menu: a bento sheet that slides up over the chat from the menu button. Every service is a tile with
 * its illustration, then the glove box with its live statuses, then a link to the full list.
 * Tapping a tile closes the sheet and sends that message into the chat. (Emergency and the ongoing booking
 * live in the thread itself, so they are not repeated here.)
 */

interface TileData {
  title: string;
  note?: string;
  intent: IntentId;
  image: string;
  position?: string;
}
const TILES: TileData[] = [
  { title: "Buy a car", note: "Advice and a fair price", intent: "buy", image: "tile-buy", position: "36% 50%" },
  { title: "Sell", note: "A verified buyer", intent: "sell", image: "tile-sell", position: "50% 40%" },
  { title: "Exchange", note: "Trade in your old car", intent: "exchange", image: "tile-exchange", position: "50% 40%" },
  { title: "Insurance", note: "Buy, renew, claim", intent: "insurance", image: "tile-insure" },
  { title: "Service", note: "Free pick up and drop", intent: "service", image: "scene-servicing" },
  { title: "Roadside help", note: "Towing, battery, tyre", intent: "emergency", image: "scene-roadside" },
];

export function MenuSheet({ open, onClose, onAsk }: { open: boolean; onClose: () => void; onAsk: (intent: IntentId) => void }) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  const ask = (intent: IntentId) => {
    onClose();
    onAsk(intent);
  };
  const glance = GLOVE_BOX.map((g) => `${g.label} ${g.value.toLowerCase()}`).join(" · ");

  return (
    <div className={`absolute inset-0 z-20 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} {...(!open && { inert: true })}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        role="dialog"
        aria-label="Menu"
        className={`absolute inset-x-0 bottom-0 top-[max(40px,env(safe-area-inset-top))] flex flex-col rounded-t-[28px] bg-surface-card-default px-12 pt-8 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-[400ms] ease-[cubic-bezier(.22,.8,.2,1)] motion-reduce:transition-none ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <button type="button" onClick={onClose} aria-label="Close menu" className="mx-auto mb-8 block h-20 w-full">
          <span className="mx-auto block h-4 w-36 rounded-full bg-border-default-medium" />
        </button>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-8 overflow-y-auto" style={{ gridTemplateRows: "repeat(3, minmax(160px, 1fr)) auto" }}>
          {TILES.map((t) => (
            <button key={t.title} type="button" onClick={() => ask(t.intent)} className="flex min-h-160 flex-col overflow-hidden rounded-2xl bg-surface-page-secondary text-left active:scale-[0.98]">
              <img src={asset(`/illustrations/${t.image}.webp`)} alt="" loading="lazy" className="min-h-0 w-full flex-1 object-cover" style={{ objectPosition: t.position }} />
              <span className="flex flex-col px-12 py-8">
                <Typography textStyle="label-md-semibold" as="span">
                  {t.title}
                </Typography>
                {t.note && (
                  <Typography textStyle="helper-sm-regular" color="secondary" as="span" truncate>
                    {t.note}
                  </Typography>
                )}
              </span>
            </button>
          ))}

          <button type="button" onClick={() => ask("glovebox")} className="col-span-2 flex min-h-88 items-stretch gap-12 overflow-hidden rounded-2xl bg-surface-page-secondary pr-16 text-left active:scale-[0.98]">
            <img src={asset("/illustrations/scene-fair.webp")} alt="" loading="lazy" className="h-full w-120 shrink-0 object-cover" />
            <span className="flex min-w-0 flex-1 flex-col justify-center">
              <Typography textStyle="label-md-semibold" as="span">
                Glove box
              </Typography>
              <Typography textStyle="helper-sm-regular" color="secondary" as="span" truncate>
                {glance}
              </Typography>
            </span>
            <Typography textStyle="body-lg-regular" color="secondary" as="span" className="self-center" aria-hidden="true">
              ›
            </Typography>
          </button>
        </div>
        <button type="button" onClick={() => ask("allservices")} className="mt-8 flex min-h-48 w-full items-center justify-center gap-4 rounded-full active:opacity-70">
          <Typography textStyle="label-md-semibold" as="span">
            View all services
          </Typography>
          <Typography textStyle="body-lg-regular" color="secondary" as="span" aria-hidden="true">
            ›
          </Typography>
        </button>
      </div>
    </div>
  );
}
