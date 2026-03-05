// ============================================================
// FORECAST ENGINE — mirrors the Apps Script logic from the XLSX
// Source: STREAMS_MODEL + DEPENDENCIES tabs
// ============================================================

export const BASELINE_STREAMS = [
  { stream_id: 'experience',    stream_title: 'Experience Center',                        driver_name: 'Qualified visits per month',   driver_unit: 'visits/mo',      plan_driver_m1: 40,  units_per_driver: 1,  unit_revenue: 30,    monthly_growth: 0.07,  enabled: true },
  { stream_id: 'training',      stream_title: 'UniFi Certification Training (Multi-day)', driver_name: 'Seats per month',              driver_unit: 'seats/mo',       plan_driver_m1: 8,   units_per_driver: 1,  unit_revenue: 2000,  monthly_growth: 0.10,  enabled: true },
  { stream_id: 'retrofit',      stream_title: 'Keyless Property Access (Retrofit)',        driver_name: 'Projects sold per month',      driver_unit: 'projects/mo',    plan_driver_m1: 4,   units_per_driver: 6,  unit_revenue: 1125,  monthly_growth: 0.075, enabled: true },
  { stream_id: 'retail',        stream_title: 'Multi-Location Retail Businesses',          driver_name: 'Active brand accounts',        driver_unit: 'accounts/mo',    plan_driver_m1: 2,   units_per_driver: 20, unit_revenue: 3500,  monthly_growth: 0.07,  enabled: true },
  { stream_id: 'monitoring',    stream_title: 'Professional Monitoring',                   driver_name: 'Active monitored sites',       driver_unit: 'sites/mo',       plan_driver_m1: 20,  units_per_driver: 1,  unit_revenue: 100,   monthly_growth: 0.06,  enabled: true },
  { stream_id: 'rentals',       stream_title: 'Tech Infrastructure Rentals',               driver_name: 'Productions served per month', driver_unit: 'productions/mo', plan_driver_m1: 5,   units_per_driver: 1,  unit_revenue: 800,   monthly_growth: 0.04,  enabled: true },
  { stream_id: 'refrigeration', stream_title: 'Refrigeration & Temp Monitoring',           driver_name: 'Locations monitored',          driver_unit: 'locations/mo',   plan_driver_m1: 15,  units_per_driver: 1,  unit_revenue: 83,    monthly_growth: 0.07,  enabled: true },
  { stream_id: 'isp',           stream_title: 'Micro ISP',                                 driver_name: 'Buildings served',             driver_unit: 'buildings/mo',   plan_driver_m1: 3,   units_per_driver: 1,  unit_revenue: 100,   monthly_growth: 0.10,  enabled: true },
];

export const DEPENDENCIES = [
  { upstream: 'experience',    downstream: 'training',      elasticity: 0.60 },
  { upstream: 'experience',    downstream: 'retrofit',      elasticity: 0.50 },
  { upstream: 'training',      downstream: 'retrofit',      elasticity: 0.30 },
  { upstream: 'training',      downstream: 'retail',        elasticity: 0.15 },
  { upstream: 'training',      downstream: 'rentals',       elasticity: 0.30 },
  { upstream: 'training',      downstream: 'refrigeration', elasticity: 0.30 },
  { upstream: 'training',      downstream: 'isp',           elasticity: 0.40 },
  { upstream: 'retrofit',      downstream: 'monitoring',    elasticity: 0.14 },
  { upstream: 'retail',        downstream: 'monitoring',    elasticity: 0.14 },
  { upstream: 'rentals',       downstream: 'monitoring',    elasticity: 0.14 },
  { upstream: 'refrigeration', downstream: 'monitoring',    elasticity: 0.14 },
  { upstream: 'isp',           downstream: 'monitoring',    elasticity: 0.14 },
];

export const SCENARIO_MULTIPLIERS = {
  conservative: { label: 'Conservative', multiplier: 0.8,  color: '#f59e0b' },
  base:          { label: 'Base',         multiplier: 1.0,  color: '#22d3ee' },
  stretch:       { label: 'Stretch',      multiplier: 1.25, color: '#a78bfa' },
};

export const STREAM_COLORS = {
  experience:    '#22d3ee',
  training:      '#f472b6',
  retrofit:      '#818cf8',
  retail:        '#fb923c',
  monitoring:    '#34d399',
  rentals:       '#a78bfa',
  refrigeration: '#38bdf8',
  isp:           '#facc15',
};

