export type PortfolioPage = { label: string; description: string; focus: string };
export type SourceFamily = { board: number; familyId: string; row: number };
export type PortfolioConcept = {
  id: string;
  title: string;
  style: string;
  description: string;
  board: number;
  source: SourceFamily;
  focus: string;
  pages: PortfolioPage[];
  featured?: boolean;
};
export type PortfolioCategory = { id: string; label: string; summary: string; styleCue: string; available: number; concepts: PortfolioConcept[] };

const boards: Record<number, string> = {
  3: "/manus-storage/concept-board-03_2484d092.webp", 4: "/manus-storage/concept-board-04_4a699b95.webp", 5: "/manus-storage/concept-board-05_67e44d91.webp", 6: "/manus-storage/concept-board-06_171e3474.webp", 7: "/manus-storage/concept-board-07_5cec64c8.webp", 8: "/manus-storage/concept-board-08_5502921a.webp", 9: "/manus-storage/concept-board-09_ea15f87a.webp", 10: "/manus-storage/concept-board-10_3d076acf.webp", 11: "/manus-storage/concept-board-11_66ded91d.webp", 12: "/manus-storage/concept-board-12_f9b97e2f.webp", 13: "/manus-storage/concept-board-13_7a2f36f3.webp", 14: "/manus-storage/concept-board-14_e03bedea.webp", 15: "/manus-storage/concept-board-15_a9ac6f4f.webp", 16: "/manus-storage/concept-board-16_2a4fc38d.webp", 17: "/manus-storage/concept-board-17_02a5ed17.webp", 18: "/manus-storage/concept-board-18_8d50bcc2.webp", 20: "/manus-storage/concept-board-20_52122220.webp", 21: "/manus-storage/concept-board-21_ac40c819.webp", 23: "/manus-storage/concept-board-23_990ddfc2.webp", 24: "/manus-storage/concept-board-24_023e5145.webp", 25: "/manus-storage/concept-board-25_9307215d.webp", 26: "/manus-storage/concept-board-26_4f831394.webp", 27: "/manus-storage/concept-board-27_61753c7f.webp", 28: "/manus-storage/concept-board-28_7706e5f2.webp", 29: "/manus-storage/concept-board-29_f7d58ef1.webp", 30: "/manus-storage/concept-board-30_a35624e1.webp", 31: "/manus-storage/concept-board-31_51668e00.webp", 32: "/manus-storage/concept-board-32_0c1d5a72.webp", 33: "/manus-storage/concept-board-33_09be2b7d.webp", 34: "/manus-storage/concept-board-34_5cc7585a.webp", 35: "/manus-storage/concept-board-35_d84ff5bc.webp",
};

const pageSets = {
  booking: ["Home", "Services", "Book"], menu: ["Home", "Menu", "Reserve"], quote: ["Home", "Services", "Quote"], stay: ["Home", "Rooms", "Book"], care: ["Home", "Packages", "Enquire"], local: ["Home", "Services", "Contact"],
} as const;
const pageX = ["16%", "50%", "84%"];

function makeConcepts(category: string, names: string[], styles: string[], set: keyof typeof pageSets, summary: string, sources: Array<[number, number]>): PortfolioConcept[] {
  return names.map((title, index) => {
    const [board, row] = sources[index];
    const familyId = `${category}-board-${board}-row-${row}`;
    return {
      id: `${category}-${index + 1}`,
      title,
      style: styles[index % styles.length],
      description: summary,
      board,
      source: { board, familyId, row },
      focus: `${pageX[0]} ${row}%`,
      featured: index === 0,
      pages: pageSets[set].map((label, pageIndex) => ({ label, focus: `${pageX[pageIndex]} ${row}%`, description: `${label} is the matching page crop from the ${title.toLowerCase()} source family.` })),
    };
  });
}

