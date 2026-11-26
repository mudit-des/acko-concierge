import { useEffect, useState } from "react";

/*
 * Tiny History-API router for a handful of pages (see App.tsx for the list).
 * Swap for react-router if the app grows nested routes or data loading.
 * The app can live under a base path (GitHub Pages: /acko-concierge). App code only ever uses
 * paths without the base, for example "/chat"; this file adds and strips it.
 * Hosting needs a fallback that serves index.html for unknown paths (the deploy script adds 404.html).
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an app path with the base path, for hrefs and history entries. */
export const withBase = (to: string) => BASE + to;

function currentPath() {
  const p = window.location.pathname;
  return BASE && p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p;
}

export function navigate(to: string, options?: { replace?: boolean }) {
  if (options?.replace) window.history.replaceState(null, "", withBase(to));
  else window.history.pushState(null, "", withBase(to));
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/** Current path (without the base) and query string; re-renders when either changes. */
export function useLocation() {
  const [loc, setLoc] = useState(() => ({ path: currentPath(), search: window.location.search }));
  useEffect(() => {
    const onChange = () => {
      setLoc({ path: currentPath(), search: window.location.search });
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return loc;
}
