/**
 * Public files (images, logos) live under the app's base path. In dev the base is "/", on GitHub Pages
 * it is "/acko-concierge/". Always build asset URLs with this helper, never a bare "/illustrations/...".
 */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, "");
