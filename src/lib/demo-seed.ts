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
  "James",
  "Robert",
  "John",
  "Michael",
  "David",
  "William",
  "Richard",
  "Joseph",
  "Thomas",
  "Christopher",
  "Charles",
  "Daniel",
  "Matthew",
  "Anthony",
  "Mark",
  "Steven",
  "Andrew",
  "Paul",
  "Joshua",
  "Kenneth",
  "Kevin",
  "Brian",
  "George",
  "Timothy",
  "Ronald",
  "Edward",
  "Jason",
  "Jeffrey",
  "Ryan",
  "Jacob",
  "Gary",
  "Nicholas",
  "Eric",
  "Jonathan",
  "Stephen",
  "Larry",
  "Justin",
  "Scott",
  "Brandon",
  "Benjamin",
  "Samuel",
  "Raymond",
  "Gregory",
  "Frank",
  "Alexander",
  "Patrick",
  "Jack",
  "Dennis",
  "Jerry",
  "Tyler",
  "Aaron",
  "Jose",
  "Adam",
  "Nathan",
  "Henry",
  "Douglas",
  "Peter",
  "Zachary",
  "Kyle",
  "Raj",
  "Amit",
  "Wei",
  "Jin",
  "Ahmed",
  "Omar",
  "Hassan",
  "Ali",
  "Mohammed",
  "Sanjay",
  "Vikram",
  "Carlos",
  "Luis",
];

const FIRST_NAMES_FEMALE = [
  "Mary",
  "Patricia",
  "Jennifer",
  "Linda",
  "Barbara",
  "Elizabeth",
  "Susan",
  "Jessica",
  "Sarah",
  "Karen",
  "Lisa",
  "Nancy",
  "Betty",
  "Margaret",
  "Sandra",
  "Ashley",
  "Dorothy",
  "Kimberly",
  "Emily",
  "Donna",
  "Michelle",
  "Carol",
  "Amanda",
  "Melissa",
  "Deborah",
  "Stephanie",
  "Rebecca",
  "Sharon",
  "Laura",
  "Cynthia",
  "Kathleen",
  "Amy",
  "Angela",
  "Shirley",
  "Anna",
  "Brenda",
  "Pamela",
  "Emma",
  "Nicole",
  "Helen",
  "Samantha",
  "Katherine",
  "Christine",
  "Debra",
  "Rachel",
  "Carolyn",
  "Janet",
  "Catherine",
  "Maria",
  "Heather",
  "Diane",
  "Priya",
  "Anita",
  "Mei",
  "Yuki",
  "Fatima",
  "Aisha",
  "Sara",
  "Lakshmi",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Patel",
  "Shah",
  "Kumar",
  "Chen",
  "Wang",
  "Li",
  "Zhang",
  "Kim",
  "Park",
  "Singh",
  "Gupta",
  "Das",
  "Reddy",
  "Khan",
  "Ali",
  "Hassan",
  "Cohen",
  "Rosenberg",
  "Goldstein",
  "Fischer",
  "Weber",
  "Mueller",
  "O'Brien",
  "Sullivan",
  "Murphy",
  "Kelly",
  "Tanaka",
  "Yamamoto",
  "Nakamura",
  "Cho",
  "Chang",
  "Wu",
  "Yang",
];

const MEDICAL_SCHOOLS = [
  "Harvard Medical School",
  "Johns Hopkins School of Medicine",
  "Stanford University School of Medicine",
  "Yale School of Medicine",
  "Columbia University Vagelos College",
  "UCSF School of Medicine",
  "University of Pennsylvania Perelman School",
  "Duke University School of Medicine",
  "Washington University School of Medicine",
  "Cornell Weill Medical College",
  "Mount Sinai Icahn School of Medicine",
  "NYU Grossman School of Medicine",
  "UCLA David Geffen School of Medicine",
  "University of Michigan Medical School",
  "Emory University School of Medicine",
  "Baylor College of Medicine",
  "University of Chicago Pritzker School",
  "Northwestern Feinberg School of Medicine",
  "Vanderbilt University School of Medicine",
  "University of Virginia School of Medicine",
  "Case Western Reserve School of Medicine",
  "University of Pittsburgh School of Medicine",
  "Boston University Chobanian & Avedisian School",
  "Georgetown University School of Medicine",
  "Tufts University School of Medicine",
  "Thomas Jefferson University",
  "Rush Medical College",
  "Medical College of Wisconsin",
  "All India Institute of Medical Sciences",
  "University of Toronto Faculty of Medicine",
];

