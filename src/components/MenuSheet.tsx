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
  {
    title: "Buy a car",
    note: "Advice and a fair price",
    intent: "buy",
    image: "buy",
    position: "36% 50%",
  },
  {
    title: "Sell",
    note: "A verified buyer",
    intent: "sell",
    image: "sell",
    position: "50% 40%",
  },
  {
    title: "Exchange",
    note: "Trade in your old car",
    intent: "exchange",
    image: "exchange",
    position: "50% 40%",
  },
  {
    title: "Insurance",
    note: "Buy, renew, claim",
    intent: "insurance",
    image: "insurance",
  },
  {
    title: "Service",
    note: "Free pick up and drop",
    intent: "service",
    image: "service",
  },
  {
    title: "Roadside help",
    note: "Towing, battery, tyre",
    intent: "emergency",
    image: "roadside",
  },
];

export function MenuSheet({
  open,
  onClose,
  onAsk,
}: {
  open: boolean;
  onClose: () => void;
  onAsk: (intent: IntentId) => void;
}) {
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
  const glance = GLOVE_BOX.map(
    (g) => `${g.label} ${g.value.toLowerCase()}`,
  ).join(" · ");

  return (
    <div
      className={`absolute inset-0 z-20 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
      {...(!open && { inert: true })}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-label="Menu"
        className={`absolute inset-x-0 bottom-0 top-[max(40px,env(safe-area-inset-top))] flex flex-col rounded-t-[28px] bg-surface-card-default px-12 pt-8 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-[400ms] ease-[cubic-bezier(.22,.8,.2,1)] motion-reduce:transition-none ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="mx-auto mb-8 block h-20 w-full"
        >
          <span className="mx-auto block h-4 w-36 rounded-full bg-border-default-medium" />
        </button>
        <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-x-8 gap-y-[40px] overflow-y-auto px-4 pt-[44px] pb-4">
          {TILES.map((t) => (
            <button
              key={t.title}
              type="button"
              onClick={() => ask(t.intent)}
              className="group relative flex min-h-[104px] flex-col items-center rounded-3xl border px-8 pt-[52px] pb-12 text-center transition-transform active:scale-[0.97]"
              style={{
                backgroundColor: "var(--brandPrimary100)",
                borderColor: "var(--brandPrimary200)",
              }}
            >
              <img
                src={asset(`/icons/${t.image}.webp`)}
                alt=""
                loading="lazy"
                className="pointer-events-none absolute -top-[36px] left-1/2 size-[88px] -translate-x-1/2 object-contain transition-transform duration-200 group-active:-translate-y-2 motion-reduce:transition-none"
              />
              <Typography
                textStyle="label-md-semibold"
                as="span"
                style={{ color: "var(--brandPrimary850)" }}
              >
                {t.title}
              </Typography>
              {t.note && (
                <Typography
                  textStyle="helper-sm-regular"
                  as="span"
                  style={{ color: "var(--brandPrimary700)" }}
                  truncate
                >
                  {t.note}
                </Typography>
              )}
            </button>
          ))}

          <button
            type="button"
            onClick={() => ask("glovebox")}
            className="group relative col-span-2 mt-[10px] flex min-h-[76px] items-center gap-12 rounded-3xl border pr-16 pl-[108px] text-left transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: "var(--brandPrimary100)",
              borderColor: "var(--brandPrimary200)",
            }}
          >
            <img
              src={asset("/icons/glovebox.webp")}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute -top-[22px] left-12 size-[88px] object-contain"
            />
            <span className="flex min-w-0 flex-1 flex-col">
              <Typography
                textStyle="label-md-semibold"
                as="span"
                style={{ color: "var(--brandPrimary850)" }}
              >
                Glove box
              </Typography>
              <Typography
                textStyle="helper-sm-regular"
                as="span"
                style={{ color: "var(--brandPrimary700)" }}
                truncate
              >
                {glance}
              </Typography>
            </span>
            <Typography
              textStyle="body-lg-regular"
              color="secondary"
              as="span"
              aria-hidden="true"
            >
              ›
            </Typography>
          </button>
        </div>
        <button
          type="button"
          onClick={() => ask("allservices")}
          className="mt-8 flex min-h-48 w-full items-center justify-center gap-4 rounded-full active:opacity-70"
        >
          <Typography textStyle="label-md-semibold" as="span">
            View all services
          </Typography>
          <Typography
            textStyle="body-lg-regular"
            color="secondary"
            as="span"
            aria-hidden="true"
          >
            ›
          </Typography>
        </button>
      </div>
    </div>
  );
}
