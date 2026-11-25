import { useEffect, useState } from "react";

/*
 * Tiny History-API router for a handful of pages (see App.tsx for the list).
 * Swap for react-router if the app grows nested routes or data loading.
 * Production hosting needs a rewrite of unknown paths to index.html.
 */

export function navigate(to: string, options?: { replace?: boolean }) {
  if (options?.replace) window.history.replaceState(null, "", to);
  else window.history.pushState(null, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/** Current path and query string; re-renders when either changes. */
export function useLocation() {
  const [loc, setLoc] = useState(() => ({ path: window.location.pathname, search: window.location.search }));
  useEffect(() => {
    const onChange = () => {
      setLoc({ path: window.location.pathname, search: window.location.search });
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return loc;
}
