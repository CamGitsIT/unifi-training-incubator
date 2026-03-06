import React, { useState, useCallback, useEffect } from 'react';
import { TrendingUp, Globe, Zap, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

// Location-free flag per stream
const LOCATION_FREE = {
    experience: false,
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

// Build slider config from baseline streams
const LINE_CONFIGS = BASELINE_STREAMS.map(s => ({
    id: s.stream_id,
    name: s.stream_title,
    emoji: { experience: '🏢', training: '🎓', retrofit: '🔑', retail: '🏪', monitoring: '👁️', rentals: '📦', refrigeration: '🌡️', isp: '📡' }[s.stream_id],
    color: STREAM_COLORS[s.stream_id],
    locationIndependent: LOCATION_FREE[s.stream_id],
    unit: s.driver_unit,
    unitLabel: s.driver_name,
    min: { experience: 10, training: 1, retrofit: 1, retail: 1, monitoring: 5, rentals: 1, refrigeration: 5, isp: 1 }[s.stream_id],
    max: { experience: 200, training: 60, retrofit: 20, retail: 20, monitoring: 150, rentals: 30, refrigeration: 100, isp: 50 }[s.stream_id],
    step: { experience: 10, training: 1, retrofit: 1, retail: 1, monitoring: 5, rentals: 1, refrigeration: 5, isp: 1 }[s.stream_id],
    defaultValue: s.plan_driver_m1,
    // store unit_revenue × units_per_driver for per-driver monthly revenue calculation
    revenuePerDriver: s.unit_revenue * s.units_per_driver,
    tagline: {
        experience: 'Local UniFi Experience Center that fuels every other revenue line.',
        training: 'Location-free National Training Center cohorts delivered online and on-site.',
        retrofit: 'Local retrofit installs that become the national playbook.',
        retail: 'Remote UniFi rollout design for franchise and multi-location retail brands.',
        monitoring: 'Recurring UniFi monitoring revenue, managed from anywhere.',
        rentals: 'UniFi infrastructure rentals for events and pop-ups, shippable anywhere.',
        refrigeration: 'Remote cold-chain compliance monitoring for food and pharma locations.',
        isp: 'Local Micro ISP infrastructure that can be replicated city by city.',
    }[s.stream_id],
}));

// Run default forecast once for initial totals reference
const DEFAULT_FORECAST = runForecast(BASELINE_STREAMS, 'base');

function LineCard({ line, value, onChange }) {
    const monthlyRev = value * line.revenuePerDriver;
    const annualRev = monthlyRev * 12;

    return (
        <motion.div
            layout
            className="bg-slate-800/40 border border-slate-700 rounded-2xl p-4 hover:border-opacity-80 transition-all"
            style={{ borderColor: `${line.color}40` }}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{line.emoji}</span>
                    <div>
                        <div className="text-white font-semibold text-sm">{line.name}</div>
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
                     min={line.min}
                     max={line.max}
                     step={line.step}
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

export default function Slide7Financials({ onInteracted }) {
    const [values, setValues] = useState(() =>
        Object.fromEntries(LINE_CONFIGS.map(l => [l.id, l.defaultValue]))
    );
    const [hasInteracted, setHasInteracted] = useState(false);
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(45);

    React.useEffect(() => {
        if (timerDone) return;
        const interval = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    setTimerDone(true);
                    onInteracted();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerDone]);

    const handleChange = useCallback((id, val) => {
        setValues(prev => ({ ...prev, [id]: val }));
        if (!hasInteracted) {
            setHasInteracted(true);
            onInteracted();
        }
    }, [hasInteracted]);

    const handleReset = () => {
        setValues(Object.fromEntries(LINE_CONFIGS.map(l => [l.id, l.defaultValue])));
    };

    // Build modified streams with current slider values
    const modifiedStreams = BASELINE_STREAMS.map(s => ({
        ...s,
        plan_driver_m1: values[s.stream_id] ?? s.plan_driver_m1,
    }));

    // Run forecast engine with modified drivers — includes compounding effects
    const currentForecast = runForecast(modifiedStreams, 'base');

    // Debug: log when forecast changes
    React.useEffect(() => {
        console.log('Forecast updated:', { y1: currentForecast.totalY1, values });
    }, [currentForecast.totalY1]);

    // Extract year totals from engine
    const y1 = currentForecast.totalY1;
    const y2 = currentForecast.totalY2;
    const y3 = currentForecast.totalY3;

    // Compute revenues using the forecast engine results for each line
    // The forecast engine includes dependency compounding effects
    const lineRevenues = LINE_CONFIGS.map(l => {
        const engineResult = currentForecast.streams[l.id];
        const annualRev = engineResult ? engineResult.y1 : 0;
        const monthlyRev = annualRev / 12;
        return { ...l, monthly: monthlyRev, annual: annualRev };
    });

    // Use the forecast engine's total (includes all compounding effects)
    const totalAnnual = currentForecast.totalY1;
    const totalProfit = Math.round(totalAnnual * MARGIN);
    const dscr = (totalProfit / ANNUAL_DEBT_SERVICE).toFixed(1);
    const dscrColor = parseFloat(dscr) >= 10 ? '#4ade80' : parseFloat(dscr) >= 3 ? '#22d3ee' : '#facc15';

    const locationFreeRevenue = lineRevenues
        .filter(l => l.locationIndependent)
        .reduce((s, l) => s + l.annual, 0);
    const locationFreePct = totalAnnual > 0 ? Math.round((locationFreeRevenue / totalAnnual) * 100) : 0;

    const chartData = lineRevenues.map(l => ({
        id: l.id,
        name: l.name,
        revenue: l.annual,
        color: l.color,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 md:px-6">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Interactive Financial Playground</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        Eight Lines. One Ecosystem.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-2xl md:text-3xl mt-1">
                            Separate revenue lines sharing one engine compound each other's reach and revenue.
                        </span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Eight UniFi-powered revenue lines share one engine. Adjust volumes to see how training, services, and rentals together comfortably cover debt and compound profit.
                    </p>
                </motion.div>

                {/* 3-Year Reference Totals from Forecast Engine */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: 'Year 1 Total', val: y1, sub: 'Months 1–12 · Base' },
                        { label: 'Year 2 Total', val: y2, sub: 'Months 13–24 · Base' },
                        { label: 'Year 3 Total', val: y3, sub: 'Months 25–36 · Base' },
                    ].map(({ label, val, sub }) => (
                        <div key={label} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">{label}</div>
                            <div className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(val, true)}</div>
                            <div className="text-xs text-slate-500 mt-1">{sub}</div>
                        </div>
                    ))}
                </div>

                {/* Summary Bar — based on slider values */}
                <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                        { label: 'Slider Annual Revenue', value: formatCurrency(totalAnnual, true), color: 'text-white', sub: `${formatCurrency(Math.round(totalAnnual/12), true)}/mo` },
                        { label: 'Net Profit (~63%)', value: formatCurrency(totalProfit, true), color: 'text-green-400', sub: 'After ops & overhead' },
                        { label: 'Debt Coverage Ratio', value: `${dscr}x`, color: dscrColor, sub: `vs $${(ANNUAL_DEBT_SERVICE/1000).toFixed(0)}K/yr debt service` },
                        { label: '% Location-Free Revenue', value: `${locationFreePct}%`, color: 'text-cyan-400', sub: 'Earnable from anywhere' },
                    ].map((s, i) => (
                        <motion.div key={i} layout className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                            <motion.div
                                key={s.value}
                                initial={{ scale: 0.9, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-2xl md:text-3xl font-bold ${s.color}`}
                            >
                                {s.value}
                            </motion.div>
                            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Debt context */}
                <div className="mb-6 bg-gradient-to-r from-green-950/30 to-slate-800/30 border border-green-900/50 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">
                        <strong className="text-white">Annual debt service: $55,200/yr ($4,600/mo).</strong>{' '}
                        Training revenue alone — a single line, delivered entirely online — covers this <em>multiple times over</em>.
                        The other 7 lines are essentially free cash flow.
                    </p>
                </div>

                {/* Location freedom callout */}
                <div className="mb-6 bg-gradient-to-r from-cyan-950/30 to-slate-800/30 border border-cyan-900/50 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3">
                    <Globe className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <p className="text-sm text-slate-300 flex-1">
                        <strong className="text-white">5 of 8 lines have zero geography.</strong>{' '}
                        Training, monitoring, retail consulting, rentals, cold-chain sensing — these work from a laptop, a coffee shop, a beach.
                        The Experience Center is our showroom. The internet is our territory.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Sliders */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                Adjust Each Line
                            </h3>
                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" /> Reset
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                            {LINE_CONFIGS.map(line => (
                                <LineCard
                                    key={line.id}
                                    line={line}
                                    value={values[line.id]}
                                    onChange={(v) => handleChange(line.id, v)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Chart + breakdown */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 flex-1">
                            <h3 className="text-white font-semibold mb-4">Annual Revenue by Line</h3>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={chartData} margin={{ bottom: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#475569"
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        angle={-30}
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => formatCurrency(v, true)} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload || !payload[0]) return null;
                                            const entry = payload[0].payload;
                                            const engineData = currentForecast.streams[entry.id];
                                            const config = LINE_CONFIGS.find(l => l.id === entry.id);
                                            return (
                                                <div className="p-2 space-y-1 text-slate-200">
                                                    <div className="font-semibold">{entry.name}</div>
                                                    <div className="text-xs border-t border-slate-600 pt-1 mt-1">
                                                        <div>Annual Y1: <strong>{formatCurrency(entry.revenue)}</strong></div>
                                                        {config && engineData && (
                                                            <>
                                                                <div className="text-slate-400 mt-1">Effective Driver: {engineData.effectiveDriver?.toFixed(2) || 'N/A'}</div>
                                                                <div className="text-slate-400">Monthly/Unit Rev: {formatCurrency(engineData.monthlyUnitRev, true)}</div>
                                                                <div className="text-slate-400">Slider Value: {values[entry.id]} {config.unit}</div>
                                                                <div className="text-slate-400">Growth: {(config.monthly_growth * 100).toFixed(1)}%/mo</div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Location breakdown */}
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4">
                            <h4 className="text-sm font-semibold text-white mb-3">Revenue Geography</h4>
                            <div className="flex gap-2 mb-2">
                                <div className="h-3 rounded-full bg-cyan-400 transition-all duration-500" style={{ width: `${locationFreePct}%` }} />
                                <div className="h-3 rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${100 - locationFreePct}%` }} />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                                    {locationFreePct}% Location-free ({formatCurrency(locationFreeRevenue, true)})
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
                                    {100 - locationFreePct}% Anchor lines
                                </span>
                            </div>
                        </div>

                        {/* The philosophy */}
                        <div className="bg-gradient-to-br from-slate-800/40 to-purple-950/20 border border-purple-800/30 rounded-2xl p-4">
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                                "We don't confront people with their tech difficulties. We spend our energy with calm,
                                content people who take care of themselves — and pay forward.
                                <strong className="text-white not-italic"> Most of what we do happens to support itself.</strong>"
                            </p>
                        </div>
                    </div>
                </div>

                {!hasInteracted && !timerDone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-cyan-400 text-sm">
                        👆 Drag any slider to explore — or continue in {secondsLeft}s
                    </motion.p>
                )}
                {(hasInteracted || timerDone) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold">
                        ✓ Click Next to continue
                    </motion.p>
                )}
            </div>
        </div>
    );
}