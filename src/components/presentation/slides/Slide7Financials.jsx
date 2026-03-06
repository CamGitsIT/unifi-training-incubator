import React, { useState, useCallback } from 'react';
import { TrendingUp, Globe, Zap, Shield, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slider } from "@/components/ui/slider";

// Business line definitions
const DEFAULT_LINES = [
    {
        id: 'experience',
        name: 'Experience Center',
        emoji: '🏢',
        color: '#22d3ee',
        locationIndependent: false,
        tagline: 'Local UniFi Experience Center that fuels every other revenue line.',
        unit: 'visitors/mo',
        unitLabel: 'Monthly Visitors',
        min: 10, max: 200, step: 10, default: 40,
        revenuePerUnit: 50, // $50 avg per visitor (demos, consultations)
        description: 'Live demo space generates leads for all other lines.',
    },
    {
        id: 'retrofit',
        name: 'Keyless Retrofit',
        emoji: '🔑',
        color: '#818cf8',
        locationIndependent: false,
        tagline: 'Local retrofit installs that become the national playbook.',
        unit: 'installs/mo',
        unitLabel: 'Monthly Installs',
        min: 1, max: 20, step: 1, default: 4,
        revenuePerUnit: 1125,
        description: 'One install = ~$1,125 avg. Local anchor, national blueprint.',
    },
    {
        id: 'training',
        name: 'UniFi Training',
        emoji: '🎓',
        color: '#f472b6',
        locationIndependent: true,
        tagline: 'Location-free National Training Center cohorts delivered online and on-site.',
        unit: 'students/mo',
        unitLabel: 'Monthly Students',
        min: 1, max: 60, step: 1, default: 8,
        revenuePerUnit: 792,
        description: 'Online cohorts + in-person intensives. Scales globally.',
    },
    {
        id: 'retail',
        name: 'Multi-Location Retail',
        emoji: '🏪',
        color: '#fb923c',
        locationIndependent: true,
        tagline: 'Remote UniFi rollout design for franchise and multi-location retail brands.',
        unit: 'sites/mo',
        unitLabel: 'Sites Served/Mo',
        min: 1, max: 20, step: 1, default: 2,
        revenuePerUnit: 750,
        description: 'Franchise & chain rollouts. You consult, they deploy.',
    },
    {
        id: 'monitoring',
        name: 'Pro Monitoring',
        emoji: '👁️',
        color: '#34d399',
        locationIndependent: true,
        tagline: 'Recurring UniFi monitoring revenue, managed from anywhere.',
        unit: 'sites monitored',
        unitLabel: 'Active Sites',
        min: 5, max: 100, step: 5, default: 20,
        revenuePerUnit: 100,
        description: 'Monthly recurring. Pure margin after setup.',
    },
    {
        id: 'rentals',
        name: 'Tech Rentals',
        emoji: '📦',
        color: '#a78bfa',
        locationIndependent: true,
        tagline: 'UniFi infrastructure rentals for events and pop-ups, shippable anywhere.',
        unit: 'rentals/mo',
        unitLabel: 'Monthly Rentals',
        min: 1, max: 30, step: 1, default: 5,
        revenuePerUnit: 200,
        description: 'Gear rental for events, staging, temp installs.',
    },
    {
        id: 'refrigeration',
        name: 'Fridge Monitoring',
        emoji: '🌡️',
        color: '#38bdf8',
        locationIndependent: true,
        tagline: 'Remote cold-chain compliance monitoring for food and pharma locations.',
        unit: 'sensors/mo',
        unitLabel: 'Active Sensors',
        min: 5, max: 100, step: 5, default: 15,
        revenuePerUnit: 83,
        description: 'Set sensors, collect monthly. FDA-compliant reporting.',
    },
    {
        id: 'isp',
        name: 'Micro ISP',
        emoji: '📡',
        color: '#facc15',
        locationIndependent: false,
        tagline: 'Local Micro ISP infrastructure that can be replicated city by city.',
        unit: 'subscribers',
        unitLabel: 'Active Subscribers',
        min: 10, max: 200, step: 10, default: 30,
        revenuePerUnit: 100,
        description: 'Community mesh wifi. High margin, high loyalty.',
    },
];

