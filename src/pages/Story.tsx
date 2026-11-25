import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { asset } from "../asset";
import { USE_CASES, type UseCase } from "../data/story";
import { navigate } from "../router";

/*
 * The story screen: four giant cards, one per thing the concierge does for you, with no top nav.
 * Swipe between them; "Learn more" is always at the bottom and leads to the services.
 */

const TOTAL = USE_CASES.length;
const FADE = "linear-gradient(to bottom, #000 86%, transparent 100%)";
const TITLE: CSSProperties = { fontSize: 36, lineHeight: 1.08, letterSpacing: "-0.02em" };
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function StoryCard({ useCase }: { useCase: UseCase }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-5xl border border-border-default-soft bg-surface-card-default shadow-m">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <img
          src={asset(useCase.image)}
          alt={useCase.imageAlt}
          width={1200}
          height={900}
          decoding="async"
          className="size-full object-cover object-[50%_58%]"
          style={{ WebkitMaskImage: FADE, maskImage: FADE }}
        />
      </div>

      <div data-story-content className="flex shrink-0 flex-col gap-16 px-24 pt-4 pb-20">
        <div className="story-in flex flex-col gap-8" style={delay(0)}>
          <Typography textStyle="label-md-semibold" color="secondary">
            {useCase.topic}
          </Typography>
          <Typography textStyle="heading-xl" as="h2" className="text-balance" style={TITLE}>
            {useCase.heading}
          </Typography>
        </div>

        <div className="flex flex-col gap-8">
          <div className="story-in max-w-[90%] self-end rounded-3xl rounded-br-md bg-surface-page-secondary px-16 py-12" style={delay(250)}>
            <Typography textStyle="body-lg-regular" color="secondary">
              {useCase.user}
            </Typography>
          </div>
          <div className="story-in max-w-[90%] self-start rounded-3xl rounded-bl-md bg-brand-surface-subtle px-16 py-12" style={delay(550)}>
            <Typography textStyle="body-lg-medium">{useCase.reply}</Typography>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Story({ morph = false }: { morph?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Every card's text block takes the height of the tallest one, so the pictures are the same size on all cards.
  useLayoutEffect(() => {
    const fit = () => {
      const blocks = Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-story-content]") ?? []);
      blocks.forEach((b) => (b.style.minHeight = ""));
      const tallest = Math.max(0, ...blocks.map((b) => b.offsetHeight));
      blocks.forEach((b) => (b.style.minHeight = `${tallest}px`));
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const el = slideRefs.current[i];
    const first = slideRefs.current[0];
    if (!track || !el || !first) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: el.offsetLeft - first.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const first = slideRefs.current[0];
    const second = slideRefs.current[1];
    if (!track || !first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    const i = Math.max(0, Math.min(TOTAL - 1, Math.round(track.scrollLeft / step)));
    setActive((prev) => (prev === i ? prev : i));
  }, []);

  return (
    <div className={`min-h-svh bg-surface-page-secondary ${morph ? "story-morph" : ""}`}>
      <main className="mx-auto flex h-svh w-full max-w-480 flex-col bg-surface-page-primary pt-[max(12px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        <section className="se-card min-h-0 flex-1" aria-roledescription="carousel" aria-label="What your concierge does">
          <div
            ref={trackRef}
            className="no-scrollbar flex h-full snap-x snap-mandatory scroll-pl-12 gap-8 overflow-x-auto overscroll-x-contain px-12 pt-4 pb-24"
            tabIndex={0}
            onScroll={onScroll}
          >
            {USE_CASES.map((u, i) => (
              <div
                key={u.id}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${TOTAL}`}
                data-active={active === i}
                className="h-full basis-[calc(100%-20px)] shrink-0 snap-start"
              >
                <StoryCard useCase={u} />
              </div>
            ))}
          </div>
        </section>

        {/* Tiny dots, left aligned, then the one action */}
        <div className="se-foot -mt-12 flex justify-start px-20">
          {USE_CASES.map((u, i) => (
            <button
              key={u.id}
              type="button"
              className="flex h-32 items-center px-4"
              aria-label={`Go to card ${i + 1}`}
              aria-current={active === i ? "true" : undefined}
              onClick={() => goTo(i)}
            >
              <span className={`block h-4 rounded-full transition-[width,background-color] duration-300 ${active === i ? "w-20 bg-text-primary" : "w-4 bg-border-default-medium"}`} />
            </button>
          ))}
        </div>
        <div className="se-foot px-16 pt-4">
          <Button size="md" fullWidth onClick={() => navigate("/home")}>
            Learn more
          </Button>
        </div>
      </main>
    </div>
  );
}
