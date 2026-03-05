// ============================================================
// REVENUE STREAMS CONFIG
// TODO: Replace placeholder formulas + assumptions with values
//       pulled from the Master Forecast Google Sheet via API.
// ============================================================

export const SCENARIO_MULTIPLIERS = {
  conservative: { revenue: 0.8, label: 'Conservative', color: '#f59e0b' },
  base: { revenue: 1.0, label: 'Base', color: '#22d3ee' },
  stretch: { revenue: 1.25, label: 'Stretch', color: '#a78bfa' },
};

// Year ramp factors (relative to run-rate)
export const YEAR_RAMP = {
  y1: 0.45,
  y2: 0.75,
  y3: 0.95,
  runRate: 1.0,
};

// Pilot client — proof strip, not a stream card
export const PILOT_CLIENT = {
  label: 'Pilot Client',
  description: 'Keyless Property Access Retrofit — proven and expanding.',
  metric: '~40 doors migrated · 3 properties in pipeline',
  badge: 'Proven',
};

// -------------------------------------------------------
// computeRevenue helper
// driverValue × unitRevenue × 12 (annualized) × ramp × scenario
// -------------------------------------------------------
function makeCompute({ unitRevenue, rampOverride }) {
  return function computeRevenue(driverValue, scenario, yearView) {
    const scenarioMult = SCENARIO_MULTIPLIERS[scenario].revenue;
    const ramp = rampOverride?.[yearView] ?? YEAR_RAMP[yearView];
    const annualRunRate = driverValue * unitRevenue * 12;
    const value = Math.round(annualRunRate * scenarioMult * ramp);
    return {
      y1: Math.round(annualRunRate * scenarioMult * (rampOverride?.y1 ?? YEAR_RAMP.y1)),
      y2: Math.round(annualRunRate * scenarioMult * (rampOverride?.y2 ?? YEAR_RAMP.y2)),
      y3: Math.round(annualRunRate * scenarioMult * (rampOverride?.y3 ?? YEAR_RAMP.y3)),
      runRate: Math.round(annualRunRate * scenarioMult),
      selectedYear: value,
    };
  };
}