const HOSPITALS = [
  "Massachusetts General Hospital",
  "Mayo Clinic",
  "Cleveland Clinic",
  "Johns Hopkins Hospital",
  "UCLA Medical Center",
  "UCSF Medical Center",
  "NewYork-Presbyterian Hospital",
  "Northwestern Memorial Hospital",
  "Cedars-Sinai Medical Center",
  "Stanford Health Care",
  "Mount Sinai Hospital",
  "Duke University Hospital",
  "University of Michigan Health",
  "Brigham and Women's Hospital",
  "Memorial Sloan Kettering",
  "MD Anderson Cancer Center",
  "Beth Israel Deaconess Medical Center",
  "Emory University Hospital",
  "Vanderbilt University Medical Center",
  "University of Pennsylvania Hospital",
  "Rush University Medical Center",
  "UPMC Presbyterian",
  "Barnes-Jewish Hospital",
  "NYU Langone Health",
  "Houston Methodist Hospital",
  "Scripps Mercy Hospital",
  "Kaiser Permanente",
  "Providence Health",
  "HCA Healthcare",
  "AdventHealth",
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

export interface DemoPublication {
  title: string;
  journal: string;
  year: number;
  citationCount: number;
  doi: string;
}

export interface DemoClinicalTrial {
  title: string;
  phase: string;
  status: "Completed" | "Recruiting" | "Active" | "Terminated";
  role: "Principal Investigator" | "Co-Investigator" | "Sub-Investigator";
  startYear: number;
  nctId: string;
}

export interface DemoConferenceAppearance {
  conference: string;
  year: number;
  type: "Speaker" | "Panelist" | "Poster" | "Attendee";
  topic: string;
}

export interface DemoOpenPayment {
  year: number;
  company: string;
  amount: number;
  category: "Consulting" | "Speaking" | "Food & Beverage" | "Travel" | "Research" | "Education";
}

export interface DemoTopDrug {
  name: string;
  category: string;
  rxVolume: number;
  trend: "increasing" | "stable" | "decreasing";
}

export interface DemoOutreachEvent {
  id: string;
  date: string;
  channel: "email" | "sms" | "direct_mail" | "social" | "phone";
  subject: string;
  status: "sent" | "delivered" | "opened" | "clicked" | "replied" | "bounced" | "scheduled";
  sentiment?: "positive" | "neutral" | "negative";
}

export interface DemoDataSource {
  field: string;
  source: string;
  lastUpdated: string;
  confidence: "high" | "medium" | "low";
}

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
  residency: string;
  boardCertifications: string[];
  completenessScore: number;
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
    topDrugs: DemoTopDrug[];
    therapeuticAreas: string[];
    openPayments: DemoOpenPayment[];
  };
  digitalPresence: {
    hasLinkedIn: boolean;
    hasTwitter: boolean;
    hasDoximity: boolean;
    publicationCount: number;
    isKol: boolean;
    linkedInUrl?: string;
    twitterHandle?: string;
    doximityUrl?: string;
    engagementScore: number;
    kolScore: number;
  };
  research: {
    publications: DemoPublication[];
    clinicalTrials: DemoClinicalTrial[];
    conferenceAppearances: DemoConferenceAppearance[];
  };
  aiPersona: {
    archetype: string;
    narrative: string;
    executiveSummary: string;
    communicationPreferences: string[];
    keyMotivators: string[];
    bestTimeToReach: string;
    preferredChannels: string[];
  };
  outreach: {
    currentStrategy: string;
    events: DemoOutreachEvent[];
    nextScheduled?: DemoOutreachEvent;
    engagementRate: number;
    totalTouchpoints: number;
  };
  dataSources: DemoDataSource[];
}

// ─── Therapeutic area mapping ───────────────────────────────────────────────

const THERAPEUTIC_AREAS: Record<string, string[]> = {
  "Internal Medicine": ["Hypertension", "Diabetes", "COPD", "Heart Failure"],
  "Family Medicine": ["Diabetes", "Hypertension", "Depression", "Asthma"],
  Cardiology: ["Heart Failure", "Atrial Fibrillation", "Coronary Artery Disease", "Hypertension"],
  Oncology: ["Breast Cancer", "Lung Cancer", "Colorectal Cancer", "Lymphoma"],
  "Orthopedic Surgery": [
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Osteoporosis",
    "Pain Management",
  ],
  Dermatology: ["Psoriasis", "Atopic Dermatitis", "Acne", "Melanoma"],
  Neurology: ["Multiple Sclerosis", "Epilepsy", "Parkinson's Disease", "Migraine"],
  Psychiatry: ["Major Depression", "Bipolar Disorder", "Schizophrenia", "ADHD"],
  Gastroenterology: ["Crohn's Disease", "Ulcerative Colitis", "GERD", "IBS"],
  Endocrinology: ["Type 2 Diabetes", "Thyroid Disorders", "Obesity", "Osteoporosis"],
  Pulmonology: ["COPD", "Asthma", "Pulmonary Fibrosis", "Sleep Apnea"],
  Rheumatology: ["Rheumatoid Arthritis", "Lupus", "Psoriatic Arthritis", "Gout"],
  Nephrology: [
    "Chronic Kidney Disease",
    "Diabetic Nephropathy",
    "Hypertension",
    "Glomerulonephritis",
  ],
  Hematology: ["Lymphoma", "Leukemia", "Anemia", "Myeloma"],
  "Infectious Disease": ["HIV", "Hepatitis C", "COVID-19", "Sepsis"],
  "Allergy & Immunology": ["Asthma", "Food Allergies", "Urticaria", "Anaphylaxis"],
  Urology: ["Prostate Cancer", "BPH", "Overactive Bladder", "Kidney Stones"],
  Ophthalmology: ["Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Cataracts"],
  Pediatrics: ["Asthma", "ADHD", "Obesity", "Infectious Disease"],
  "Emergency Medicine": ["Sepsis", "Trauma", "Acute MI", "Stroke"],
};

