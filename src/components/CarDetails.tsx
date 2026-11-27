import { useState } from "react";
import { ChevronDown, ChevronUp } from "@acko/icons";
import { Typography } from "@acko/typography";
import { CAR_NUMBERS, CAR_PRICING, DELIVERY_DATE } from "../data/booking";

/**
 * The car's details, collapsed: one row that opens to the arrival date, engine and chassis numbers and how the
 * balance adds up. No photo; the car is already in the header.
 */
export function CarDetails() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full rounded-3xl border border-border-default-soft bg-surface-card-default px-16">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="car-details"
        className="flex min-h-56 w-full items-center justify-between gap-12 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-selection-default"
      >
        <span className="flex flex-col">
          <Typography textStyle="label-md-semibold">Car details</Typography>
          <Typography textStyle="helper-sm-regular" color="secondary">
            Engine and chassis numbers, and how the balance adds up
          </Typography>
        </span>
        <span
          className="shrink-0 text-text-secondary [&_svg]:size-20"
          aria-hidden="true"
        >
          {open ? <ChevronUp /> : <ChevronDown />}
        </span>
      </button>
      {open && (
        <div id="car-details" className="reveal-up flex flex-col gap-12 pb-16">
          <dl className="flex flex-col gap-8 border-t border-border-default-soft pt-12">
            <Row label="Arrives" value={DELIVERY_DATE} />
            {CAR_NUMBERS.map((r) => (
              <Row key={r.label} label={r.label} value={r.value} />
            ))}
          </dl>
          <dl className="flex flex-col gap-8 border-t border-border-default-soft pt-12">
            {CAR_PRICING.map((r) => (
              <Row
                key={r.label}
                label={r.label}
                value={r.value}
                strong={r.strong}
              />
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-12">
      <Typography
        textStyle={strong ? "body-md-semibold" : "body-md-regular"}
        color={strong ? undefined : "secondary"}
        as="dt"
      >
        {label}
      </Typography>
      <Typography
        textStyle={strong ? "body-md-semibold" : "body-md-medium"}
        as="dd"
      >
        {value}
      </Typography>
    </div>
  );
}
