import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, TrendingUp, ChevronRight } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STREAMS, SCENARIO_MULTIPLIERS } from './revenueConfig';
import { BASELINE_STREAMS } from '@/components/forecast/forecastEngine';
import StreamDrawer from './StreamDrawer';

const BASELINE_STREAMS_MAP = Object.fromEntries(BASELINE_STREAMS.map(s => [s.stream_id, s]));

const SCENARIO_OPTIONS = Object.entries(SCENARIO_MULTIPLIERS).map(([k, v]) => ({ key: k, ...v }));

const fmt = (v) => {
    if (v == null || isNaN(v)) return '—';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
    return `$${Math.round(v)}`;
};

const fmtCompact = (v) => {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${Math.round(v)}`;
};

export default function Slide2Mission({ onInteracted }) {
    const [scenario, setScenario] = useState('base');
    const [activeStream, setActive] = useState(null);
    const [hasInteracted, setInteracted] = useState(false);

    const defaultDrivers = useMemo(() =>
        Object.fromEntries(STREAMS.map(s => [s.id, s.driver.defaultValue])), []);
    const [drivers, setDrivers] = useState(defaultDrivers);

    const markInteracted = () => { if (!hasInteracted) { setInteracted(true); onInteracted(); } };

    const revenues = useMemo(() =>
        Object.fromEntries(STREAMS.map(s => [s.id, s.computeRevenue(drivers[s.id], scenario, 'y1')]))
    , [drivers, scenario]);

    const total = useMemo(() =>
        STREAMS.filter(s => !s.isPipelinePrimary)
            .reduce((sum, s) => sum + (revenues[s.id]?.selectedYear ?? 0), 0)
    , [revenues]);

    const totalY2 = useMemo(() =>
        STREAMS.filter(s => !s.isPipelinePrimary)
            .reduce((sum, s) => sum + (revenues[s.id]?.y2 ?? 0), 0)
    , [revenues]);

    const totalY3 = useMemo(() =>
        STREAMS.filter(s => !s.isPipelinePrimary)
            .reduce((sum, s) => sum + (revenues[s.id]?.y3 ?? 0), 0)
    , [revenues]);

    const chartData = [
        { label: 'Y1', value: total },
        { label: 'Y2', value: totalY2 },
        { label: 'Y3', value: totalY3 },
    ];

    const streamBreakdown = useMemo(() =>
        STREAMS.filter(s => !s.isPipelinePrimary).map(s => ({
            name: s.title.split(' ').slice(0, 2).join(' '),
            value: revenues[s.id]?.selectedYear ?? 0,
            color: s.color,
        }))
    , [revenues]);

    const handleReset = () => setDrivers(defaultDrivers);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 py-14 px-4 md:px-8">
            <div className="max-w-6xl mx-auto w-full">

                {/* ── HEADER */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-400 text-xs font-semibold tracking-wide">Revenue Streams Console</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Eight Lines. One Ecosystem.</h2>
                        <p className="text-slate-400 text-sm mt-1">Drag the sliders to model each revenue driver. Click any row to explore details.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Scenario */}
                        <div className="flex bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
                            {SCENARIO_OPTIONS.map(opt => (
                                <button key={opt.key}
                                    onClick={() => { setScenario(opt.key); markInteracted(); }}
                                    className={`px-3.5 py-2 text-xs font-semibold transition-all ${scenario === opt.key ? 'text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                    style={scenario === opt.key ? { backgroundColor: opt.color } : {}}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleReset}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-all">
                            <RotateCcw className="w-3.5 h-3.5" /> Reset
                        </button>
                    </div>
                </motion.div>

                {/* ── MAIN LAYOUT: sliders left, summary right */}
                <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">

                    {/* LEFT: Slider rows */}
                    <div className="space-y-2">
                        {STREAMS.map((stream, i) => {
                            const driverVal = drivers[stream.id];
                            const rev = revenues[stream.id];
                            const revenueDisplay = stream.isPipelinePrimary
                                ? `${Math.round(driverVal * stream.pipelineOutputs.retrofitConversion)} leads/mo`
                                : fmt(rev?.selectedYear);

                            return (
                                <motion.div key={stream.id}
                                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.045 }}
                                    className="group flex items-center gap-4 bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/40 hover:border-slate-600/60 rounded-2xl px-5 py-4 transition-all"
                                >
                                    {/* Emoji + name */}
                                    <div className="flex items-center gap-2.5 w-52 flex-shrink-0">
                                        <span className="text-lg">{stream.emoji}</span>
                                        <div>
                                            <div className="text-white text-sm font-semibold leading-tight">{stream.title}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{stream.driver.unitLabel}</div>
                                        </div>
                                    </div>

                                    {/* Slider + value */}
                                    <div className="flex-1 flex items-center gap-4 min-w-0">
                                        <div className="flex-1">
                                            <Slider
                                                value={[driverVal]}
                                                onValueChange={v => {
                                                    setDrivers(prev => ({ ...prev, [stream.id]: v[0] }));
                                                    markInteracted();
                                                }}
                                                min={stream.driver.min}
                                                max={stream.driver.max}
                                                step={stream.driver.step}
                                                className="w-full"
                                                style={{ '--slider-color': stream.color }}
                                            />
                                        </div>
                                        {/* Driver number */}
                                        <motion.span key={driverVal}
                                            initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                                            className="text-base font-bold tabular-nums w-8 text-right flex-shrink-0"
                                            style={{ color: stream.color }}
                                        >
                                            {driverVal}
                                        </motion.span>
                                    </div>

                                    {/* Revenue output */}
                                    <motion.div key={revenueDisplay}
                                        initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                                        className="w-28 text-right flex-shrink-0 group/rev relative"
                                        title={stream.isPipelinePrimary
                                            ? `Pipeline driver: ${driverVal} visits × ${Math.round(stream.pipelineOutputs.retrofitConversion * 100)}% conversion = ${Math.round(driverVal * stream.pipelineOutputs.retrofitConversion)} retrofit leads/mo`
                                            : (() => {
                                                const g = stream.driver.defaultValue === driverVal
                                                    ? (BASELINE_STREAMS_MAP[stream.id]?.monthly_growth ?? 0)
                                                    : 0;
                                                const unitRev = BASELINE_STREAMS_MAP[stream.id]?.unit_revenue ?? 0;
                                                const unitsPerDriver = BASELINE_STREAMS_MAP[stream.id]?.units_per_driver ?? 1;
                                                const factor12 = g === 0 ? 12 : ((Math.pow(1 + g, 12) - 1) / g);
                                                return `${driverVal} ${stream.driver.unitLabel} × ${unitsPerDriver} unit(s) × $${unitRev.toLocaleString()}/mo × ${factor12.toFixed(1)} (growth factor) = ${fmt(rev?.selectedYear)} Y1`;
                                            })()
                                        }
                                    >
                                        <div className="text-base font-bold tabular-nums" style={{ color: stream.color }}>
                                            {revenueDisplay}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            {stream.isPipelinePrimary ? 'pipeline' : 'Y1 rev'}
                                        </div>
                                    </motion.div>

                                    {/* Arrow to drawer */}
                                    <button
                                        onClick={() => { setActive(stream); markInteracted(); }}
                                        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-slate-700 text-slate-500 hover:text-white hover:border-slate-500 hover:bg-slate-700 transition-all"
                                        title="Explore details"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* RIGHT: Summary panel */}
                    <div className="space-y-4 sticky top-20">

                        {/* Total revenue */}
                        <motion.div layout className="rounded-2xl border border-slate-700 overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                            <div className="px-5 py-4 border-b border-slate-800">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ background: SCENARIO_MULTIPLIERS[scenario].color }} />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Total · Y1 · {SCENARIO_MULTIPLIERS[scenario].label}
                                    </span>
                                </div>
                                <motion.div key={total}
                                    initial={{ scale: 0.95, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl font-bold text-white tabular-nums mt-1"
                                >
                                    {fmt(total)}
                                </motion.div>
                                <div className="text-slate-500 text-xs mt-0.5">/year (7 revenue streams)</div>
                            </div>

                            {/* Y1/Y2/Y3 strip */}
                            <div className="grid grid-cols-3 divide-x divide-slate-800">
                                {[['Y1', total], ['Y2', totalY2], ['Y3', totalY3]].map(([label, val]) => (
                                    <div key={label} className="px-4 py-3 text-center">
                                        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
                                        <div className="text-sm font-bold text-white tabular-nums">{fmtCompact(val)}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Bar chart */}
                        <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Annual Revenue Projection</p>
                            <ResponsiveContainer width="100%" height={120}>
                                <BarChart data={chartData} barSize={32}>
                                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis hide />
                                    <Tooltip
                                        formatter={(v) => [fmtCompact(v), 'Revenue']}
                                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={['#22d3ee', '#818cf8', '#34d399'][i]} fillOpacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stream breakdown */}
                        <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Y1 Stream Breakdown</p>
                            <div className="space-y-2">
                                {streamBreakdown.sort((a, b) => b.value - a.value).map(s => {
                                    const pct = total > 0 ? (s.value / total) * 100 : 0;
                                    return (
                                        <div key={s.name}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-400 truncate">{s.name}</span>
                                                <span className="font-semibold tabular-nums ml-2 flex-shrink-0" style={{ color: s.color }}>
                                                    {fmtCompact(s.value)}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: s.color }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <p className="text-xs text-amber-500/60 italic px-1">
                            ⚠ Modeled — numbers link to Master Forecast.
                        </p>

                        {hasInteracted && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-xs text-green-400 font-semibold text-center">
                                ✓ Click Next to continue
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── DRAWER */}
            <AnimatePresence>
                {activeStream && (
                    <StreamDrawer
                        key={activeStream.id}
                        stream={activeStream}
                        scenario={scenario}
                        yearView="y1"
                        driverValue={drivers[activeStream.id]}
                        onDriverChange={(val) => setDrivers(prev => ({ ...prev, [activeStream.id]: val }))}
                        onClose={() => setActive(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}