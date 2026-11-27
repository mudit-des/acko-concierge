import { Typography } from "@acko/typography";
import type { GridItem } from "../data/context";

/*
 * Every service as a 3D icon on a pale sage circle, with its label underneath. No cards or borders.
 * Emergency is a soft pink circle with a red label. Used on the home screen and in the menu sheet,
 * so the two always look the same. Tap feedback is a gentle scale; hover only on devices with a mouse;
 * reduced motion turns the movement off.
 */
export function ServiceGrid({
  items,
  picked,
  onPick,
}: {
  items: GridItem[];
  /** The item to show as selected, if any. */
  picked?: string | null;
  onPick: (item: GridItem) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-20">
      {items.map((i) => {
        const urgent = i.id === "emergency";
        const selected = picked === i.id;
        return (
          <button
            key={i.id}
            type="button"
            aria-pressed={picked === undefined ? undefined : selected}
            onClick={() => onPick(i)}
            className="group flex min-h-[44px] flex-col items-center gap-10 rounded-3xl text-center outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-selection-default"
          >
            <span
              className={`grid size-[84px] place-items-center rounded-full transition-[transform,background-color,box-shadow] duration-200 ease-out group-active:scale-[0.96] motion-reduce:transition-none motion-reduce:group-active:scale-100 ${
                urgent
                  ? "[@media(hover:hover)]:group-hover:bg-[color-mix(in_srgb,var(--textStatusError)_16%,white)]"
                  : "[@media(hover:hover)]:group-hover:bg-[var(--brandPrimary150)]"
              }`}
              style={{
                backgroundColor: urgent
                  ? `color-mix(in srgb, var(--textStatusError) ${selected ? 18 : 10}%, white)`
                  : "var(--brandPrimary100)",
                boxShadow:
                  selected && !urgent
                    ? "0 0 0 3px var(--surfacePagePrimary), 0 0 0 5px var(--brandPrimary600)"
                    : "none",
              }}
            >
              <img
                src={i.image}
                alt=""
                decoding="async"
                style={{
                  width: Math.round(60 * (i.fit ?? 1)),
                  height: Math.round(60 * (i.fit ?? 1)),
                }}
                className="pointer-events-none max-w-none object-contain transition-transform duration-200 ease-out [@media(hover:hover)]:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </span>
            <Typography
              textStyle="label-md-medium"
              as="span"
              align="center"
              className="px-2 leading-[18px] tracking-[-0.005em]"
              style={{ color: urgent ? "var(--textStatusError)" : undefined }}
            >
              {i.label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}
