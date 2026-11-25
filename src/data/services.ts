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
