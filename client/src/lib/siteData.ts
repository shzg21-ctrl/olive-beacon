import { CarFront, Coffee, Scissors, Sparkles, Store, Wrench } from "lucide-react";

export const productData = {
  stand: {
    slug: "review-stand",
    label: "Olive Beacon Review Stand",
    shortLabel: "Review Stand",
    eyebrow: "NFC + QR COUNTERTOP EXPERIENCE",
    headline: "A better moment to ask for a little more.",
    description: "A premium acrylic NFC + QR touchpoint, designed for the counter, reception area, or service handover where customer confidence is already high.",
    placement: "Reception desks, payment counters, barber stations, restaurant counters, garages, and service completion areas.",
    surface: "Freestanding, considered, and designed for the moments that matter.",
  },
  sticker: {
    slug: "review-sticker",
    label: "Olive Beacon Review Sticker",
    shortLabel: "Review Sticker",
    eyebrow: "NFC + QR SURFACE TOUCHPOINT",
    headline: "Small footprint. Clear invitation.",
    description: "A compact NFC + QR window and counter solution for placing a thoughtful next step exactly where a customer will see it.",
    placement: "Windows, counters, doors, reception spaces, and other smooth customer-facing surfaces.",
    surface: "Compact, configurable, and made to sit naturally in your space.",
  },
} as const;

export type IndustrySlug = "barbers" | "beauty" | "cafes" | "restaurants" | "hospitality" | "hotels" | "automotive" | "garages" | "detailers" | "trades" | "local-services" | "retailers";

export const industryData: Array<{
  slug: IndustrySlug;
  label: string;
  Icon: typeof Scissors;
  moment: string;
  placement: string;
  opportunity: string;
  services: string[];
  theme: string;
}> = [
  { slug: "barbers", label: "Barbers", Icon: Scissors, moment: "A customer finishes, checks the mirror, pays, and leaves feeling looked after.", placement: "Review Stand at checkout or beside the final mirror; Review Sticker near the door.", opportunity: "A booking-led site with services, price list, gallery, location, and a clear route back to the chair.", services: ["Review Stand", "Review Sticker", "Website"], theme: "cut" },
  { slug: "beauty", label: "Beauty & salons", Icon: Sparkles, moment: "A treatment ends with a calm, confident customer at reception.", placement: "Review Stand at reception; Review Sticker beside the appointment desk or window.", opportunity: "An elegant treatments and booking experience with service detail, imagery, and practical contact paths.", services: ["Review Stand", "Review Sticker", "Website", "Digital solutions"], theme: "glow" },
  { slug: "cafes", label: "Cafés", Icon: Coffee, moment: "A guest has enjoyed a drink, a meal, or a quick but memorable visit at the counter.", placement: "Review Stand at the till; Review Sticker by the entrance, takeaway point, or coffee collection area.", opportunity: "A local-first website with menu, opening times, location, gallery, and simple contact or order routes.", services: ["Review Stand", "Review Sticker", "Website"], theme: "table" },
  { slug: "restaurants", label: "Restaurants", Icon: Coffee, moment: "A guest has finished a meal and reaches the payment point or leaves through the host area.", placement: "Review Stand at the host desk or payment point; Review Sticker near the entrance or bar.", opportunity: "A visually rich experience for menus, reservations, opening times, location, and atmosphere.", services: ["Review Stand", "Review Sticker", "Website"], theme: "table" },
  { slug: "hospitality", label: "Hospitality", Icon: Coffee, moment: "A guest has completed a considered visit and is ready to reflect on the experience.", placement: "Review Stand at reception, bar, or departure point; Review Sticker in a clear customer-facing area.", opportunity: "A hospitality website that connects bookings, events, menus, directions, and guest information clearly.", services: ["Review Stand", "Review Sticker", "Website"], theme: "table" },
  { slug: "hotels", label: "Hotels", Icon: Coffee, moment: "A guest checks out after their stay and is at the reception desk with the experience still fresh.", placement: "Review Stand at checkout reception; Review Sticker beside key return or concierge touchpoints.", opportunity: "A polished stay-planning website with rooms, booking routes, local information, dining, and contact details.", services: ["Review Stand", "Review Sticker", "Website", "Digital solutions"], theme: "table" },
  { slug: "automotive", label: "Automotive", Icon: CarFront, moment: "A customer collects a vehicle after a service, repair, or purchase and sees the value immediately.", placement: "Review Stand at handover or reception; Review Sticker in the waiting or collection area.", opportunity: "A confidence-led website with services, quote routes, vehicle or project galleries, and clear contact options.", services: ["Review Stand", "Review Sticker", "Website", "Digital solutions"], theme: "drive" },
  { slug: "garages", label: "Garages", Icon: CarFront, moment: "A customer receives their vehicle after maintenance or repair and speaks with the team at collection.", placement: "Review Stand at the collection desk; Review Sticker by the customer waiting area or reception window.", opportunity: "A practical service website with MOT and maintenance architecture, booking requests, locations, and contact paths.", services: ["Review Stand", "Review Sticker", "Website"], theme: "drive" },
  { slug: "detailers", label: "Detailers", Icon: CarFront, moment: "A vehicle is handed back after detail work and the visible transformation is at its strongest.", placement: "Review Stand at vehicle handover; Review Sticker at reception or in the waiting area.", opportunity: "A premium gallery-led website for services, quote requests, before-and-after structure, and booking enquiries.", services: ["Review Stand", "Review Sticker", "Website", "Digital solutions"], theme: "drive" },
  { slug: "trades", label: "Trades", Icon: Wrench, moment: "A job has been completed and the customer can see the value delivered in their own space.", placement: "Review Sticker on work-completion material or a Review Stand where handovers happen in person.", opportunity: "A trust-focused service site with coverage areas, quote journeys, selected-work structure, and direct contact routes.", services: ["Review Sticker", "Website", "Digital solutions"], theme: "build" },
  { slug: "local-services", label: "Local services", Icon: Wrench, moment: "A customer has received a helpful local service and speaks with the team at completion or payment.", placement: "Review Stand at the counter where relevant, or Review Sticker on suitable customer-facing materials.", opportunity: "A straightforward local website with services, areas covered, quote path, and contact information.", services: ["Review Sticker", "Website", "Digital solutions"], theme: "build" },
  { slug: "retailers", label: "Independent retailers", Icon: Store, moment: "A customer has discovered something useful, personal, or memorable in-store.", placement: "Review Stand at the till; Review Sticker near the exit, bagging point, or window.", opportunity: "A shopfront website with product or collection architecture, location, social links, and contact pathways.", services: ["Review Stand", "Review Sticker", "Website"], theme: "retail" },
];