// ─── Additional Reference Data ──────────────────────────────────────────────

const JOURNALS = [
  "New England Journal of Medicine",
  "The Lancet",
  "JAMA",
  "BMJ",
  "Annals of Internal Medicine",
  "Nature Medicine",
  "JAMA Internal Medicine",
  "Circulation",
  "Journal of Clinical Oncology",
  "Gastroenterology",
  "Neurology",
  "JAMA Cardiology",
  "The Lancet Oncology",
  "Chest",
  "American Journal of Psychiatry",
  "Journal of the American College of Cardiology",
  "Journal of Bone and Joint Surgery",
  "JAMA Dermatology",
  "Kidney International",
  "Blood",
  "Clinical Infectious Diseases",
  "Journal of Allergy and Clinical Immunology",
];

const PHARMA_COMPANIES = [
  "Pfizer",
  "Johnson & Johnson",
  "AbbVie",
  "Merck",
  "Bristol-Myers Squibb",
  "Eli Lilly",
  "AstraZeneca",
  "Novartis",
  "Roche",
  "Amgen",
  "Gilead Sciences",
  "Sanofi",
  "Regeneron",
  "Biogen",
  "Moderna",
  "Bayer",
  "Takeda",
  "Novo Nordisk",
  "GSK",
  "Boehringer Ingelheim",
];

const CONFERENCES = [
  "American Heart Association (AHA) Scientific Sessions",
  "American Society of Clinical Oncology (ASCO) Annual Meeting",
  "American College of Cardiology (ACC) Scientific Session",
  "Digestive Disease Week (DDW)",
  "American Academy of Neurology (AAN) Annual Meeting",
  "American Psychiatric Association (APA) Annual Meeting",
  "American Academy of Dermatology (AAD) Annual Meeting",
  "European Society of Cardiology (ESC) Congress",
  "American Thoracic Society (ATS) International Conference",
  "American College of Rheumatology (ACR) Annual Meeting",
  "Kidney Week (ASN)",
  "American Society of Hematology (ASH) Annual Meeting",
  "IDWeek",
  "Endocrine Society Annual Meeting (ENDO)",
  "American Academy of Allergy, Asthma & Immunology (AAAAI)",
];

