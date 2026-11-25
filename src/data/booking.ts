import { asset } from "../asset";
import { Car, ClipboardCheck, Coverage, Delivery, Money } from "@acko/icons";
import type { MascotMood } from "../components/Mascot";
import type { IconType } from "../components/Icon";

/**
 * Car purchase, from booking amount to delivery.
 * Every name, amount, date and promise below is a placeholder to show the pattern.
 * The hero image is a third-party product photo supplied for the prototype; production needs the
 * OEM or dealer image licence. Final copy needs the real flow, partner dealers, lenders and the
 * insurance start rules.
 */
export const CAR = { name: "Hyundai Creta", model: "SX", image: asset("/illustrations/car-creta.webp"), imageRatio: { width: 930, height: 620 } };
export const CONCIERGE_NAME = "Your concierge"; // swap for the mascot's name once chosen
export const BOOKING_AMOUNT = 10000;
export const DELIVERY_DATE = "12 Dec";
export const PAPERWORK_DEADLINE = "tomorrow, 6 pm";

/** After the documents are verified: reassure the customer that the dealer search has started. */
export const DEALER_MESSAGE = `That's the paperwork done. Now we're finding a dealer who can match your ${CAR.name} ${CAR.model}. They usually take a few hours to confirm stock, and we'll update you here as soon as we hear back.`;
export const DEALER_SEARCH_LINES = [
  "Reaching out to partner dealers near you",
  `Checking stock for your ${CAR.name} ${CAR.model}`,
  "Finding who can deliver soonest",
];
export const DEALER_CLOSING = "We'll update you as soon as we have news.";

/** "Next steps" card. Several updates can belong to one stage. */
export const STAGES: { title: string; line: string; icon: IconType }[] = [
  { title: "Finish your paperwork", line: "Confirm a couple of documents. Two minutes.", icon: ClipboardCheck },
  { title: "We assign your dealer", line: "A partner dealer fulfils your exact make and model.", icon: Car },
  { title: "We sort the money", line: "Finance through us or your own bank. Your call.", icon: Money },
  { title: "Insurance and registration", line: "Your ACKO policy and the RTO work, handled.", icon: Coverage },
  { title: "Your car arrives", line: `Delivery by ${DELIVERY_DATE}.`, icon: Delivery },
];

export interface GateOption {
  label: string;
  /** What the customer "says" in the thread after choosing. */
  said: string;
  /** The concierge's answer. */
  reply?: string[];
}

export interface BookingStep {
  id: string;
  /** The page for this state. One URL per screen. */
  path: string;
  /** Short name and one line for the /states index. */
  title: string;
  summary: string;
  time: string;
  /** Index into STAGES that is "now". */
  stage: number;
  mood: MascotMood;
  /** Short line shown on the pinned car card. */
  status: string;
  /** In progress (orange dot) rather than finished (green dot). */
  statusBusy: boolean;
  /** Thread messages. Step 0 is the hero card at the top of the page, so it has none here. */
  messages: string[];
  card?: "car" | "verify" | "searching";
  /** What the customer says first (their bubble), before the concierge replies. */
  customerSays?: string;
  /** A plain next action (no choice): the sticky primary button opens this page. */
  action?: { label: string; to: string };
  /** The booking waits for the customer. Primary is the sticky action. Each choice has its own query value. */
  gate?: { primary: GateOption & { value: string }; secondary?: GateOption & { value: string } };
}

const BASE = "/buy-car";

