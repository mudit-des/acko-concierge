import { asset } from "../asset";
import type { IconType } from "../components/Icon";
import { GLOVE_BOX } from "./home";

/**
 * Scripted answers for the assisted chat. This is a prototype of the conversation, not a real
 * model: a tap on a suggestion, or a keyword in free text, picks the reply. Every line is placeholder
 * copy until the business and legal have confirmed what the concierge may promise.
 */

export interface Chip {
  label: string;
  /** Which scripted answer a tap brings. */
  intent?: IntentId;
  /** Or a page to open (closes the chat). */
  to?: string;
}

export type IntentId =
  | "buy"
  | "sell"
  | "exchange"
  | "insurance"
  | "claim"
  | "challans"
  | "fastag"
  | "puc"
  | "service"
  | "emergency"
  | "glovebox"
  | "cars"
  | "allservices"
  | "human"
  | "fallback";

interface Intent {
  answer: string;
  chips: Chip[];
  /** Words in a typed message that point here. */
  keywords?: string[];
}

export const GREETING =
  "Hi, I'm Otto, your car companion. Ask me anything about your car, and we'll get back to you here.";

/** What the customer is taken to have said when they start from a tile instead of typing. */
export const ASK_TEXT: Record<IntentId, string> = {
  buy: "I want to buy a car",
  sell: "I'd like to sell my car",
  exchange: "I'd like to exchange my car",
  insurance: "I need help with car insurance",
  claim: "My car broke down",
  challans: "Check my challans",
  fastag: "Recharge my FASTag",
  puc: "Check my PUC validity",
  service: "I need to book a service",
  emergency: "I need help right now",
  glovebox: "Show me my glove box",
  cars: "I need help with a car",
  allservices: "Show me all services",
  human: "I'd like to talk to a person",
  fallback: "I need some help",
};

/** The first suggestions in the chat. */
export const HERO_CHIPS: Chip[] = [
  { label: "Buy a car", intent: "buy" },
  { label: "Renew my insurance", intent: "insurance" },
  { label: "My car broke down", intent: "claim" },
  { label: "Check challans", intent: "challans" },
];

/** The pills posted right after the welcome. */
export interface QuickAction {
  label: string;
  intent: IntentId;
  urgent?: boolean;
}
export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Emergency", intent: "emergency", urgent: true },
  { label: "Service or repair", intent: "service" },
  { label: "Raise a claim", intent: "claim" },
  { label: "Glove box", intent: "glovebox" },
];

/** The pill that opens the full list; shown where the browse grid is not. */
export const VIEW_ALL_ACTION: QuickAction = {
  label: "View all services",
  intent: "allservices",
};

/** Everything the concierge does. A picture where one exists, otherwise an icon. */
export interface ServiceRow {
  title: string;
  note: string;
  intent: IntentId;
  image?: string;
  icon?: IconType;
}
/** The 3D icon for Emergency, which is not a service row of its own. */
export const EMERGENCY_ICON = asset("/icons/emergency.webp");

export const SERVICES: ServiceRow[] = [
  {
    title: "Buy a car",
    note: "Advice, a fair price, and we chase the rest",
    intent: "buy",
    image: asset("/icons/buy.webp"),
  },
  {
    title: "Sell your car",
    note: "A fair price and a verified buyer",
    intent: "sell",
    image: asset("/icons/sell.webp"),
  },
  {
    title: "Exchange",
    note: "Trade in your old car for a new one",
    intent: "exchange",
    image: asset("/icons/exchange.webp"),
  },
  {
    title: "Car insurance",
    note: "Buy or renew in under a minute",
    intent: "insurance",
    image: asset("/icons/insurance.webp"),
  },
  {
    title: "Service and repair",
    note: "Free pick up and drop",
    intent: "service",
    image: asset("/icons/service.webp"),
  },
  {
    title: "Roadside help",
    note: "Towing, battery and tyre, any time",
    intent: "emergency",
    image: asset("/icons/roadside.webp"),
  },
  {
    title: "Claims",
    note: "Raise one and we follow it through",
    intent: "claim",
    image: asset("/icons/claims.webp"),
  },
  {
    title: "Glove box",
    note: "Challans, FASTag and PUC in one place",
    intent: "glovebox",
    image: asset("/icons/glovebox.webp"),
  },
];

export const NOTE = "AI-assisted. A person can step in any time.";

export const START_CHIPS: Chip[] = [
  { label: "Buy a car", intent: "buy" },
  { label: "Sell my car", intent: "sell" },
  { label: "Exchange", intent: "exchange" },
  { label: "Car insurance", intent: "insurance" },
  { label: "Make a claim", intent: "claim" },
  { label: "Check challans", intent: "challans" },
  { label: "Recharge FASTag", intent: "fastag" },
  { label: "PUC validity", intent: "puc" },
];

const PERSON: Chip = { label: "Talk to a person", intent: "human" };
const MORE: Chip = { label: "Something else", intent: "fallback" };

