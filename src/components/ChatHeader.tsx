import { useEffect, useState } from "react";
import { Button } from "@acko/button";
import { Drawer } from "@acko/drawer";
import { ArrowLeft, ChevronDown, ChevronUp, CustomerService } from "@acko/icons";
import { Typography } from "@acko/typography";
import { CONCIERGE_NAME, STAGES } from "../data/booking";
import { Mascot, type MascotMood } from "./Mascot";
import { StepsTimeline } from "./StepsTimeline";

/**
 * Header for the car purchase pages: a regular bar with the back button, the mascot as a small
 * avatar right beside it, and "Get help" on the right. At the top of the page it is flat and
 * transparent; once the page scrolls it becomes a white bar with a soft shadow, as if floating.
 * After the booking, a miniature car card is pinned underneath with the car's name, its live
 * status and a control that opens the full next-steps list.
 */
export function ChatHeader({
  mood,
  talking = false,
  car,
  onBack,
}: {
  mood: MascotMood;
  talking?: boolean;
  /** Pinned mini card once the car is booked. `busy` makes the dot orange (in progress) instead of green (done). */
  car?: { name: string; image: string; status: string; busy: boolean; stage: number; allDone: boolean };
  onBack: () => void;
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The bar only looks like it floats once content scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the steps panel when the booking moves on, or on Escape.
  useEffect(() => setStepsOpen(false), [car?.status]);
  useEffect(() => {
    if (!stepsOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setStepsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepsOpen]);

  return (
    <>
      <header
        className={`sticky top-0 pt-[max(8px,env(safe-area-inset-top))] pb-8 transition-[box-shadow,background-color] duration-200 ${
          scrolled ? "bg-surface-card-default/90 shadow-m backdrop-blur-md" : "bg-transparent"
        }`}
        style={{ zIndex: "var(--zSticky)" }}
      >
        <Typography textStyle="helper-sm-regular" className="sr-only">
          {CONCIERGE_NAME}
        </Typography>

        <div className="flex items-center gap-4 px-8 [&_button]:text-text-primary!">
          <Button variant="ghost" size="sm" iconOnly iconLeft={<ArrowLeft aria-hidden="true" />} aria-label="Back" onClick={onBack}>
            Back
          </Button>
          <span className="relative" aria-hidden="true">
            <span className="grid size-44 place-items-center overflow-hidden rounded-full bg-brand-surface-subtle">
              <Mascot mood={mood} talking={talking} size={40} className="mt-4" />
            </span>
            <span className="absolute right-0 bottom-0 size-12 rounded-full border-2 border-surface-card-default bg-surface-status-success" />
          </span>
          <span className="ml-auto">
            <Button variant="ghost" size="sm" iconLeft={<CustomerService aria-hidden="true" />} onClick={() => setHelpOpen(true)}>
              Get help
            </Button>
          </span>
        </div>

        {car && (
          <>
            {stepsOpen && <div className="fixed inset-0 bg-text-primary/10" onClick={() => setStepsOpen(false)} aria-hidden="true" />}
            <div className="reveal-up relative mt-8 px-16">
              <div
                className={`flex flex-col gap-8 rounded-3xl border border-border-default-soft bg-surface-card-default p-8 transition-shadow duration-200 ${
                  scrolled ? "shadow-none" : "shadow-m"
                }`}
              >
                <div className="flex items-center gap-12">
                  <img src={car.image} alt="" width={56} height={40} className="h-40 w-56 shrink-0 rounded-lg bg-surface-page-secondary object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col" aria-live="polite">
                    <Typography textStyle="body-md-semibold" truncate>
                      {car.name}
                    </Typography>
                    <span className="inline-flex items-center gap-8">
                      <Typography textStyle="body-md-regular" color="secondary" truncate>
                        {car.status}
                      </Typography>
                      {/* Static dot: orange while in progress, green when finished. No animation, so it stays calm on screen. */}
                      <span className={`size-8 shrink-0 rounded-full ${car.busy ? "bg-surface-status-warning" : "bg-surface-status-success"}`} aria-hidden="true" />
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    iconLeft={stepsOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
                    aria-label={stepsOpen ? "Hide all steps" : "Show all steps"}
                    aria-expanded={stepsOpen}
                    aria-controls="booking-steps"
                    onClick={() => setStepsOpen((o) => !o)}
                  >
                    {stepsOpen ? "Hide all steps" : "Show all steps"}
                  </Button>
                </div>

                {/* Progress: one segment per step */}
                <div className="flex gap-4 px-4 pb-4" role="img" aria-label={`Step ${Math.min(car.stage + 1, STAGES.length)} of ${STAGES.length}`}>
                  {STAGES.map((s, i) => (
                    <span
                      key={s.title}
                      className={`h-4 flex-1 rounded-full ${
                        i < car.stage || car.allDone ? "bg-brand-selection-default" : i === car.stage ? "bg-brand-primary400" : "bg-brand-primary150"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {stepsOpen && (
                <div
                  id="booking-steps"
                  className="reveal-up absolute inset-x-16 top-full mt-8 max-h-[60svh] overflow-auto rounded-3xl border border-border-default-soft bg-surface-card-default p-16 shadow-l"
                >
                  <div className="mb-16 flex flex-col gap-4">
                    <Typography textStyle="label-md-semibold" color="brand">
                      Next steps
                    </Typography>
                    <Typography textStyle="heading-md" as="h2">
                      Here's what happens after this
                    </Typography>
                  </div>
                  <StepsTimeline stage={car.stage} allDone={car.allDone} />
                </div>
              )}
            </div>
          </>
        )}
      </header>

      <Drawer
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        side="bottom"
        title="Need a hand?"
        description={requested ? "Done. We'll call you shortly." : "We can call you back, usually within a few minutes."}
        footer={
          <Button size="lg" fullWidth disabled={requested} onClick={() => setRequested(true)}>
            {requested ? "Call-back requested" : "Request a call-back"}
          </Button>
        }
      >
        <div className="pb-8">
          <Typography textStyle="body-md-regular" color="secondary">
            You can also keep going here. Your concierge will see everything you've done so far.
          </Typography>
        </div>
      </Drawer>
    </>
  );
}
