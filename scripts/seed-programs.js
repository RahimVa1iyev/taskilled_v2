const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyYWhpbXZhbGl5ZXY5OUBnbWFpbC5jb20iLCJ1c2VyX2lkIjo1OSwicm9sZV9pZCI6Mywicm9sZSI6InBhcnRuZXIiLCJ0eXAiOiJhY2Nlc3MiLCJleHAiOjE3Nzk5OTk4ODYsImlhdCI6MTc3OTk5NjI4Nn0.FToRoEnKnSJRLhAjfhMWyqLQw__RxbmhOByO4L1k2Tk";
const baseURL = "https://back.taskilled.com/business_simulation_ms/api/v1/program/create";

const programs = [
  {
    company_id: "14",
    title: "Lean Startup Bootcamp",
    description: "Build, measure, learn — run a complete validation cycle on a real product idea with mentor reviews each week.",
    category_id: 1,
    duration_weeks: 6,
    price: "150.00",
    currency: "AZN",
    has_mentor: true,
    has_cohort: true
  },
  {
    company_id: "14",
    title: "People & Hiring Workshop",
    description: "Run a fictional hiring loop end-to-end: scorecards, interviews, debriefs, and an offer-decision exercise.",
    category_id: 2,
    duration_weeks: 3,
    price: "0.00",
    currency: "AZN",
    has_mentor: true,
    has_cohort: true
  },
  {
    company_id: "14",
    title: "Series A Fundraising Simulation",
    description: "Pitch a fictional SaaS to a panel of partners. Build the deck, model the cap table, defend the valuation.",
    category_id: 3,
    duration_weeks: 4,
    price: "0.00",
    currency: "AZN",
    has_mentor: true,
    has_cohort: false
  },
  {
    company_id: "14",
    title: "Growth Marketing Sprint",
    description: "Run paid + organic experiments across 3 channels. Weekly ROAS reviews, conversion teardown, retention loops.",
    category_id: 1,
    duration_weeks: 8,
    price: "299.00",
    currency: "USD",
    has_mentor: false,
    has_cohort: true
  },
  {
    company_id: "14",
    title: "Design Systems in Practice",
    description: "Ship a token-driven component library, from primitives to docs site. Critique sessions every Friday.",
    category_id: 4,
    duration_weeks: 5,
    price: "120.00",
    currency: "AZN",
    has_mentor: true,
    has_cohort: false
  }
];

async function seed() {
  console.log("Starting seed process...");
  for (const p of programs) {
    try {
      const res = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(p)
      });
      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed to create "${p.title}":`, res.status, err);
      } else {
        const data = await res.json();
        console.log(`✅ Created: "${p.title}" (ID: ${data.id})`);
      }
    } catch (e) {
      console.error(`❌ Error creating "${p.title}":`, e.message);
    }
  }
  console.log("Seed process completed.");
}

seed();
