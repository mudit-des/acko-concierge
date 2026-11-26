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

export type IntentId = "buy" | "sell" | "exchange" | "insurance" | "claim" | "challans" | "fastag" | "puc" | "human" | "fallback";

interface Intent {
  answer: string;
  chips: Chip[];
  /** Words in a typed message that point here. */
  keywords?: string[];
}

export const GREETING = "Hi, I'm your ACKO Drive concierge. Ask me anything about your car, and we'll get back to you here.";

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
    answer: "Happy to help you buy. Tell me the car you have in mind, or open your purchase to see where things stand. I'll chase the dealer and the bank so you don't have to.",
    chips: [{ label: "Open my purchase", to: "/buy-car/received" }, PERSON],
  },
  sell: {
    keywords: ["sell", "valuation", "resale", "worth"],
    answer: "To value your car I need its make, model, year and kilometres driven. Share those and I'll get you a fair price from verified buyers.",
    chips: [{ label: "Value my car", intent: "fallback" }, PERSON],
  },
  exchange: {
    keywords: ["exchange", "trade", "swap", "upgrade"],
    answer: "Trading in is simple: we value your current car, and the amount comes off your new one. Which car are you looking to move to?",
    chips: [{ label: "Start an exchange", intent: "fallback" }, PERSON],
  },
  insurance: {
    keywords: ["insurance", "policy", "renew", "premium", "cover"],
    answer: "I can help you buy or renew car insurance. Do you have your registration number handy? I'll show you plans in under a minute.",
    chips: [{ label: "Buy or renew", intent: "fallback" }, { label: "Make a claim", intent: "claim" }, PERSON],
  },
  claim: {
    keywords: ["claim", "accident", "damage", "crash", "breakdown", "tow"],
    answer: "I'm sorry that happened. First, is everyone safe? If you need help on the road right now, I can arrange towing. Otherwise I'll start your claim and guide you through each step.",
    chips: [{ label: "Start a claim", intent: "fallback" }, { label: "I need towing", intent: "human" }, PERSON],
  },
  challans: {
    keywords: ["challan", "fine", "traffic"],
    answer: "Send me your vehicle registration number and I'll check for pending challans.",
    chips: [{ label: "Check challans", intent: "fallback" }, MORE],
  },
  fastag: {
    keywords: ["fastag", "toll", "recharge"],
    answer: "I can recharge your FASTag. Which vehicle is it for, and how much would you like to add?",
    chips: [{ label: "Recharge FASTag", intent: "fallback" }, MORE],
  },
  puc: {
    keywords: ["puc", "pollution", "emission"],
    answer: "Share your registration number and I'll tell you when your PUC expires and remind you before it does.",
    chips: [{ label: "See PUC validity", intent: "fallback" }, MORE],
  },
  human: {
    keywords: ["person", "human", "agent", "someone", "call me", "talk to"],
    answer: "Of course. I've asked someone from the team to join. They usually reply within a few minutes, and they can see this conversation so you won't need to repeat yourself.",
    chips: [{ label: "Keep chatting here", intent: "fallback" }],
  },
  fallback: {
    answer: "I can help with that, but I want to get it right. Could you tell me a little more? Or I can bring in a person.",
    chips: [PERSON, ...START_CHIPS.slice(0, 3)],
  },
};

/** Picks a scripted answer for something typed. */
export function matchIntent(text: string): IntentId {
  const t = text.toLowerCase();
  const hit = (Object.keys(INTENTS) as IntentId[]).find((id) => INTENTS[id].keywords?.some((k) => t.includes(k)));
  return hit ?? "fallback";
}
