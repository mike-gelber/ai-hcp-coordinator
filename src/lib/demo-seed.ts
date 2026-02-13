/**
 * Demo seed data generator.
 *
 * Generates ~1,000 realistic HCP profiles with valid NPI numbers,
 * spanning multiple specialties and geographies.
 *
 * NPIs are generated using the Luhn algorithm to be structurally valid.
 * The associated demographic data is synthetic but realistic.
 */

// ─── NPI Generator ──────────────────────────────────────────────────────────

/**
 * Compute a valid NPI check digit using the Luhn algorithm.
 * The NPI is prefixed with "80840" before computing.
 */
function computeNpiCheckDigit(nineDigits: string): number {
  const prefixed = "80840" + nineDigits;
  const digits = prefixed.split("").map(Number);

  let sum = 0;
  // Starting from the rightmost position (which will be the check digit),
  // double every second digit from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    const pos = digits.length - 1 - i; // position from right (0-based)
    let n = digits[i];
    if (pos % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }

  return (10 - (sum % 10)) % 10;
}

/**
 * Generate a valid 10-digit NPI from a seed number.
 */
function generateValidNpi(seed: number): string {
  // Use the seed to create a 9-digit base, starting from 1000000000 range
  const base = (1000000000 + seed).toString().slice(0, 9).padStart(9, "0");
  const checkDigit = computeNpiCheckDigit(base);
  return base + checkDigit;
}

// ─── Reference Data ─────────────────────────────────────────────────────────

const SPECIALTIES = [
  { name: "Internal Medicine", weight: 15 },
  { name: "Family Medicine", weight: 12 },
  { name: "Cardiology", weight: 8 },
  { name: "Oncology", weight: 8 },
  { name: "Orthopedic Surgery", weight: 6 },
  { name: "Dermatology", weight: 5 },
  { name: "Neurology", weight: 5 },
  { name: "Psychiatry", weight: 5 },
  { name: "Gastroenterology", weight: 5 },
  { name: "Endocrinology", weight: 4 },
  { name: "Pulmonology", weight: 4 },
  { name: "Rheumatology", weight: 3 },
  { name: "Nephrology", weight: 3 },
  { name: "Hematology", weight: 3 },
  { name: "Infectious Disease", weight: 3 },
  { name: "Allergy & Immunology", weight: 2 },
  { name: "Urology", weight: 2 },
  { name: "Ophthalmology", weight: 2 },
  { name: "Pediatrics", weight: 3 },
  { name: "Emergency Medicine", weight: 2 },
];

