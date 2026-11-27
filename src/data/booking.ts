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
export const CAR = {
  name: "Hyundai Creta",
  model: "SX",
  image: asset("/illustrations/car-creta.webp"),
  imageRatio: { width: 930, height: 620 },
};
export const CONCIERGE_NAME = "Otto"; // the concierge's name (working name, pending a trademark check)
export const BOOKING_AMOUNT = 10000;
export const DELIVERY_DATE = "12 Dec";
export const PAPERWORK_DEADLINE = "tomorrow, 6 pm";
export const CAR_PRICE = 1373780; // placeholder
export const BALANCE = CAR_PRICE - BOOKING_AMOUNT;
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** After the documents are verified: Otto says the dealer search has started, in a line or two. */
export const DEALER_MESSAGE = `KYC is all set. I'm checking with dealers for your ${CAR.name.split(" ").pop()} ${CAR.model}. It usually takes a few hours, and I'll ping you here once stock is confirmed.`;
/** The fee and the cancellation rule are placeholders: the business must confirm the real policy before this ships. */
export const CHANGE_FEE = 5000;
export const HEADS_UP_MESSAGE = `One thing to know: from the next step, changing your pick costs ₹${CHANGE_FEE.toLocaleString("en-IN")}, and if you cancel, half your booking amount stays with us.`;

/** "Next steps" card. Several updates can belong to one stage. */
export const STAGES: { title: string; line: string; icon: IconType }[] = [
  {
    title: "Complete your KYC",
    line: "Keep your PAN and Aadhaar handy. Two minutes.",
    icon: ClipboardCheck,
  },
  {
    title: "We assign your dealer",
    line: "A partner dealer fulfils your exact make and model.",
    icon: Car,
  },
  {
    title: "We sort the money",
    line: "Finance through us or your own bank. Your call.",
    icon: Money,
  },
  {
    title: "Insurance and registration",
    line: "Your ACKO policy and the RTO work, handled.",
    icon: Coverage,
  },
  {
    title: "Your car arrives",
    line: `Delivery by ${DELIVERY_DATE}.`,
    icon: Delivery,
  },
];

export type PayValue = "us" | "bank" | "full";

/** One way to pay the balance. Shown as a selectable card; confirming it sends `said` and Otto answers with `reply`. */
export interface PayOption {
  value: PayValue;
  title: string;
  pitch: string;
  /** The two numbers that matter when comparing: time and money. */
  stats: { value: string; label: string }[];
  /** The label of the confirm button while this option is selected. */
  confirm: string;
  /** What the customer "says" in the thread after confirming. */
  said: string;
  /** Otto's answer. */
  reply: string[];
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
  card?: "assigned" | "verify";
  /** What the customer says first (their bubble), before the concierge replies. */
  customerSays?: string;
  /** A plain next action (no choice): the sticky primary button opens this page. */
  action?: { label: string; to: string };
  /** The booking waits for the customer to choose one of these. Each has its own query value (?choice=). */
  gate?: {
    options: PayOption[];
    preselected: PayValue;
  };
}

const BASE = "/buy-car";