export const INTENTS: Record<IntentId, Intent> = {
  buy: {
    keywords: ["buy", "purchase", "new car", "booking", "book"],
    answer:
      "Happy to help you buy. Tell me the car you have in mind, or open your purchase to see where things stand. I'll chase the dealer and the bank so you don't have to.",
    chips: [{ label: "Open my purchase", to: "/buy-car/received" }, PERSON],
  },
  sell: {
    keywords: ["sell", "valuation", "resale", "worth"],
    answer:
      "To value your car I need its make, model, year and kilometres driven. Share those and I'll get you a fair price from verified buyers.",
    chips: [{ label: "Value my car", intent: "fallback" }, PERSON],
  },
  exchange: {
    keywords: ["exchange", "trade", "swap", "upgrade"],
    answer:
      "Trading in is simple: we value your current car, and the amount comes off your new one. Which car are you looking to move to?",
    chips: [{ label: "Start an exchange", intent: "fallback" }, PERSON],
  },
  insurance: {
    keywords: ["insurance", "policy", "renew", "premium", "cover"],
    answer:
      "I can help you buy or renew car insurance. Do you have your registration number handy? I'll show you plans in under a minute.",
    chips: [
      { label: "Buy or renew", intent: "fallback" },
      { label: "Make a claim", intent: "claim" },
      PERSON,
    ],
  },
  claim: {
    keywords: ["claim", "accident", "damage", "crash", "breakdown", "tow"],
    answer:
      "I'm sorry that happened. First, is everyone safe? If you need help on the road right now, I can arrange towing. Otherwise I'll start your claim and guide you through each step.",
    chips: [
      { label: "Start a claim", intent: "fallback" },
      { label: "I need towing", intent: "human" },
      PERSON,
    ],
  },
  challans: {
    keywords: ["challan", "fine", "traffic"],
    answer:
      "Send me your vehicle registration number and I'll check for pending challans.",
    chips: [{ label: "Check challans", intent: "fallback" }, MORE],
  },
  fastag: {
    keywords: ["fastag", "toll", "recharge"],
    answer:
      "I can recharge your FASTag. Which vehicle is it for, and how much would you like to add?",
    chips: [{ label: "Recharge FASTag", intent: "fallback" }, MORE],
  },
  puc: {
    keywords: ["puc", "pollution", "emission"],
    answer:
      "Share your registration number and I'll tell you when your PUC expires and remind you before it does.",
    chips: [{ label: "See PUC validity", intent: "fallback" }, MORE],
  },
  service: {
    keywords: ["service", "servicing", "repair", "garage"],
    answer:
      "I can book your service with free pick up and drop. Tell me the day that suits you, and I'll arrange a valet to collect the car.",
    chips: [{ label: "Book a service", intent: "fallback" }, PERSON],
  },
  emergency: {
    keywords: [
      "emergency",
      "stuck",
      "breakdown",
      "broke down",
      "tow",
      "tyre",
      "battery",
      "help now",
    ],
    answer:
      "I'm here. First, is everyone safe? If you need help on the road right now, I can arrange towing, a jump-start or a tyre change straight away.",
    chips: [
      { label: "I need a tow", intent: "human" },
      { label: "Flat tyre or battery", intent: "human" },
      PERSON,
    ],
  },
  glovebox: {
    keywords: ["glove"],
    answer: `Here's your glove box. ${GLOVE_BOX.map((g) => `${g.label}: ${g.value.toLowerCase()}`).join(". ")}.`,
    chips: [
      { label: "Check challans", intent: "challans" },
      { label: "Recharge FASTag", intent: "fastag" },
      { label: "PUC validity", intent: "puc" },
      { label: "Book a service", intent: "service" },
    ],
  },
  cars: {
    answer:
      "Happy to help with your car. Are you buying, selling or exchanging?",
    chips: [
      { label: "Buy a car", intent: "buy" },
      { label: "Sell my car", intent: "sell" },
      { label: "Exchange", intent: "exchange" },
    ],
  },
  allservices: {
    answer: "Here's everything I can do for you.",
    chips: [],
  },
  human: {
    keywords: ["person", "human", "agent", "someone", "call me", "talk to"],
    answer:
      "Of course. I've asked someone from the team to join. They usually reply within a few minutes, and they can see this conversation so you won't need to repeat yourself.",
    chips: [{ label: "Keep chatting here", intent: "fallback" }],
  },
  fallback: {
    answer:
      "I can help with that, but I want to get it right. Could you tell me a little more? Or I can bring in a person.",
    chips: [PERSON, ...START_CHIPS.slice(0, 3)],
  },
};

/** Picks a scripted answer for something typed. */
export function matchIntent(text: string): IntentId {
  const t = text.toLowerCase();
  const hit = (Object.keys(INTENTS) as IntentId[]).find((id) =>
    INTENTS[id].keywords?.some((k) => t.includes(k)),
  );
  return hit ?? "fallback";
}