export const STREAMS = [
  // ── 1. Experience Center ──────────────────────────────────
  {
    id: 'experience',
    title: 'Experience Center',
    subtitle: 'Live Demo + Demand Engine',
    tags: ['Pipeline Driver', 'Anchor'],
    color: '#22d3ee',
    emoji: '🏢',
    what: 'A physical showroom where prospects experience our full UniFi stack live — turning skeptics into buyers.',
    whoServes: 'HOA boards, property managers, retail chains, and prospective training students.',
    howWeEarn: 'Modeled contribution from hosted events, sponsorships, and facilitation fees. Primary value is pipeline generated for all other streams.',
    isPipelinePrimary: true,
    pipelineOutputs: {
      retrofitConversion: 0.12, // 12% of visits → retrofit inquiry
      trainingConversion: 0.08, // 8% of visits → training inquiry
    },
    driver: {
      name: 'Qualified visits per month',
      unitLabel: 'visits/mo',
      min: 10,
      max: 200,
      step: 5,
      defaultValue: 40,
    },
    // Modeled optional revenue (events/sponsorships)
    assumptions: {
      unitRevenue: 30, // $ per visit (Modeled placeholder)
      scenarioNote: 'Revenue is secondary; pipeline generation is primary value.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 30 }),
  },

  // ── 2. Keyless Property Access Retrofit ───────────────────
  {
    id: 'retrofit',
    title: 'Keyless Property Access',
    subtitle: 'Retrofit — Partner-Executed',
    tags: ['Proven', 'Project', 'Partner-executed'],
    color: '#818cf8',
    emoji: '🔑',
    what: 'We scope and sell property access retrofits. Partners handle installation — no labor bottleneck.',
    whoServes: 'HOAs, multi-family property managers, commercial landlords.',
    howWeEarn: 'Fee on project value. Avg project: $9,000 · Our fee: ~12.5% = ~$1,125/project (Modeled placeholder).',
    proven: true,
    proofBadge: 'Pilot Client Expanding',
    driver: {
      name: 'Projects sold per month',
      unitLabel: 'projects/mo',
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 4,
    },
    assumptions: {
      unitRevenue: 1125, // per project (Modeled placeholder)
      avgProjectValue: 9000,
      feePercent: 12.5,
      scenarioNote: 'Conservative/Stretch adjusts avg deal size ±20%.',
    },
    proof: [
      'Pilot client onboarded — ~40 doors',
      '3 additional properties in active pipeline',
      'Partner installer network operational',
    ],
    computeRevenue: makeCompute({ unitRevenue: 1125 }),
  },

  // ── 3. Certification Training ──────────────────────────────
  {
    id: 'training',
    title: 'UniFi Certification Training',
    subtitle: 'Multi-day Courses (URSCA, Full-Stack)',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: '#f472b6',
    emoji: '🎓',
    what: 'Multi-day certification bootcamps for technicians and IT professionals — delivered in-person and online.',
    whoServes: 'IT professionals, career-changers, property managers seeking self-sufficiency.',
    howWeEarn: '$2,000 per seat. Group cohorts of 4–12 students. Delivered remotely or at Experience Center.',
    driver: {
      name: 'Seats per month',
      unitLabel: 'seats/mo',
      min: 1,
      max: 60,
      step: 1,
      defaultValue: 8,
    },
    assumptions: {
      unitRevenue: 2000, // REAL: $2,000/seat
      avgCohortSize: 6,
      scenarioNote: 'Conservative = fewer cohorts; Stretch = waitlist demand, online scale.',
    },
    proof: [
      'Course curriculum drafted',
      'Ubiquiti cert framework validated',
    ],
    computeRevenue: makeCompute({ unitRevenue: 2000 }),
  },

  // ── 4. Multi-Location Retail ───────────────────────────────
  {
    id: 'retail',
    title: 'Multi-Location Retail',
    subtitle: 'Franchise & Chain Rollouts',
    tags: ['Project', 'Location-free', 'Recurring'],
    color: '#fb923c',
    emoji: '🏪',
    what: 'Consulting + managed rollouts for retail brands replacing legacy access/security with UniFi.',
    whoServes: 'Regional chains, franchise operators, QSR brands (20–200+ locations).',
    howWeEarn: 'Per-account annual consulting retainer. Avg: $6,000/year per brand account (Modeled placeholder).',
    driver: {
      name: 'Active brand accounts',
      unitLabel: 'accounts',
      min: 1,
      max: 20,
      step: 1,
      defaultValue: 2,
    },
    assumptions: {
      unitRevenue: 500, // per account per month ($6k/yr ÷ 12)
      avgAnnualPerAccount: 6000,
      scenarioNote: 'Stretch assumes 2 national accounts adding significant volume.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 500 }),
  },

  // ── 5. Professional Monitoring ─────────────────────────────
  {
    id: 'monitoring',
    title: 'Professional Monitoring',
    subtitle: 'Managed SOC-lite for Properties',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: '#34d399',
    emoji: '👁️',
    what: 'Remote monitoring of security cameras and access control systems. Alerts, reports, and escalation.',
    whoServes: 'Property managers, HOAs, retail chains already on UniFi infrastructure.',
    howWeEarn: '$100/site/month recurring. Pure margin after onboarding (Modeled placeholder).',
    driver: {
      name: 'Active monitored sites',
      unitLabel: 'sites',
      min: 5,
      max: 150,
      step: 5,
      defaultValue: 20,
    },
    assumptions: {
      unitRevenue: 100, // per site per month
      churnRate: 0.03,
      scenarioNote: 'Conservative = slower site acquisition; Stretch = referral flywheel.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 100 }),
  },

  // ── 6. Tech Infrastructure Rentals (Film & Production) ────
  {
    id: 'rentals',
    title: 'Tech Infrastructure Rentals',
    subtitle: 'Film, Production & Event Deployments',
    tags: ['Project', 'Pipeline', 'Location-free'],
    color: '#a78bfa',
    emoji: '🎬',
    what: 'Rent full UniFi infrastructure kits to film crews, event producers, and pop-up deployments.',
    whoServes: 'Film production companies, event coordinators, real estate stagers, pop-up retailers.',
    howWeEarn: '$800/production rental avg (gear + 1-day setup support) (Modeled placeholder).',
    driver: {
      name: 'Productions per month',
      unitLabel: 'productions/mo',
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 5,
    },
    assumptions: {
      unitRevenue: 800, // per production
      scenarioNote: 'Stretch assumes film industry relationships driving volume.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 800 }),
  },

  // ── 7. Refrigeration & Temperature Monitoring ─────────────
  {
    id: 'refrigeration',
    title: 'Refrigeration & Temp Monitoring',
    subtitle: 'FDA-Compliant Cold Chain Sensing',
    tags: ['Recurring', 'Location-free', 'Niche'],
    color: '#38bdf8',
    emoji: '🌡️',
    what: 'IoT sensor monitoring for food-service and pharma refrigeration with automated compliance reports.',
    whoServes: 'Restaurants, grocery chains, pharmacies, food distributors.',
    howWeEarn: '$83/location/month (sensor + reporting service) (Modeled placeholder).',
    driver: {
      name: 'Locations monitored',
      unitLabel: 'locations',
      min: 5,
      max: 100,
      step: 5,
      defaultValue: 15,
    },
    assumptions: {
      unitRevenue: 83, // per location per month
      scenarioNote: 'Stretch assumes chain-level contracts (50+ locations per client).',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 83 }),
  },

  // ── 8. Micro ISP ───────────────────────────────────────────
  {
    id: 'isp',
    title: 'Micro ISP',
    subtitle: 'Community Mesh Broadband',
    tags: ['Recurring', 'Anchor', 'High-loyalty'],
    color: '#facc15',
    emoji: '📡',
    what: 'Deploy and operate community-owned mesh WiFi networks for underserved residential buildings.',
    whoServes: 'Apartment buildings, mobile home communities, HOAs seeking internet as an amenity.',
    howWeEarn: '$100/subscriber/month (ISP margin after upstream wholesale cost) (Modeled placeholder).',
    driver: {
      name: 'Active subscribers',
      unitLabel: 'subscribers',
      min: 10,
      max: 200,
      step: 10,
      defaultValue: 30,
    },
    assumptions: {
      unitRevenue: 100, // per subscriber per month
      wholesaleCost: 30, // upstream cost per sub
      netMarginPerSub: 70,
      scenarioNote: 'Conservative = single building; Stretch = 3+ buildings at capacity.',
    },
    proof: [],
    computeRevenue: makeCompute({ unitRevenue: 100 }),
  },
];