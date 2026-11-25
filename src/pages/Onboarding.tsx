import { useEffect, useRef, useState } from "react";
import { Button } from "@acko/button";
import { Refresh } from "@acko/icons";
import { Typography } from "@acko/typography";
import { Mascot } from "../components/Mascot";
import { PILLS } from "../data/story";
import { CONCIERGE_NAME } from "../data/booking";
import { navigate } from "../router";

/*
 * App-opening screen. Pills for everything a car owner deals with float about, then gather into
 * the concierge. The motion follows the "vision" scene of the Calm Commerce artifact: pills
 * shrink and blur toward the centre with a stagger, a soft orb grows in, and the title swaps.
 * With reduced motion it opens already gathered.
 */

const EASE = "cubic-bezier(.22,.8,.2,1)";
/** Big, tight, left aligned. Inline because component CSS beats utilities. */
const TITLE = { fontSize: 36, lineHeight: 1.1, letterSpacing: "-0.02em", textAlign: "left" } as const;

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
  const touched = useRef(false);

  // Start gathering shortly after the screen opens, unless the person replayed it by hand.
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => {
      if (!touched.current) setGathered(true);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const replay = () => {
    touched.current = true;
    setGathered(false);
    window.setTimeout(() => setGathered(true), 1800);
  };

  return (
    <div className="onb min-h-svh bg-surface-page-secondary">
      <main className="mx-auto flex h-svh w-full max-w-480 flex-col overflow-hidden bg-surface-page-primary px-16 pt-[max(8px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        {/* Replay sits top right and only appears once the animation has finished */}
        <header className="flex h-44 items-center justify-end">
          <div style={{ opacity: gathered ? 1 : 0, pointerEvents: gathered ? "auto" : "none", transition: `opacity 0.8s ease ${gathered ? "2.4s" : "0s"}` }}>
            <Button variant="ghost" size="sm" iconLeft={<Refresh aria-hidden="true" />} onClick={replay} tabIndex={gathered ? 0 : -1}>
              Replay
            </Button>
          </div>
        </header>

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
              style={{ opacity: gathered ? 1 : 0, transform: `scale(${gathered ? 1 : 0.3})`, transition: `opacity 1.2s ease 1s, transform 1.6s ${EASE} 1s` }}
            >
              <i className="onb-ring absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(107,154,133,.12), rgba(107,154,133,.04) 70%)" }} />
              <i className="onb-ring absolute inset-[17%] rounded-full bg-brand-surface-subtle" style={{ animationDelay: ".8s" }} />
              <span className="relative grid size-[46%] place-items-center rounded-full border border-border-default-soft bg-surface-card-default shadow-m">
                <Mascot mood="happy" size={92} className="mt-4" />
              </span>
              <span className="sr-only">{CONCIERGE_NAME}</span>
            </div>
          </div>
        </div>

        {/* Bottom: the title swaps in place, left aligned and large, then the subline and the button */}
        <div className="flex flex-col">
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
            style={{ marginTop: 14, opacity: gathered ? 1 : 0, transition: `opacity 1.2s ease ${gathered ? "1.6s" : "0s"}` }}
          >
            One place for everything your car needs.
          </Typography>

          <div style={{ marginTop: 24, opacity: gathered ? 1 : 0, transform: gathered ? "none" : "translateY(8px)", transition: `all 1.2s ${EASE} ${gathered ? "2.2s" : "0s"}` }}>
            <Button size="md" fullWidth disabled={!gathered} onClick={() => navigate("/home")}>
              Get started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
