// ============================================================
// REVENUE STREAMS CONFIG — Slide 2: Revenue Streams Console
// TODO: Replace placeholder formulas + assumptions with live
//       values pulled from the Master Forecast Google Sheet via API.
// ============================================================

export const SCENARIO_MULTIPLIERS = {
  conservative: { revenue: 0.8,  label: 'Conservative', color: '#f59e0b' },
  base:         { revenue: 1.0,  label: 'Base',          color: '#22d3ee' },
  stretch:      { revenue: 1.25, label: 'Stretch',        color: '#a78bfa' },
};

// Year ramp factors (relative to run-rate)
// TODO: Replace with Master Forecast ramp schedule when available.
export const YEAR_RAMP = {
  y1:      0.40,
  y2:      0.72,
  y3:      0.92,
  runRate: 1.0,
};

// -------------------------------------------------------
// Core compute helper
// driverValue × unitRevenue × 12 × scenarioMult × rampFactor
// -------------------------------------------------------
function makeCompute({ unitRevenue }) {
  return function computeRevenue(driverValue, scenario, yearView) {
    const scenarioMult = SCENARIO_MULTIPLIERS[scenario].revenue;
    const annualRunRate = driverValue * unitRevenue * 12;
    return {
      y1:           Math.round(annualRunRate * scenarioMult * YEAR_RAMP.y1),
      y2:           Math.round(annualRunRate * scenarioMult * YEAR_RAMP.y2),
      y3:           Math.round(annualRunRate * scenarioMult * YEAR_RAMP.y3),
      runRate:      Math.round(annualRunRate * scenarioMult),
      selectedYear: Math.round(annualRunRate * scenarioMult * YEAR_RAMP[yearView]),
    };
  };
}

