import { Bank, CalendarDays, Coverage, PolicyDocument, PriceTag, SellCarBike1, Tools, Towing } from "@acko/icons";
import type { IconType } from "../components/Icon";

export type ServiceId =
  | "buy"
  | "sell"
  | "repair"
  | "maintain"
  | "insurance"
  | "paperwork"
  | "finance"
  | "roadside";

export interface Service {
  id: ServiceId;
  title: string;
  body: string;
  icon: IconType;
}

/** Copy and details here are placeholders until the real service list is confirmed. */
export const SERVICES: Record<ServiceId, Service> = {
  buy: { id: "buy", title: "Buy", body: "Expert advice and a price you can trust.", icon: PriceTag },
  sell: { id: "sell", title: "Sell and exchange", body: "A fair valuation and a verified buyer.", icon: SellCarBike1 },
  repair: { id: "repair", title: "Repair and service", body: "Only the work you need, explained and tracked.", icon: Tools },
  maintain: { id: "maintain", title: "Maintain", body: "Services, renewals and challans, tracked for you.", icon: CalendarDays },
  insurance: { id: "insurance", title: "Insure, claim and manage", body: "Renewals and claims in one place.", icon: Coverage },
  paperwork: { id: "paperwork", title: "Challans and paperwork", body: "RC, PUC and challan clearance.", icon: PolicyDocument },
  finance: { id: "finance", title: "Car finance", body: "Compare loans and track approval.", icon: Bank },
  roadside: { id: "roadside", title: "Roadside help", body: "Warning light or breakdown, we step in.", icon: Towing },
};

/**
 * Intro carousel, after the story slide. Pain to promise: each slide opens with a
 * customer's own words (from research), then the concierge's answer.
 * The last slide is the lifecycle overview and has no chat pair.
 * All copy is a placeholder until the business confirms the promises.
 */
export interface Slide {
  id: string;
  theme: string;
  heading: string;
  user?: string;
  reply?: string;
  lifecycle?: { label: string; icon: IconType }[];
  cta?: string;
  image: string;
  imageAlt: string;
}

export const SLIDES: Slide[] = [
  {
    id: "chasing",
    theme: "No chasing",
    heading: "Stop chasing. We'll do it.",
    user: "I chase the dealer, the bank and the garage, and hear about delays late.",
    reply: "We do the chasing. You get one thread with every update.",
    image: "/illustrations/scene-chasing.webp",
    imageAlt: "A concierge with a clipboard beside a car. One glowing thread links a showroom, a bank and a garage, with a ticked document travelling along it.",
  },
  {
    id: "fair",
    theme: "Clear and fair",
    heading: "Know it's needed. Know it's fair.",
    user: "A free service suddenly cost ₹10k. Was any of it needed?",
    reply: "We explain every line before you approve, and compare quotes for you.",
    cta: "Check what your car is worth",
    image: "/illustrations/scene-fair.webp",
    imageAlt: "A floating checklist with ticks and a magnifying glass, a price tag and a level scale beside a garage, above a parked car.",
  },
  {
    id: "peace",
    theme: "Peace of mind",
    heading: "Nothing sneaks up on you.",
    user: "A warning light just ruined my weekend.",
    reply: "We track what's due. For anything else, message us and we step in.",
    image: "/illustrations/scene-peace.webp",
    imageAlt: "A car at dusk with a floating calendar of ticked reminders, a switched-off warning light and a chat bubble with a tick.",
  },
  {
    id: "lifecycle",
    theme: "Every stage",
    heading: "From your first car to your next.",
    lifecycle: [
      { label: "Buy, sell and exchange", icon: PriceTag },
      { label: "Insure, claim and manage", icon: Coverage },
      { label: "Repair and service", icon: Tools },
    ],
    cta: "Check what your car is worth",
    image: "/illustrations/scene-lifecycle.webp",
    imageAlt: "A winding road past a showroom, the car under a shield and a garage, with a newer car waiting further along.",
  },
];
