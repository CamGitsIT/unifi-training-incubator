import React, { useState, useEffect, useMemo } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle, Users, Cpu, DollarSign, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

// Run forecast once with base scenario
const FORECAST = runForecast(BASELINE_STREAMS, 'base');

// Map stream IDs to the business line display config
const STREAM_DISPLAY = {
    experience:    { icon: Camera,       color: 'cyan',   subtitle: 'Zero-Inventory Retail Showroom',       description: 'Live UniFi Experience Center showroom driving zero-inventory hardware sales and demand for every other service line.', metrics: ['Live demo environment drives high-confidence purchases', 'Zero inventory risk — orders fulfilled direct to customer', 'Doubles as marketing engine for all other business lines'] },
    retrofit:      { icon: Building2,    color: 'purple', subtitle: 'The DoorKing Killer',                   description: 'Retrofit DoorKing-style systems with subscription-free UniFi access control, delivering faster ROI and lower lifetime cost.', metrics: ['Average deal size: $9,000 · Our fee: ~12.5%', 'Partner-executed installs — no install labor bottleneck', 'Every retrofit is a monitoring candidate'] },
    training:      { icon: GraduationCap,color: 'green',  subtitle: 'Authorized Ubiquiti Education',         description: 'National Training Center delivering Ubiquiti / UniFi certifications that create the workforce powering all eight revenue streams.', metrics: ['$2,000/seat — cohorts of 4–12 students', 'In-person or remote delivery', 'Training graduates feed 5 downstream streams'] },
    retail:        { icon: Store,        color: 'amber',  subtitle: 'Site Magic for Multi-Location Brands',  description: 'UniFi networks for multi-location retail brands, reducing operational cost while standardizing secure, scalable infrastructure.', metrics: ['Retainer per brand × 20 sites × $3,500/site/mo', 'Stretch: 2 national accounts add significant volume', 'Each rollout feeds Professional Monitoring'] },
    monitoring:    { icon: Shield,       color: 'red',    subtitle: 'Replacing ADT, Brinks & Legacy Systems', description: 'UniFi-compatible monitoring replacing legacy alarm vendors, creating sticky recurring revenue with lower OpEx for clients.', metrics: ['$100/site/month recurring MRR', 'Fed by every infrastructure stream (0.14× elasticity each)', 'Compounding as retrofit, retail, and ISP grow'] },
    rentals:       { icon: Camera,       color: 'indigo', subtitle: 'Film & Production Deployments',         description: 'Reusable UniFi infrastructure packages rented to film productions, generating high-margin income without new CapEx each project.', metrics: ['$800 avg per production rental', 'Reusable gear — no per-project capital outlay', 'Builds relationships in ATL film industry'] },
    refrigeration: { icon: Thermometer,  color: 'orange', subtitle: 'FDA Compliance Automation',             description: 'Automated UniFi sensor monitoring for refrigeration, eliminating manual logs and avoiding spoilage across food and pharma locations.', metrics: ['$83/location/month recurring', 'Eliminates manual logging labor', 'Scalable across restaurant and pharmacy chains'] },
    isp:           { icon: Wifi,         color: 'teal',   subtitle: 'Breaking the Monopoly on Internet',     description: 'Micro ISP built on UniFi infrastructure, offering HOAs community-owned broadband that undercuts monopoly pricing.', metrics: ['$100/building/month net margin', 'Serves HOAs underserved by Comcast/AT&T', 'Training graduates drive deployment (0.4× elasticity)'] },
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

// Build the business lines array from the forecast + display config
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

// Bar chart data — annual totals by stream for Y1/Y2/Y3
const barData = [
    { year: 'Year 1', total: FORECAST.totalY1 },
    { year: 'Year 2', total: FORECAST.totalY2 },
    { year: 'Year 3', total: FORECAST.totalY3 },
];

function EcosystemFlywheel() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(3000);

    const coreColor = "#3B82F6";

    const steps = [
        { id: 'training', title: 'Training', description: 'Creates qualified Installers', icon: <GraduationCap className="w-8 h-8" /> },
        { id: 'installers', title: 'Installers', description: 'Need a steady stream of work', icon: <Users className="w-8 h-8" /> },
        { id: 'ai', title: 'AI Lead Gen', description: 'Finds and identifies Projects', icon: <Cpu className="w-8 h-8" /> },
        { id: 'experience', title: 'Experience Center', description: 'Closes Projects with customers', icon: <Building2 className="w-8 h-8" /> },
        { id: 'revenue', title: 'Revenue', description: 'Flows back into more Training', icon: <DollarSign className="w-8 h-8" /> },
    ];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
            }, speed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, steps.length]);

    const radius = 160;
    const centerX = 250;
    const centerY = 250;

    const getCoordinates = (index, total) => {
        const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
        return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
    };

    return (
        <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden">
            <div className="p-8 text-center border-b border-slate-100 bg-white">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">UniFi Ecosystem Flywheel</h3>
                <p className="text-slate-500 max-w-lg mx-auto">A self-sustaining cycle where AI and specialized centers drive continuous, compounding growth and revenue.</p>
            </div>

            <div className="flex flex-col lg:flex-row p-8 gap-12 items-center bg-white">
                <div className="relative w-full max-w-[500px] aspect-square flex-shrink-0">
                    <svg viewBox="0 0 500 500" className="w-full h-full">
                        <circle cx="250" cy="250" r="210" fill="none" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                        {steps.map((_, i) => {
                            const start = getCoordinates(i, steps.length);
                            const end = getCoordinates((i + 1) % steps.length, steps.length);
                            const isTransitioning = activeStep === i;
                            return (
                                <g key={`path-${i}`}>
                                    <path
                                        d={`M ${start.x} ${start.y} Q ${250 + (start.x + end.x - 500) * 0.3} ${250 + (start.y + end.y - 500) * 0.3} ${end.x} ${end.y}`}
                                        fill="none"
                                        stroke={isTransitioning ? coreColor : '#e2e8f0'}
                                        strokeWidth={isTransitioning ? "4" : "2"}
                                        className="transition-all duration-700"
                                        strokeDasharray={isTransitioning ? "none" : "5 5"}
                                    />
                                    {isTransitioning && isPlaying && (
                                        <circle r="6" fill={coreColor}>
                                            <animateMotion
                                                dur={`${speed / 1000}s`}
                                                repeatCount="indefinite"
                                                path={`M ${start.x} ${start.y} Q ${250 + (start.x + end.x - 500) * 0.3} ${250 + (start.y + end.y - 500) * 0.3} ${end.x} ${end.y}`}
                                            />
                                            <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}
                        {steps.map((step, i) => {
                            const { x, y } = getCoordinates(i, steps.length);
                            const isSource = activeStep === i;
                            const isDestination = activeStep === (i === 0 ? steps.length - 1 : i - 1);
                            const isActive = isSource || isDestination;
                            return (
                                <g key={step.id} className="cursor-pointer" onClick={() => setActiveStep(i)}>
                                    {isActive && (
                                        <circle cx={x} cy={y} r="50" fill={coreColor} fillOpacity="0.1">
                                            <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                    <circle cx={x} cy={y} r={isSource ? 42 : 36} fill="white" stroke={isActive ? coreColor : '#cbd5e1'} strokeWidth={isSource ? 4 : 2} className="transition-all duration-500" />
                                    <foreignObject x={x - 20} y={y - 20} width="40" height="40">
                                        <div className={`flex items-center justify-center w-full h-full transition-all duration-500 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{step.icon}</div>
                                    </foreignObject>
                                    <text x={x} y={y + 55} textAnchor="middle" fontSize="10" fontWeight="bold" fill={isActive ? '#0f172a' : '#94a3b8'}>{step.title}</text>
                                </g>
                            );
                        })}
                        <circle cx="250" cy="250" r="65" fill="white" stroke={coreColor} strokeWidth="2" />
                        <circle cx="250" cy="250" r="58" fill={coreColor} />
                        <foreignObject x="200" y="215" width="100" height="70">
                            <div className="flex flex-col items-center justify-center h-full text-center p-2">
                                <span className="text-white font-bold text-[10px] leading-tight tracking-tight uppercase">UniFi</span>
                                <span className="text-white font-black text-[11px] leading-tight uppercase">Ecosystem</span>
                            </div>
                        </foreignObject>
                    </svg>
                </div>

                <div className="w-full flex-1 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Active Phase
                        </h4>
                        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm transition-all duration-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">{steps[activeStep].icon}</div>
                                <div className="flex items-center text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">STEP {activeStep + 1} OF 5</div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{steps[activeStep].title}</h3>
                            <p className="text-slate-600 mb-6">{steps[activeStep].description}</p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 cursor-pointer" onClick={() => setActiveStep((activeStep + 1) % steps.length)}>
                                Next: {steps[(activeStep + 1) % steps.length].title}
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setActiveStep(i)} className={`h-2 rounded-full transition-all duration-300 ${activeStep === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-200'}`} />
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex gap-3">
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${isPlaying ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                                {isPlaying ? <><Pause size={16} /> Pause Cycle</> : <><Play size={16} /> Resume Cycle</>}
                            </button>
                            <button onClick={() => setActiveStep(0)} className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                <RotateCcw size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Tempo</span>
                            <div className="flex bg-slate-100 rounded-lg p-1">
                                {[5000, 3000, 1000].map((s, idx) => (
                                    <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${speed === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                                        {['Slow', 'Mid', 'Fast'][idx]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                    <YAxis
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={v => formatCurrency(v, true)}
                    />
                    <Tooltip
                        formatter={(v) => [formatCurrency(v, true), 'Total Revenue']}
                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                    />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => (
                            <Cell key={i} fill={['#22d3ee', '#818cf8', '#a78bfa'][i]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
    const [expanded, setExpanded] = useState(new Set());
    const [yearView, setYearView] = useState('y3');
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        if (timerDone) {
            if (onUnlockMessage) onUnlockMessage(null);
            return;
        }
        if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
    }, [secondsLeft, timerDone]);

    useEffect(() => {
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

    const handleExpand = (i) => {
        const next = new Set(expanded);
        next.has(i) ? next.delete(i) : next.add(i);
        setExpanded(next);
    };

    const allExpanded = expanded.size === businessLines.length;

    useEffect(() => {
        if (allExpanded && !timerDone) {
            setTimerDone(true);
            onInteracted();
            if (onUnlockMessage) onUnlockMessage(null);
        }
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

                <div className="mb-12">
                    <EcosystemFlywheel />
                </div>

                {/* Everything below the flywheel is hidden — remove this comment block to re-enable
                <RevenueBarChart />

                {/* Year toggle for cards */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Show revenue:</span>
                    <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                        {['y1', 'y2', 'y3'].map(y => (
                            <button
                                key={y}
                                onClick={() => setYearView(y)}
                                className={`px-3.5 py-1.5 text-xs font-semibold transition-all ${yearView === y ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                            >
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
                            <motion.div
                                key={line.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => handleExpand(i)}
                                className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.005] ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        {isOpen
                                            ? <CheckCircle className="w-5 h-5 text-green-400" />
                                            : <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                                        }
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
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-t border-slate-700/50"
                                    >
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
                */ }
            </div>
        </div>
    );
}