export const STEPS: BookingStep[] = [
  {
    id: "received",
    path: `${BASE}/received`,
    title: "Booked",
    summary: "The car is booked, the ₹10,000 is received, your KYC is next.",
    status: "",
    statusBusy: false,
    time: "Today, 6:42 pm",
    stage: 0,
    mood: "happy",
    messages: [],
    action: { label: "Start my KYC", to: `${BASE}/documents` },
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
    messages: [DEALER_MESSAGE, HEADS_UP_MESSAGE],
  },
  {
    id: "accepted",
    path: `${BASE}/accepted`,
    title: "Found a match",
    summary:
      "A dealer is found and the car is reserved. The customer shares a one-time code when the dealer calls.",
    status: "Dealer found",
    statusBusy: false,
    time: "Tomorrow, 11:20 am",
    stage: 1,
    mood: "celebrating",
    messages: [
      `Good news! I've found a dealer and reserved your ${CAR.name.split(" ").pop()} ${CAR.model}.`,
      "We'll call you shortly. Have your phone ready and share the one-time code with us.",
    ],
    action: { label: "After the call (demo)", to: `${BASE}/confirmed` },
  },
  {
    id: "confirmed",
    path: `${BASE}/confirmed`,
    title: "Car assigned",
    summary:
      "The code checked out. Engine and chassis numbers are on the card, and the balance is shown.",
    status: "Car assigned to you",
    statusBusy: false,
    time: "Tomorrow, 11:32 am",
    stage: 2,
    mood: "happy",
    messages: [
      `Your code checked out. This ${CAR.name.split(" ").pop()} ${CAR.model} is assigned to you.`,
      `Next up: pay the remaining ${inr(BALANCE)}. You can finance it through me or arrange it yourself.`,
      `Your ${DELIVERY_DATE} delivery holds once payment is set up. Every day this waits moves it back.`,
    ],
    card: "assigned",
    action: { label: "See payment options", to: `${BASE}/finance` },
  },
  {
    id: "finance",
    path: `${BASE}/finance`,
    title: "Choose how to pay",
    summary:
      "Three ways to pay the balance as selectable cards. Add ?choice=us, ?choice=bank or ?choice=full to see the reply.",
    status: "Waiting for your choice",
    statusBusy: true,
    time: "Tomorrow, 2:00 pm",
    stage: 2,
    mood: "asking",
    messages: [
      `How would you like to pay the remaining ${inr(BALANCE)}?`,
      "I've selected financing through me. You can change it before you confirm, and nothing is final until you do.",
    ],
    gate: {
      preselected: "us",
      options: [
        {
          value: "us",
          title: "Finance with ACKO Drive",
          pitch: "I line up offers from lenders and handle the paperwork.",
          stats: [
            { value: "2 days", label: "approval, about" },
            { value: "₹21,833", label: "a month, estimated" },
          ],
          confirm: "Continue with ACKO Drive finance",
          said: "I'll finance through you.",
          reply: ["Done. I'll bring lender offers here within a day."],
        },
        {
          value: "bank",
          title: "Arrange the loan yourself",
          pitch:
            "Pick any bank. Bring me the sanction letter and I take it from there.",
          stats: [
            { value: "5–7 days", label: "bank approval" },
            { value: "Any bank", label: "your rate" },
          ],
          confirm: "Continue with my own bank",
          said: "I'll use my own bank.",
          reply: [
            "Got it. Share your bank's approval letter when you have it and I'll take it from there.",
          ],
        },
        {
          value: "full",
          title: "Pay in full",
          pitch: "No loan, no EMI. Pay and your car gets ready for delivery.",
          stats: [
            { value: inr(BALANCE), label: "due now" },
            { value: "No bank wait", label: "fastest to delivery" },
          ],
          confirm: "Pay in full",
          said: "I'll pay in full.",
          reply: [
            "Great. I'll send you the payment link here and get your car ready for delivery.",
          ],
        },
      ],
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
    messages: [
      "Your ACKO car insurance is ready to start on delivery day.",
      "We're also handling registration with the RTO, so you won't need to visit.",
    ],
  },
  {
    id: "ready",
    path: `${BASE}/ready`,
    title: "Checked and ready",
    summary:
      "The pre-delivery check passed and the delivery slot is confirmed.",
    status: "Car checked and ready",
    statusBusy: false,
    time: `${DELIVERY_DATE}, 10:00 am`,
    stage: 4,
    mood: "happy",
    messages: [
      "Your car has passed its pre-delivery check.",
      `Your delivery slot is confirmed for ${DELIVERY_DATE}, between 3 and 5 pm.`,
    ],
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
    messages: [
      "Your car is with you. Welcome to your new car.",
      "Your documents, policy and invoice are saved here. We'll remind you when the first service is due.",
    ],
  },
];

/**
 * The update a "Next steps" row points to: the first update of that stage. Documents received still
 * belongs to the paperwork row, so the dealer row starts at the dealer search.
 */
export function stageTarget(stage: number): number {
  if (stage === 0) return 1;
  return Math.max(
    1,
    STEPS.findIndex((s) => s.stage === stage && s.id !== "documents-received"),
  );
}

/** Pages outside the numbered states. */
export const DOCUMENTS_PATH = `${BASE}/documents`;
export const START_PATH = `${BASE}/received`;

/** Rows on the assigned-car card (placeholder numbers). */
export const CAR_NUMBERS: { label: string; value: string }[] = [
  { label: "Engine no.", value: "G4LAHM123456" },
  { label: "Chassis no.", value: "MALBM1234ABC567890" },
];
export const CAR_PRICING: { label: string; value: string; strong?: boolean }[] =
  [
    { label: "ACKO Drive price", value: inr(CAR_PRICE) },
    { label: "Booking amount paid", value: `− ${inr(BOOKING_AMOUNT)}` },
    { label: "Amount to pay", value: inr(BALANCE), strong: true },
  ];

/** Shown on the verification card in the chat, ticked off one by one. */
export const VERIFY_LINES = [
  "Reading your PAN",
  "Matching your Aadhaar details",
  "Checking your name and address",
];
export const VERIFIED_LINE = "Verified. Your booking is now open in your name.";

/** The documents page. Placeholder copy: compliance must review anything about Aadhaar. */
export const DOCUMENT_ROWS: {
  id: "aadhaar" | "pan";
  title: string;
  hint: string;
}[] = [
  {
    id: "aadhaar",
    title: "Aadhaar card",
    hint: "One photo with both sides, or separate front and back",
  },
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
