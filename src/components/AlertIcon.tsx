/*
 * Filled alert icon in warning orange. @acko/icons only ships outlined glyphs, so this is a
 * small custom one (a filled disc with an exclamation mark). Sized like a standard 20px icon.
 * Raise it with the icon library owners if a filled alert is added there.
 */
export function AlertIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-20 shrink-0" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="10" style={{ fill: "var(--surfaceStatusWarning)" }} />
      <rect x="8.9" y="4.6" width="2.2" height="7.2" rx="1.1" fill="#fff" />
      <circle cx="10" cy="14.6" r="1.35" fill="#fff" />
    </svg>
  );
}