/**
 * Core engine: runs the 36-month simulation with dependency-based compounding.
 *
 * Algorithm (matching the Apps Script):
 * 1. For each month M (1..36), process streams in order (upstream first).
 * 2. Each stream's driver at month M = plan_driver_m1 × (1 + growth)^(M-1)
 *    PLUS upstream dependency lifts accumulated so far this month.
 * 3. Dependency lift for downstream: Δdownstream_driver += upstream_driver_delta × elasticity
 *    where upstream_driver_delta = upstream_driver_m - upstream_driver_m1_effective
 * 4. Monthly revenue = effective_driver_m × units_per_driver × unit_revenue × scenario_multiplier
 */
export function runForecast(streams, scenario = 'base') {
  const mult = SCENARIO_MULTIPLIERS[scenario].multiplier;
  const streamOrder = streams.map(s => s.stream_id);

  // Pre-compute effective M1 drivers (base plan drivers, no dependency in M1)
  const effectiveM1 = {};
  streams.forEach(s => { effectiveM1[s.stream_id] = s.plan_driver_m1; });

  // Apply dependency lifts to M1 effective drivers (same as Apps Script does for initial state)
  // We skip M1 dep lift to match the sheet (effective_driver_m1 = plan_driver_m1 for all)

  // Build monthly revenue arrays per stream
  const monthlyRevenue = {}; // stream_id -> [m1..m36]
  const monthlyDriver  = {}; // stream_id -> [m1..m36]
  streams.forEach(s => {
    monthlyRevenue[s.stream_id] = [];
    monthlyDriver[s.stream_id]  = [];
  });

  for (let m = 1; m <= 36; m++) {
    // Step 1: compute organic (no-dep) driver for each stream at month m
    const organicDriver = {};
    streams.forEach(s => {
      organicDriver[s.stream_id] = s.plan_driver_m1 * Math.pow(1 + s.monthly_growth, m - 1);
    });

    // Step 2: compute dependency lifts — accumulate upstream deltas
    const depLift = {};
    streams.forEach(s => { depLift[s.stream_id] = 0; });

    DEPENDENCIES.forEach(dep => {
      const upStream = streams.find(s => s.stream_id === dep.upstream);
      if (!upStream || !upStream.enabled) return;
      const downStream = streams.find(s => s.stream_id === dep.downstream);
      if (!downStream || !downStream.enabled) return;

      // Delta = how much upstream driver grew vs M1
      const upOrganicM1 = upStream.plan_driver_m1; // baseline M1
      const upDriverM   = organicDriver[dep.upstream];
      const upDelta     = upDriverM - upOrganicM1;

      depLift[dep.downstream] += upDelta * dep.elasticity;
    });

    // Step 3: effective driver = organic + dep lift (floor at 0)
    streams.forEach(s => {
      const effective = Math.max(0, organicDriver[s.stream_id] + depLift[s.stream_id]);
      monthlyDriver[s.stream_id].push(effective);

      const rev = s.enabled
        ? effective * s.units_per_driver * s.unit_revenue * mult
        : 0;
      monthlyRevenue[s.stream_id].push(rev);
    });
  }

  // Aggregate results per stream
  const results = {};
  streams.forEach(s => {
    const rev = monthlyRevenue[s.stream_id];
    results[s.stream_id] = {
      monthly:       rev,
      monthlyDriver: monthlyDriver[s.stream_id],
      y1:            rev.slice(0, 12).reduce((a, b) => a + b, 0),
      y2:            rev.slice(12, 24).reduce((a, b) => a + b, 0),
      y3:            rev.slice(24, 36).reduce((a, b) => a + b, 0),
      runRateM12:    rev[11],
      runRateM24:    rev[23],
      runRateM36:    rev[35],
    };
  });

  // Totals
  const enabled = streams.filter(s => s.enabled);
  const totalY1 = enabled.reduce((a, s) => a + results[s.stream_id].y1, 0);
  const totalY2 = enabled.reduce((a, s) => a + results[s.stream_id].y2, 0);
  const totalY3 = enabled.reduce((a, s) => a + results[s.stream_id].y3, 0);

  // Monthly totals for chart
  const totalMonthly = Array.from({ length: 36 }, (_, i) =>
    enabled.reduce((a, s) => a + monthlyRevenue[s.stream_id][i], 0)
  );

  return { streams: results, totalY1, totalY2, totalY3, totalMonthly };
}

export function formatCurrency(n, compact = false) {
  if (compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
    return `$${Math.round(n).toLocaleString()}`;
  }
  return `$${Math.round(n).toLocaleString()}`;
}