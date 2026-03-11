// ============================================================
// FORECAST ENGINE — mirrors the Apps Script logic from the XLSX
// Source: STREAMS_MODEL + DEPENDENCIES tabs
// ============================================================

export const BASELINE_STREAMS = [
  // Values sourced from STREAMS_MODEL tab — OverIT Revenue Forecast 20260305 MASTER (updated 2026-03-06)
  { stream_id: 'experience',                  stream_title: 'Experience Center',                              driver_name: 'Qualified visits per month', driver_unit: 'visits/mo',      plan_driver_m1: 20, units_per_driver: 1, unit_revenue: 300,    monthly_growth: 0.07,  enabled: true },
  { stream_id: 'experience_design_consulting', stream_title: 'Experience Center — Design Consulting',          driver_name: 'Qualified visits per month', driver_unit: 'visits/mo',      plan_driver_m1: 20, units_per_driver: 1, unit_revenue: 300,    monthly_growth: 0.07,  enabled: true },
  { stream_id: 'training',                    stream_title: 'UniFi Certification Training (Multi-day)',        driver_name: 'Seats per month',            driver_unit: 'seats/mo',       plan_driver_m1: 8,  units_per_driver: 1, unit_revenue: 2000,   monthly_growth: 0.10,  enabled: true },
  { stream_id: 'retrofit',      stream_title: 'Keyless Property Access (Retrofit)',        driver_name: 'Projects sold per month',      driver_unit: 'projects/mo',    plan_driver_m1: 10,  units_per_driver: 1,  unit_revenue: 1125,   monthly_growth: 0.075, enabled: true },
  { stream_id: 'retail',        stream_title: 'Multi-Location Retail Businesses',          driver_name: 'Active brand accounts',        driver_unit: 'accounts/mo',    plan_driver_m1: 2,   units_per_driver: 20, unit_revenue: 500,    monthly_growth: 0.07,  enabled: true },
  { stream_id: 'monitoring',    stream_title: 'Professional Monitoring',                   driver_name: 'Active monitored sites',       driver_unit: 'sites/mo',       plan_driver_m1: 20,  units_per_driver: 1,  unit_revenue: 40,     monthly_growth: 0.06,  enabled: true },
  { stream_id: 'rentals',       stream_title: 'Tech Infrastructure Rentals',               driver_name: 'Productions served per month', driver_unit: 'productions/mo', plan_driver_m1: 5,   units_per_driver: 1,  unit_revenue: 800,    monthly_growth: 0.04,  enabled: true },
  { stream_id: 'refrigeration', stream_title: 'Refrigeration & Temp Monitoring',           driver_name: 'Locations monitored',          driver_unit: 'locations/mo',   plan_driver_m1: 15,  units_per_driver: 1,  unit_revenue: 83,     monthly_growth: 0.07,  enabled: true },
  { stream_id: 'isp',           stream_title: 'Micro ISP',                                 driver_name: 'Buildings served',             driver_unit: 'buildings/mo',   plan_driver_m1: 3,   units_per_driver: 20, unit_revenue: 48.75,  monthly_growth: 0.10,  enabled: true },
];

// Allows ForecastEngine page to override baseline at runtime via CSV/Excel import
export function applyImportedStreams(importedRows, baseStreams = BASELINE_STREAMS) {
  return baseStreams.map(s => {
    const match = importedRows.find(r => r.stream_id === s.stream_id);
    if (!match) return s;
    return {
      ...s,
      plan_driver_m1:  match.plan_driver_m1  ?? s.plan_driver_m1,
      units_per_driver: match.units_per_driver ?? s.units_per_driver,
      unit_revenue:    match.unit_revenue     ?? s.unit_revenue,
      monthly_growth:  match.monthly_growth   ?? s.monthly_growth,
    };
  });
}

export const DEPENDENCIES = [
  // Per XLSX DEPENDENCIES tab (MASTER TEMPLATE):
  // Only experience → experience_design_consulting is active (elasticity 1.0 — 1:1 lockstep).
  // All other cross-stream dependencies are intentionally placeholder/near-zero in the template.
  // Each stream is otherwise independent.
  { upstream: 'experience', downstream: 'experience_design_consulting', elasticity: 1.0 },
];

export const SCENARIO_MULTIPLIERS = {
  conservative: { label: 'Conservative', multiplier: 0.8,  color: '#f59e0b' },
  base:          { label: 'Base',         multiplier: 1.0,  color: '#22d3ee' },
  stretch:       { label: 'Stretch',      multiplier: 1.25, color: '#a78bfa' },
};

