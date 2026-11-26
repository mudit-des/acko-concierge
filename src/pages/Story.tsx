import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { USE_CASES } from "../data/story";
import { navigate } from "../router";
import { WelcomeArt, WelcomeText } from "../components/WelcomeScene";

/*
 * The story screen, in the style of Instagram stories: a full-screen picture per story with
 * timer bars across the top, and the words in white over a dark gradient at the bottom.
 * Story 0 is the opening animation (pills gather into the concierge); then come the pictures.
 *  - Each story runs for a few seconds, then the next one starts. After the last, it opens the chat.
 *  - Tap the right side for the next story and the left side for the previous one.
 *  - Press and hold to pause. The close button skips to the home page.
 *  - With reduced motion nothing advances by itself.
 */

/** Story 0 is the welcome animation, then one story per use case. */
const TOTAL = USE_CASES.length + 1;
const STORY_MS = 5500;
/** The welcome needs longer: the pills gather, the title swaps, and it is held to be read. */
const WELCOME_MS = 6500;
const WELCOME_GATHER_MS = 2200;
const HOLD_MS = 220;
const DARK = "#08160e";
/** Story 0 is plain and light; the pictures sit on dark green. */
const LIGHT = "#f5f7f3";
/** The pictures fade out at the bottom, so they melt into the dark instead of ending in a hard edge. */
const FADE_OUT = "linear-gradient(to bottom, #000 68%, transparent 100%)";
const TITLE: CSSProperties = {
  fontSize: 32,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

export default function Story() {
  const reduce = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const down = useRef<{ t: number; x: number } | null>(null);

  // Story 0: the pills start scattered and gather a couple of seconds in. Each time it is shown, it starts over.
  const [gathered, setGathered] = useState(reduce);
  const [welcomeRun, setWelcomeRun] = useState(0);
  useEffect(() => {
    if (index !== 0) return;
    setWelcomeRun((n) => n + 1);
    if (reduce) {
      setGathered(true);
      return;
    }
    setGathered(false);
    const t = window.setTimeout(() => setGathered(true), WELCOME_GATHER_MS);
    return () => window.clearTimeout(t);
  }, [index, reduce]);

  const finish = useCallback(() => navigate("/chat"), []);
  const next = useCallback(
    () => setIndex((i) => (i + 1 < TOTAL ? i + 1 : (finish(), i))),
    [finish],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  // Pause while the tab is hidden; arrow keys and Escape work too.
  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") finish();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("keydown", onKey);
    };
  }, [next, prev, finish]);

  // A short press is a tap (left third goes back, the rest goes on); holding pauses until release.
  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    down.current = { t: Date.now(), x: e.clientX };
    setPaused(true);
  };
  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = down.current;
    down.current = null;
    setPaused(false);
    if (!d || Date.now() - d.t > HOLD_MS) return;
    const box = e.currentTarget.getBoundingClientRect();
    if (e.clientX - box.left < box.width / 3) prev();
    else next();
  };
  const onCancel = () => {
    down.current = null;
    setPaused(false);
  };

  const story = index > 0 ? USE_CASES[index - 1] : null;
  // Story 0 has a light top, so its timer bars and buttons are dark; the pictures have darker tops, so theirs are white.
  const lightTop = index === 0;
  const running = !reduce && tabVisible && !paused;

  return (
    <div className="min-h-svh bg-surface-page-secondary">
      <main
        className="relative mx-auto h-svh w-full max-w-480 overflow-hidden"
        style={{
          background: index === 0 ? LIGHT : DARK,
          transition: "background-color 350ms ease",
        }}
        aria-roledescription="carousel"
        aria-label="What your concierge does"
      >
        <div className="absolute inset-0">
          {/* Pictures: all mounted so they are ready, only the current one shows. They sit in the top part of the screen so the characters stay above the text. */}
          <div
            className="absolute inset-x-0 top-0 h-[84%]"
            style={{
              opacity: index === 0 ? 1 : 0,
              transition: "opacity 350ms ease",
            }}
          >
            <WelcomeArt key={welcomeRun} gathered={gathered} />
          </div>
          {USE_CASES.map((u, i) => (
            <img
              key={u.id}
              src={asset(u.image)}
              alt={i + 1 === index ? u.imageAlt : ""}
              aria-hidden={i + 1 !== index}
              decoding="async"
              className="absolute inset-x-0 top-0 h-[84%] w-full object-cover"
              style={{
                objectPosition: u.focus ?? "50% 0%",
                opacity: i + 1 === index ? 1 : 0,
                transition: "opacity 350ms ease",
                WebkitMaskImage: FADE_OUT,
                maskImage: FADE_OUT,
              }}
            />
          ))}
          {/* Dark gradient that the words sit on */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%]"
            style={{
              background: `linear-gradient(to top, ${DARK} 0%, rgba(8,22,14,0.94) 30%, rgba(8,22,14,0.62) 62%, rgba(8,22,14,0) 100%)`,
              opacity: lightTop ? 0 : 1,
              transition: "opacity 350ms ease",
            }}
            aria-hidden="true"
          />

          {/* Tap and hold area */}
          <div
            className="absolute inset-x-0 top-64 bottom-0 touch-none select-none"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={onCancel}
            onPointerLeave={onCancel}
            aria-hidden="true"
          />

          {/* Words */}
          {story ? (
            <div
              key={story.id}
              className="pointer-events-none absolute inset-x-0 bottom-[max(48px,env(safe-area-inset-bottom))] flex flex-col gap-8 px-20 text-white opacity-70"
            >
              {story.topic && (
                <Typography
                  textStyle="label-lg-semibold"
                  color="static"
                  className="reveal-up opacity-85"
                >
                  {story.topic}
                </Typography>
              )}
              <Typography
                textStyle="heading-xl"
                as="h1"
                color="static"
                className="reveal-up text-balance"
                style={{ ...TITLE, animationDelay: "120ms" }}
              >
                {story.heading}
              </Typography>
            </div>
          ) : (
            <WelcomeText key={welcomeRun} gathered={gathered} />
          )}
        </div>

        {/* Timer bars and the top row */}
        <div className="absolute inset-x-0 top-0 px-12 pt-[max(12px,env(safe-area-inset-top))]">
          <ol className="flex gap-4" aria-label="Story progress">
            {Array.from({ length: TOTAL }, (_, i) => (
              <li
                key={i}
                className={`relative h-3 flex-1 overflow-hidden rounded-full ${lightTop ? "bg-black/15" : "bg-white/35"}`}
                aria-current={i === index ? "step" : undefined}
              >
                <span className="sr-only">{`Story ${i + 1} of ${TOTAL}`}</span>
                {i < index || (reduce && i === index) ? (
                  <span className="absolute inset-0 bg-white" />
                ) : (
                  i === index && (
                    <span
                      key={index}
                      className={`story-fill absolute inset-y-0 left-0 ${lightTop ? "bg-text-primary" : "bg-white"}`}
                      style={{
                        ["--storyDuration" as string]: `${index === 0 ? WELCOME_MS : STORY_MS}ms`,
                        animationPlayState: running ? "running" : "paused",
                      }}
                      onAnimationEnd={next}
                    />
                  )
                )}
              </li>
            ))}
          </ol>
          <div className="mt-12 flex items-center justify-between">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/90 px-10 py-4">
              <img
                src={asset("/brand/acko-drive-wide-green.svg")}
                alt="ACKO Drive"
                height={14}
                className="h-14 w-auto"
              />
            </span>
            <button
              type="button"
              onClick={finish}
              className={`min-h-36 rounded-full px-12 ${lightTop ? "text-text-primary/70" : "text-white/80"}`}
            >
              <Typography
                textStyle="label-lg-semibold"
                as="span"
                style={{ color: "inherit" }}
              >
                Skip
              </Typography>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
