import { CarService, Fastag, PollutionCentre, TrafficFines } from "@acko/icons";
import type { IconType } from "../components/Icon";
import type { IntentId } from "./chat";

/**
 * Placeholder account data for the Home tab. Nothing here is real: the booking, the plate and the
 * glove box statuses stand in for what the backend will return.
 */

export const ACTIVE_BOOKING = {
  status: "Finding your dealer",
  /** The stage in progress, as an index into STAGES (0 = paperwork). */
  stage: 1,
  /** Where the tracker for it lives. */
  path: "/buy-car/processing",
};

export const PLATE = "KA01 AB 1234";

export interface GloveItem {
  label: string;
  icon: IconType;
  value: string;
  tone: "ok" | "warn" | "bad" | "none";
  /** What a tap starts in the chat. */
  intent: IntentId;
}

/** Live status of the things a car owner keeps having to check. */
export const GLOVE_BOX: GloveItem[] = [
  { label: "Challans", icon: TrafficFines, value: "All clear", tone: "ok", intent: "challans" },
  { label: "FASTag", icon: Fastag, value: "₹560", tone: "none", intent: "fastag" },
  { label: "PUC", icon: PollutionCentre, value: "Expiring soon", tone: "warn", intent: "puc" },
  { label: "Service", icon: CarService, value: "Overdue", tone: "bad", intent: "service" },
];