const ANNUAL_DEBT_SERVICE = 55200;

const formatDollar = (v) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
    return `$${v}`;
};

const MARGIN = 0.63;

function LineCard({ line, value, onChange }) {
    const monthlyRev = value * line.revenuePerUnit;
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
                    <div className="text-lg font-bold" style={{ color: line.color }}>{formatDollar(annualRev)}</div>
                    <div className="text-xs text-slate-500">/yr</div>
                </div>
            </div>

            <p className="text-xs text-slate-400 mb-3 italic leading-relaxed">"{line.tagline}"</p>

            <div className="flex items-center gap-3">
                <div className="text-xs text-slate-400 w-28 flex-shrink-0">
                    {value} {line.unit}
                </div>
                <Slider
                    value={[value]}
                    onValueChange={(v) => onChange(v[0])}
                    min={line.min}
                    max={line.max}
                    step={line.step}
                    className="flex-1"
                    style={{ '--slider-color': line.color }}
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
        Object.fromEntries(DEFAULT_LINES.map(l => [l.id, l.default]))
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
        setValues(Object.fromEntries(DEFAULT_LINES.map(l => [l.id, l.default])));
    };

    // Totals
    const lineRevenues = DEFAULT_LINES.map(l => ({
        ...l,
        monthly: values[l.id] * l.revenuePerUnit,
        annual: values[l.id] * l.revenuePerUnit * 12,
    }));

    const totalAnnual = lineRevenues.reduce((s, l) => s + l.annual, 0);
    const totalProfit = Math.round(totalAnnual * MARGIN);
    const dscr = (totalProfit / ANNUAL_DEBT_SERVICE).toFixed(1);
    const dscrColor = parseFloat(dscr) >= 10 ? '#4ade80' : parseFloat(dscr) >= 3 ? '#22d3ee' : '#facc15';

    const locationFreeRevenue = lineRevenues
        .filter(l => l.locationIndependent)
        .reduce((s, l) => s + l.annual, 0);
    const locationFreePct = totalAnnual > 0 ? Math.round((locationFreeRevenue / totalAnnual) * 100) : 0;

    const chartData = lineRevenues.map(l => ({
        name: l.name.replace(' ', '\n'),
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
                        8 Lines. One Ecosystem.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-2xl md:text-3xl mt-1">
                            Most of it works from anywhere on Earth.
                        </span>
                    </h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Eight UniFi-powered revenue lines share one engine. Adjust volumes to see how training, services, and rentals together comfortably cover debt and compound profit.
                    </p>
                </motion.div>

                {/* Summary Bar */}
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                >
                    {[
                        { label: 'Total Annual Revenue', value: formatDollar(totalAnnual), color: 'text-white', sub: `${formatDollar(Math.round(totalAnnual/12))}/mo` },
                        { label: 'Net Profit (~63%)', value: formatDollar(totalProfit), color: 'text-green-400', sub: 'After ops & overhead' },
                        { label: 'Debt Coverage Ratio', value: `${dscr}x`, color: dscrColor, sub: `vs $${(ANNUAL_DEBT_SERVICE/1000).toFixed(0)}K/yr debt service` },
                        { label: '% Location-Free Revenue', value: `${locationFreePct}%`, color: 'text-cyan-400', sub: 'Earnable from anywhere' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            layout
                            className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center"
                        >
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
                            {DEFAULT_LINES.map(line => (
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
                                    <YAxis stroke="#475569" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={formatDollar} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                                        formatter={(v) => [formatDollar(v), 'Annual Revenue']}
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
                                <div
                                    className="h-3 rounded-full bg-cyan-400 transition-all duration-500"
                                    style={{ width: `${locationFreePct}%` }}
                                />
                                <div
                                    className="h-3 rounded-full bg-purple-500 transition-all duration-500"
                                    style={{ width: `${100 - locationFreePct}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                                    {locationFreePct}% Location-free ({formatDollar(locationFreeRevenue)})
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