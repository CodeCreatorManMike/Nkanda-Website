// Shared data layer for the Nkanda demo site — mirrors the logic in the iOS
// app's Models/ folder (VisaCategory, CategoryRequirements, VisaRoute) at
// demo scale, so both surfaces tell a consistent story.

const PHOTO_CODES = ["ae", "ar", "at", "au", "br", "ca", "ch", "cn", "cy", "cz", "de", "dk", "eg", "es", "fr", "gb", "gr", "hu", "id", "ie", "il", "in", "is", "it", "jo", "jp", "ke", "kr", "ma", "mx", "my", "ng", "nl", "no", "nz", "ph", "pl", "pt", "qa", "sa", "se", "sg", "th", "tr", "us", "vn", "za"];

// Destinations with real per-route metadata (the "featured" set) — mirrors
// NkandaApp/Nkanda/Models/Destination.swift.
const FEATURED = [
  { code: "fr", name: "France", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "it", name: "Italy", validity: "90 days", guaranteedDays: 7, type: "E-Visa" },
  { code: "jp", name: "Japan", validity: "30 days", guaranteedDays: 10, type: "E-Visa" },
  { code: "gr", name: "Greece", validity: "90 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "us", name: "United States", validity: "2 years", guaranteedDays: 14, type: "Sticker" },
  { code: "gb", name: "United Kingdom", validity: "180 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "ae", name: "United Arab Emirates", validity: "60 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "au", name: "Australia", validity: "1 year", guaranteedDays: 12, type: "E-Visa" },
  { code: "za", name: "South Africa", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "ca", name: "Canada", validity: "6 months", guaranteedDays: 11, type: "E-Visa" },
];

const EXTRA = [
  { code: "eg", name: "Egypt", validity: "90 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "tr", name: "Türkiye", validity: "180 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "th", name: "Thailand", validity: "60 days", guaranteedDays: 7, type: "E-Visa" },
  { code: "sg", name: "Singapore", validity: "30 days", guaranteedDays: 4, type: "E-Visa" },
  { code: "my", name: "Malaysia", validity: "30 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "cn", name: "China", validity: "30 days", guaranteedDays: 12, type: "E-Visa" },
  { code: "in", name: "India", validity: "30 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "kr", name: "South Korea", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "es", name: "Spain", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "pt", name: "Portugal", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "de", name: "Germany", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "nl", name: "Netherlands", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "ch", name: "Switzerland", validity: "90 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "at", name: "Austria", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "ie", name: "Ireland", validity: "90 days", guaranteedDays: 10, type: "E-Visa" },
  { code: "is", name: "Iceland", validity: "90 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "no", name: "Norway", validity: "90 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "se", name: "Sweden", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "dk", name: "Denmark", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "cy", name: "Cyprus", validity: "180 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "mx", name: "Mexico", validity: "180 days", guaranteedDays: 7, type: "E-Visa" },
  { code: "br", name: "Brazil", validity: "90 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "ar", name: "Argentina", validity: "90 days", guaranteedDays: 9, type: "E-Visa" },
  { code: "nz", name: "New Zealand", validity: "9 months", guaranteedDays: 11, type: "E-Visa" },
  { code: "id", name: "Indonesia", validity: "30 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "vn", name: "Vietnam", validity: "90 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "ph", name: "Philippines", validity: "30 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "qa", name: "Qatar", validity: "30 days", guaranteedDays: 5, type: "E-Visa" },
  { code: "sa", name: "Saudi Arabia", validity: "90 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "ma", name: "Morocco", validity: "90 days", guaranteedDays: 7, type: "E-Visa" },
  { code: "ke", name: "Kenya", validity: "90 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "ng", name: "Nigeria", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "il", name: "Israel", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "jo", name: "Jordan", validity: "30 days", guaranteedDays: 6, type: "E-Visa" },
  { code: "pl", name: "Poland", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "cz", name: "Czechia", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
  { code: "hu", name: "Hungary", validity: "90 days", guaranteedDays: 8, type: "E-Visa" },
];

const DESTINATIONS = FEATURED.concat(EXTRA);

function destinationByCode(code) {
  return DESTINATIONS.find((d) => d.code === code);
}

function photoUrl(code) {
  if (PHOTO_CODES.indexOf(code) !== -1) return `assets/images/countries/${code}.jpg`;
  return null;
}

function flagUrl(code) {
  return `assets/flags/${code}.svg`;
}

// 14-category route model, condensed from NkandaApp/Nkanda/Models/CategoryRequirements.swift
const CATEGORIES = {
  visitor: {
    title: "Visitor",
    workRights: "No local work",
    justification: "Visitors with a genuine temporary purpose, a valid passport and evidence of return travel are the highest-volume, highest-approval route for short stays.",
    baseAcceptance: 92,
    timeline: ["Application and evidence submitted", "Biometrics or document check", "Decision issued"],
    documents: [
      { title: "Passport", desc: "Valid travel document with sufficient validity beyond the stay." },
      { title: "Photograph", desc: "Recent biometric-format photo." },
      { title: "Proof of funds", desc: "Bank statement or sponsor letter." },
      { title: "Itinerary & accommodation", desc: "Booking confirmations and return travel." },
    ],
  },
  work: {
    title: "Skilled Work",
    workRights: "Full work rights",
    justification: "Skilled work routes hinge on a genuine sponsored job meeting salary and skill thresholds.",
    baseAcceptance: 78,
    timeline: ["Sponsor licence and job checked", "Application and biometrics", "Decision and permit issued"],
    documents: [
      { title: "Job offer / contract", desc: "Signed offer from a licensed sponsor." },
      { title: "Sponsor certificate", desc: "Sponsorship reference from the employer." },
      { title: "Qualifications", desc: "Degree or credential assessment." },
      { title: "Salary evidence", desc: "Contract or payslip." },
    ],
  },
  study: {
    title: "Study",
    workRights: "Limited part-time",
    justification: "A confirmed admission letter plus clear funding evidence is the core of nearly every study route's decision.",
    baseAcceptance: 89,
    timeline: ["Admission verified", "Financial evidence checked", "Study permit issued"],
    documents: [
      { title: "Admission letter", desc: "Confirmed place at a recognized institution." },
      { title: "Proof of funds", desc: "Tuition and living-cost funds." },
      { title: "Academic transcripts", desc: "Prior qualifications." },
      { title: "Insurance", desc: "Health or travel insurance." },
    ],
  },
  family: {
    title: "Family / Reunification",
    workRights: "Full work rights",
    justification: "Family routes are decided on genuine-relationship evidence and the sponsor's own status.",
    baseAcceptance: 81,
    timeline: ["Relationship evidence verified", "Sponsor eligibility checked", "Decision issued"],
    documents: [
      { title: "Relationship evidence", desc: "Marriage or birth certificate." },
      { title: "Sponsor status proof", desc: "Sponsor's citizenship or residence." },
      { title: "Financial evidence", desc: "Sponsor income meeting any threshold." },
      { title: "Accommodation proof", desc: "Evidence of adequate housing." },
    ],
  },
  investor: {
    title: "Investor / Golden Visa",
    workRights: "Business-specific",
    justification: "Investor routes are approved on due diligence and provable source of funds.",
    baseAcceptance: 74,
    timeline: ["Source-of-funds review", "Due diligence", "Residence or approval granted"],
    documents: [
      { title: "Source of funds", desc: "Bank and tax records." },
      { title: "Business/property records", desc: "Evidence of the qualifying investment." },
      { title: "Due-diligence documents", desc: "Background checks." },
      { title: "Passport", desc: "Valid travel document." },
    ],
  },
};

const PURPOSE_TO_CATEGORY = {
  tourism: "visitor",
  business: "visitor",
  work: "work",
  study: "study",
  family: "family",
  investment: "investor",
};

/**
 * Mirrors VisaRoute.matches(destination:purpose:profile:) — the category
 * baseline nudged by the destination's guaranteed-decision window and any
 * travel-history factors, matching the same heuristic the iOS app uses.
 */
function matchRoute(destinationCode, purposeKey, profile) {
  const dest = destinationByCode(destinationCode) || { name: "your destination", guaranteedDays: 8, validity: "90 days" };
  const categoryKey = PURPOSE_TO_CATEGORY[purposeKey] || "visitor";
  const category = CATEGORIES[categoryKey];
  let chance = category.baseAcceptance;
  const factors = [];

  profile = profile || {};
  if (profile.hasRefusal) {
    chance -= 15;
    factors.push("−15% for a prior visa refusal on record");
  } else if (profile.hasPriorVisa) {
    chance += 6;
    factors.push("+6% for a clean prior visa history");
  }
  chance = Math.max(20, Math.min(98, chance));

  return {
    destination: dest,
    category: categoryKey,
    name: `${dest.name} ${category.title}`,
    duration: dest.validity,
    workRights: category.workRights,
    justification: category.justification,
    timeline: category.timeline,
    documents: category.documents,
    acceptanceChance: chance,
    factors: factors,
  };
}

function viabilityScore(dest, profile) {
  const route = matchRoute(dest.code, "tourism", profile);
  return route.acceptanceChance - dest.guaranteedDays;
}

function rankedDestinations(profile) {
  return DESTINATIONS
    .map((d) => ({ dest: d, score: viabilityScore(d, profile) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.dest);
}