const DRUG_NAMES: Record<string, Array<{ name: string; category: string }>> = {
  "Internal Medicine": [
    { name: "Lisinopril", category: "ACE Inhibitor" },
    { name: "Metformin", category: "Antidiabetic" },
    { name: "Atorvastatin", category: "Statin" },
    { name: "Amlodipine", category: "Calcium Channel Blocker" },
    { name: "Omeprazole", category: "Proton Pump Inhibitor" },
  ],
  "Family Medicine": [
    { name: "Amoxicillin", category: "Antibiotic" },
    { name: "Metformin", category: "Antidiabetic" },
    { name: "Lisinopril", category: "ACE Inhibitor" },
    { name: "Albuterol", category: "Bronchodilator" },
    { name: "Sertraline", category: "SSRI" },
  ],
  Cardiology: [
    { name: "Entresto", category: "ARNI" },
    { name: "Eliquis", category: "Anticoagulant" },
    { name: "Jardiance", category: "SGLT2 Inhibitor" },
    { name: "Atorvastatin", category: "Statin" },
    { name: "Metoprolol", category: "Beta Blocker" },
  ],
  Oncology: [
    { name: "Keytruda", category: "Immunotherapy" },
    { name: "Opdivo", category: "Immunotherapy" },
    { name: "Ibrance", category: "CDK4/6 Inhibitor" },
    { name: "Revlimid", category: "Immunomodulator" },
    { name: "Tagrisso", category: "EGFR Inhibitor" },
  ],
  Dermatology: [
    { name: "Dupixent", category: "Biologic" },
    { name: "Humira", category: "TNF Inhibitor" },
    { name: "Skyrizi", category: "IL-23 Inhibitor" },
    { name: "Otezla", category: "PDE4 Inhibitor" },
    { name: "Tretinoin", category: "Retinoid" },
  ],
  Neurology: [
    { name: "Ocrevus", category: "Anti-CD20" },
    { name: "Aimovig", category: "CGRP Inhibitor" },
    { name: "Tecfidera", category: "DMT" },
    { name: "Vimpat", category: "Antiepileptic" },
    { name: "Levodopa", category: "Dopamine Precursor" },
  ],
  Psychiatry: [
    { name: "Lexapro", category: "SSRI" },
    { name: "Abilify", category: "Atypical Antipsychotic" },
    { name: "Vyvanse", category: "Stimulant" },
    { name: "Lamotrigine", category: "Mood Stabilizer" },
    { name: "Wellbutrin", category: "NDRI" },
  ],
  Gastroenterology: [
    { name: "Humira", category: "TNF Inhibitor" },
    { name: "Stelara", category: "IL-12/23 Inhibitor" },
    { name: "Entyvio", category: "Integrin Inhibitor" },
    { name: "Linzess", category: "GC-C Agonist" },
    { name: "Nexium", category: "Proton Pump Inhibitor" },
  ],
  Endocrinology: [
    { name: "Ozempic", category: "GLP-1 Agonist" },
    { name: "Jardiance", category: "SGLT2 Inhibitor" },
    { name: "Synthroid", category: "Thyroid Hormone" },
    { name: "Trulicity", category: "GLP-1 Agonist" },
    { name: "Mounjaro", category: "GIP/GLP-1 Agonist" },
  ],
  Pulmonology: [
    { name: "Trelegy Ellipta", category: "Triple Therapy" },
    { name: "Dupixent", category: "Biologic" },
    { name: "Nucala", category: "Anti-IL-5" },
    { name: "Spiriva", category: "LAMA" },
    { name: "Ofev", category: "Kinase Inhibitor" },
  ],
  Rheumatology: [
    { name: "Humira", category: "TNF Inhibitor" },
    { name: "Rinvoq", category: "JAK Inhibitor" },
    { name: "Xeljanz", category: "JAK Inhibitor" },
    { name: "Cosentyx", category: "IL-17A Inhibitor" },
    { name: "Allopurinol", category: "Xanthine Oxidase Inhibitor" },
  ],
  Nephrology: [
    { name: "Farxiga", category: "SGLT2 Inhibitor" },
    { name: "Kerendia", category: "MRA" },
    { name: "Epogen", category: "ESA" },
    { name: "Sevelamer", category: "Phosphate Binder" },
    { name: "Lisinopril", category: "ACE Inhibitor" },
  ],
  Hematology: [
    { name: "Revlimid", category: "Immunomodulator" },
    { name: "Imbruvica", category: "BTK Inhibitor" },
    { name: "Darzalex", category: "Anti-CD38" },
    { name: "Calquence", category: "BTK Inhibitor" },
    { name: "Rituxan", category: "Anti-CD20" },
  ],
  "Infectious Disease": [
    { name: "Biktarvy", category: "Antiretroviral" },
    { name: "Paxlovid", category: "Antiviral" },
    { name: "Epclusa", category: "HCV Antiviral" },
    { name: "Daptomycin", category: "Antibiotic" },
    { name: "Voriconazole", category: "Antifungal" },
  ],
};

const RESIDENCY_PROGRAMS = [
  "Massachusetts General Hospital",
  "Johns Hopkins Hospital",
  "Mayo Clinic",
  "Cleveland Clinic",
  "Brigham and Women's Hospital",
  "UCSF Medical Center",
  "NYU Langone Health",
  "Stanford Health Care",
  "University of Michigan",
  "Duke University Hospital",
  "University of Pennsylvania",
  "Columbia University Medical Center",
  "Mount Sinai Hospital",
  "Northwestern Memorial Hospital",
  "UCLA Medical Center",
];

const ARCHETYPES = [
  "Evidence-Driven Innovator",
  "Patient-Centric Practitioner",
  "Research-Focused Academic",
  "Efficiency-Minded Clinician",
  "Collaborative Team Leader",
  "Technology-Forward Adopter",
  "Conservative Care Specialist",
  "Community Health Advocate",
];

const OUTREACH_SUBJECTS_EMAIL = [
  "New Clinical Data for {area}",
  "Invitation: Peer Exchange on {area}",
  "Patient Case Study: {area} Treatment Outcomes",
  "CME Opportunity: Advances in {area}",
  "Research Update: {area} Management Guidelines",
  "Formulary Update: New Options for {area}",
];

const OUTREACH_SUBJECTS_SMS = [
  "Quick update on {area} clinical data",
  "New {area} resource available",
  "Reminder: Upcoming {area} webinar",
];

// ─── Generator ──────────────────────────────────────────────────────────────