export const conceptData = [
  { slug: "barber", label: "Barber concept", category: "Barbers", accent: "#b9c751", headline: "A sharp digital first impression.", modules: ["Book now", "Services", "Price list", "Gallery", "Location"], theme: "barber" },
  { slug: "beauty", label: "Beauty & salon concept", category: "Beauty", accent: "#d3b26c", headline: "A calmer route to booking.", modules: ["Treatments", "Booking", "Gallery", "Location", "Contact"], theme: "beauty" },
  { slug: "hospitality", label: "Hospitality concept", category: "Restaurant", accent: "#d4bd6a", headline: "A table worth returning to.", modules: ["Menu", "Reservations", "Opening times", "Gallery", "Find us"], theme: "hospitality" },
  { slug: "automotive", label: "Automotive concept", category: "Detailer", accent: "#7fc0b3", headline: "Confidence at every turn.", modules: ["Services", "Quote request", "Gallery", "Before / after", "Contact"], theme: "automotive" },
  { slug: "trades", label: "Trades concept", category: "Local service", accent: "#aab6c7", headline: "Clear from the first call.", modules: ["Services", "Areas covered", "Quote form", "Selected work", "Contact"], theme: "trades" },
] as const;

export const faqData = [
  ["What is NFC?", "NFC is a short-range technology that lets compatible phones open a chosen digital destination when they are brought close to an NFC-enabled product."],
  ["Do customers need an app?", "No app is normally needed on a compatible NFC smartphone. Every Olive Beacon NFC solution can also use a QR code as an alternative route."],
  ["Does Olive Beacon guarantee more reviews?", "No. Olive Beacon reduces friction and makes the route clearer. Customers always decide whether to share feedback or leave a review."],
  ["Can a product connect to my review destination?", "Yes, where the correct destination is provided and the product is configured for it. Olive Beacon does not require your Google password."],
  ["Can the product be customised?", "Yes. Business name, logo, colours, customer message, QR code, and the selected destination can form part of the configuration."],
  ["Can Olive Beacon build my website?", "Yes. Olive Beacon creates responsive, considered digital experiences around the business and its customers. Scope and ongoing support are agreed per project."],
] as const;