export const STEPS: BookingStep[] = [
  {
    id: "received",
    path: `${BASE}/received`,
    title: "Booked",
    summary: "The car is booked, the ₹10,000 is received, paperwork is next.",
    status: "",
    statusBusy: false,
    time: "Today, 6:42 pm",
    stage: 0,
    mood: "happy",
    messages: [],
    action: { label: "Let's do the paperwork", to: `${BASE}/documents` },
  },
  {
    id: "documents-received",
    path: `${BASE}/documents/received`,
    title: "Documents received",
    summary: "Your documents tick through verification.",
    status: "Documents verified",
    statusBusy: false,
    time: "Today, 6:50 pm",
    stage: 1,
    mood: "happy",
    customerSays: "Here are my documents.",
    messages: ["Got your documents. I'm verifying them now."],
    card: "verify",
    action: { label: "What's next?", to: `${BASE}/processing` },
  },
  {
    id: "processing",
    path: `${BASE}/processing`,
    title: "Finding your dealer",
    summary: "We're reaching out to partner dealers. You'll hear back here.",
    status: "Finding your dealer",
    statusBusy: true,
    time: "Today, 6:52 pm",
    stage: 1,
    mood: "thinking",
    messages: [DEALER_MESSAGE],
    card: "searching",
  },
  {
    id: "dealer-assigned",
    path: `${BASE}/dealer-assigned`,
    title: "Dealer assigned",
    summary: "A partner dealer has your exact variant and colour reserved.",
    status: "Dealer assigned",
    statusBusy: false,
    time: "Tomorrow, 11:20 am",
    stage: 2,
    mood: "happy",
    messages: ["A partner dealer is assigned. Your exact variant and colour are reserved in your name.", `Delivery is on track for ${DELIVERY_DATE}.`],
    card: "car",
  },
  {
    id: "finance",
    path: `${BASE}/finance`,
    title: "Choose how to pay",
    summary: "Finance through us or use your own bank. Add ?choice=us or ?choice=bank to see the reply.",
    status: "Waiting for your choice",
    statusBusy: true,
    time: "Tomorrow, 2:00 pm",
    stage: 2,
    mood: "asking",
    messages: ["You can finance through us or use your own bank.", "If you choose us, we'll line up offers from lenders and show them here. Nothing is final until you accept."],
    gate: {
      primary: { value: "us", label: "Finance through us", said: "I'll finance through you.", reply: ["Done. We'll bring lender offers here within a day."] },
      secondary: { value: "bank", label: "Use my own bank", said: "I'll use my own bank.", reply: ["Got it. Share your bank's approval letter when you have it and we'll take it from there."] },
    },
  },
  {
    id: "insurance",
    path: `${BASE}/insurance`,
    title: "Insurance and registration",
    summary: "Your ACKO policy and the RTO registration are handled.",
    status: "Sorting insurance and registration",
    statusBusy: true,
    time: "In 3 days",
    stage: 3,
    mood: "working",
    messages: ["Your ACKO car insurance is ready to start on delivery day.", "We're also handling registration with the RTO, so you won't need to visit."],
  },
  {
    id: "ready",
    path: `${BASE}/ready`,
    title: "Checked and ready",
    summary: "The pre-delivery check passed and the delivery slot is confirmed.",
    status: "Car checked and ready",
    statusBusy: false,
    time: `${DELIVERY_DATE}, 10:00 am`,
    stage: 4,
    mood: "happy",
    messages: ["Your car has passed its pre-delivery check.", `Your delivery slot is confirmed for ${DELIVERY_DATE}, between 3 and 5 pm.`],
  },
  {
    id: "on-the-way",
    path: `${BASE}/on-the-way`,
    title: "On the way",
    summary: "The car is on its way to you.",
    status: "Driving your car to you",
    statusBusy: true,
    time: `${DELIVERY_DATE}, 3:40 pm`,
    stage: 4,
    mood: "driving",
    messages: ["Your car is on the way. It will reach you by about 5 pm."],
  },
  {
    id: "delivered",
    path: `${BASE}/delivered`,
    title: "Delivered",
    summary: "Welcome to your new car.",
    status: "Delivered",
    statusBusy: false,
    time: `${DELIVERY_DATE}, 4:55 pm`,
    stage: 4,
    mood: "celebrating",
    messages: ["Your car is with you. Welcome to your new car.", "Your documents, policy and invoice are saved here. We'll remind you when the first service is due."],
  },
];

/** Pages outside the numbered states. */
export const DOCUMENTS_PATH = `${BASE}/documents`;
export const START_PATH = `${BASE}/received`;

export const CAR_CARD: { label: string; value: string }[] = [
  { label: "Variant", value: "SX" },
  { label: "Colour", value: "Dark green" },
  { label: "Reserved", value: "In your name" },
  { label: "Delivery", value: `By ${DELIVERY_DATE}` },
];

/** Shown on the verification card in the chat, ticked off one by one. */
export const VERIFY_LINES = ["Reading your PAN", "Matching your Aadhaar details", "Checking your name and address"];
export const VERIFIED_LINE = "Verified. Your booking is now open in your name.";

/** The documents page. Placeholder copy: compliance must review anything about Aadhaar. */
export const DOCUMENT_ROWS: { id: "aadhaar" | "pan"; title: string; hint: string }[] = [
  { id: "aadhaar", title: "Aadhaar card", hint: "One photo with both sides, or separate front and back" },
  { id: "pan", title: "PAN card", hint: "One clear photo" },
];
export const QUICK_CHECKS = [
  "Name should match on Aadhaar and PAN. We'll register the car, and the loan if you take one, against this name.",
  "Aadhaar address should show Bengaluru, since that's where the car gets registered.",
];


/**
 * Heads-up shown once the dealer search starts. The fee and the cancellation rule are placeholders
 * taken from the reference page: the business must confirm the real policy before this ships.
 */
export const CHANGE_FEE = 5000;
export const HEADS_UP_TITLE = "A quick heads-up";
export const HEADS_UP_BODY = `From the next step, changing your pick costs ₹${CHANGE_FEE.toLocaleString("en-IN")}, and if you cancel, half your booking amount stays with us.`;
