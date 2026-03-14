import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { TrendingUp, Globe, Zap, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

// ─── Timing ───────────────────────────────────────────────────────────────────
// How long to wait between each stream reveal AFTER the user has clicked
// "Start Reveal" or scrolled/interacted with the slide.
// Adjust these two numbers to tune pacing:
const REVEAL_INTERVAL    = 4000;  // ms between each stream appearing
const FIRST_REVEAL_DELAY = 600;   // ms before the first stream appears (lets slide entrance finish)

// ─── Constants ────────────────────────────────────────────────────────────────
const LOCATION_FREE = {
    experience: false,
    experience_design_consulting: false,
    training: true,
    retrofit: false,
    retail: true,
    monitoring: true,
    rentals: true,
    refrigeration: true,
    isp: false,
};

const ANNUAL_DEBT_SERVICE = 55200;
const MARGIN = 0.63;

// ─── LINE_CONFIGS ─────────────────────────────────────────────────────────────
const LINE_CONFIGS_RAW = BASELINE_STREAMS.map(s => ({
    id: s.stream_id,
    name: s.stream_title,
    emoji: {
        experience: '🏢', experience_design_consulting: '✏️', training: '🎓',
        retrofit: '🔑', retail: '🏪', monitoring: '👁️',
        rentals: '📦', refrigeration: '🌡️', isp: '📡',
    }[s.stream_id],
    color: STREAM_COLORS[s.stream_id],
    locationIndependent: LOCATION_FREE[s.stream_id],
    unit: s.driver_unit,
    unitLabel: s.driver_name,
    min:  { experience:5, experience_design_consulting:5, training:1, retrofit:1, retail:1, monitoring:5, rentals:1, refrigeration:5, isp:1 }[s.stream_id],
    max:  { experience:200, experience_design_consulting:200, training:60, retrofit:20, retail:20, monitoring:150, rentals:30, refrigeration:100, isp:50 }[s.stream_id],
    step: { experience:5, experience_design_consulting:5, training:1, retrofit:1, retail:1, monitoring:5, rentals:1, refrigeration:5, isp:1 }[s.stream_id],
    defaultValue: s.plan_driver_m1,
    revenuePerDriver: s.unit_revenue * s.units_per_driver,
    tagline: {
        experience:    'Local UniFi Experience Center that fuels every other revenue line.',
        experience_design_consulting: '2-hour design consult billed per visit — $300 per qualified visitor.',
        training:      'Location-free National Training Center cohorts delivered online and on-site.',
        retrofit:      'Local retrofit installs that become the national playbook.',
        retail:        'Remote UniFi rollout design for franchise and multi-location retail brands.',
        monitoring:    'Recurring UniFi monitoring revenue, managed from anywhere.',
        rentals:       'UniFi infrastructure rentals for events and pop-ups, shippable anywhere.',
        refrigeration: 'Remote cold-chain compliance monitoring for food and pharma locations.',
        isp:           'Local Micro ISP infrastructure that can be replicated city by city.',
    }[s.stream_id],
}));

// Experience Center first, then Training — then others by revenue desc
const PINNED_IDS = ['experience', 'training'];
const OTHER_IDS  = ['refrigeration', 'retrofit', 'retail', 'rentals', 'isp', 'monitoring'];

const LINE_CONFIGS = [
    ...PINNED_IDS.map(id => LINE_CONFIGS_RAW.find(l => l.id === id)),
    ...OTHER_IDS.map(id  => LINE_CONFIGS_RAW.find(l => l.id === id)),
].filter(Boolean);

const PINNED_COUNT = PINNED_IDS.length;
const TOTAL_STEPS  = OTHER_IDS.length;

// ─── LineCard ─────────────────────────────────────────────────────────────────
function LineCard({ line, value, onChange, isPinned }) {
    const annualRev = value * line.revenuePerDriver * 12;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 hover:border-opacity-80 transition-all"
            style={{ borderColor: isPinned ? `${line.color}70` : `${line.color}40` }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{line.emoji}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-white font-semibold text-sm">{line.name}</div>
                            {isPinned && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background:`${line.color}20`, color:line.color, border:`1px solid ${line.color}40` }}>
                                    Core
                                </span>
                            )}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: line.color }}>
                            {line.locationIndependent ? '🌐 Location-free' : '📍 Anchor line'}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: line.color }}>{formatCurrency(annualRev, true)}</div>
                    <div className="text-xs text-slate-500">/yr</div>
                </div>
            </div>
            <p className="text-xs text-slate-400 mb-3 italic leading-relaxed">"{line.tagline}"</p>
            <div className="flex items-center gap-3">
                <div className="text-xs flex-shrink-0 w-28">
                    <div><strong className="text-slate-300">{value}</strong> <span className="text-slate-500">{line.unit}</span></div>
                    <div className="text-slate-600 text-xs mt-0.5">{line.unitLabel}</div>
                </div>
                <Slider
                    value={[value]}
                    onValueChange={(v) => onChange(v[0])}
                    min={line.min} max={line.max} step={line.step}
                    className="flex-1"
                    style={{ '--slider-filled': '#21d3ee' }}
                />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>{line.min} {line.unit}</span>
                <span>{line.max} {line.unit}</span>
            </div>
        </motion.div>
    );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function useAnimatedValue(target, duration = 700) {
    const [display, setDisplay] = useState(target);
    const prev = useRef(target);
    useEffect(() => {
        const start = prev.current, end = target, t0 = performance.now();
        const raf = requestAnimationFrame(function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            setDisplay(Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
            else prev.current = end;
        });
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return display;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Slide7Financials({ onInteracted }) {
    const [values, setValues] = useState(() =>
        Object.fromEntries(LINE_CONFIGS.map(l => [l.id, l.defaultValue]))
    );

    // ── Reveal state ──────────────────────────────────────────────────────────
    // revealStep: 0 = only pinned visible. 1..6 = additional streams shown.
    // started: user has clicked "Begin" — only then do we start the clock.
    const [revealStep, setRevealStep] = useState(0);
    const [started,    setStarted]    = useState(false);

    // We store the timestamp of when "started" became true, and use a
    // requestAnimationFrame loop to check wall-clock elapsed time.
    // This is completely immune to React re-renders, StrictMode, and
    // Framer Motion's exit animation holding old component instances alive —
    // because we never set state from a timer that could fire on a stale closure.
    const startedAt   = useRef(null);
    const rafRef      = useRef(null);
    const stepRef     = useRef(0); // mirrors revealStep but accessible in RAF

    // Guard against Vite Fast Refresh stale state: useState values (started,
    // revealStep) survive HMR but useRef values reset. If started=true but
    // startedAt is null we're in an inconsistent post-HMR state — reset before paint.
    useLayoutEffect(() => {
        if (started && startedAt.current === null) {
            setStarted(false);
            setRevealStep(0);
            stepRef.current = 0;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const startReveal = useCallback(() => {
        if (startedAt.current !== null) return; // already started
        startedAt.current = performance.now();
        setStarted(true);

        function loop(now) {
            const elapsed = now - startedAt.current;
            // Which step should we be on given elapsed time?
            let target = 0;
            if (elapsed >= FIRST_REVEAL_DELAY) {
                target = 1 + Math.floor((elapsed - FIRST_REVEAL_DELAY) / REVEAL_INTERVAL);
            }
            target = Math.min(target, TOTAL_STEPS);

            if (target > stepRef.current) {
                stepRef.current = target;
                setRevealStep(target);
            }

            if (stepRef.current < TOTAL_STEPS) {
                rafRef.current = requestAnimationFrame(loop);
            }
        }

        rafRef.current = requestAnimationFrame(loop);
    }, []);

    // Auto-start reveal on mount; also mark slide as interacted immediately
    // (no gating — the reveal itself is the experience)
    useEffect(() => {
        onInteracted();
        startReveal();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = useCallback((id, val) => {
        setValues(prev => ({ ...prev, [id]: val }));
    }, []);

    const handleReset = () => {
        setValues(Object.fromEntries(LINE_CONFIGS.map(l => [l.id, l.defaultValue])));
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        startedAt.current = null;
        stepRef.current   = 0;
        setRevealStep(0);
        setStarted(false);
        startReveal(); // restart auto-reveal from the beginning
    };

    // ── Forecast ──────────────────────────────────────────────────────────────
    const modifiedStreams = BASELINE_STREAMS.map(s => ({
        ...s, plan_driver_m1: values[s.stream_id] ?? s.plan_driver_m1,
    }));
    const currentForecast = runForecast(modifiedStreams, 'base');

    const visibleIds = [...PINNED_IDS, ...OTHER_IDS.slice(0, revealStep)];

    const lineRevenues = LINE_CONFIGS.map(l => ({
        ...l, annual: currentForecast.streams[l.id]?.y1 ?? 0,
    }));

    // Only count visible streams — totals aggregate as each card is revealed
    const visibleRevenue = lineRevenues
        .filter(l => visibleIds.includes(l.id))
        .reduce((s, l) => s + l.annual, 0);

    const visibleY2 = LINE_CONFIGS
        .filter(l => visibleIds.includes(l.id))
        .reduce((s, l) => s + (currentForecast.streams[l.id]?.y2 ?? 0), 0);

    const visibleY3 = LINE_CONFIGS
        .filter(l => visibleIds.includes(l.id))
        .reduce((s, l) => s + (currentForecast.streams[l.id]?.y3 ?? 0), 0);

    const visibleProfit = Math.round(visibleRevenue * MARGIN);
    const visibleDscr   = (visibleProfit / ANNUAL_DEBT_SERVICE).toFixed(1);
    const dscrColor     = parseFloat(visibleDscr) >= 10 ? '#4ade80' : parseFloat(visibleDscr) >= 3 ? '#22d3ee' : '#facc15';

    const locationFreeRevenue = lineRevenues
        .filter(l => l.locationIndependent && visibleIds.includes(l.id))
        .reduce((s, l) => s + l.annual, 0);
    const locationFreePct = visibleRevenue > 0
        ? Math.round((locationFreeRevenue / visibleRevenue) * 100) : 0;

    const chartData = lineRevenues
        .filter(l => visibleIds.includes(l.id))
        .map(l => ({ id: l.id, name: l.name, revenue: l.annual, color: l.color }));

    const displayY1 = useAnimatedValue(visibleRevenue);
    const displayY2 = useAnimatedValue(visibleY2);
    const displayY3 = useAnimatedValue(visibleY3);
    const allRevealed  = revealStep >= TOTAL_STEPS;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 md:px-6">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Interactive Financial Playground</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Nine Lines. One Ecosystem.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-2xl md:text-3xl mt-1">
                            Separate revenue lines sharing one engine compound each other's reach and revenue.
                        </span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Nine UniFi-powered revenue lines share one engine. Adjust volumes to see how training, services, and rentals together comfortably cover debt and compound profit.
                    </p>
                </motion.div>

                {/* 3-Year Totals — aggregate as streams are revealed */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label:'Year 1 Total', val:displayY1, sub:'Months 1–12 · Base' },
                        { label:'Year 2 Total', val:displayY2, sub:'Months 13–24 · Base' },
                        { label:'Year 3 Total', val:displayY3, sub:'Months 25–36 · Base' },
                    ].map(({ label, val, sub }) => (
                        <div key={label} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">{label}</div>
                            <motion.div key={val} initial={{scale:0.95,opacity:0.6}} animate={{scale:1,opacity:1}}
                                className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(val, true)}</motion.div>
                            <div className="text-xs text-slate-500 mt-1">{sub}</div>
                        </div>
                    ))}
                </div>

                {/* Summary bar — all values reflect only revealed streams */}
                <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        {
                            label: allRevealed ? 'Total Annual Revenue' : `Running Total (${visibleIds.length} streams)`,
                            value: formatCurrency(displayY1, true),
                            color: allRevealed ? '#ffffff' : '#22d3ee',
                            sub:   allRevealed ? `${formatCurrency(Math.round(visibleRevenue/12),true)}/mo` : 'building…',
                        },
                        { label:'Net Profit (~63%)',       value:formatCurrency(visibleProfit,true), color:'#4ade80', sub:'After ops & overhead' },
                        { label:'Debt Coverage Ratio',     value:`${visibleDscr}x`,                  color:dscrColor, sub:`vs $${(ANNUAL_DEBT_SERVICE/1000).toFixed(0)}K/yr debt service` },
                        { label:'% Location-Free Revenue', value:`${locationFreePct}%`,              color:'#22d3ee', sub:'Earnable from anywhere' },
                    ].map((s, i) => (
                        <motion.div key={i} layout className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                            <motion.div key={s.value} initial={{scale:0.9,opacity:0.5}} animate={{scale:1,opacity:1}}
                                className="text-2xl md:text-3xl font-bold" style={{color:s.color}}>
                                {s.value}
                            </motion.div>
                            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Callout bars */}
                <div className="mb-4 bg-gradient-to-r from-green-950/30 to-slate-800/30 border border-green-900/50 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">
                        <strong className="text-white">Annual debt service: $55,200/yr ($4,600/mo).</strong>{' '}
                        Training revenue alone — a single line, delivered entirely online — covers this <em>multiple times over</em>.
                        The other 7 lines are essentially free cash flow.
                    </p>
                </div>
                <div className="mb-6 bg-gradient-to-r from-cyan-950/30 to-slate-800/30 border border-cyan-900/50 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
                    <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">
                        <strong className="text-white">5 of 9 lines have zero geography.</strong>{' '}
                        Training, monitoring, retail consulting, rentals, cold-chain sensing — these work from a laptop, a coffee shop, a beach.
                        The Experience Center is our showroom. The internet is our territory.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">

                    {/* Left: Stream cards */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />Adjust Each Line
                            </h3>
                            <button onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Reset
                            </button>
                        </div>

                        {/* Status bar */}
                        {started && !allRevealed && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs text-slate-500">
                                    Stream {revealStep + PINNED_COUNT} of {TOTAL_STEPS + PINNED_COUNT}
                                </span>
                                <div className="flex-1 h-1 bg-slate-800 rounded overflow-hidden">
                                    <motion.div className="h-full rounded bg-cyan-400"
                                        animate={{ width:`${(revealStep / TOTAL_STEPS) * 100}%` }}
                                        transition={{ duration:0.4 }} />
                                </div>
                            </div>
                        )}
                        {allRevealed && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex-1 h-1 bg-cyan-500/40 rounded" />
                                <span className="text-xs text-cyan-400 font-semibold">All 8 streams revealed</span>
                                <div className="flex-1 h-1 bg-cyan-500/40 rounded" />
                            </div>
                        )}

                        <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">

                            {/* Pinned: Experience Center then Training — always visible */}
                            {LINE_CONFIGS.slice(0, PINNED_COUNT).map(line => (
                                <LineCard key={line.id} line={line} value={values[line.id]}
                                    onChange={v => handleChange(line.id, v)} isPinned={true} />
                            ))}

                            <div className="flex items-center gap-2 py-1">
                                <div className="flex-1 border-t border-slate-700/60" />
                                <span className="text-xs text-slate-600">additional streams</span>
                                <div className="flex-1 border-t border-slate-700/60" />
                            </div>

                            {/* Animated reveal streams */}
                            <AnimatePresence>
                                {LINE_CONFIGS.slice(PINNED_COUNT).map((line, i) => {
                                    if (i >= revealStep) return null;
                                    return (
                                        <motion.div key={line.id}
                                            initial={{ opacity:0, y:16, scale:0.97 }}
                                            animate={{ opacity:1, y:0, scale:1 }}
                                            transition={{ duration:0.5, ease:'easeOut' }}>
                                            <LineCard line={line} value={values[line.id]}
                                                onChange={v => handleChange(line.id, v)} isPinned={false} />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Skeleton placeholders */}
                            {!allRevealed && Array.from({ length: TOTAL_STEPS - revealStep }).map((_, i) => (
                                <div key={`ph-${i}`}
                                    className="border border-dashed border-slate-700/40 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-slate-800 rounded animate-pulse w-1/3" />
                                        <div className="h-2 bg-slate-800/60 rounded animate-pulse w-2/3" />
                                    </div>
                                    <div className="h-6 w-16 bg-slate-800 rounded animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Chart */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 flex-1">
                            <h3 className="text-white font-semibold mb-1">Annual Revenue by Line</h3>
                            {!allRevealed && <p className="text-xs text-slate-500 mb-3">Chart grows as each stream is revealed</p>}
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={chartData} margin={{ bottom:50 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis dataKey="name" stroke="#475569"
                                        tick={{ fontSize:10, fill:'#94a3b8' }} angle={-30} textAnchor="end" interval={0} />
                                    <YAxis stroke="#475569" tick={{ fontSize:10, fill:'#94a3b8' }}
                                        tickFormatter={v => formatCurrency(v, true)} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor:'#0f172a', border:'1px solid #334155', borderRadius:'8px', fontSize:'11px' }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload?.[0]) return null;
                                            const entry = payload[0].payload;
                                            const ed  = currentForecast.streams[entry.id];
                                            const cfg = LINE_CONFIGS.find(l => l.id === entry.id);
                                            return (
                                                <div className="p-2 space-y-1 text-slate-200">
                                                    <div className="font-semibold">{entry.name}</div>
                                                    <div className="text-xs border-t border-slate-600 pt-1 mt-1">
                                                        <div>Annual Y1: <strong>{formatCurrency(entry.revenue)}</strong></div>
                                                        {cfg && ed && <>
                                                            <div className="text-slate-400 mt-1">Effective Driver: {ed.effectiveDriver?.toFixed(2) || 'N/A'}</div>
                                                            <div className="text-slate-400">Monthly/Unit Rev: {formatCurrency(ed.monthlyUnitRev, true)}</div>
                                                            <div className="text-slate-400">Slider: {values[entry.id]} {cfg.unit}</div>
                                                        </>}
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="revenue" radius={[6,6,0,0]}>
                                        {chartData.map((e,i) => <Cell key={i} fill={e.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4">
                            <h4 className="text-sm font-semibold text-white mb-3">Revenue Geography</h4>
                            <div className="flex gap-2 mb-2">
                                <div className="h-3 rounded-full bg-cyan-400 transition-all duration-500" style={{ width:`${locationFreePct}%` }} />
                                <div className="h-3 rounded-full bg-purple-500 transition-all duration-500" style={{ width:`${100-locationFreePct}%` }} />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                                    {locationFreePct}% Location-free ({formatCurrency(locationFreeRevenue, true)})
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                                    {100-locationFreePct}% Anchor lines
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-800/40 to-purple-950/20 border border-purple-800/30 rounded-2xl p-4">
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                "We don't confront people with their tech difficulties. We spend our energy with calm,
                                content people who take care of themselves — and pay forward.
                                <strong className="text-white not-italic"> Most of what we do happens to support itself.</strong>"
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