const DEMO_SEED = 42;
const DEMO_COUNT = 1000;

function generatePublications(
  rng: SeededRandom,
  specialty: string,
  count: number,
  lastName: string,
): DemoPublication[] {
  const pubs: DemoPublication[] = [];
  const areas = THERAPEUTIC_AREAS[specialty] || ["General Medicine"];
  for (let i = 0; i < count; i++) {
    const area = rng.pick(areas);
    const year = 2024 - rng.int(0, 15);
    const titles = [
      `A Randomized Trial of Novel Therapy in ${area}`,
      `Long-term Outcomes in ${area}: A Retrospective Analysis`,
      `${area} Treatment Patterns Among US Physicians`,
      `Comparative Effectiveness of ${area} Interventions`,
      `Real-World Evidence for ${area} Management`,
      `Biomarker-Guided Therapy in ${area}: A Prospective Study`,
      `Patient-Reported Outcomes in ${area} Clinical Practice`,
      `Safety and Efficacy of Combination Therapy in ${area}`,
    ];
    pubs.push({
      title: rng.pick(titles),
      journal: rng.pick(JOURNALS),
      year,
      citationCount: rng.int(0, 200),
      doi: `10.${rng.int(1000, 9999)}/${rng.int(100000, 999999)}`,
    });
  }
  return pubs.sort((a, b) => b.year - a.year);
}

function generateTrials(
  rng: SeededRandom,
  specialty: string,
  yearsInPractice: number,
): DemoClinicalTrial[] {
  if (yearsInPractice < 5 || rng.next() < 0.4) return [];
  const count = rng.int(1, Math.min(6, Math.floor(yearsInPractice / 4)));
  const trials: DemoClinicalTrial[] = [];
  const areas = THERAPEUTIC_AREAS[specialty] || ["General Medicine"];
  const phases = ["Phase I", "Phase II", "Phase III", "Phase IV"];
  const statuses: DemoClinicalTrial["status"][] = [
    "Completed",
    "Recruiting",
    "Active",
    "Terminated",
  ];
  const roles: DemoClinicalTrial["role"][] = [
    "Principal Investigator",
    "Co-Investigator",
    "Sub-Investigator",
  ];
  for (let i = 0; i < count; i++) {
    const area = rng.pick(areas);
    trials.push({
      title: `${rng.pick(phases)} Study of Novel Agent in ${area}`,
      phase: rng.pick(phases),
      status: rng.pick(statuses),
      role: yearsInPractice > 15 ? rng.pick(roles.slice(0, 2)) : rng.pick(roles),
      startYear: 2024 - rng.int(0, 8),
      nctId: `NCT${String(rng.int(10000000, 99999999))}`,
    });
  }
  return trials;
}

function generateConferences(
  rng: SeededRandom,
  specialty: string,
  yearsInPractice: number,
): DemoConferenceAppearance[] {
  if (rng.next() < 0.3) return [];
  const count = rng.int(1, Math.min(5, Math.floor(yearsInPractice / 3)));
  const appearances: DemoConferenceAppearance[] = [];
  const areas = THERAPEUTIC_AREAS[specialty] || ["General Medicine"];
  const types: DemoConferenceAppearance["type"][] = ["Speaker", "Panelist", "Poster", "Attendee"];
  for (let i = 0; i < count; i++) {
    appearances.push({
      conference: rng.pick(CONFERENCES),
      year: 2024 - rng.int(0, 4),
      type: yearsInPractice > 15 ? rng.pick(types.slice(0, 3)) : rng.pick(types),
      topic: `${rng.pick(["Advances in", "Current Management of", "Novel Approaches to", "Evidence-Based"])} ${rng.pick(areas)}`,
    });
  }
  return appearances;
}

function generateOpenPayments(rng: SeededRandom, prescribingVolume: string): DemoOpenPayment[] {
  if (rng.next() < 0.2) return [];
  const count = rng.int(2, 8);
  const payments: DemoOpenPayment[] = [];
  const categories: DemoOpenPayment["category"][] = [
    "Consulting",
    "Speaking",
    "Food & Beverage",
    "Travel",
    "Research",
    "Education",
  ];
  for (let i = 0; i < count; i++) {
    const category = rng.pick(categories);
    let baseAmount = 0;
    switch (category) {
      case "Research":
        baseAmount = rng.int(5000, 150000);
        break;
      case "Consulting":
        baseAmount = rng.int(1000, 25000);
        break;
      case "Speaking":
        baseAmount = rng.int(500, 15000);
        break;
      case "Travel":
        baseAmount = rng.int(200, 5000);
        break;
      case "Education":
        baseAmount = rng.int(100, 8000);
        break;
      case "Food & Beverage":
        baseAmount = rng.int(15, 500);
        break;
    }
    if (prescribingVolume === "high") baseAmount = Math.round(baseAmount * 1.3);
    payments.push({
      year: 2024 - rng.int(0, 3),
      company: rng.pick(PHARMA_COMPANIES),
      amount: baseAmount,
      category,
    });
  }
  return payments.sort((a, b) => b.year - a.year || b.amount - a.amount);
}

