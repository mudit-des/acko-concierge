import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@acko/button";
import { Card } from "@acko/card";
import { ArrowRight } from "@acko/icons";
import { Typography } from "@acko/typography";
import { SLIDES, type Slide } from "../data/services";
import { Bubble } from "./Bubble";
import { Icon } from "./Icon";

const TOTAL = SLIDES.length + 1; // story slide + one per theme

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
  const setSlideRef = (i: number) => (el: HTMLDivElement | null) => {
    slideRefs.current[i] = el;
  };

  return (
    <section ref={rootRef} className="pt-8" aria-roledescription="carousel" aria-label="Why a concierge">
      {/* Segmented progress */}
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
              <span className="relative block h-3 w-full overflow-hidden rounded-full bg-brand-primary150">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full bg-brand-selection-default ${
                    current && auto ? "story-fill" : done || current ? "w-full" : "w-0"
                  }`}
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
        <div
          ref={setSlideRef(0)}
          role="group"
          aria-roledescription="slide"
          aria-label={`1 of ${TOTAL}`}
          className="flex basis-[calc(100%-36px)] shrink-0 snap-start flex-col"
        >
          <StorySlide />
        </div>

        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            ref={setSlideRef(idx + 1)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 2} of ${TOTAL}`}
            className="flex basis-[calc(100%-36px)] shrink-0 snap-start flex-col"
          >
            <ThemeSlide slide={slide} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

const FADE = "linear-gradient(to bottom, #000 84%, transparent 100%)";

/**
 * Illustration panel. The scenes have a misty vignette, so the image runs edge to
 * edge and its bottom fades into whatever surface the copy sits on.
 */
function Art({ src, alt, fadeTo, priority = false }: { src: string; alt: string; fadeTo: string; priority?: boolean }) {
  return (
    <div className={`relative h-224 shrink-0 overflow-hidden ${fadeTo}`}>
      <img
        src={src}
        alt={alt}
        width={1200}
        height={900}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="size-full object-cover object-[50%_58%]"
        style={{ WebkitMaskImage: FADE, maskImage: FADE }}
      />
    </div>
  );
}

/** Slide 1: illustration on top, why / what / how on deep sage below. */
function StorySlide() {
  return (
    <div className="flex min-h-580 flex-1 flex-col overflow-hidden rounded-5xl bg-surface-page-brand">
      <Art
        src="/illustrations/intro-street.webp"
        alt="A parked car at dusk with a key, documents, a wrench and a receipt floating above it in an arc"
        fadeTo="bg-surface-page-brand"
        priority
      />

      <div className="flex flex-1 flex-col justify-between gap-20 p-24">
        <div className="flex flex-col gap-8">
          <Typography textStyle="label-md-semibold" color="static" className="opacity-80">
            Why
          </Typography>
          <Typography textStyle="heading-xl" as="h1" color="static">
            Owning a car isn't broken. It's just busy.
          </Typography>
        </div>

        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <Typography textStyle="label-md-semibold" color="static" className="opacity-80">
              What
            </Typography>
            <Typography textStyle="body-md-regular" color="static">
              Your ACKO Drive concierge: one place for everything your car needs, whenever you need it.
            </Typography>
          </div>
          <div className="flex flex-col gap-4 border-t border-surface-static-white/15 pt-16">
            <Typography textStyle="label-md-semibold" color="static" className="opacity-80">
              How
            </Typography>
            <Typography textStyle="body-md-regular" color="static">
              Tell us once. We deal with the dealers, garages, banks and paperwork, and keep you updated.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Slides 2 to 5: one customer theme each. */
function ThemeSlide({ slide }: { slide: Slide }) {
  return (
    <Card
      variant="primary"
      /* @acko/css sets overflow: visible on .acko-card (unlayered), which beats the utility
         and lets the image square off the rounded corners. Clip inline. */
      style={{ overflow: "hidden" }}
      className="flex min-h-580 flex-1 flex-col"
    >
      <Art src={slide.image} alt={slide.imageAlt} fadeTo="bg-surface-card-default" />

      <div className="flex flex-1 flex-col gap-12 p-24">
        <Typography textStyle="label-md-semibold" color="brand">
          {slide.theme}
        </Typography>
        <Typography textStyle="heading-xl" as="h2">
          {slide.heading}
        </Typography>

        {slide.user && slide.reply && (
          <div className="flex flex-col gap-8">
            <Bubble from="customer">{slide.user}</Bubble>
            <Bubble from="concierge">{slide.reply}</Bubble>
          </div>
        )}

        {slide.lifecycle && (
          <ul className="flex flex-col gap-8">
            {slide.lifecycle.map((row) => (
              <li key={row.label} className="flex items-center gap-12 rounded-3xl bg-brand-surface-subtle px-16 py-12">
                <span className="text-brand-label-default">
                  <Icon icon={row.icon} size={24} />
                </span>
                <Typography textStyle="body-md-medium">{row.label}</Typography>
              </li>
            ))}
          </ul>
        )}

        {slide.cta && (
          <div className="mt-auto flex pt-8">
            <Button variant="secondary" size="md" iconRight={<ArrowRight aria-hidden="true" />}>
              {slide.cta}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