export const STREAM_COLORS = {
  experience:    '#22d3ee',
  experience_design_consulting: '#06b6d4',
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
/**
 * Matches the Apps Script recalculateModel() logic exactly:
 * - Dependency effect = sum of elasticity × (upEff/upBase - 1) for each upstream
 * - effective_driver_m1 = plan_driver_m1 × (1 + depEffect)
 * - Y1 = eff × monthlyUnitRev × factor12  where factor12 = (growth==0) ? 12 : ((1+g)^12-1)/g
 * - Y2 = eff × monthlyUnitRev × (1+g)^12 × factor12
 * - Y3 = eff × monthlyUnitRev × (1+g)^24 × factor12
 * - RunRate M12 = eff × (1+g)^11 × monthlyUnitRev
 */
export function runForecast(streams, scenario = 'base') {
  const mult = SCENARIO_MULTIPLIERS[scenario].multiplier;
  const MONTHS = 12;

  // Current slider values (what the user set)
  const current = {};
  streams.forEach(s => { current[s.stream_id] = s.plan_driver_m1; });

  // Original baseline from BASELINE_STREAMS (defaults)
  const originalBaseline = {};
  BASELINE_STREAMS.forEach(s => { originalBaseline[s.stream_id] = s.plan_driver_m1; });

  // Compute effective M1 drivers with dependency lifts (Apps Script style)
  const effective = {};
  streams.forEach(s => {
    if (!s.enabled) { effective[s.stream_id] = 0; return; }
    let depEffect = 0;
    DEPENDENCIES.forEach(dep => {
      if (dep.downstream !== s.stream_id) return;
      const upOriginal = originalBaseline[dep.upstream] || 0;
      const upCurrent = current[dep.upstream] || 0;
      const upEff = effective[dep.upstream] || upCurrent;
      // Dependency effect: how much did this upstream increase from its original?
      const upDelta = upOriginal === 0 ? 0 : (upEff - upOriginal) / upOriginal;
      depEffect += dep.elasticity * upDelta;
    });
    effective[s.stream_id] = s.plan_driver_m1 * (1 + depEffect);
  });
  
  // Debug log (remove later)
  if (typeof window !== 'undefined' && window._debugForecast) {
    console.log('Forecast Debug:', { current, originalBaseline, effective });
  }

  const results = {};
  streams.forEach(s => {
    const eff = s.enabled ? (effective[s.stream_id] || 0) : 0;
    const monthlyUnitRev = s.enabled ? s.units_per_driver * s.unit_revenue * mult : 0;
    const g = s.monthly_growth;
    const factor12 = g === 0 ? MONTHS : (Math.pow(1 + g, MONTHS) - 1) / g;

    const y1 = eff * monthlyUnitRev * factor12;
    const y2 = eff * monthlyUnitRev * Math.pow(1 + g, MONTHS) * factor12;
    const y3 = eff * monthlyUnitRev * Math.pow(1 + g, 2 * MONTHS) * factor12;
    const runRateM12 = eff * Math.pow(1 + g, MONTHS - 1) * monthlyUnitRev;
    const runRateM24 = eff * Math.pow(1 + g, 2 * MONTHS - 1) * monthlyUnitRev;
    const runRateM36 = eff * Math.pow(1 + g, 3 * MONTHS - 1) * monthlyUnitRev;

    // Build monthly array for charts (month 1..36)
    const monthly = Array.from({ length: 36 }, (_, i) =>
      eff * Math.pow(1 + g, i) * monthlyUnitRev
    );

    results[s.stream_id] = {
      monthly, y1, y2, y3,
      runRateM12, runRateM24, runRateM36,
      effectiveDriver: eff,
      monthlyUnitRev,
    };
  });

  const enabled = streams.filter(s => s.enabled);
  const totalY1 = enabled.reduce((a, s) => a + results[s.stream_id].y1, 0);
  const totalY2 = enabled.reduce((a, s) => a + results[s.stream_id].y2, 0);
  const totalY3 = enabled.reduce((a, s) => a + results[s.stream_id].y3, 0);
  const totalMonthly = Array.from({ length: 36 }, (_, i) =>
    enabled.reduce((a, s) => a + results[s.stream_id].monthly[i], 0)
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