import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TrendingUp, Globe, Zap, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

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

// ─── LINE_CONFIGS_RAW — all 9 streams (used for chart & totals) ────────────
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

// Only these two have interactive sliders
const CORE_IDS = ['experience', 'training'];
const CORE_CONFIGS = CORE_IDS.map(id => LINE_CONFIGS_RAW.find(l => l.id === id)).filter(Boolean);

// ─── LineCard ─────────────────────────────────────────────────────────────────
function LineCard({ line, value, onChange }) {
    const annualRev = value * line.revenuePerDriver * 12;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 hover:border-opacity-80 transition-all"
            style={{ borderColor: `${line.color}70` }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{line.emoji}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-white font-semibold text-sm">{line.name}</div>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{ background:`${line.color}20`, color:line.color, border:`1px solid ${line.color}40` }}>
                                Core
                            </span>
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
        Object.fromEntries(CORE_CONFIGS.map(l => [l.id, l.defaultValue]))
    );

    useEffect(() => { onInteracted(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = useCallback((id, val) => {
        setValues(prev => ({ ...prev, [id]: val }));
    }, []);

    const handleReset = () => {
        setValues(Object.fromEntries(CORE_CONFIGS.map(l => [l.id, l.defaultValue])));
    };

    // ── Forecast — slider values for core lines, baseline for all others ──────
    const modifiedStreams = BASELINE_STREAMS.map(s => ({
        ...s, plan_driver_m1: values[s.stream_id] ?? s.plan_driver_m1,
    }));
    const currentForecast = runForecast(modifiedStreams, 'base');

    // Totals use full 9-stream forecast
    const totalY1 = currentForecast.totalY1;
    const totalY2 = currentForecast.totalY2;
    const totalY3 = currentForecast.totalY3;
    const totalProfit = Math.round(totalY1 * MARGIN);
    const totalDscr   = (totalProfit / ANNUAL_DEBT_SERVICE).toFixed(1);
    const dscrColor   = parseFloat(totalDscr) >= 10 ? '#4ade80' : parseFloat(totalDscr) >= 3 ? '#22d3ee' : '#facc15';

    const locationFreeRevenue = LINE_CONFIGS_RAW
        .filter(l => l.locationIndependent)
        .reduce((s, l) => s + (currentForecast.streams[l.id]?.y1 ?? 0), 0);
    const locationFreePct = totalY1 > 0
        ? Math.round((locationFreeRevenue / totalY1) * 100) : 0;

    const chartData = LINE_CONFIGS_RAW.map(l => ({
        id: l.id,
        name: l.name,
        revenue: currentForecast.streams[l.id]?.y1 ?? 0,
        color: l.color,
    }));

    const displayY1 = useAnimatedValue(Math.round(totalY1));
    const displayY2 = useAnimatedValue(Math.round(totalY2));
    const displayY3 = useAnimatedValue(Math.round(totalY3));

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 md:px-6">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Interactive Financial Model</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Two Core Lines. Nine-Line Engine.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-2xl md:text-3xl mt-1">
                            Experience Center and Training drive the model — the other seven amplify it.
                        </span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Adjust the two primary drivers to see how they alone — or together — clear debt service and stack profit across all nine revenue lines.
                    </p>
                </motion.div>

                {/* 3-Year Totals */}
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

                {/* Summary bar */}
                <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label:'Total Annual Revenue',    value:formatCurrency(displayY1, true), color:'#ffffff', sub:`${formatCurrency(Math.round(totalY1/12),true)}/mo avg` },
                        { label:'Net Profit (~63%)',        value:formatCurrency(totalProfit,true), color:'#4ade80', sub:'After ops & overhead' },
                        { label:'Debt Coverage Ratio',      value:`${totalDscr}x`,                  color:dscrColor, sub:`vs $${(ANNUAL_DEBT_SERVICE/1000).toFixed(0)}K/yr debt service` },
                        { label:'% Location-Free Revenue',  value:`${locationFreePct}%`,            color:'#22d3ee', sub:'Earnable from anywhere' },
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
                        The other seven lines are essentially free cash flow.
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

                    {/* Left: Core sliders */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />Adjust Core Drivers
                            </h3>
                            <button onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Reset
                            </button>
                        </div>

                        <div className="space-y-3">
                            {CORE_CONFIGS.map(line => (
                                <LineCard key={line.id} line={line} value={values[line.id]}
                                    onChange={v => handleChange(line.id, v)} />
                            ))}
                        </div>

                        {/* Supporting streams note */}
                        <div className="mt-4 bg-slate-800/20 border border-slate-700/40 rounded-xl px-4 py-3">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                <strong className="text-slate-400">+ 7 supporting streams</strong> (Retrofit, Retail, Monitoring, Rentals, Refrigeration, ISP, Design Consulting)
                                run at base assumptions and are reflected in the totals and chart above.
                            </p>
                        </div>
                    </div>

                    {/* Right: Chart */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 flex-1">
                            <h3 className="text-white font-semibold mb-4">Annual Revenue by Line — All 9 Streams</h3>
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
                                            const cfg = LINE_CONFIGS_RAW.find(l => l.id === entry.id);
                                            const isCore = CORE_IDS.includes(entry.id);
                                            return (
                                                <div className="p-2 space-y-1 text-slate-200">
                                                    <div className="font-semibold">{entry.name}{isCore ? ' ✦' : ''}</div>
                                                    <div className="text-xs border-t border-slate-600 pt-1 mt-1">
                                                        <div>Annual Y1: <strong>{formatCurrency(entry.revenue)}</strong></div>
                                                        {cfg && ed && <>
                                                            <div className="text-slate-400 mt-1">Driver: {ed.effectiveDriver?.toFixed(2) || 'N/A'} {cfg.unit}</div>
                                                            <div className="text-slate-400">Rev/unit: {formatCurrency(ed.monthlyUnitRev, true)}/mo</div>
                                                            {isCore && <div className="text-cyan-400 mt-1">← adjustable with slider</div>}
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
