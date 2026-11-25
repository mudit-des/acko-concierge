import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Card } from "@acko/card";
import { Typography } from "@acko/typography";
import { Bubble } from "./Bubble";
import { asset } from "../asset";
import { USE_CASES, type UseCase } from "../data/story";

/*
 * Home carousel: four things the concierge can do for a customer. Each slide is a white card
 * with an illustration, the customer's own words and the concierge's answer.
 */

const TOTAL = USE_CASES.length;

export function StoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const el = slideRefs.current[i];
    const first = slideRefs.current[0];
    if (!track || !el || !first) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: el.offsetLeft - first.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    setActive(i);
  }, []);

  // Any manual interaction ends autoplay for good.
  const stopAuto = useCallback(() => setAuto(false), []);

  // Keep the active index in sync with manual swipes.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    const first = slideRefs.current[0];
    const second = slideRefs.current[1];
    if (!track || !first || !second) return;
    const step = second.offsetLeft - first.offsetLeft;
    const i = Math.max(0, Math.min(TOTAL - 1, Math.round(track.scrollLeft / step)));
    setActive((prev) => (prev === i ? prev : i));
  }, []);

  // Pause the timer while the carousel is off screen or the tab is hidden.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(node);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const running = auto && inView && tabVisible;
  const slides: ReactNode[] = USE_CASES.map((u) => <UseCaseSlide key={u.id} useCase={u} />);

  return (
    <section ref={rootRef} className="pt-8" aria-roledescription="carousel" aria-label="Why a concierge">
      {/* Segmented progress: neutral track, black fill */}
      <div className="flex gap-6 px-16">
        {Array.from({ length: TOTAL }, (_, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <button
              key={i}
              type="button"
              className="flex h-44 flex-1 items-center"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={current ? "true" : undefined}
              onClick={() => {
                stopAuto();
                goTo(i);
              }}
            >
              <span className="relative block h-3 w-full overflow-hidden rounded-full bg-border-default-soft">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-text-primary ${current && auto ? "story-fill" : done || current ? "w-full" : "w-0"}`}
                  style={current && auto ? { animationPlayState: running ? "running" : "paused" } : undefined}
                  onAnimationEnd={() => {
                    if (current && auto) goTo((i + 1) % TOTAL);
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* Slides */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory scroll-pl-16 gap-12 overflow-x-auto overscroll-x-contain px-16 pt-4 pb-20"
        tabIndex={0}
        onScroll={onScroll}
        onPointerDown={stopAuto}
        onTouchStart={stopAuto}
        onWheel={stopAuto}
        onKeyDown={stopAuto}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${TOTAL}`}
            data-active={active === i}
            className="flex basis-[calc(100%-36px)] shrink-0 snap-start flex-col"
          >
            {slide}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

const FADE = "linear-gradient(to bottom, #000 84%, transparent 100%)";

/** Illustration at the top of a card. Its bottom fades into the white card below. */
function Art({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-168 shrink-0 overflow-hidden bg-surface-card-default">
      <img
        src={src}
        alt={alt}
        width={1200}
        height={900}
        loading="lazy"
        decoding="async"
        className="size-full object-cover object-[50%_58%]"
        style={{ WebkitMaskImage: FADE, maskImage: FADE }}
      />
    </div>
  );
}

/** White card shared by every slide: optional art, eyebrow, heading, then the slide's own content. */
function Frame({ eyebrow, heading, art, children }: { eyebrow: string; heading: ReactNode; art?: { src: string; alt: string }; children: ReactNode }) {
  return (
    <Card
      variant="primary"
      /* @acko/css sets overflow: visible on .acko-card (unlayered), which beats the utility. Clip inline. */
      style={{ overflow: "hidden", backgroundColor: "var(--surfaceCardDefault)" }}
      className="flex flex-1 flex-col border border-border-default-soft"
    >
      {art && <Art {...art} />}
      <div className={`flex flex-1 flex-col gap-20 px-24 pb-24 ${art ? "pt-20" : "pt-24"}`}>
        <div className="flex flex-col gap-8">
          <Typography textStyle="label-md-semibold" color="secondary">
            {eyebrow}
          </Typography>
          <Typography textStyle="heading-xl" as="h2" className="text-balance">
            {heading}
          </Typography>
        </div>
        {children}
      </div>
    </Card>
  );
}

/** One use case: illustration, what the customer is doing, their words, and the concierge's answer. */
function UseCaseSlide({ useCase }: { useCase: UseCase }) {
  return (
    <Frame eyebrow={useCase.topic} heading={useCase.heading} art={{ src: asset(useCase.image), alt: useCase.imageAlt }}>
      <div className="flex flex-col gap-8">
        <Bubble from="customer">{useCase.user}</Bubble>
        <Bubble from="concierge">{useCase.reply}</Bubble>
      </div>
    </Frame>
  );
}
