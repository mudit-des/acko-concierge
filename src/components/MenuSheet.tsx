import { useEffect } from "react";
import { Typography } from "@acko/typography";
import type { IntentId } from "../data/chat";
import { GRID_ITEMS } from "../data/context";
import { ServiceGrid } from "./ServiceGrid";

/*
 * The menu: a sheet that slides up over the chat from the menu button. It shows the same circular icon grid
 * as the home screen (one component, so they never drift apart), then a link to the full list.
 * Tapping an item closes the sheet and sends that message into the chat.
 */

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
        className={`absolute inset-x-0 bottom-0 flex max-h-[calc(100%-max(40px,env(safe-area-inset-top)))] flex-col rounded-t-[28px] bg-surface-card-default px-16 pt-8 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-[400ms] ease-[cubic-bezier(.22,.8,.2,1)] motion-reduce:transition-none ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="mx-auto mb-8 block h-20 w-full"
        >
          <span className="mx-auto block h-4 w-36 rounded-full bg-border-default-medium" />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto pt-8 pb-8">
          <ServiceGrid items={GRID_ITEMS} onPick={(i) => ask(i.intent)} />
        </div>
        <button
          type="button"
          onClick={() => ask("allservices")}
          className="mt-4 flex min-h-48 w-full items-center justify-center gap-4 rounded-full active:opacity-70"
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
