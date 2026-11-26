import { useEffect, useState } from "react";
import { Typography } from "@acko/typography";

/*
 * The hint text in the chat's input: it rolls through the things the concierge does, one every few
 * seconds. All the lines sit in one column that slides up a line at a time, so two lines can never
 * overlap. The first hint is repeated at the end; once the column has slid onto it, it jumps back to the
 * top without animating, which makes the loop seamless.
 */

const HINTS = ["Ask Otto", "Help me buy a car", "What's my car worth?", "Renew my insurance", "My car broke down", "Check my challans", "Recharge my FASTag"];
const EVERY_MS = 2800;
const LINE = 28;

export function RollingHint({ paused = false }: { paused?: boolean }) {
  const [i, setI] = useState(0);
  const [snap, setSnap] = useState(false);
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (paused || still) return;
    const t = window.setInterval(() => {
      setSnap(false);
      setI((n) => n + 1);
    }, EVERY_MS);
    return () => window.clearInterval(t);
  }, [paused, still]);

  const onEnd = () => {
    if (i >= HINTS.length) {
      setSnap(true);
      setI(0);
    }
  };

  return (
    <span className="relative block h-28 min-w-0 flex-1 overflow-hidden" aria-hidden="true">
      <span className="block" style={{ transform: `translateY(${-i * LINE}px)`, transition: snap ? "none" : "transform 500ms cubic-bezier(.22, .8, .2, 1)" }} onTransitionEnd={onEnd}>
        {[...HINTS, HINTS[0]].map((text, k) => (
          <span key={k} className="flex h-28 items-center">
            <Typography textStyle="body-lg-regular" color="secondary" as="span" truncate>
              {text}
            </Typography>
          </span>
        ))}
      </span>
    </span>
  );
}
