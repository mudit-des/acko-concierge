import type { Car } from "@acko/icons";

/** Any icon exported by @acko/icons. */
export type IconType = typeof Car;

/*
 * iconography.md: standalone icons must be sized by a wrapper
 * (size-16 small, size-24 normal, size-32 large). Never set width/height.
 */
const SIZE = {
  16: "size-16",
  24: "size-24",
  32: "size-32",
} as const;

export function Icon({ icon: Glyph, size = 24 }: { icon: IconType; size?: keyof typeof SIZE }) {
  return (
    <span className={`inline-flex shrink-0 ${SIZE[size]} [&_svg]:size-full`} aria-hidden="true">
      <Glyph aria-hidden="true" />
    </span>
  );
}
