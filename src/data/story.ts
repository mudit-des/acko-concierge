/**
 * Home carousel copy, adapted from the concierge deck.
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
 * The four things a customer can hand to the concierge, each opening with a customer's own words.
 * The first three quotes come from the research notes. The fourth is a placeholder to replace with a
 * real quote. All replies are placeholders until the business confirms the promises.
 */
export interface UseCase {
  id: string;
  /** What the customer is doing. */
  topic: string;
  heading: string;
  user: string;
  reply: string;
  image: string;
  imageAlt: string;
}

export const USE_CASES: UseCase[] = [
  {
    id: "buying",
    topic: "Buying a car",
    heading: "Stop chasing. We'll do it.",
    user: "I chase the dealer, the bank and the garage, and hear about delays late.",
    reply: "We do the chasing. You get one thread with every update.",
    image: "/illustrations/scene-chasing.webp",
    imageAlt: "A concierge with a clipboard beside a car. One glowing thread links a showroom, a bank and a garage, with a ticked document travelling along it.",
  },
  {
    id: "servicing",
    topic: "Servicing your car",
    heading: "Know it's needed. Know it's fair.",
    user: "A free service suddenly cost ₹10k. Was any of it needed?",
    reply: "We explain every line before you approve, and compare quotes for you.",
    image: "/illustrations/scene-fair.webp",
    imageAlt: "A floating checklist with ticks and a magnifying glass, a price tag and a level scale beside a garage, above a parked car.",
  },
  {
    id: "trouble",
    topic: "When something goes wrong",
    heading: "Stuck? We step in.",
    user: "A warning light just ruined my weekend.",
    reply: "Message us and we step in. We also track what's due, so little catches you out.",
    image: "/illustrations/scene-peace.webp",
    imageAlt: "A car at dusk with a floating calendar of ticked reminders, a switched-off warning light and a chat bubble with a tick.",
  },
  {
    id: "selling",
    topic: "Selling or upgrading",
    heading: "Sell without the haggling.",
    user: "Selling means strangers, lowball offers and endless back and forth.",
    reply: "A fair valuation, a verified buyer, and the paperwork handled.",
    image: "/illustrations/scene-lifecycle.webp",
    imageAlt: "A winding road past a showroom, the car under a shield and a garage, with a newer car waiting further along.",
  },
];