export const STREAMS = [

  // ── 1. Experience Center ─────────────────────────────────────
  {
    id: 'experience',
    title: 'Experience Center',
    subtitle: 'Live demo environment & top-of-funnel demand engine',
    tags: ['Pipeline Driver', 'Anchor'],
    color: '#22d3ee',
    emoji: '🏢',
    what: 'A physical showroom where prospects experience the full UniFi stack in a working building. Every visitor is a potential entry point into any of the other 7 revenue lines — retrofit, training, monitoring, retail, ISP, rentals, and cold chain.',
    whoServes: 'HOA boards, property managers, retail chains, prospective training students, MSPs, developers — anyone who needs to see it to believe it.',
    howWeEarn: 'Secondary revenue from hosted events, demos, and sponsorships. The real value is the qualified pipeline it feeds into all downstream streams. A single motivated visitor can convert into a retrofit project, a training cohort, a monitoring contract, or a retail chain rollout.',
    liveProof: 'This Experience Center will sit inside a building that is already retrofitted — so the entire property is a live demo on day one. Every tour is already a proof of concept.',
    isPipelinePrimary: true,
    pipelineOutputs: {
      retrofitConversion: 0.12,  // 12% of qualified visits → retrofit inquiry
      trainingConversion: 0.08,  // 8%  of qualified visits → training inquiry
    },
    driver: {
      name: 'Qualified visits per month',
      unitLabel: 'visits/mo',
      min: 10, max: 200, step: 5, defaultValue: 40,
    },
    assumptions: {
      unitRevenue: 30, // $ per visit — Modeled placeholder (events/sponsorships)
      scenarioNote: 'Revenue is secondary to pipeline generation. Conservative/Stretch adjusts event frequency.',
    },
    proof: [
      'Building already retrofitted — instant live demo environment',
      'Demand gen for 7 downstream revenue lines',
    ],
    computeRevenue: makeCompute({ unitRevenue: 30 }),
  },

  // ── 2. Keyless Property Access Retrofit ──────────────────────
  {
    id: 'retrofit',
    title: 'Keyless Property Access',
    subtitle: 'Retrofit scoping & sales — partner-executed installs',
    tags: ['Proven', 'Project', 'Partner-executed'],
    color: '#818cf8',
    emoji: '🔑',
    what: 'We scope, sell, and manage property access retrofits. Licensed partners handle installation — no labor bottleneck on our end.',
    whoServes: 'HOAs, multi-family property managers, commercial landlords.',
    howWeEarn: 'Fee on project value. Avg project: $9,000 · Our fee: ~12.5% = ~$1,125/project.',
    liveProof: 'Proven in practice: the building we\'re acquiring is already running the retrofit. The Experience Center is our live case study.',
    proven: true,
    proofBadge: 'Live in Production',
    driver: {
      name: 'Projects sold per month',
      unitLabel: 'projects/mo',
      min: 1, max: 20, step: 1, defaultValue: 4,
    },
    assumptions: {
      unitRevenue: 1125,
      avgProjectValue: 9000,
      feePercent: 12.5,
      scenarioNote: 'Conservative/Stretch adjusts avg deal size ±20%. Partner-executed; no install labor bottleneck.',
    },
    proof: [
      'Pilot client live — ~40 doors retrofitted',
      '3 additional properties in active pipeline',
      'Partner installer network operational',
    ],
    computeRevenue: makeCompute({ unitRevenue: 1125 }),
  },

  // ── 3. UniFi Certification Training ──────────────────────────
  {
    id: 'training',
    title: 'UniFi Certification Training',
    subtitle: 'Multi-day bootcamps — URSCA, Full-Stack, and more',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: '#f472b6',
    emoji: '🎓',
    what: 'Multi-day Ubiquiti certification courses for IT professionals, MSPs, and technicians — in-person at the Experience Center or fully online. Every graduate is a potential pipeline feeder: an MSP who trains here will drive their entire client base toward our other streams.',
    whoServes: 'IT professionals, career-changers, property managers pursuing self-sufficiency, MSPs, and integrators. An MSP trained here who works with retail chains can funnel dozens of sites into monitoring, retail rollouts, and refrigeration services.',
    howWeEarn: '$2,000 per seat — cohorts of 4–12 students. Delivered in-person or remotely. A single trained MSP with 30 retail clients can trigger monitoring contracts across all 30 of those locations.',
    driver: {
      name: 'Seats per month',
      unitLabel: 'seats/mo',
      min: 1, max: 60, step: 1, defaultValue: 8,
    },
    assumptions: {
      unitRevenue: 2000, // REAL: $2,000/seat — not a placeholder
      avgCohortSize: 6,
      scenarioNote: 'Conservative = fewer cohorts/mo; Stretch = waitlist demand + online scale.',
    },
    proof: [
      'Course curriculum drafted and validated',
      'Ubiquiti certification framework confirmed',
      '$2,000/seat is a real, validated price point',
    ],
    computeRevenue: makeCompute({ unitRevenue: 2000 }),
  },

  // ── 4. Multi-Location Retail ──────────────────────────────────
  {
    id: 'retail',
    title: 'Multi-Location Retail',
    subtitle: 'Franchise & chain UniFi rollouts — remote consulting',
    tags: ['Project', 'Location-free', 'Recurring'],
    color: '#fb923c',
    emoji: '🏪',
    what: 'Consulting and managed rollouts for retail brands replacing legacy access/security systems with UniFi infrastructure across dozens or hundreds of locations.',
    whoServes: 'Regional chains, franchise operators, QSR brands with 20–200+ locations.',
    howWeEarn: 'Annual consulting retainer per brand account. Avg: $6,000/year per account (Modeled placeholder).',
    driver: {
      name: 'Active brand accounts',
      unitLabel: 'accounts',
      min: 1, max: 20, step: 1, defaultValue: 2,
    },
    assumptions: {
      unitRevenue: 500, // per account per month ($6k/yr ÷ 12) — Modeled placeholder
      avgAnnualPerAccount: 6000,
      scenarioNote: 'Stretch assumes 2 national accounts adding significant project volume.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 500 }),
  },

  // ── 5. Professional Monitoring ────────────────────────────────
  {
    id: 'monitoring',
    title: 'Professional Monitoring',
    subtitle: 'Managed SOC-lite — recurring revenue per property',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: '#34d399',
    emoji: '👁️',
    what: 'Remote monitoring of security cameras and access control systems with alerting, reporting, and escalation. Every other stream that installs or expands UniFi infrastructure is a direct feeder — more deployed sites = more monitoring contracts.',
    whoServes: 'Property managers, HOAs, retail chains, and any client whose infrastructure we touched through retrofit, retail rollout, training, or ISP. An MSP trained by us who converts their retail clients also converts those clients into monitoring subscribers.',
    howWeEarn: '$100/site/month recurring — the more we deploy through other streams, the larger this base grows without additional sales effort. A single retail chain rollout of 40 locations = $4,000/mo in monitoring recurring revenue.',
    driver: {
      name: 'Active monitored sites',
      unitLabel: 'sites',
      min: 5, max: 150, step: 5, defaultValue: 20,
    },
    assumptions: {
      unitRevenue: 100, // per site per month — Modeled placeholder
      churnRate: 0.03,
      scenarioNote: 'Conservative = slower site acquisition; Stretch = referral flywheel via retrofit clients.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 100 }),
  },

  // ── 6. Tech Infrastructure Rentals ───────────────────────────
  {
    id: 'rentals',
    title: 'Tech Infrastructure Rentals',
    subtitle: 'UniFi kits for film, production & events',
    tags: ['Project', 'Location-free'],
    color: '#a78bfa',
    emoji: '🎬',
    what: 'Rent complete UniFi infrastructure kits to film crews, event producers, and pop-up operators who need enterprise-grade connectivity without a permanent install.',
    whoServes: 'Film production companies, event coordinators, real estate stagers, pop-up retailers.',
    howWeEarn: '$800 avg per production rental (gear + remote setup support) (Modeled placeholder).',
    driver: {
      name: 'Productions served per month',
      unitLabel: 'productions/mo',
      min: 1, max: 30, step: 1, defaultValue: 5,
    },
    assumptions: {
      unitRevenue: 800, // per production — Modeled placeholder
      scenarioNote: 'Stretch assumes established film industry relationships and repeat clients.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 800 }),
  },

  // ── 7. Refrigeration & Temperature Monitoring ─────────────────
  {
    id: 'refrigeration',
    title: 'Refrigeration & Temp Monitoring',
    subtitle: 'FDA-compliant cold chain IoT sensing — recurring',
    tags: ['Recurring', 'Location-free', 'Niche'],
    color: '#38bdf8',
    emoji: '🌡️',
    what: 'IoT sensor monitoring for food-service and pharmaceutical refrigeration with automated FDA-compliant compliance reports. Often introduced through Professional Monitoring relationships — a client already letting us watch their cameras is a natural candidate for cold-chain compliance.',
    whoServes: 'Restaurants, grocery chains, pharmacies, food distributors. Likely discovered through monitoring referrals, Experience Center visits, or word of mouth from an existing client. Not a cold-call sale — it comes in warm.',
    howWeEarn: '$83/location/month — sensor hardware + cloud reporting service. Chains that discover us through monitoring or the Experience Center can add cold-chain sensing to every location at once (Modeled placeholder).',
    driver: {
      name: 'Locations monitored',
      unitLabel: 'locations',
      min: 5, max: 100, step: 5, defaultValue: 15,
    },
    assumptions: {
      unitRevenue: 83, // per location per month — Modeled placeholder
      scenarioNote: 'Stretch assumes chain-level contracts (50+ locations per client).',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 83 }),
  },

  // ── 8. Micro ISP ──────────────────────────────────────────────
  {
    id: 'isp',
    title: 'Micro ISP',
    subtitle: 'Community mesh broadband — owned infrastructure',
    tags: ['Recurring', 'Anchor', 'High-loyalty'],
    color: '#facc15',
    emoji: '📡',
    what: 'Deploy and operate community-owned mesh WiFi networks for residential buildings and communities — internet as an owned amenity, not a rented dependency.',
    whoServes: 'Apartment buildings, mobile home communities, HOAs seeking internet as an amenity.',
    howWeEarn: '$100/building/month net margin after upstream wholesale cost (Modeled placeholder).',
    driver: {
      name: 'Buildings served',
      unitLabel: 'buildings',
      min: 1, max: 50, step: 1, defaultValue: 3,
    },
    assumptions: {
      unitRevenue: 100, // per building per month net — Modeled placeholder
      wholesaleCostPerBuilding: 30,
      scenarioNote: 'Conservative = single building pilot; Stretch = 5+ buildings with anchor subscriber density.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 100 }),
  },
];