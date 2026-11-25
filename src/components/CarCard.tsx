import { Typography } from "@acko/typography";
import { CAR, CAR_NUMBERS, CAR_PRICING, DELIVERY_DATE } from "../data/booking";

/**
 * The car in a chat card: hero image, name and delivery date. With `details` it also lists the
 * engine and chassis numbers and the price breakdown, shown once the dealer has assigned the car.
 */
export function CarCard({ details = false }: { details?: boolean }) {
  return (
    <div className="w-full rounded-5xl border border-border-default-soft bg-surface-card-default p-12">
      <img src={CAR.image} alt={`${CAR.name}, ${CAR.model}`} width={CAR.imageRatio.width} height={CAR.imageRatio.height} className="aspect-3/2 w-full rounded-2xl object-cover" />
      <div className="flex flex-col gap-12 p-8 pt-16">
        <div className="flex flex-col">
          <Typography textStyle="label-lg-semibold">{CAR.name}</Typography>
          <Typography textStyle="body-md-regular" color="secondary">
            {CAR.model}
          </Typography>
        </div>
        <span className="inline-flex items-center gap-8">
          <span className="size-8 rounded-full bg-surface-status-warning" aria-hidden="true" />
          <Typography textStyle="body-md-medium">Arrives {DELIVERY_DATE}</Typography>
        </span>

        {details && (
          <>
            <dl className="flex flex-col gap-8 border-t border-border-default-soft pt-12">
              {CAR_NUMBERS.map((r) => (
                <Row key={r.label} label={r.label} value={r.value} />
              ))}
            </dl>
            <dl className="flex flex-col gap-8 border-t border-border-default-soft pt-12">
              {CAR_PRICING.map((r) => (
                <Row key={r.label} label={r.label} value={r.value} strong={r.strong} />
              ))}
            </dl>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-12">
      <Typography textStyle={strong ? "body-md-semibold" : "body-md-regular"} color={strong ? undefined : "secondary"} as="dt">
        {label}
      </Typography>
      <Typography textStyle={strong ? "body-md-semibold" : "body-md-medium"} as="dd">
        {value}
      </Typography>
    </div>
  );
}
