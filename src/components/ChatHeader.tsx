import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Close } from "@acko/icons";
import { Button } from "@acko/button";
import { Typography } from "@acko/typography";
import { STAGES } from "../data/booking";
import type { MascotMood } from "./Mascot";
import { OttoHeader } from "./OttoHeader";
import { StepsTimeline } from "./StepsTimeline";

/**
 * Header for the car purchase pages: the Otto bar (back, mascot, "Otto by ACKO Drive") on every screen, so the
 * brand stays put. Once the car is booked, a flat row sits under it between two hairlines: the car's round
 * photo, its name and the booking status. Tapping the row opens the full next-steps list.
 */

type Car = {
  name: string;
  image: string;
  status: string;
  busy: boolean;
  stage: number;
  allDone: boolean;
};

export function ChatHeader({
  mood,
  talking = false,
  car,
  onBack,
  onSelectStage,
}: {
  mood: MascotMood;
  talking?: boolean;
  /** The booking's status, once the car is booked. `busy` makes the dot orange (in progress) instead of green (done). */
  car?: Car;
  onBack: () => void;
  /** Called with a step index when a finished or current step in the open panel is tapped. */
  onSelectStage?: (stage: number) => void;
}) {
  const [stepsOpen, setStepsOpen] = useState(false);

  // Close the steps panel when the booking moves on, or on Escape.
  useEffect(() => setStepsOpen(false), [car?.status]);
  useEffect(() => {
    if (!stepsOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setStepsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepsOpen]);

  const header =
    "sticky top-0 bg-surface-page-primary/95 px-16 pt-[max(8px,env(safe-area-inset-top))] pb-8 backdrop-blur-md";

  if (!car) {
    return (
      <header className={header} style={{ zIndex: "var(--zSticky)" }}>
        <OttoHeader mood={mood} talking={talking} onBack={onBack} />
      </header>
    );
  }

  const total = STAGES.length;
  const stepNo = Math.min(car.stage + 1, total);

  return (
    <>
      {stepsOpen && (
        <div
          className="fixed inset-0 bg-text-primary/10"
          onClick={() => setStepsOpen(false)}
          aria-hidden="true"
        />
      )}
      <header className={header} style={{ zIndex: "var(--zSticky)" }}>
        <OttoHeader mood={mood} talking={talking} onBack={onBack} />

        <button
          type="button"
          onClick={() => setStepsOpen((o) => !o)}
          aria-expanded={stepsOpen}
          aria-controls="booking-steps"
          aria-label={`${car.name}, ${car.status}. ${stepsOpen ? "Hide" : "Show"} all steps`}
          className="mt-4 flex min-h-56 w-full items-center gap-12 border-y border-border-default-soft py-8 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-selection-default"
        >
          <img
            src={car.image}
            alt=""
            className="size-40 shrink-0 rounded-full bg-surface-page-secondary object-contain p-2"
          />
          <span className="flex min-w-0 flex-1 flex-col" aria-live="polite">
            <Typography textStyle="label-md-semibold" truncate>
              {car.name}
            </Typography>
            <span className="flex items-center gap-6">
              <Typography
                textStyle="helper-sm-regular"
                color="secondary"
                truncate
              >
                {car.status}
              </Typography>
              <span
                className={`size-8 shrink-0 rounded-full ${car.busy ? "bg-surface-status-warning" : "bg-surface-status-success"}`}
                aria-hidden="true"
              />
            </span>
          </span>
          <span
            className="shrink-0 text-text-secondary [&_svg]:size-20"
            aria-hidden="true"
          >
            {stepsOpen ? <ChevronUp /> : <ChevronDown />}
          </span>
        </button>

        {stepsOpen && (
          <div
            id="booking-steps"
            role="dialog"
            aria-label="Your booking steps"
            className="reveal-up absolute inset-x-12 top-full mt-4 max-h-[70svh] overflow-auto rounded-3xl border border-border-default-soft bg-surface-card-default p-8 shadow-l"
          >
            <div className="flex items-center justify-between gap-8 px-12 pt-8 pb-4">
              <Typography textStyle="label-lg-semibold" as="h2">
                Your booking
              </Typography>
              <span className="flex items-center gap-4">
                <Typography textStyle="helper-sm-regular" color="secondary">
                  Step {stepNo} of {total}
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  iconOnly
                  iconLeft={<Close aria-hidden="true" />}
                  aria-label="Close"
                  onClick={() => setStepsOpen(false)}
                >
                  Close
                </Button>
              </span>
            </div>
            <StepsTimeline
              compact
              stage={car.stage}
              allDone={car.allDone}
              onSelect={
                onSelectStage &&
                ((i) => {
                  setStepsOpen(false);
                  onSelectStage(i);
                })
              }
            />
          </div>
        )}
      </header>
    </>
  );
}
