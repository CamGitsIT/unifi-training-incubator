// ============================================================
// REVENUE STREAMS CONFIG — Slide 2 Revenue Streams Console
// Numbers now flow from the shared Forecast Engine (forecastEngine.js)
// ============================================================

import { BASELINE_STREAMS, STREAM_COLORS, SCENARIO_MULTIPLIERS as ENGINE_SCENARIOS, runForecast } from '@/components/forecast/forecastEngine';

// Re-export scenario multipliers in the shape Slide2 / StreamDrawer expect
export const SCENARIO_MULTIPLIERS = {
  conservative: { revenue: 0.8,  label: 'Conservative', color: '#f59e0b' },
  base:         { revenue: 1.0,  label: 'Base',          color: '#22d3ee' },
  stretch:      { revenue: 1.25, label: 'Stretch',        color: '#a78bfa' },
};

// Year ramp is now expressed as fractional totals from the engine (Y1 = mo1-12 sum, etc.)
// This is kept for the Assumptions accordion display only
export const YEAR_RAMP = {
  y1:      0.40,
  y2:      0.72,
  y3:      0.92,
  runRate: 1.0,
};

// -------------------------------------------------------
// computeRevenue — wraps runForecast for a single stream.
// Called with (driverValue, scenario, yearView) to match
// the existing Slide2 / StreamDrawer interface.
// -------------------------------------------------------
function makeCompute(streamId) {
  return function computeRevenue(driverValue, scenario, yearView, _secondParam, customGrowthRate) {
    const streams = BASELINE_STREAMS.map(s =>
      s.stream_id === streamId
        ? { ...s, plan_driver_m1: driverValue, ...(customGrowthRate != null ? { monthly_growth: customGrowthRate } : {}) }
        : { ...s }
    );
    const result = runForecast(streams, scenario);
    const sr = result.streams[streamId];
    const runRate = sr.runRateM36;
    const selectedYear =
      yearView === 'y1'      ? sr.y1 :
      yearView === 'y2'      ? sr.y2 :
      yearView === 'y3'      ? sr.y3 :
      yearView === 'runRate' ? runRate : sr.y1;
    return { y1: sr.y1, y2: sr.y2, y3: sr.y3, runRate, selectedYear };
  };
}

// Special combined compute for Experience Center:
// Each visit generates hardware dropship profit ($300) + 2hr design consult ($300) = $600/visit.
// experience_design_consulting is 1:1 with experience visits, so we sum both streams.
function computeExperienceRevenue(driverValue, scenario, yearView, _secondParam, customGrowthRate) {
  const streams = BASELINE_STREAMS.map(s =>
    (s.stream_id === 'experience' || s.stream_id === 'experience_design_consulting')
      ? { ...s, plan_driver_m1: driverValue, ...(customGrowthRate != null ? { monthly_growth: customGrowthRate } : {}) }
      : { ...s }
  );
  const result = runForecast(streams, scenario);
  const expR = result.streams['experience'];
  const consultR = result.streams['experience_design_consulting'];
  const y1 = expR.y1 + consultR.y1;
  const y2 = expR.y2 + consultR.y2;
  const y3 = expR.y3 + consultR.y3;
  const runRate = expR.runRateM36 + consultR.runRateM36;
  const selectedYear =
    yearView === 'y1'      ? y1 :
    yearView === 'y2'      ? y2 :
    yearView === 'y3'      ? y3 :
    yearView === 'runRate' ? runRate : y1;
  return { y1, y2, y3, runRate, selectedYear };
}

// Special compute for Multi-Location Retail:
// accounts × sitesPerAccount × $500/site (12.5% of $4,000/site)
function computeRetailRevenue(accountsValue, scenario, yearView, sitesPerAccount = 20, customGrowthRate) {
  const streams = BASELINE_STREAMS.map(s =>
    s.stream_id === 'retail'
      ? { ...s, plan_driver_m1: accountsValue, units_per_driver: sitesPerAccount, ...(customGrowthRate != null ? { monthly_growth: customGrowthRate } : {}) }
      : { ...s }
  );
  const result = runForecast(streams, scenario);
  const sr = result.streams['retail'];
  const runRate = sr.runRateM36;
  const selectedYear =
    yearView === 'y1'      ? sr.y1 :
    yearView === 'y2'      ? sr.y2 :
    yearView === 'y3'      ? sr.y3 :
    yearView === 'runRate' ? runRate : sr.y1;
  return { y1: sr.y1, y2: sr.y2, y3: sr.y3, runRate, selectedYear };
}

