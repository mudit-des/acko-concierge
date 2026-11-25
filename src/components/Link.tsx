import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { navigate, withBase } from "../router";

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

/** Client-side link. Modified clicks (new tab, etc.) fall through to the browser. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };
  return (
    <a href={withBase(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
