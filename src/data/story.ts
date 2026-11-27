/**
 * Home carousel copy, adapted from Otto deck.
 * All of it is placeholder until the business confirms the promises and the partner list.
 */

/** Everything a car owner deals with. Scattered on slide 1, gathered on slide 2. */
export const PILLS: { label: string; /** drift offsets in px, and duration in seconds */ dx: number; dy: number; dur: number; at: { left: string; top: number } }[] = [
  { label: "Dealer", dx: 8, dy: -6, dur: 7, at: { left: "2%", top: 0 } },
  { label: "Insurer", dx: -10, dy: 6, dur: 8, at: { left: "52%", top: 8 } },
  { label: "Roadside help", dx: 6, dy: 8, dur: 6.5, at: { left: "12%", top: 56 } },
  { label: "FASTag", dx: -8, dy: -8, dur: 7.5, at: { left: "68%", top: 62 } },
  { label: "Garage", dx: 10, dy: 6, dur: 8.5, at: { left: "0%", top: 112 } },
  { label: "Resale site", dx: -6, dy: 8, dur: 6.8, at: { left: "46%", top: 118 } },
  { label: "Body shop", dx: 8, dy: -6, dur: 7.2, at: { left: "30%", top: 170 } },
  { label: "Pick-up and drop", dx: -8, dy: -4, dur: 8, at: { left: "4%", top: 224 } },
];

/**
 * The four things a customer can hand to Otto: a question the customer is asking themselves,
 * then Otto's promise. Copy comes from the business and is final unless noted.
 */
export interface UseCase {
  id: string;
  /** The question, shown small above the promise. Optional: a card can be just a promise. */
  topic?: string;
  /** The promise, shown large. */
  heading: string;
  image: string;
  imageAlt: string;
  /** CSS object-position for the full-screen picture, to keep the subject in view. */
  focus?: string;
}

export const USE_CASES: UseCase[] = [
  {
    id: "buying",
    topic: "Buying a car?",
    heading: "Leave the research and negotiations to us!",
    image: "/illustrations/scene-buying.webp",
    imageAlt: "In front of a glass showroom Otto shakes hands with a smiling dealer holding a ticked clipboard, under a floating ticked price tag, while the customer relaxes on a bench with a cup of tea beside a new car with a ribbon bow.",
  },
  {
    id: "servicing",
    topic: "Need it serviced?",
    heading: "Free pick up and drop, your personal valet",
    image: "/illustrations/scene-servicing.webp",
    imageAlt: "Otto holds out a car key beside a sage hatchback. A glowing dotted route loops from a house, where the customer waves with a cup, to a garage and back.",
  },
  {
    id: "trouble",
    topic: "Something goes wrong?",
    heading: "Roadside assistance when you want it",
    image: "/illustrations/scene-roadside.webp",
    imageAlt: "At dusk Otto waves beside a sage hatchback that has pulled over with its hazard lights on, holding up a phone with a ticked chat bubble while a tow truck arrives.",
  },
  {
    id: "selling",
    topic: "Looking to sell or exchange?",
    heading: "We've got you covered!",
    image: "/illustrations/scene-sellexchange.webp",
    imageAlt: "Under a soft protective shield, an older car and a newer sage car with a ribbon bow, joined by a swap arrow, while Otto shakes hands with a buyer and holds a ticked document.",
  },
];