function generateOutreachEvents(rng: SeededRandom, area: string): DemoOutreachEvent[] {
  const count = rng.int(3, 12);
  const events: DemoOutreachEvent[] = [];
  const channels: DemoOutreachEvent["channel"][] = [
    "email",
    "sms",
    "direct_mail",
    "social",
    "phone",
  ];
  const sentiments: DemoOutreachEvent["sentiment"][] = ["positive", "neutral", "negative"];

  for (let i = 0; i < count; i++) {
    const channel = rng.pick(channels);
    const daysAgo = rng.int(1, 180);
    const date = new Date(2025, 1, 13);
    date.setDate(date.getDate() - daysAgo);
    const statusRoll = rng.next();
    let status: DemoOutreachEvent["status"];
    if (statusRoll < 0.05) status = "bounced";
    else if (statusRoll < 0.2) status = "sent";
    else if (statusRoll < 0.4) status = "delivered";
    else if (statusRoll < 0.65) status = "opened";
    else if (statusRoll < 0.8) status = "clicked";
    else status = "replied";

    let subject: string;
    if (channel === "email") {
      subject = rng.pick(OUTREACH_SUBJECTS_EMAIL).replace("{area}", area);
    } else if (channel === "sms") {
      subject = rng.pick(OUTREACH_SUBJECTS_SMS).replace("{area}", area);
    } else {
      subject = `${rng.pick(["Follow-up", "Introduction", "Resource sharing", "Meeting request"])}: ${area}`;
    }

    events.push({
      id: `evt-${i}-${rng.int(1000, 9999)}`,
      date: date.toISOString().split("T")[0],
      channel,
      subject,
      status,
      sentiment: status === "replied" ? rng.pick(sentiments) : undefined,
    });
  }
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

function generatePersona(
  rng: SeededRandom,
  firstName: string,
  lastName: string,
  specialty: string,
  yearsInPractice: number,
  isKol: boolean,
  prescribingVolume: string,
  area: string,
  affiliation: string,
): DemoHcpProfile["aiPersona"] {
  const archetype = rng.pick(ARCHETYPES);
  const channels = ["email", "in-person", "webinar", "phone", "social media"];
  const preferredChannels = [rng.pick(channels)];
  if (rng.next() > 0.4)
    preferredChannels.push(rng.pick(channels.filter((c) => !preferredChannels.includes(c))));

  const times = [
    "Early morning (7-9 AM)",
    "Mid-morning (9-11 AM)",
    "Lunch break (12-1 PM)",
    "Late afternoon (4-6 PM)",
    "Evening (7-9 PM)",
  ];

  const motivators = [
    "Patient outcomes improvement",
    "Clinical evidence and data",
    "Peer recognition and thought leadership",
    "Practice efficiency",
    "Innovative treatment options",
    "Continuing medical education",
    "Cost-effectiveness data",
    "Real-world evidence",
  ];
  const selectedMotivators = [rng.pick(motivators)];
  for (let i = 0; i < 2; i++) {
    const m = rng.pick(motivators.filter((x) => !selectedMotivators.includes(x)));
    selectedMotivators.push(m);
  }

  const commPrefs = [
    "Prefers data-driven conversations",
    "Values brevity and conciseness",
    "Responds well to peer-reviewed evidence",
    "Appreciates patient case examples",
    "Open to digital engagement",
    "Prefers formal communication style",
    "Engages with visual data presentations",
  ];
  const selectedComm = [rng.pick(commPrefs)];
  if (rng.next() > 0.3)
    selectedComm.push(rng.pick(commPrefs.filter((x) => !selectedComm.includes(x))));

  const kolNarrative = isKol
    ? ` As a recognized Key Opinion Leader in ${specialty}, Dr. ${lastName} influences prescribing patterns among peers and frequently contributes to clinical guidelines. Their extensive publication record and conference appearances make them a valuable target for medical affairs engagement.`
    : "";

  const volumeNote =
    prescribingVolume === "high"
      ? ` Their high prescribing volume in ${area} indicates strong clinical activity and patient throughput.`
      : prescribingVolume === "medium"
        ? ` Their moderate prescribing volume suggests a balanced patient panel with opportunity for therapeutic education.`
        : ` Their focused prescribing pattern suggests a specialized patient population with selective treatment decisions.`;

  return {
    archetype,
    narrative: `Dr. ${firstName} ${lastName} is a ${yearsInPractice}-year ${specialty} practitioner affiliated with ${affiliation}. They exhibit characteristics of the "${archetype}" profile, driven primarily by ${selectedMotivators[0].toLowerCase()} and ${selectedMotivators[1].toLowerCase()}.${kolNarrative}${volumeNote} Engagement strategies should leverage their preference for ${preferredChannels.join(" and ")}-based communication, focusing on ${area}-related clinical data and outcomes.`,
    executiveSummary: `${archetype} profile | ${yearsInPractice} years in ${specialty} | ${prescribingVolume} volume prescriber | Primary focus: ${area}${isKol ? " | KOL status" : ""} | Best engaged via ${preferredChannels[0]}`,
    communicationPreferences: selectedComm,
    keyMotivators: selectedMotivators,
    bestTimeToReach: rng.pick(times),
    preferredChannels,
  };
}

function generateDataSources(rng: SeededRandom): DemoDataSource[] {
  const now = new Date(2025, 1, 13);
  const sources: DemoDataSource[] = [
    {
      field: "NPI & Basic Demographics",
      source: "NPPES NPI Registry",
      lastUpdated: dateOffset(now, -rng.int(1, 30)),
      confidence: "high",
    },
    {
      field: "Practice Location",
      source: "NPPES NPI Registry",
      lastUpdated: dateOffset(now, -rng.int(1, 30)),
      confidence: "high",
    },
    {
      field: "Specialty & Credentials",
      source: "NPPES NPI Registry + State Medical Board",
      lastUpdated: dateOffset(now, -rng.int(5, 60)),
      confidence: "high",
    },
    {
      field: "Board Certifications",
      source: "ABMS Board Verification",
      lastUpdated: dateOffset(now, -rng.int(10, 90)),
      confidence: "high",
    },
    {
      field: "Education & Residency",
      source: "ABMS + Doximity Profile Scrape",
      lastUpdated: dateOffset(now, -rng.int(30, 120)),
      confidence: "medium",
    },
    {
      field: "Affiliation",
      source: "CMS Provider Enrollment + Hospital Website Scrape",
      lastUpdated: dateOffset(now, -rng.int(10, 60)),
      confidence: "medium",
    },
    {
      field: "Prescribing Data",
      source: "CMS Medicare Part D Prescriber Data",
      lastUpdated: dateOffset(now, -rng.int(60, 180)),
      confidence: "high",
    },
    {
      field: "Open Payments",
      source: "CMS Open Payments Database",
      lastUpdated: dateOffset(now, -rng.int(60, 180)),
      confidence: "high",
    },
    {
      field: "Publications",
      source: "PubMed API + Google Scholar Scrape",
      lastUpdated: dateOffset(now, -rng.int(5, 30)),
      confidence: "medium",
    },
    {
      field: "Clinical Trials",
      source: "ClinicalTrials.gov API",
      lastUpdated: dateOffset(now, -rng.int(5, 30)),
      confidence: "high",
    },
    {
      field: "Conference Appearances",
      source: "Conference Website Scrape + Doximity",
      lastUpdated: dateOffset(now, -rng.int(15, 90)),
      confidence: "low",
    },
    {
      field: "Social Profiles",
      source: "LinkedIn Scrape + Twitter API + Doximity",
      lastUpdated: dateOffset(now, -rng.int(1, 14)),
      confidence: "medium",
    },
    {
      field: "AI Persona",
      source: "GPT-4o Analysis (Internal)",
      lastUpdated: dateOffset(now, -rng.int(1, 7)),
      confidence: "medium",
    },
    {
      field: "Outreach History",
      source: "Internal CRM (Salesforce)",
      lastUpdated: dateOffset(now, -1),
      confidence: "high",
    },
  ];
  return sources;
}

function dateOffset(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

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
  const residency = rng.pick(RESIDENCY_PROGRAMS);
  const stateData = rng.pick(STATES);
  const city = rng.pick(stateData.cities);
  const hospital = rng.pick(HOSPITALS);

  const therapeuticAreas = THERAPEUTIC_AREAS[specialty] || ["General Medicine"];
  const topTherapeuticArea = rng.pick(therapeuticAreas);
  const volumeRoll = rng.next();
  const prescribingVolume = volumeRoll < 0.3 ? "high" : volumeRoll < 0.7 ? "medium" : "low";
  const brandRoll = rng.next();
  const brandVsGeneric =
    brandRoll < 0.35 ? "brand-leaning" : brandRoll < 0.65 ? "balanced" : "generic-leaning";

  const publicationCount = yearsInPractice > 10 ? rng.int(0, 50) : rng.int(0, 10);
  const isKol = publicationCount > 20 && rng.next() > 0.5;

  const certifications = [specialty];
  if (rng.next() > 0.7) certifications.push("Internal Medicine");

  const roles =
    yearsInPractice > 20
      ? ["Chief of " + specialty, "Department Chair", "Medical Director", "Section Head"]
      : yearsInPractice > 10
        ? ["Associate Professor", "Attending Physician", "Senior Physician"]
        : ["Assistant Professor", "Attending Physician", "Staff Physician"];

  const affiliationType =
    rng.next() > 0.3
      ? ("hospital" as const)
      : rng.next() > 0.5
        ? ("academic" as const)
        : ("group_practice" as const);

  const hasLinkedIn = rng.next() > 0.3;
  const hasTwitter = rng.next() > 0.7;
  const hasDoximity = rng.next() > 0.4;
  const engagementScore = rng.int(10, 100);
  const kolScore = isKol ? rng.int(70, 100) : rng.int(10, 60);

  // Generate top drugs for this specialty
  const specialtyDrugs = DRUG_NAMES[specialty] || DRUG_NAMES["Internal Medicine"]!;
  const topDrugs: DemoTopDrug[] = specialtyDrugs.map((d) => ({
    ...d,
    rxVolume:
      prescribingVolume === "high"
        ? rng.int(50, 200)
        : prescribingVolume === "medium"
          ? rng.int(20, 80)
          : rng.int(5, 30),
    trend: rng.pick(["increasing", "stable", "decreasing"] as const),
  }));

  const publications = generatePublications(
    rng,
    specialty,
    Math.min(publicationCount, 8),
    lastName,
  );
  const clinicalTrials = generateTrials(rng, specialty, yearsInPractice);
  const conferenceAppearances = generateConferences(rng, specialty, yearsInPractice);
  const openPayments = generateOpenPayments(rng, prescribingVolume);
  const outreachEvents = generateOutreachEvents(rng, topTherapeuticArea);
  const repliedCount = outreachEvents.filter(
    (e) => e.status === "replied" || e.status === "clicked" || e.status === "opened",
  ).length;
  const engagementRate =
    outreachEvents.length > 0 ? Math.round((repliedCount / outreachEvents.length) * 100) : 0;

  // Upcoming scheduled outreach
  const nextScheduledDate = new Date(2025, 1, 13);
  nextScheduledDate.setDate(nextScheduledDate.getDate() + rng.int(1, 14));
  const nextScheduled: DemoOutreachEvent = {
    id: `evt-next-${rng.int(1000, 9999)}`,
    date: nextScheduledDate.toISOString().split("T")[0],
    channel: rng.pick(["email", "sms", "phone"] as const),
    subject: `Follow-up: ${topTherapeuticArea} Treatment Update`,
    status: "scheduled",
  };

  const aiPersona = generatePersona(
    rng,
    firstName,
    lastName,
    specialty,
    yearsInPractice,
    isKol,
    prescribingVolume,
    topTherapeuticArea,
    hospital,
  );
  const dataSources = generateDataSources(rng);

  // Completeness score based on available data
  let completeness = 40; // base from NPI data
  if (publications.length > 0) completeness += 10;
  if (clinicalTrials.length > 0) completeness += 8;
  if (conferenceAppearances.length > 0) completeness += 5;
  if (hasLinkedIn || hasTwitter || hasDoximity) completeness += 7;
  if (openPayments.length > 0) completeness += 10;
  if (outreachEvents.length > 0) completeness += 10;
  completeness += rng.int(0, 10); // slight variance
  completeness = Math.min(100, completeness);

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
    residency,
    boardCertifications: certifications,
    completenessScore: completeness,
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
      topDrugs,
      therapeuticAreas,
      openPayments,
    },
    digitalPresence: {
      hasLinkedIn,
      hasTwitter,
      hasDoximity,
      publicationCount,
      isKol,
      linkedInUrl: hasLinkedIn
        ? `https://linkedin.com/in/dr-${firstName.toLowerCase()}-${lastName.toLowerCase()}`
        : undefined,
      twitterHandle: hasTwitter
        ? `@Dr${lastName}${specialty.replace(/\s+/g, "").slice(0, 4)}`
        : undefined,
      doximityUrl: hasDoximity
        ? `https://doximity.com/pub/dr-${firstName.toLowerCase()}-${lastName.toLowerCase()}`
        : undefined,
      engagementScore,
      kolScore,
    },
    research: {
      publications,
      clinicalTrials,
      conferenceAppearances,
    },
    aiPersona,
    outreach: {
      currentStrategy: `Multi-channel engagement focusing on ${aiPersona.preferredChannels.join(" and ")} communication, with emphasis on ${topTherapeuticArea} clinical data. Frequency: ${prescribingVolume === "high" ? "bi-weekly" : prescribingVolume === "medium" ? "monthly" : "quarterly"} touchpoints.`,
      events: outreachEvents,
      nextScheduled,
      engagementRate,
      totalTouchpoints: outreachEvents.length,
    },
    dataSources,
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
      profiles.reduce((sum, p) => sum + p.yearsInPractice, 0) / profiles.length,
    ),
  };
}
