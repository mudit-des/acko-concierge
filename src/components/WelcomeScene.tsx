import { Typography } from "@acko/typography";
import { CONCIERGE_NAME } from "../data/booking";
import { PILLS } from "../data/story";
import { Mascot } from "./Mascot";

/*
 * Story 0: the opening animation. Pills for everything a car owner deals with float about on the dusk
 * sky, then gather into the concierge, and the title changes from the problem to the answer.
 * The motion follows the "vision" scene of the Calm Commerce artifact: pills shrink and blur toward
 * the centre with a stagger, a soft orb grows in, and the title swaps. `gathered` drives all of it.
 */

const EASE = "cubic-bezier(.22,.8,.2,1)";
const TONES = ["#334155", "#94a3b8", "#6b9a85"];

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

/** The pictured part: floating pills on the plain light background, and the concierge they gather into. */
export function WelcomeArt({ gathered }: { gathered: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Field: pills float here, then gather at its centre */}
      <div className="absolute inset-x-0 top-96 bottom-[30%]">
        {PILLS.map((p, i) => {
          const [left, top, rot, scale] = SCATTER[i];
          const d = i * 70;
          return (
            <div
              key={p.label}
              className="absolute"
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
                style={{
                  animationDuration: `${6 + (i % 5)}s`,
                  animationDelay: `${-i * 0.7}s`,
                }}
              >
                <span
                  className="size-8 shrink-0 rounded-full"
                  style={{ background: TONES[i % 3] }}
                />
                <Typography
                  textStyle="body-md-medium"
                  as="span"
                  className="whitespace-nowrap"
                >
                  {p.label}
                </Typography>
              </span>
            </div>
          );
        })}

        {/* The concierge: soft rings and the mascot, growing in as the pills arrive */}
        <div
          className="absolute top-1/2 left-1/2"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <div
            className="relative grid size-[min(250px,64vw)] place-items-center"
            style={{
              opacity: gathered ? 1 : 0,
              transform: `scale(${gathered ? 1 : 0.3})`,
              transition: `opacity 1.2s ease 1s, transform 1.6s ${EASE} 1s`,
            }}
          >
            <i
              className="onb-ring absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(107,154,133,.16), rgba(107,154,133,.05) 70%)",
              }}
            />
            <i
              className="onb-ring absolute inset-[17%] rounded-full bg-brand-surface-subtle"
              style={{ animationDelay: ".8s" }}
            />
            <span className="relative grid size-[46%] place-items-center rounded-full border border-border-default-soft bg-surface-card-default shadow-m">
              <Mascot mood="happy" size={88} className="mt-4" />
            </span>
            <span className="sr-only">{CONCIERGE_NAME}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The words: the title swaps in place from the problem to the answer, then a line of support. */
export function WelcomeText({ gathered }: { gathered: boolean }) {
  const title = {
    fontSize: 32,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  } as const;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(48px,env(safe-area-inset-bottom))] flex flex-col gap-8 px-20 opacity-70">
      <div className="grid">
        <Typography
          textStyle="heading-xl"
          as="h1"
          className="col-start-1 row-start-1 self-end text-balance"
          style={{
            ...title,
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
            ...title,
            opacity: gathered ? 1 : 0,
            transform: gathered ? "none" : "translateY(10px)",
            transition: `all 1s ${EASE} ${gathered ? ".9s" : "0s"}`,
          }}
        >
          Otto brings it all together.
        </Typography>
      </div>
      <Typography
        textStyle="body-lg-regular"
        color="secondary"
        style={{
          opacity: gathered ? 1 : 0,
          transition: `opacity 1.2s ease ${gathered ? "1.6s" : "0s"}`,
        }}
      >
        One place for everything your car needs.
      </Typography>
    </div>
  );
}
