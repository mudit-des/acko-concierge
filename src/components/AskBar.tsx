import { useEffect, useState } from "react";
import { ArrowUp } from "@acko/icons";
import { Typography } from "@acko/typography";

/**
 * The ask bar, fixed at the bottom of the screen from the first screen on, like the composer of a
 * messaging app, so the concierge is always one tap away. It hides while the chat is open.
 * The hint text rolls through the things the concierge does, one every few seconds.
 */
const HINTS = [
  "Ask your concierge",
  "Help me buy a car",
  "What's my car worth?",
  "Renew my insurance",
  "My car broke down",
  "Check my challans",
  "Recharge my FASTag",
];
const EVERY_MS = 2800;

/** Two lines of text on top of each other: the old one rolls up and out while the new one rolls in. */
function RollingHint({ paused }: { paused: boolean }) {
  const [{ i, prev }, setPos] = useState<{ i: number; prev: number | null }>({ i: 0, prev: null });

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      setPos((p) => ({ i: (p.i + 1) % HINTS.length, prev: p.i }));
    }, EVERY_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <span className="relative block h-28 min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      {prev !== null && (
        <span key={`out-${prev}-${i}`} className="ask-out absolute inset-x-0 top-0 flex h-28 items-center">
          <Typography textStyle="body-lg-regular" color="secondary" as="span" truncate>
            {HINTS[prev]}
          </Typography>
        </span>
      )}
      <span key={`in-${i}`} className={`${prev !== null ? "ask-in" : ""} absolute inset-x-0 top-0 flex h-28 items-center`}>
        <Typography textStyle="body-lg-regular" color="secondary" as="span" truncate>
          {HINTS[i]}
        </Typography>
      </span>
    </span>
  );
}

export function AskBar({ visible, onOpen }: { visible: boolean; onOpen: () => void }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0"
      style={{ zIndex: "var(--zSticky)", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "opacity 300ms ease, transform 300ms ease" }}
    >
      <div
        className="mx-auto w-full max-w-480 px-16 pt-24 pb-[max(16px,env(safe-area-inset-bottom))]"
        style={{ background: "linear-gradient(180deg, transparent 0%, var(--surfacePagePrimary) 45%)" }}
      >
        <button
          type="button"
          onClick={onOpen}
          tabIndex={visible ? 0 : -1}
          aria-hidden={!visible}
          className={`flex h-56 w-full items-center justify-between rounded-full border border-border-default-medium bg-surface-card-default py-4 pr-4 pl-20 text-left shadow-m ${visible ? "pointer-events-auto" : ""}`}
        >
          <span className="sr-only">Ask your concierge</span>
          <RollingHint paused={!visible} />
          <span className="grid size-44 place-items-center rounded-full bg-text-primary text-surface-card-default">
            <span className="inline-flex size-20 [&_svg]:size-full" aria-hidden="true">
              <ArrowUp />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
