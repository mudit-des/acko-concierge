import { Typography } from "@acko/typography";
import type { PayOption } from "../data/booking";

/**
 * One way to pay, as a card you can select. Selecting is not paying: the confirm button does that.
 * A radio, a title, one line, and the two numbers to compare. Quiet border when off, sage when on.
 */
export function PayOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: PayOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="flex w-full flex-col gap-12 rounded-3xl border p-16 text-left outline-none transition-[background-color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-selection-default motion-reduce:transition-none"
      style={{
        borderColor: selected
          ? "var(--brandPrimary600)"
          : "var(--borderDefaultSoft)",
        backgroundColor: selected
          ? "var(--brandPrimary50)"
          : "var(--surfaceCardDefault)",
      }}
    >
      <span className="flex items-start gap-12">
        <span className="flex min-w-0 flex-1 flex-col gap-4">
          <Typography textStyle="label-lg-semibold">{option.title}</Typography>
          <Typography textStyle="body-md-regular" color="secondary">
            {option.pitch}
          </Typography>
        </span>
        <span
          className="mt-2 grid size-24 shrink-0 place-items-center rounded-full border-2"
          style={{
            borderColor: selected
              ? "var(--brandPrimary600)"
              : "var(--borderDefaultMedium)",
          }}
          aria-hidden="true"
        >
          {selected && (
            <span
              className="size-12 rounded-full"
              style={{ backgroundColor: "var(--brandPrimary600)" }}
            />
          )}
        </span>
      </span>
      <span className="flex gap-16 border-t border-border-default-soft pt-12">
        {option.stats.map((st) => (
          <span key={st.label} className="flex min-w-0 flex-1 flex-col">
            <Typography textStyle="label-md-semibold">{st.value}</Typography>
            <Typography textStyle="helper-sm-regular" color="secondary">
              {st.label}
            </Typography>
          </span>
        ))}
      </span>
    </button>
  );
}
