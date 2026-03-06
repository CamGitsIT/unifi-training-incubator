import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

// Run forecast once with base scenario
const FORECAST = runForecast(BASELINE_STREAMS, 'base');

const STREAM_DISPLAY = {
    experience:    { icon: Camera,        color: 'cyan',   subtitle: 'Zero-Inventory Retail Showroom',       description: 'Live UniFi Experience Center showroom driving zero-inventory hardware sales and demand for every other service line.', metrics: ['Live demo environment drives high-confidence purchases', 'Zero inventory risk — orders fulfilled direct to customer', 'Doubles as marketing engine for all other business lines'] },
    retrofit:      { icon: Building2,     color: 'purple', subtitle: 'The DoorKing Killer',                   description: 'Retrofit DoorKing-style systems with subscription-free UniFi access control, delivering faster ROI and lower lifetime cost.', metrics: ['Average deal size: $9,000 · Our fee: ~12.5%', 'Partner-executed installs — no install labor bottleneck', 'Every retrofit is a monitoring candidate'] },
    training:      { icon: GraduationCap, color: 'green',  subtitle: 'Authorized Ubiquiti Education',         description: 'National Training Center delivering Ubiquiti / UniFi certifications that create the workforce powering all eight revenue streams.', metrics: ['$2,000/seat — cohorts of 4–12 students', 'In-person or remote delivery', 'Training graduates feed 5 downstream streams'] },
    retail:        { icon: Store,         color: 'amber',  subtitle: 'Site Magic for Multi-Location Brands',  description: 'UniFi networks for multi-location retail brands, reducing operational cost while standardizing secure, scalable infrastructure.', metrics: ['Retainer per brand × 20 sites × $3,500/site/mo', 'Stretch: 2 national accounts add significant volume', 'Each rollout feeds Professional Monitoring'] },
    monitoring:    { icon: Shield,        color: 'red',    subtitle: 'Replacing ADT, Brinks & Legacy Systems', description: 'UniFi-compatible monitoring replacing legacy alarm vendors, creating sticky recurring revenue with lower OpEx for clients.', metrics: ['$100/site/month recurring MRR', 'Fed by every infrastructure stream (0.14× elasticity each)', 'Compounding as retrofit, retail, and ISP grow'] },
    rentals:       { icon: Camera,        color: 'indigo', subtitle: 'Film & Production Deployments',         description: 'Reusable UniFi infrastructure packages rented to film productions, generating high-margin income without new CapEx each project.', metrics: ['$800 avg per production rental', 'Reusable gear — no per-project capital outlay', 'Builds relationships in ATL film industry'] },
    refrigeration: { icon: Thermometer,   color: 'orange', subtitle: 'FDA Compliance Automation',             description: 'Automated UniFi sensor monitoring for refrigeration, eliminating manual logs and avoiding spoilage across food and pharma locations.', metrics: ['$83/location/month recurring', 'Eliminates manual logging labor', 'Scalable across restaurant and pharmacy chains'] },
    isp:           { icon: Wifi,          color: 'teal',   subtitle: 'Breaking the Monopoly on Internet',     description: 'Micro ISP built on UniFi infrastructure, offering HOAs community-owned broadband that undercuts monopoly pricing.', metrics: ['$100/building/month net margin', 'Serves HOAs underserved by Comcast/AT&T', 'Training graduates drive deployment (0.4× elasticity)'] },
};

const colorMap = {
    cyan:   { bg: 'from-cyan-950/30',   border: 'border-cyan-900/50',   icon: 'bg-cyan-500/10',   iconColor: 'text-cyan-400',   accent: 'text-cyan-400',   hex: STREAM_COLORS.experience },
    purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400', hex: STREAM_COLORS.retrofit },
    green:  { bg: 'from-green-950/30',  border: 'border-green-900/50',  icon: 'bg-green-500/10',  iconColor: 'text-green-400',  accent: 'text-green-400',  hex: STREAM_COLORS.training },
    amber:  { bg: 'from-amber-950/30',  border: 'border-amber-900/50',  icon: 'bg-amber-500/10',  iconColor: 'text-amber-400',  accent: 'text-amber-400',  hex: STREAM_COLORS.retail },
    red:    { bg: 'from-red-950/30',    border: 'border-red-900/50',    icon: 'bg-red-500/10',    iconColor: 'text-red-400',    accent: 'text-red-400',    hex: STREAM_COLORS.monitoring },
    indigo: { bg: 'from-indigo-950/30', border: 'border-indigo-900/50', icon: 'bg-indigo-500/10', iconColor: 'text-indigo-400', accent: 'text-indigo-400', hex: STREAM_COLORS.rentals },
    orange: { bg: 'from-orange-950/30', border: 'border-orange-900/50', icon: 'bg-orange-500/10', iconColor: 'text-orange-400', accent: 'text-orange-400', hex: STREAM_COLORS.refrigeration },
    teal:   { bg: 'from-teal-950/30',   border: 'border-teal-900/50',   icon: 'bg-teal-500/10',   iconColor: 'text-teal-400',   accent: 'text-teal-400',   hex: STREAM_COLORS.isp },
};

