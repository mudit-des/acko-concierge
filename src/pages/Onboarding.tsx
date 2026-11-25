import { useEffect, useRef, useState } from "react";
import { Typography } from "@acko/typography";
import { Mascot } from "../components/Mascot";
import { PILLS } from "../data/story";
import { CONCIERGE_NAME } from "../data/booking";
import { withBase } from "../router";
import Story from "./Story";

/*
 * App-opening screen. Pills for everything a car owner deals with float about, then gather into
 * the concierge. The motion follows the "vision" scene of the Calm Commerce artifact: pills
 * shrink and blur toward the centre with a stagger, a soft orb grows in, and the title swaps.
 * With reduced motion it opens already gathered. There are no buttons: after the title settles, the a few
 * seconds after the title settles, the the story cards slide in from the right and this screen drifts away.
 */

const EASE = "cubic-bezier(.22,.8,.2,1)";
/** How long the finished screen is held before the cards slide up. */
const HOLD_MS = 4200;
/** How long the welcome items take to lift away. */
const FADE_MS = 450;
/** How long the concierge takes to contract away before the cards fade in. */
const CONTRACT_MS = 750;
/** Big, tight, centred. Inline because component CSS beats utilities. */
const TITLE = { fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", textAlign: "center" } as const;

/** Where each pill floats before it gathers: left %, top %, tilt in degrees, scale. */
const SCATTER: [number, number, number, number][] = [
  [26, 9, -5, 1],
  [74, 17, 4, 0.95],
  [34, 29, 3, 1],
  [80, 40, -4, 1],
  [22, 49, 5, 0.95],
  [60, 57, -3, 1],
  [38, 73, 4, 1],
  [76, 82, -5, 0.95],
];
const TONES = ["#334155", "#94a3b8", "#6b9a85"];

export default function Onboarding() {
  const reduce = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches).current;
  const [gathered, setGathered] = useState(reduce);

  // Start gathering shortly after the screen opens.
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setGathered(true), 2200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  // Hold on the finished screen, then let everything lift away (shorter hold if reduced motion).
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (!gathered) return;
    const t = window.setTimeout(() => setLeaving(true), reduce ? 1500 : HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reduce, gathered]);

  // The concierge contracts away, then the story screen fades in slowly in its place.
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    if (!leaving) return;
    window.history.replaceState(null, "", withBase("/story"));
    if (reduce) {
      setReveal(true);
      return;
    }
    const t = window.setTimeout(() => setReveal(true), CONTRACT_MS);
    return () => window.clearTimeout(t);
  }, [leaving, reduce]);

  return (
    <div className="onb min-h-svh bg-surface-page-secondary">
      <main
        className="mx-auto flex h-svh w-full max-w-480 flex-col overflow-hidden bg-surface-page-primary px-16 pt-[max(16px,env(safe-area-inset-top))] pb-[max(32px,env(safe-area-inset-bottom))]"
      >
        <div className="flex min-h-0 flex-1 flex-col">
        {/* Field: pills float here, then gather into the concierge at the centre */}
        <div className="relative mb-16 min-h-0 flex-1" aria-label={gathered ? "Everything gathered into one place" : "Scattered tasks of owning a car"}>
          {PILLS.map((p, i) => {
            const [left, top, rot, scale] = SCATTER[i];
            const d = i * 70;
            return (
              <div
                key={p.label}
                className="absolute"
                aria-hidden="true"
                style={{
                  left: `${gathered ? 50 : left}%`,
                  top: `${gathered ? 50 : top}%`,
                  transform: `translate(-50%,-50%) rotate(${gathered ? 0 : rot}deg) scale(${gathered ? 0.25 : scale})`,
                  opacity: gathered ? 0 : 1,
                  filter: gathered ? "blur(6px)" : "blur(0px)",
                  transition: `left 1.7s ${EASE} ${d}ms, top 1.7s ${EASE} ${d}ms, transform 1.7s ${EASE} ${d}ms, opacity 1.2s ease ${d + 500}ms, filter 1.2s ease ${d}ms`,
                  willChange: "left, top, transform",
                }}
              >
                <span
                  className="onb-drift inline-flex items-center gap-8 rounded-full border border-border-default-soft bg-surface-card-default px-12 py-8 shadow-s"
                  style={{ animationDuration: `${6 + (i % 5)}s`, animationDelay: `${-i * 0.7}s` }}
                >
                  <span className="size-8 shrink-0 rounded-full" style={{ background: TONES[i % 3] }} />
                  <Typography textStyle="body-md-medium" as="span" className="whitespace-nowrap">
                    {p.label}
                  </Typography>
                </span>
              </div>
            );
          })}

          {/* The concierge: soft rings and the mascot, growing in as the pills arrive */}
          <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%,-50%)" }}>
            <div
              className="relative grid size-[min(260px,66vw)] place-items-center"
              style={
                leaving
                  ? { opacity: 0, transform: "scale(0)", transition: `opacity ${CONTRACT_MS}ms ease-in, transform ${CONTRACT_MS}ms cubic-bezier(.5, 0, .75, 0)` }
                  : { opacity: gathered ? 1 : 0, transform: `scale(${gathered ? 1 : 0.3})`, transition: `opacity 1.2s ease 1s, transform 1.6s ${EASE} 1s` }
              }
            >
              <i className="onb-ring absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(107,154,133,.12), rgba(107,154,133,.04) 70%)", opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }} />
              <i className="onb-ring absolute inset-[17%] rounded-full bg-brand-surface-subtle" style={{ animationDelay: ".8s", opacity: leaving ? 0 : 1, transition: `opacity ${FADE_MS}ms ease` }} />
              <span className="relative grid size-[46%] place-items-center rounded-full border border-border-default-soft bg-surface-card-default shadow-m">
                <Mascot mood="happy" size={92} className="mt-4" />
              </span>
              <span className="sr-only">{CONCIERGE_NAME}</span>
            </div>
          </div>
        </div>

        {/* Bottom: the title swaps in place, centred and large, then the subline. It lifts away when the circle opens. */}
        <div className="flex flex-col" style={{ opacity: leaving ? 0 : 1, transform: leaving ? "translateY(-10px)" : "none", transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ${EASE}` }}>
          <div className="grid">
            <Typography
              textStyle="heading-xl"
              as="h1"
              className="col-start-1 row-start-1 self-end text-balance"
              style={{
                ...TITLE,
                opacity: gathered ? 0 : 1,
                transform: gathered ? "translateY(-10px)" : "none",
                transition: `all 1s ${EASE}`,
              }}
            >
              Car ownership is scattered.
            </Typography>
            <Typography
              textStyle="heading-xl"
              as="h1"
              className="col-start-1 row-start-1 self-end text-balance"
              aria-hidden={!gathered}
              style={{
                ...TITLE,
                opacity: gathered ? 1 : 0,
                transform: gathered ? "none" : "translateY(10px)",
                transition: `all 1s ${EASE} ${gathered ? ".9s" : "0s"}`,
              }}
            >
              Your concierge brings it all together.
            </Typography>
          </div>

          <Typography
            textStyle="body-md-regular"
            color="secondary"
            align="center"
            style={{ marginTop: 14, opacity: gathered ? 1 : 0, transition: `opacity 1.2s ease ${gathered ? "1.6s" : "0s"}` }}
          >
            One place for everything your car needs.
          </Typography>

        </div>
        </div>
      </main>

      {/* Once the concierge has contracted away, the story screen mounts and its cards fade in slowly. */}
      {reveal && (
        <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 50 }}>
          <Story morph />
        </div>
      )}
    </div>
  );
}
