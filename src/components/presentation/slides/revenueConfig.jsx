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
  return function computeRevenue(driverValue, scenario, yearView) {
    // Build stream list with this stream's driver overridden
    const streams = BASELINE_STREAMS.map(s =>
      s.stream_id === streamId
        ? { ...s, plan_driver_m1: driverValue }
        : { ...s }
    );

    const result = runForecast(streams, scenario);
    const sr = result.streams[streamId];

    const runRate = sr.runRateM36; // M36 = "run-rate"

    const selectedYear =
      yearView === 'y1'      ? sr.y1 :
      yearView === 'y2'      ? sr.y2 :
      yearView === 'y3'      ? sr.y3 :
      yearView === 'runRate' ? runRate : sr.y1;

    return {
      y1:           sr.y1,
      y2:           sr.y2,
      y3:           sr.y3,
      runRate:      runRate,
      selectedYear: selectedYear,
    };
  };
}

// Helper to map baseline stream data to STREAMS shape expected by Slide2/Drawer
function baseline(id) {
  return BASELINE_STREAMS.find(s => s.stream_id === id);
}

export const STREAMS = [

  // ── 1. Experience Center ─────────────────────────────────────
  {
    id: 'experience',
    title: 'Experience Center',
    subtitle: 'Live demo environment & top-of-funnel demand engine',
    tags: ['Pipeline Driver', 'Anchor'],
    color: STREAM_COLORS.experience,
    emoji: '🏢',
    what: 'A physical showroom where prospects experience the full UniFi stack in a working building. Every visitor is a potential entry point into any of the other 7 revenue lines.',
    whoServes: 'HOA boards, property managers, retail chains, prospective training students, MSPs, developers.',
    howWeEarn: 'Secondary revenue from retail sales and training signups. The real value is the qualified pipeline it feeds downstream.',
    liveProof: 'This Experience Center will sit inside a building that is already retrofitted — so the entire property is a live demo on day one.',
    feedsInto: 'All 7 other revenue streams via dependency elasticities — training (0.6×), retrofit (0.5×).',
    isPipelinePrimary: true,
    pipelineOutputs: {
      retrofitConversion: 0.12,
      trainingConversion: 0.08,
    },
    driver: {
      name: baseline('experience').driver_name,
      unitLabel: baseline('experience').driver_unit,
      min: 5, max: 200, step: 5, defaultValue: baseline('experience').plan_driver_m1,
    },
    assumptions: {
      unitRevenue: baseline('experience').unit_revenue,
      scenarioNote: 'Revenue is secondary to pipeline generation. Conservative/Stretch adjusts event frequency.',
    },
    proof: [
      'Building already retrofitted — instant live demo environment',
      'Demand gen for 7 downstream revenue lines',
    ],
    computeRevenue: makeCompute('experience'),
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
    feedsInto: 'Professional Monitoring (every retrofitted property is a monitoring candidate via 0.14× elasticity).',
    fedBy: 'Experience Center visits (0.5× elasticity) + Training graduates (0.3× elasticity).',
    proven: true,
    proofBadge: 'Live in Production',
    driver: {
      name: baseline('retrofit').driver_name,
      unitLabel: baseline('retrofit').driver_unit,
      min: 1, max: 20, step: 1, defaultValue: baseline('retrofit').plan_driver_m1,
    },
    assumptions: {
      unitRevenue: baseline('retrofit').unit_revenue,
      avgProjectValue: 9000,
      feePercent: 12.5,
      scenarioNote: 'Conservative/Stretch adjusts scenario multiplier. Partner-executed; no install labor bottleneck.',
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
    what: 'Multi-day Ubiquiti certification courses for IT professionals, MSPs, and technicians.',
    whoServes: 'IT professionals, career-changers, property managers, MSPs, and integrators.',
    howWeEarn: '$2,000 per seat — cohorts of 4–12 students. In-person or remote.',
    feedsInto: 'Retrofit (0.3×), Retail (0.3×), Rentals (0.3×), Refrigeration (0.3×), Micro ISP (0.4×) via dependency elasticities.',
    fedBy: 'Experience Center visits by IT professionals and MSPs (0.6× elasticity).',
    driver: {
      name: baseline('training').driver_name,
      unitLabel: baseline('training').driver_unit,
      min: 1, max: 60, step: 1, defaultValue: baseline('training').plan_driver_m1,
    },
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
    what: 'Consulting and managed rollouts for retail brands replacing legacy access/security systems.',
    whoServes: 'Regional chains, franchise operators, QSR brands with 20–200+ locations.',
    howWeEarn: 'Retainer per brand account × 20 sites/account × $3,500/site/mo.',
    fedBy: 'Training graduates via MSP relationships (0.3× elasticity).',
    feedsInto: 'Professional Monitoring (0.14× elasticity on monitoring driver).',
    driver: {
      name: baseline('retail').driver_name,
      unitLabel: baseline('retail').driver_unit,
      min: 1, max: 20, step: 1, defaultValue: baseline('retail').plan_driver_m1,
    },
    assumptions: {
      unitRevenue: baseline('retail').unit_revenue,
      avgAnnualPerAccount: baseline('retail').unit_revenue * 20 * 12,
      scenarioNote: 'Stretch assumes 2 national accounts adding significant project volume.',
    },
    proof: [],
    computeRevenue: makeCompute('retail'),
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
    whoServes: 'Property managers, HOAs, retail chains, and any client whose infrastructure we touched.',
    howWeEarn: '$100/site/month recurring. A single retail chain rollout of 40 locations = $4,000/mo MRR.',
    fedBy: 'Every revenue stream that deploys infrastructure: Retrofit, Retail, Rentals, Refrigeration, ISP — all feed monitoring via 0.14× elasticity each.',
    driver: {
      name: baseline('monitoring').driver_name,
      unitLabel: baseline('monitoring').driver_unit,
      min: 5, max: 150, step: 5, defaultValue: baseline('monitoring').plan_driver_m1,
    },
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
    fedBy: 'Training graduates expand partner/referral network (0.3× elasticity).',
    feedsInto: 'Professional Monitoring (0.14× elasticity).',
    driver: {
      name: baseline('rentals').driver_name,
      unitLabel: baseline('rentals').driver_unit,
      min: 1, max: 30, step: 1, defaultValue: baseline('rentals').plan_driver_m1,
    },
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
    howWeEarn: '$83/location/month — sensor hardware + cloud reporting service.',
    fedBy: 'Training graduates (0.3× elasticity), Experience Center visits from food-service operators.',
    feedsInto: 'Professional Monitoring (0.14× elasticity).',
    driver: {
      name: baseline('refrigeration').driver_name,
      unitLabel: baseline('refrigeration').driver_unit,
      min: 5, max: 100, step: 5, defaultValue: baseline('refrigeration').plan_driver_m1,
    },
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
    howWeEarn: '$100/building/month net margin after upstream wholesale cost.',
    fedBy: 'Training graduates (0.4× elasticity — highest among downstream streams).',
    feedsInto: 'Professional Monitoring (0.14× elasticity).',
    driver: {
      name: baseline('isp').driver_name,
      unitLabel: baseline('isp').driver_unit,
      min: 1, max: 50, step: 1, defaultValue: baseline('isp').plan_driver_m1,
    },
    assumptions: {
      unitRevenue: baseline('isp').unit_revenue,
      scenarioNote: 'Conservative = single building pilot; Stretch = 5+ buildings with anchor subscriber density.',
    },
    proof: [],
    computeRevenue: makeCompute('isp'),
  },
];