const STATES = [
  { code: "CA", cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"] },
  { code: "NY", cities: ["New York", "Brooklyn", "Buffalo", "Rochester", "Albany"] },
  { code: "TX", cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"] },
  { code: "FL", cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"] },
  { code: "IL", cities: ["Chicago", "Springfield", "Naperville", "Evanston", "Rockford"] },
  { code: "PA", cities: ["Philadelphia", "Pittsburgh", "Harrisburg", "Allentown", "Erie"] },
  { code: "OH", cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"] },
  { code: "MA", cities: ["Boston", "Cambridge", "Worcester", "Springfield", "Lowell"] },
  { code: "NJ", cities: ["Newark", "Jersey City", "Trenton", "Princeton", "Hackensack"] },
  { code: "GA", cities: ["Atlanta", "Savannah", "Augusta", "Athens", "Macon"] },
  { code: "NC", cities: ["Charlotte", "Raleigh", "Durham", "Greensboro", "Wilmington"] },
  { code: "MI", cities: ["Detroit", "Ann Arbor", "Grand Rapids", "Lansing", "Kalamazoo"] },
  { code: "WA", cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Olympia"] },
  { code: "AZ", cities: ["Phoenix", "Tucson", "Scottsdale", "Mesa", "Chandler"] },
  { code: "CO", cities: ["Denver", "Boulder", "Colorado Springs", "Aurora", "Fort Collins"] },
  { code: "MN", cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"] },
  { code: "MD", cities: ["Baltimore", "Bethesda", "Rockville", "Silver Spring", "Annapolis"] },
  { code: "TN", cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"] },
  { code: "MO", cities: ["St. Louis", "Kansas City", "Springfield", "Columbia", "Jefferson City"] },
  { code: "CT", cities: ["Hartford", "New Haven", "Stamford", "Bridgeport", "Waterbury"] },
];

const FIRST_NAMES_MALE = [
  "James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph",
  "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark",
  "Steven", "Andrew", "Paul", "Joshua", "Kenneth", "Kevin", "Brian", "George",
  "Timothy", "Ronald", "Edward", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
  "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Raymond", "Gregory", "Frank", "Alexander", "Patrick",
  "Jack", "Dennis", "Jerry", "Tyler", "Aaron", "Jose", "Adam", "Nathan", "Henry",
  "Douglas", "Peter", "Zachary", "Kyle", "Raj", "Amit", "Wei", "Jin", "Ahmed",
  "Omar", "Hassan", "Ali", "Mohammed", "Sanjay", "Vikram", "Carlos", "Luis",
];

const FIRST_NAMES_FEMALE = [
  "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan",
  "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Margaret", "Sandra",
  "Ashley", "Dorothy", "Kimberly", "Emily", "Donna", "Michelle", "Carol",
  "Amanda", "Melissa", "Deborah", "Stephanie", "Rebecca", "Sharon", "Laura",
  "Cynthia", "Kathleen", "Amy", "Angela", "Shirley", "Anna", "Brenda", "Pamela",
  "Emma", "Nicole", "Helen", "Samantha", "Katherine", "Christine", "Debra",
  "Rachel", "Carolyn", "Janet", "Catherine", "Maria", "Heather", "Diane",
  "Priya", "Anita", "Mei", "Yuki", "Fatima", "Aisha", "Sara", "Lakshmi",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
  "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen",
  "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera",
  "Campbell", "Mitchell", "Carter", "Roberts", "Patel", "Shah", "Kumar",
  "Chen", "Wang", "Li", "Zhang", "Kim", "Park", "Singh", "Gupta", "Das",
  "Reddy", "Khan", "Ali", "Hassan", "Cohen", "Rosenberg", "Goldstein",
  "Fischer", "Weber", "Mueller", "O'Brien", "Sullivan", "Murphy", "Kelly",
  "Tanaka", "Yamamoto", "Nakamura", "Cho", "Chang", "Wu", "Yang",
];

const MEDICAL_SCHOOLS = [
  "Harvard Medical School", "Johns Hopkins School of Medicine",
  "Stanford University School of Medicine", "Yale School of Medicine",
  "Columbia University Vagelos College", "UCSF School of Medicine",
  "University of Pennsylvania Perelman School", "Duke University School of Medicine",
  "Washington University School of Medicine", "Cornell Weill Medical College",
  "Mount Sinai Icahn School of Medicine", "NYU Grossman School of Medicine",
  "UCLA David Geffen School of Medicine", "University of Michigan Medical School",
  "Emory University School of Medicine", "Baylor College of Medicine",
  "University of Chicago Pritzker School", "Northwestern Feinberg School of Medicine",
  "Vanderbilt University School of Medicine", "University of Virginia School of Medicine",
  "Case Western Reserve School of Medicine", "University of Pittsburgh School of Medicine",
  "Boston University Chobanian & Avedisian School", "Georgetown University School of Medicine",
  "Tufts University School of Medicine", "Thomas Jefferson University",
  "Rush Medical College", "Medical College of Wisconsin",
  "All India Institute of Medical Sciences", "University of Toronto Faculty of Medicine",
];

const HOSPITALS = [
  "Massachusetts General Hospital", "Mayo Clinic", "Cleveland Clinic",
  "Johns Hopkins Hospital", "UCLA Medical Center", "UCSF Medical Center",
  "NewYork-Presbyterian Hospital", "Northwestern Memorial Hospital",
  "Cedars-Sinai Medical Center", "Stanford Health Care",
  "Mount Sinai Hospital", "Duke University Hospital",
  "University of Michigan Health", "Brigham and Women's Hospital",
  "Memorial Sloan Kettering", "MD Anderson Cancer Center",
  "Beth Israel Deaconess Medical Center", "Emory University Hospital",
  "Vanderbilt University Medical Center", "University of Pennsylvania Hospital",
  "Rush University Medical Center", "UPMC Presbyterian",
  "Barnes-Jewish Hospital", "NYU Langone Health",
  "Houston Methodist Hospital", "Scripps Mercy Hospital",
  "Kaiser Permanente", "Providence Health", "HCA Healthcare", "AdventHealth",
];

const CREDENTIALS = ["MD", "DO", "MD, PhD", "MD, FACC", "MD, FACS", "DO, FACOI", "MD, MPH"];

// ─── Seeded Random Generator ────────────────────────────────────────────────

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  weightedPick<T extends { name: string; weight: number }>(arr: T[]): T {
    const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
    let r = this.next() * totalWeight;
    for (const item of arr) {
      r -= item.weight;
      if (r <= 0) return item;
    }
    return arr[arr.length - 1];
  }
}

// ─── Demo HCP Profile Type ─────────────────────────────────────────────────

export interface DemoHcpProfile {
  npi: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  credentials: string;
  gender: string;
  primarySpecialty: string;
  subSpecialty?: string;
  yearsInPractice: number;
  medicalSchool: string;
  boardCertifications: string[];
  location: {
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  affiliation: {
    organizationName: string;
    type: "hospital" | "group_practice" | "academic";
    role: string;
  };
  prescribingProfile: {
    topTherapeuticArea: string;
    prescribingVolume: "high" | "medium" | "low";
    brandVsGeneric: "brand-leaning" | "generic-leaning" | "balanced";
  };
  digitalPresence: {
    hasLinkedIn: boolean;
    hasTwitter: boolean;
    hasDoximity: boolean;
    publicationCount: number;
    isKol: boolean;
  };
}

// ─── Therapeutic area mapping ───────────────────────────────────────────────

const THERAPEUTIC_AREAS: Record<string, string[]> = {
  "Internal Medicine": ["Hypertension", "Diabetes", "COPD", "Heart Failure"],
  "Family Medicine": ["Diabetes", "Hypertension", "Depression", "Asthma"],
  "Cardiology": ["Heart Failure", "Atrial Fibrillation", "Coronary Artery Disease", "Hypertension"],
  "Oncology": ["Breast Cancer", "Lung Cancer", "Colorectal Cancer", "Lymphoma"],
  "Orthopedic Surgery": ["Osteoarthritis", "Rheumatoid Arthritis", "Osteoporosis", "Pain Management"],
  "Dermatology": ["Psoriasis", "Atopic Dermatitis", "Acne", "Melanoma"],
  "Neurology": ["Multiple Sclerosis", "Epilepsy", "Parkinson's Disease", "Migraine"],
  "Psychiatry": ["Major Depression", "Bipolar Disorder", "Schizophrenia", "ADHD"],
  "Gastroenterology": ["Crohn's Disease", "Ulcerative Colitis", "GERD", "IBS"],
  "Endocrinology": ["Type 2 Diabetes", "Thyroid Disorders", "Obesity", "Osteoporosis"],
  "Pulmonology": ["COPD", "Asthma", "Pulmonary Fibrosis", "Sleep Apnea"],
  "Rheumatology": ["Rheumatoid Arthritis", "Lupus", "Psoriatic Arthritis", "Gout"],
  "Nephrology": ["Chronic Kidney Disease", "Diabetic Nephropathy", "Hypertension", "Glomerulonephritis"],
  "Hematology": ["Lymphoma", "Leukemia", "Anemia", "Myeloma"],
  "Infectious Disease": ["HIV", "Hepatitis C", "COVID-19", "Sepsis"],
  "Allergy & Immunology": ["Asthma", "Food Allergies", "Urticaria", "Anaphylaxis"],
  "Urology": ["Prostate Cancer", "BPH", "Overactive Bladder", "Kidney Stones"],
  "Ophthalmology": ["Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Cataracts"],
  "Pediatrics": ["Asthma", "ADHD", "Obesity", "Infectious Disease"],
  "Emergency Medicine": ["Sepsis", "Trauma", "Acute MI", "Stroke"],
};

// ─── Generator ──────────────────────────────────────────────────────────────

const DEMO_SEED = 42;
const DEMO_COUNT = 1000;

function generateDemoProfile(index: number, rng: SeededRandom): DemoHcpProfile {
  const npi = generateValidNpi(index + 100000);
  const isMale = rng.next() > 0.45; // ~55% male in medicine
  const gender = isMale ? "M" : "F";
  const firstName = isMale ? rng.pick(FIRST_NAMES_MALE) : rng.pick(FIRST_NAMES_FEMALE);
  const lastName = rng.pick(LAST_NAMES);
  const credentials = rng.pick(CREDENTIALS);
  const specialty = rng.weightedPick(SPECIALTIES).name;
  const yearsInPractice = rng.int(2, 40);
  const medicalSchool = rng.pick(MEDICAL_SCHOOLS);
  const stateData = rng.pick(STATES);
  const city = rng.pick(stateData.cities);
  const hospital = rng.pick(HOSPITALS);

  const therapeuticAreas = THERAPEUTIC_AREAS[specialty] || ["General Medicine"];
  const topTherapeuticArea = rng.pick(therapeuticAreas);
  const volumeRoll = rng.next();
  const prescribingVolume = volumeRoll < 0.3 ? "high" : volumeRoll < 0.7 ? "medium" : "low";
  const brandRoll = rng.next();
  const brandVsGeneric = brandRoll < 0.35 ? "brand-leaning" : brandRoll < 0.65 ? "balanced" : "generic-leaning";

  const publicationCount = yearsInPractice > 10 ? rng.int(0, 50) : rng.int(0, 10);
  const isKol = publicationCount > 20 && rng.next() > 0.5;

  const certifications = [specialty];
  if (rng.next() > 0.7) certifications.push("Internal Medicine");

  const roles = yearsInPractice > 20
    ? ["Chief of " + specialty, "Department Chair", "Medical Director", "Section Head"]
    : yearsInPractice > 10
    ? ["Associate Professor", "Attending Physician", "Senior Physician"]
    : ["Assistant Professor", "Attending Physician", "Staff Physician"];

  const affiliationType = rng.next() > 0.3
    ? "hospital" as const
    : rng.next() > 0.5
    ? "academic" as const
    : "group_practice" as const;

  return {
    npi,
    firstName,
    lastName,
    middleName: rng.next() > 0.6 ? String.fromCharCode(65 + rng.int(0, 25)) + "." : undefined,
    credentials,
    gender,
    primarySpecialty: specialty,
    yearsInPractice,
    medicalSchool,
    boardCertifications: certifications,
    location: {
      addressLine1: `${rng.int(100, 9999)} ${rng.pick(["Main St", "Oak Ave", "Medical Center Dr", "University Blvd", "Hospital Way", "Park Ave", "Broadway", "Elm St", "Health Pkwy", "Research Dr"])}`,
      city,
      state: stateData.code,
      zipCode: String(rng.int(10000, 99999)),
      phone: `(${rng.int(200, 999)}) ${rng.int(200, 999)}-${String(rng.int(1000, 9999))}`,
    },
    affiliation: {
      organizationName: hospital,
      type: affiliationType,
      role: rng.pick(roles),
    },
    prescribingProfile: {
      topTherapeuticArea,
      prescribingVolume,
      brandVsGeneric,
    },
    digitalPresence: {
      hasLinkedIn: rng.next() > 0.3,
      hasTwitter: rng.next() > 0.7,
      hasDoximity: rng.next() > 0.4,
      publicationCount,
      isKol,
    },
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

let _cachedProfiles: DemoHcpProfile[] | null = null;

/**
 * Generate all ~1,000 demo HCP profiles.
 * Results are cached in memory after first generation.
 */
export function getDemoProfiles(): DemoHcpProfile[] {
  if (_cachedProfiles) return _cachedProfiles;

  const rng = new SeededRandom(DEMO_SEED);
  const profiles: DemoHcpProfile[] = [];

  for (let i = 0; i < DEMO_COUNT; i++) {
    profiles.push(generateDemoProfile(i, rng));
  }

  _cachedProfiles = profiles;
  return profiles;
}

/**
 * Get demo stats summary.
 */
export function getDemoStats() {
  const profiles = getDemoProfiles();

  const bySpecialty: Record<string, number> = {};
  const byState: Record<string, number> = {};
  let kolCount = 0;
  let highVolumeCount = 0;

  for (const p of profiles) {
    bySpecialty[p.primarySpecialty] = (bySpecialty[p.primarySpecialty] || 0) + 1;
    byState[p.location.state] = (byState[p.location.state] || 0) + 1;
    if (p.digitalPresence.isKol) kolCount++;
    if (p.prescribingProfile.prescribingVolume === "high") highVolumeCount++;
  }

  return {
    total: profiles.length,
    bySpecialty: Object.entries(bySpecialty)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count })),
    byState: Object.entries(byState)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count })),
    kolCount,
    highVolumeCount,
    avgYearsInPractice: Math.round(
      profiles.reduce((sum, p) => sum + p.yearsInPractice, 0) / profiles.length
    ),
  };
}