export const portfolioCategories: PortfolioCategory[] = [
  { id: "barbers", label: "Barbers", summary: "Confident booking journeys, style-led imagery, and sharp service architecture.", styleCue: "Cut, editorial, urban", available: 6, concepts: makeConcepts("barbers", ["The Modern Cut", "After Hours", "Precision Studio", "Classic Form", "Fade District", "The Gentleman’s Chair"], ["Editorial", "Urban", "Premium", "Classic"], "booking", "A confident appointment-first direction with an unmistakable personality.", [[3, 18], [3, 76], [6, 18], [8, 51], [21, 18], [25, 76]]) },
  { id: "restaurants", label: "Restaurants", summary: "Menu, reservation, atmosphere, and location experiences built around appetite.", styleCue: "Cinematic, menu-first, refined", available: 6, concepts: makeConcepts("restaurants", ["The Supper Room", "Sunday Table", "Fire & Olive", "The Good Plate", "Casa Verde", "Bela Tavola"], ["Cinematic", "Warm modern", "Bold", "Editorial"], "menu", "A food-led direction that brings menu, mood, and the reservation decision together.", [[5, 18], [9, 18], [10, 18], [20, 18], [26, 18], [28, 54]]) },
  { id: "cafes", label: "Cafés", summary: "Warm daily rituals, menu discovery, and local presence with different visual personalities.", styleCue: "Warm, minimal, playful", available: 6, concepts: makeConcepts("cafes", ["Morning Ritual", "The Daily Grind", "Sunroom Coffee", "Neighbourhood Brew", "Field Notes", "The Coffee Counter"], ["Minimal", "Playful", "Natural", "Bold"], "menu", "A relaxed, local-first concept designed around a menu and a reason to visit.", [[17, 18], [17, 50], [17, 82], [29, 18], [29, 50], [29, 82]]) },
  { id: "pubs-bars", label: "Pubs & Bars", summary: "Atmosphere-led venues with food, drinks, events, and booking routes.", styleCue: "Moody, social, venue-first", available: 6, concepts: makeConcepts("pubs-bars", ["The Foundry", "Old Oak", "The Sports House", "Velvet Hour", "Rum Shack", "The Local"], ["Moody", "Classic", "Social", "Vibrant"], "menu", "A venue-first direction for showing the feeling, the calendar, and the next booking.", [[12, 18], [12, 66], [15, 18], [15, 43], [15, 68], [15, 88]]) },
  { id: "beauty", label: "Beauty & Aesthetics", summary: "Calm consultations, considered treatments, and premium booking experiences.", styleCue: "Luxury, soft, expressive", available: 6, concepts: makeConcepts("beauty", ["Luxe Aura", "The Skin Room", "Natura Beauty", "Luna Wellness", "Glow Higher", "Nova Studio"], ["Luxury", "Soft editorial", "Natural", "Expressive"], "booking", "A treatment-led direction that balances desire, clarity, and a smooth booking decision.", [[13, 18], [13, 42], [13, 74], [18, 18], [18, 60], [35, 74]]) },
  { id: "hotels", label: "Hotels", summary: "Stay-planning, room discovery, local experiences, and clear booking pathways.", styleCue: "Escape, hospitality, place", available: 4, concepts: makeConcepts("hotels", ["The Grand Stay", "Coastal Escape", "City Rest", "Wild Retreat"], ["Luxury", "Coastal", "Contemporary", "Nature-led"], "stay", "A stay-led direction focused on rooms, place, and an intuitive route to book.", [[11, 18], [11, 42], [11, 67], [11, 88]]) },
  { id: "garages", label: "Garages", summary: "Trust-building service information, repair clarity, and practical booking journeys.", styleCue: "Performance, trust, practical", available: 6, concepts: makeConcepts("garages", ["Precision Auto", "The Motor Works", "Roadside Ready", "Factory Service", "Northside Garage", "The Workshop"], ["Performance", "Modern", "Industrial", "Practical"], "quote", "A confidence-first service concept built around clear work, value, and booking.", [[4, 18], [4, 51], [24, 18], [32, 18], [33, 50], [34, 74]]) },
  { id: "detailing", label: "Vehicle Detailing", summary: "Transformation-focused package pages, gallery drama, and enquiry-led conversion.", styleCue: "Premium, glossy, transformation", available: 4, concepts: makeConcepts("detailing", ["Auto Gloss", "The Detail House", "Pure Finish", "Black Label Care"], ["Premium", "Minimal", "Natural", "Dark luxury"], "care", "A premium visual direction built around visible transformation and considered enquiry paths.", [[16, 18], [16, 43], [16, 67], [16, 88]]) },
  { id: "landscaping", label: "Landscaping", summary: "Project-led storytelling, services, and quote journeys rooted in place.", styleCue: "Natural, project-first, calm", available: 4, concepts: makeConcepts("landscaping", ["Green & Grounded", "Outdoor Rooms", "The Planting Studio", "Garden Craft"], ["Natural", "Architectural", "Editorial", "Classic"], "quote", "A project-led concept where the work itself carries the journey towards a quote.", [[23, 18], [23, 43], [23, 68], [23, 88]]) },
  { id: "trades", label: "Trades & Builders", summary: "Service clarity, workmanship, coverage, and credible quote-first calls to action.", styleCue: "Direct, dependable, structured", available: 4, concepts: makeConcepts("trades", ["Built Right", "The Project Co.", "Aftercare Build", "Home & Form"], ["Industrial", "Professional", "Dark premium", "Clean"], "quote", "A service-first concept designed to make trust, capability, and quote actions easy to find.", [[27, 18], [27, 43], [27, 68], [27, 88]]) },
  { id: "cleaning", label: "Cleaning", summary: "Clear service routes, flexible packages, and simple contact conversion.", styleCue: "Clean, friendly, service-led", available: 4, concepts: makeConcepts("cleaning", ["Clear Home", "Bright Standard", "Fresh Space", "Happy Home"], ["Clean", "Modern", "Friendly", "Bright"], "quote", "A straightforward concept that pairs a professional service offer with a clear contact route.", [[30, 14], [30, 27], [30, 40], [30, 53]]) },
  { id: "waste-clearance", label: "Waste & Clearance", summary: "Confident, practical service information with fast enquiry routes.", styleCue: "Utility, local, decisive", available: 4, concepts: makeConcepts("waste-clearance", ["Clear It", "Responsible Removal", "Local Clear", "Proper Clearance"], ["Utility", "Professional", "Local", "Direct"], "quote", "A service-led direction built to explain the offer quickly and move visitors to a quote.", [[30, 64], [30, 76], [30, 87], [30, 95]]) },
  { id: "other-services", label: "Other Services", summary: "Flexible directions for local experts, fitness, pet care, repairs, events, and more.", styleCue: "Flexible, varied, local", available: 12, concepts: makeConcepts("other-services", ["The Pet Routine", "The Personal Coach", "Computer Fix", "Move Simply", "Home Help", "The Laundry Edit", "Tutor Time", "Event Frame", "Storage Co.", "Digital Assist", "Care & Company", "Local Collective"], ["Friendly", "Bold", "Modern", "Flexible"], "local", "A flexible local-service direction intended to adapt around a distinct offer and audience.", [[14, 18], [14, 76], [31, 13], [31, 22], [31, 31], [31, 40], [31, 50], [31, 59], [31, 68], [31, 77], [31, 86], [31, 95]]) },
];

export function getBoardSrc(index: number) { return boards[index]; }
export function getPortfolioCategory(id?: string) { return portfolioCategories.find((category) => category.id === id); }
export function getPortfolioConcept(categoryId?: string, conceptId?: string) { return getPortfolioCategory(categoryId)?.concepts.find((concept) => concept.id === conceptId); }
