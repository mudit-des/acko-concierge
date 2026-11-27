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
          <div
            className="flex items-center justify-between gap-12 rounded-2xl px-16 py-12"
            style={{ backgroundColor: "var(--brandPrimary100)" }}
          >
            <Typography textStyle="label-md-medium" color="secondary">
              Arrives
            </Typography>
            <Typography textStyle="label-md-semibold">
              {DELIVERY_DATE}
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            <Typography
              textStyle="label-sm-semibold"
              color="secondary"
              className="px-4"
            >
              Car numbers
            </Typography>
            <dl className="flex flex-col divide-y divide-border-default-soft rounded-2xl border border-border-default-soft">
              {CAR_NUMBERS.map((r) => (
                <div key={r.label} className="flex flex-col gap-2 px-16 py-12">
                  <Typography
                    textStyle="helper-sm-regular"
                    color="secondary"
                    as="dt"
                  >
                    {r.label}
                  </Typography>
                  <Typography
                    textStyle="body-md-medium"
                    as="dd"
                    className="tracking-wide"
                  >
                    {r.value}
                  </Typography>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-4">
            <Typography
              textStyle="label-sm-semibold"
              color="secondary"
              className="px-4"
            >
              Balance
            </Typography>
            <dl className="flex flex-col gap-8 rounded-2xl border border-border-default-soft px-16 py-12">
              {CAR_PRICING.filter((r) => !r.strong).map((r) => (
                <Row key={r.label} label={r.label} value={r.value} />
              ))}
              {CAR_PRICING.filter((r) => r.strong).map((r) => (
                <div
                  key={r.label}
                  className="-mx-16 -mb-12 mt-4 flex items-center justify-between gap-12 rounded-b-2xl px-16 py-12"
                  style={{ backgroundColor: "var(--brandPrimary100)" }}
                >
                  <Typography textStyle="label-md-semibold" as="dt">
                    {r.label}
                  </Typography>
                  <Typography textStyle="heading-md" as="dd">
                    {r.value}
                  </Typography>
                </div>
              ))}
            </dl>
          </div>
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