const businessLines = BASELINE_STREAMS.map(s => {
    const display = STREAM_DISPLAY[s.stream_id];
    const fr = FORECAST.streams[s.stream_id];
    return {
        id: s.stream_id,
        icon: display.icon,
        title: s.stream_title,
        subtitle: display.subtitle,
        color: display.color,
        hex: colorMap[display.color].hex,
        y1: fr.y1,
        y2: fr.y2,
        y3: fr.y3,
        description: display.description,
        metrics: display.metrics,
    };
});

const barData = [
    { year: 'Year 1', total: FORECAST.totalY1 },
    { year: 'Year 2', total: FORECAST.totalY2 },
    { year: 'Year 3', total: FORECAST.totalY3 },
];

// ── TO RESTORE: uncomment <RevenueBarChart /> and the section below it ────────
function RevenueBarChart() {
    return (
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
            <div className="text-sm text-cyan-400 font-semibold mb-1 uppercase tracking-wide">Annual Revenue Forecast · Base Scenario</div>
            <div className="flex gap-8 mb-4">
                {barData.map(d => (
                    <div key={d.year}>
                        <div className="text-xs text-slate-500">{d.year}</div>
                        <div className="text-lg font-bold text-white">{formatCurrency(d.total, true)}</div>
                    </div>
                ))}
            </div>
            <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} barSize={56}>
                    <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v, true)} />
                    <Tooltip formatter={(v) => [formatCurrency(v, true), 'Total Revenue']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => <Cell key={i} fill={['#22d3ee', '#818cf8', '#a78bfa'][i]} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
    const [expanded, setExpanded] = useState(new Set());
    const [yearView, setYearView] = useState('y3');
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        if (timerDone) { if (onUnlockMessage) onUnlockMessage(null); return; }
        if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
    }, [secondsLeft, timerDone]);

    useEffect(() => {
        if (timerDone) return;
        const interval = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) { clearInterval(interval); setTimerDone(true); onInteracted(); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerDone]);

    const handleExpand = (i) => {
        const next = new Set(expanded);
        next.has(i) ? next.delete(i) : next.add(i);
        setExpanded(next);
    };

    const allExpanded = expanded.size === businessLines.length;

    useEffect(() => {
        if (allExpanded && !timerDone) { setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null); }
    }, [allExpanded]);

    const yearLabel = { y1: 'Yr 1', y2: 'Yr 2', y3: 'Yr 3' };

    return (
        <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Eight Lines. One Ecosystem.</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Separate revenue lines sharing one engine compound each other's reach and revenue.
                    </p>
                </motion.div>

                {/* ── TO RESTORE flywheel: uncomment the EcosystemFlywheel import and the block below ──
                <div className="mb-12">
                    <EcosystemFlywheel />
                </div>
                */}

                {/* ── TO RESTORE bar chart + cards: uncomment below ──
                <RevenueBarChart />

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Show revenue:</span>
                    <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        {['y1', 'y2', 'y3'].map(y => (
                            <button key={y} onClick={() => setYearView(y)} className={`px-3.5 py-1.5 text-xs font-semibold transition-all ${yearView === y ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                                {yearLabel[y]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {businessLines.map((line, i) => {
                        const colors = colorMap[line.color];
                        const Icon = line.icon;
                        const isOpen = expanded.has(i);
                        const revenueVal = line[yearView];
                        return (
                            <motion.div key={line.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} onClick={() => handleExpand(i)}
                                className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.005] ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        {isOpen ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Icon className={`w-5 h-5 ${colors.iconColor}`} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white leading-tight">{line.title}</h3>
                                        <p className={`text-xs ${colors.accent}`}>{line.subtitle}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xl font-bold ${colors.accent}`}>{formatCurrency(revenueVal, true)}</div>
                                        <div className="text-xs text-slate-400">{yearLabel[yearView]} Revenue</div>
                                    </div>
                                </div>
                                {isOpen && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-slate-700/50">
                                        <p className="text-slate-300 mb-3 text-sm">{line.description}</p>
                                        <div className="flex gap-4 mb-3 text-xs">
                                            {['y1', 'y2', 'y3'].map(y => (
                                                <div key={y} className="text-center">
                                                    <div className="text-slate-500">{yearLabel[y]}</div>
                                                    <div className="font-bold" style={{ color: line.hex }}>{formatCurrency(line[y], true)}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-1.5">
                                            {line.metrics.map((m, j) => (
                                                <div key={j} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <ArrowRight className={`w-4 h-4 flex-shrink-0 ${colors.iconColor}`} />
                                                    <span>{m}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center bg-gradient-to-r from-slate-800/30 to-slate-800/10 border border-slate-700 rounded-2xl p-6">
                    <div className="grid grid-cols-3 gap-4 mb-2">
                        {[{ label: 'Year 1', val: FORECAST.totalY1 }, { label: 'Year 2', val: FORECAST.totalY2 }, { label: 'Year 3', val: FORECAST.totalY3 }].map(({ label, val }) => (
                            <div key={label}>
                                <div className="text-xs text-slate-500 mb-1">{label}</div>
                                <div className="text-2xl font-bold text-white">{formatCurrency(val, true)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-slate-500 text-xs mt-2">Combined · Base Scenario · 36-month compound growth model</div>
                </div>

                {allExpanded && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ All 8 lines explored — click Next to continue
                    </motion.p>
                )}
                */}
            </div>
        </div>
    );
}