// Special compute for Micro ISP:
// buildings × unitsPerBuilding × $48.75/unit (75% of $65/unit, 25% kickback to HOA)
function computeIspRevenue(buildingsValue, scenario, yearView, unitsPerBuilding = 20, customGrowthRate) {
  const streams = BASELINE_STREAMS.map(s =>
    s.stream_id === 'isp'
      ? { ...s, plan_driver_m1: buildingsValue, units_per_driver: unitsPerBuilding, ...(customGrowthRate != null ? { monthly_growth: customGrowthRate } : {}) }
      : { ...s }
  );
  const result = runForecast(streams, scenario);
  const sr = result.streams['isp'];
  const runRate = sr.runRateM36;
  const selectedYear =
    yearView === 'y1'      ? sr.y1 :
    yearView === 'y2'      ? sr.y2 :
    yearView === 'y3'      ? sr.y3 :
    yearView === 'runRate' ? runRate : sr.y1;
  return { y1: sr.y1, y2: sr.y2, y3: sr.y3, runRate, selectedYear };
}

// Helper to map baseline stream data to STREAMS shape expected by Slide2/Drawer
function baseline(id) {
  return BASELINE_STREAMS.find(s => s.stream_id === id);
}

export const STREAMS = [

  // ── 1. Experience Center ─────────────────────────────────────
  // Combined: hardware dropship profit ($300/visit) + design consulting ($300/visit) = $600/visit
  {
    id: 'experience',
    title: 'Experience Center',
    subtitle: '$600/visit · dropship profit + 2hr design consult',
    tags: ['Direct Revenue', 'Anchor'],
    color: STREAM_COLORS.experience,
    emoji: '🏢',
    what: 'A live UniFi showcase inside a real building. Every qualified visit generates hardware dropship profit AND a 2-hour design consultation.',
    whoServes: 'Developers, property managers, HOA boards, retail operators, MSPs, and future students.',
    howWeEarn: '$300 hardware dropship profit + $300 design consulting (2hr × $150/hr) = $600 per qualified visit.',
    liveProof: 'Sager Lofts is already retrofitted with UniFi keyless entry and biometrics — the property itself is the proof point.',
    isPipelinePrimary: false,
    driver: {
      name: baseline('experience').driver_name,
      unitLabel: baseline('experience').driver_unit,
      min: 0, max: 200, step: 1, defaultValue: baseline('experience').plan_driver_m1,
    },
    revenueFormula: (d) => `$600/visit × ${d} visits/mo × growth_factor\n= ($300 hardware dropship + $300 design consult) × visits`,
    assumptions: {
      unitRevenue: 600,
      scenarioNote: '$300 dropship + $300 consult per visit. Conservative/Stretch adjusts visit volume.',
    },
    proof: [
      'Building already retrofitted — instant live demo environment',
      '$300 dropship profit per visitor (10% of avg $3,000 cart)',
      '$300 design consulting per visitor (2hr × $150/hr)',
    ],
    computeRevenue: computeExperienceRevenue,
  },

  // ── 2. Keyless Property Access Retrofit ──────────────────────
  {
    id: 'retrofit',
    title: 'Keyless Property Access',
    subtitle: 'Retrofit scoping & sales — partner-executed installs',
    tags: ['Proven', 'Project', 'Partner-executed'],
    color: STREAM_COLORS.retrofit,
    emoji: '🔑',
    what: 'We scope, sell, and manage property access retrofits. Licensed partners handle installation.',
    whoServes: 'HOAs, multi-family property managers, commercial landlords, and developers.',
    howWeEarn: `Fee on project value. Avg project: $9,000 · Our fee: ~12.5% = ~$1,125/project.`,
    liveProof: 'Proven in practice: the building we\'re acquiring is already running the retrofit.',
    proven: true,
    proofBadge: 'Live in Production',
    driver: {
      name: baseline('retrofit').driver_name,
      unitLabel: baseline('retrofit').driver_unit,
      min: 0, max: 50, step: 1, defaultValue: baseline('retrofit').plan_driver_m1,
    },
    revenueFormula: (d) => `$1,125/project × ${d} projects/mo × growth_factor\n= $9,000 avg project × 12.5% fee = $1,125/project`,
    assumptions: {
      unitRevenue: baseline('retrofit').unit_revenue,
      avgProjectValue: 9000,
      feePercent: 12.5,
      scenarioNote: 'Partner-executed — no install labor bottleneck. Conservative/Stretch adjusts project volume.',
    },
    proof: [
      'Pilot client live — ~40 doors retrofitted',
      '3 additional properties in active pipeline',
      'Partner installer network operational',
    ],
    computeRevenue: makeCompute('retrofit'),
  },

  // ── 3. UniFi Certification Training ──────────────────────────
  {
    id: 'training',
    title: 'UniFi Certification Training',
    subtitle: 'Multi-day bootcamps — URSCA, Full-Stack, and more',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: STREAM_COLORS.training,
    emoji: '🎓',
    what: 'Multi-day Ubiquiti/UniFi certification courses for IT professionals, MSPs, integrators, and technicians. In-person or remote, all from our National Training Center.',
   // whoServes: 'IT professionals, career-changers, property managers, MSPs, and integrators.',
    howWeEarn: '$2,000 per seat — cohorts of 4–12 students.',

    driver: {
      name: baseline('training').driver_name,
      unitLabel: baseline('training').driver_unit,
      min: 0, max: 60, step: 1, defaultValue: baseline('training').plan_driver_m1,
    },
    revenueFormula: (d) => `$2,000/seat × ${d} seats/mo × growth_factor\n≈ ${Math.ceil(d/6)} classes/mo × ~6 students avg cohort × $2,000/seat`,
    assumptions: {
      unitRevenue: baseline('training').unit_revenue,
      avgCohortSize: 6,
      scenarioNote: 'Conservative = fewer cohorts/mo; Stretch = waitlist demand + online scale.',
    },
    proof: [
      'Course curriculum drafted and validated',
      'Ubiquiti certification framework confirmed',
      '$2,000/seat is a real, validated price point',
    ],
    computeRevenue: makeCompute('training'),
  },

  // ── 4. Multi-Location Retail ──────────────────────────────────
  {
    id: 'retail',
    title: 'Multi-Location Retail',
    subtitle: 'Franchise & chain UniFi rollouts — Rollout Design',
    tags: ['Project', 'Location-free', 'Recurring'],
    color: STREAM_COLORS.retail,
    emoji: '🏪',
    what: 'We design and sell complete UniFi access/security rollout plans for aimed to templatizale projects best for for multi-location retail brands. A licensed MSP handles installation — we earn a design and project management fee.',
    whoServes: 'Regional chains, franchise operators, QSR brands with 20–200+ locations.',
    howWeEarn: 'We design each project and sell to an MSP. Avg 20 sites/account × $4,000/site = $80,000 gross project. Our fee: 12.5% = $500/site · $10,000/account. New account signings grow at ~7%/month as the sales pipeline matures.',
    driver: {
      name: baseline('retail').driver_name,
      unitLabel: baseline('retail').driver_unit,
      min: 0, max: 20, step: 1, defaultValue: baseline('retail').plan_driver_m1,
    },
    sitesDriver: {
      name: 'Sites per account',
      unitLabel: 'sites',
      min: 1, max: 200, step: 1, defaultValue: 20,
    },
    revenueFormula: (d, sites = 20) => `$500/site × ${sites} sites/account × ${d} accounts × growth_factor\n= $4,000/site × 12.5% fee × ${sites} sites × ${d} accounts`,
    assumptions: {
      unitRevenue: 500,
      sitesPerAccount: 20,
      projectValuePerSite: 4000,
      feePercent: 12.5,
      scenarioNote: 'New account signing rate grows 7%/month (compounding). Partner-executed MSP installs — no install labor bottleneck. Conservative/Stretch adjusts account volume.',
    },
    proof: [],
    computeRevenue: computeRetailRevenue,
  },

  // ── 5. Professional Monitoring ────────────────────────────────
  {
    id: 'monitoring',
    title: 'Professional Monitoring',
    subtitle: 'Managed SOC-lite — recurring revenue per property',
    tags: ['Recurring', 'Location-free', 'High-margin'],
    color: STREAM_COLORS.monitoring,
    emoji: '👁️',
    what: 'Remote monitoring of security cameras and access control systems with alerting, reporting, and escalation.',
    whoServes: 'Property managers, HOAs, retail chains, and any client whose IT infrastructure supports more sophicted access and security systems.',
    howWeEarn: '$40/site/month recurring. A single retail chain rollout of 40 locations = $1,600/mo MRR.',
    driver: {
      name: baseline('monitoring').driver_name,
      unitLabel: baseline('monitoring').driver_unit,
      min: 0, max: 150, step: 1, defaultValue: baseline('monitoring').plan_driver_m1,
    },
    revenueFormula: (d) => `$40/site/mo × ${d} active sites × growth_factor\n= recurring monthly monitoring fee per managed property`,
    assumptions: {
      unitRevenue: baseline('monitoring').unit_revenue,
      churnRate: 0.03,
      scenarioNote: 'Conservative = slower site acquisition; Stretch = referral flywheel via retrofit clients.',
    },
    proof: [],
    computeRevenue: makeCompute('monitoring'),
  },

  // ── 6. Tech Infrastructure Rentals ───────────────────────────
  {
    id: 'rentals',
    title: 'Tech Infrastructure Rentals',
    subtitle: 'UniFi kits for film, production & events',
    tags: ['Project', 'Location-free'],
    color: STREAM_COLORS.rentals,
    emoji: '🎬',
    what: 'Rent complete UniFi infrastructure kits to film crews, event producers, and pop-up operators.',
    whoServes: 'Film production companies, event coordinators, real estate stagers, pop-up retailers.',
    howWeEarn: '$800 avg per production rental (gear + remote setup support).',

    driver: {
      name: baseline('rentals').driver_name,
      unitLabel: baseline('rentals').driver_unit,
      min: 0, max: 30, step: 1, defaultValue: baseline('rentals').plan_driver_m1,
    },
    revenueFormula: (d) => `$800/production × ${d} productions/mo × growth_factor\n= gear kit + remote setup support per rental`,
    assumptions: {
      unitRevenue: baseline('rentals').unit_revenue,
      scenarioNote: 'Stretch assumes established film industry relationships and repeat clients.',
    },
    proof: [],
    computeRevenue: makeCompute('rentals'),
  },

  // ── 7. Refrigeration & Temperature Monitoring ─────────────────
  {
    id: 'refrigeration',
    title: 'Refrigeration & Temp Monitoring',
    subtitle: 'FDA-compliant cold chain IoT sensing — recurring',
    tags: ['Recurring', 'Location-free', 'Niche'],
    color: STREAM_COLORS.refrigeration,
    emoji: '🌡️',
    what: 'IoT sensor monitoring for food-service and pharmaceutical refrigeration with automated FDA-compliant compliance reports.',
    whoServes: 'Restaurants, pharmacies, food distributors, and any regulated business requiring cold chain compliance.',
    howWeEarn: 'Setup of sensors + cloud reporting service hardware varies, but less than $2000 hardware per store with estimated one-time labor & configuration costs around $3000.',

    driver: {
      name: baseline('refrigeration').driver_name,
      unitLabel: baseline('refrigeration').driver_unit,
      min: 0, max: 100, step: 1, defaultValue: baseline('refrigeration').plan_driver_m1,
    },
    revenueFormula: (d) => `$83/location/mo × ${d} locations × growth_factor\n= sensor hardware + FDA-compliant cloud reporting`,
    assumptions: {
      unitRevenue: baseline('refrigeration').unit_revenue,
      scenarioNote: 'Stretch assumes chain-level contracts (50+ locations per client).',
    },
    proof: [],
    computeRevenue: makeCompute('refrigeration'),
  },

  // ── 8. Micro ISP ──────────────────────────────────────────────
  {
    id: 'isp',
    title: 'Micro ISP',
    subtitle: 'Community mesh broadband — owned infrastructure',
    tags: ['Recurring', 'Anchor', 'High-loyalty'],
    color: STREAM_COLORS.isp,
    emoji: '📡',
    what: 'Deploy and operate community-owned mesh WiFi networks for residential buildings and communities.',
    whoServes: 'Apartment buildings, mobile home communities, HOAs seeking internet as an amenity.',
    howWeEarn: '$55/unit/month connectivity fee. OverIT keeps 75% ($41.25/unit); 25% ($13.75/unit) is paid back to the HOA or property management. Example: 3 buildings × 40 units = 120 units → $4,950/mo to OverIT.',
    driver: {
      name: baseline('isp').driver_name,
      unitLabel: baseline('isp').driver_unit,
      min: 0, max: 50, step: 1, defaultValue: baseline('isp').plan_driver_m1,
    },
    unitsDriver: {
      name: 'Units per building',
      unitLabel: 'units',
      min: 1, max: 500, step: 1, defaultValue: 20,
    },
    revenueFormula: (d, units = 40) => `$41.25/unit/mo × ${units} units/building × ${d} buildings × growth_factor\n= $55/unit × 75% OverIT share. ${d * units} total units → $${(d * units * 41.25).toFixed(0)}/mo at M1`,
    assumptions: {
      unitRevenue: 41.25,
      pricePerUnit: 55,
      overiTakeRate: 0.75,
      hoaKickback: 0.25,
      scenarioNote: '$55/unit/month · 75% OverIT share = $41.25/unit net. Conservative = fewer buildings; Stretch = denser buildings or faster signings.',
    },
    proof: [],
    computeRevenue: computeIspRevenue,
  },
];