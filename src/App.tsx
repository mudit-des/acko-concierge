import { useEffect } from "react";
import BuyCar from "./pages/BuyCar";
import Documents from "./pages/Documents";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Onboarding from "./pages/Onboarding";
import States from "./pages/States";
import StyleGuide from "./pages/StyleGuide";
import { DOCUMENTS_PATH, START_PATH, STEPS } from "./data/booking";
import { navigate, useLocation } from "./router";

/*
 * Routes
 *   /welcome                   app-opening animation (the root address opens it)
 *   /story                     the four use-case cards, full screen
 *   /home                      the services (bento)
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
    path === "/"
      ? "/welcome"
      : path === "/buy-car" || path === "/booking" || path === "/booking/received"
      ? START_PATH
      : path === "/booking/documents"
        ? DOCUMENTS_PATH
        : path.startsWith("/booking/")
          ? path.replace("/booking/", "/buy-car/")
          : null;
  const known = path === "/welcome" || path === "/story" || path === "/home" || path === "/states" || path === "/style-guide" || path === DOCUMENTS_PATH || stepIndex >= 0;

  useEffect(() => {
    if (redirect) navigate(redirect, { replace: true });
    else if (!known) navigate("/home", { replace: true });
  }, [redirect, known]);

  if (redirect) return null;
  if (stepIndex >= 0) return <BuyCar key={path} step={stepIndex} search={search} />;
  if (path === DOCUMENTS_PATH) return <Documents />;
  if (path === "/welcome") return <Onboarding />;
  if (path === "/story") return <Story />;
  if (path === "/states") return <States />;
  if (path === "/style-guide") return <StyleGuide />;
  return <Home />;
}
