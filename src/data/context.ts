import { asset } from "../asset";
import type { IntentId } from "./chat";

/*
 * What the home grid shows, and in what order. Today the order adapts to a customer "stage" that is read from
 * the address (?context=new-owner | owner | active-claim | emergency), so the idea can be reviewed without a backend.
 * When account data exists, only getStage() needs to change. With no stage, the default grid is shown.
 */

export type CustomerStage =
  "new-owner" | "owner" | "active-claim" | "emergency";

export interface GridItem {
  id: string;
  label: string;
  intent: IntentId;
  image: string;
  /** Evens out the visual weight of wide illustrations (1 = as drawn). */
  fit?: number;
}

export const GRID_ITEMS: GridItem[] = [
  {
    id: "emergency",
    label: "Emergency",
    intent: "emergency",
    image: asset("/icons/emergency.webp"),
  },
  {
    id: "buy",
    label: "Buy",
    intent: "buy",
    image: asset("/icons/buy.webp"),
    fit: 1.12,
  },
  {
    id: "sell",
    label: "Sell",
    intent: "sell",
    image: asset("/icons/sell.webp"),
  },
  {
    id: "exchange",
    label: "Exchange",
    intent: "exchange",
    image: asset("/icons/exchange.webp"),
    fit: 1.08,
  },
  {
    id: "insure",
    label: "Insurance",
    intent: "insurance",
    image: asset("/icons/insurance.webp"),
  },
  {
    id: "service",
    label: "Service",
    intent: "service",
    image: asset("/icons/service.webp"),
  },
  {
    id: "roadside",
    label: "Roadside",
    intent: "roadside",
    image: asset("/icons/roadside.webp"),
    fit: 1.1,
  },
  {
    id: "claim",
    label: "Claims",
    intent: "claim",
    image: asset("/icons/claims.webp"),
  },
  {
    id: "documents",
    label: "Documents",
    intent: "glovebox",
    image: asset("/icons/glovebox.webp"),
  },
];

/** Order of the grid per stage. Emergency always leads; ids left out follow in the default order. */
const PRIORITY: Record<CustomerStage, string[]> = {
  "new-owner": [
    "emergency",
    "insure",
    "documents",
    "service",
    "roadside",
    "claim",
  ],
  owner: ["emergency", "service", "insure", "roadside", "documents", "claim"],
  "active-claim": [
    "emergency",
    "claim",
    "roadside",
    "insure",
    "service",
    "documents",
  ],
  emergency: [
    "emergency",
    "roadside",
    "claim",
    "service",
    "insure",
    "documents",
  ],
};

/** Labels that read better for a given stage. Anything not listed keeps its default label. */
const LABELS: Partial<Record<CustomerStage, Record<string, string>>> = {
  owner: { insure: "Renew policy" },
  "active-claim": { claim: "Track claim" },
};

/** Otto's opening lines, one set per stage. The first entry (no stage) is the default introduction. */
const GREETINGS: Record<CustomerStage | "default", string[]> = {
  default: [
    "Hey, I'm Otto, your car companion. I take care of the annoying car stuff, so you don't have to.",
    "Here's how I can help you, or just ask away in chat.",
  ],
  "new-owner": [
    "Congratulations on the new car! Let's get it sorted.",
    "Insurance, registration and your car documents are the best places to start, or just ask away in chat.",
  ],
  owner: [
    "Welcome back. Let's keep your car in good shape.",
    "I can book a service, sort a repair or renew your insurance, or just ask away in chat.",
  ],
  "active-claim": [
    "I'm keeping an eye on your claim.",
    "Track it here for the latest, or ask me anything in chat.",
  ],
  emergency: [
    "I'm here. Are you and everyone with you safe?",
    "Tap Emergency help and I'll get someone to you straight away.",
  ],
};

/** Otto's opening, as a short run of messages (one idea each). */
export function greetingFor(stage: CustomerStage | null): string[] {
  return GREETINGS[stage ?? "default"];
}

const STAGES = Object.keys(PRIORITY) as CustomerStage[];

/** The customer's stage, or null when unknown (then the default grid shows). */
export function getStage(search: string): CustomerStage | null {
  const v = new URLSearchParams(search).get("context");
  return STAGES.find((s) => s === v) ?? null;
}

export function arrangeGrid(stage: CustomerStage | null): GridItem[] {
  if (!stage) return GRID_ITEMS;
  const rank = (id: string) => {
    const i = PRIORITY[stage].indexOf(id);
    return i === -1
      ? PRIORITY[stage].length + GRID_ITEMS.findIndex((g) => g.id === id)
      : i;
  };
  const labels = LABELS[stage] ?? {};
  return [...GRID_ITEMS]
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map((g) => (labels[g.id] ? { ...g, label: labels[g.id] } : g));
}
