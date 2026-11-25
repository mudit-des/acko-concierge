import { useEffect } from "react";
import BuyCar from "./pages/BuyCar";
import Documents from "./pages/Documents";
import Home from "./pages/Home";
import States from "./pages/States";
import StyleGuide from "./pages/StyleGuide";
import { DOCUMENTS_PATH, START_PATH, STEPS } from "./data/booking";
import { navigate, useLocation } from "./router";

/*
 * Routes
 *   /home                      landing page
 *   /buy-car                   redirects to /buy-car/received
 *   /buy-car/received ...      one page per state of the car purchase (see STEPS in data/booking.ts)
 *   /buy-car/documents         upload the documents
 *   /states                    reviewer index of every screen (temporary)
 *   /style-guide               temporary style guide
 * Old /booking addresses redirect to the matching /buy-car address.
 */
export default function App() {
  const { path, search } = useLocation();
  const stepIndex = STEPS.findIndex((s) => s.path === path);

  const redirect =
    path === "/buy-car" || path === "/booking" || path === "/booking/received"
      ? START_PATH
      : path === "/booking/documents"
        ? DOCUMENTS_PATH
        : path.startsWith("/booking/")
          ? path.replace("/booking/", "/buy-car/")
          : null;
  const known = path === "/home" || path === "/states" || path === "/style-guide" || path === DOCUMENTS_PATH || stepIndex >= 0;

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
    else if (!known) navigate("/home", { replace: true });
  }, [redirect, known]);

  if (redirect) return null;
  if (stepIndex >= 0) return <BuyCar key={path} step={stepIndex} search={search} />;
  if (path === DOCUMENTS_PATH) return <Documents />;
  if (path === "/states") return <States />;
  if (path === "/style-guide") return <StyleGuide />;
  return <Home />;
}
