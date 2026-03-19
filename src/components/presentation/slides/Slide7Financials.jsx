import React, { useState, useCallback, useEffect, useRef } from 'react';
import { TrendingUp, Zap, Shield, RefreshCw, ChevronRight, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Slider } from "@/components/ui/slider";
import { BASELINE_STREAMS, runForecast, formatCurrency, STREAM_COLORS } from '@/components/forecast/forecastEngine';

// ─── Constants ────────────────────────────────────────────────────────────────
const LOCATION_FREE = {
    experience: false, experience_design_consulting: false,
    training: true, retrofit: false, retail: true,
    monitoring: true, rentals: true, refrigeration: true, isp: false,
};

const ANNUAL_DEBT_SERVICE = 55200;
const MARGIN = 0.63;

const INVEST_AMOUNTS  = [5000, 10000, 25000, 50000, 85000];
const PAYBACK_MONTHS  = [12, 24, 36, 48, 60];
const ANNUAL_RETURN   = 0.10; // fixed 10% simple interest — not equity

// ─── Core slider configs ───────────────────────────────────────────────────────
const CORE_CONFIGS = [
    {
        id: 'experience',
        blendedIds: ['experience', 'experience_design_consulting'],
        name: 'Experience Center',
        emoji: '🏢',
        color: STREAM_COLORS['experience'],
        locationIndependent: false,
        unit: 'visits/mo',
        unitLabel: 'Qualified visitors per month',
        min: 5, max: 200, step: 5,
        defaultValue: 10,
        revenuePerDriver: 600,
        tagline: 'On-site showroom and design consult — $600 combined per qualified visit. The anchor that feeds every other line.',
    },
    {
        id: 'training',
        blendedIds: ['training'],
        name: 'Training',
        emoji: '🎓',
        color: STREAM_COLORS['training'],
        locationIndependent: true,
        unit: 'seats/mo',
        unitLabel: 'Enrolled seats per month',
        min: 1, max: 60, step: 1,
        defaultValue: 20,
        revenuePerDriver: 2000,
        tagline: 'National cohorts delivered online and on-site. Location-optional. Covers debt service alone.',
    },
];

const SUPPORT_IDS = ['retrofit', 'retail', 'monitoring', 'rentals', 'refrigeration', 'isp'];

// ─── LineCard ─────────────────────────────────────────────────────────────────
function LineCard({ line, value, onChange, y1, y2, y3 }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="bg-slate-800/40 border rounded-2xl p-4 transition-all"
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
                                Direct
                            </span>
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: line.color }}>
                            {line.locationIndependent ? '🌐 Location-optional' : '📍 Property anchor'}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: line.color }}>{formatCurrency(y1, true)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Y1</div>
                    {y2 != null && y3 != null && (
                        <div className="flex gap-2 mt-1 justify-end">
                            <span className="text-xs text-slate-500">Y2 <span className="text-slate-400 font-medium">{formatCurrency(y2, true)}</span></span>
                            <span className="text-xs text-slate-500">Y3 <span className="text-slate-400 font-medium">{formatCurrency(y3, true)}</span></span>
                        </div>
                    )}
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
    // Stream sliders
    const [values, setValues] = useState(() =>
        Object.fromEntries(CORE_CONFIGS.map(l => [l.id, l.defaultValue]))
    );

    // Investor calculator
    const [investAmount,  setInvestAmount]  = useState(25000);
    const [paybackMonths, setPaybackMonths] = useState(24);

    useEffect(() => { onInteracted(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = useCallback((id, val) => {
        setValues(prev => ({ ...prev, [id]: val }));
    }, []);

    const handleReset = () => {
        setValues(Object.fromEntries(CORE_CONFIGS.map(l => [l.id, l.defaultValue])));
    };

    // ── Forecast ──────────────────────────────────────────────────────────────
    const modifiedStreams = BASELINE_STREAMS.map(s => {
        if (s.stream_id === 'experience' || s.stream_id === 'experience_design_consulting') {
            return { ...s, plan_driver_m1: values['experience'] ?? s.plan_driver_m1 };
        }
        return { ...s, plan_driver_m1: values[s.stream_id] ?? s.plan_driver_m1 };
    });
    const currentForecast = runForecast(modifiedStreams, 'base');

    const totalY1 = currentForecast.totalY1;
    const totalY2 = currentForecast.totalY2;
    const totalY3 = currentForecast.totalY3;
    const totalProfit  = Math.round(totalY1 * MARGIN);
    const totalDscr    = (totalProfit / ANNUAL_DEBT_SERVICE).toFixed(1);
    const dscrColor    = parseFloat(totalDscr) >= 10 ? '#4ade80' : parseFloat(totalDscr) >= 3 ? '#22d3ee' : '#facc15';
    const freeCash     = totalProfit - ANNUAL_DEBT_SERVICE;

    const locationFreeRevenue = BASELINE_STREAMS
        .filter(s => LOCATION_FREE[s.stream_id])
        .reduce((sum, s) => sum + (currentForecast.streams[s.stream_id]?.y1 ?? 0), 0);
    const locationFreePct = totalY1 > 0 ? Math.round((locationFreeRevenue / totalY1) * 100) : 0;

    // Blended Experience Y1/Y2/Y3
    const experienceCombinedY1 =
        (currentForecast.streams['experience']?.y1 ?? 0) +
        (currentForecast.streams['experience_design_consulting']?.y1 ?? 0);
    const experienceCombinedY2 =
        (currentForecast.streams['experience']?.y2 ?? 0) +
        (currentForecast.streams['experience_design_consulting']?.y2 ?? 0);
    const experienceCombinedY3 =
        (currentForecast.streams['experience']?.y3 ?? 0) +
        (currentForecast.streams['experience_design_consulting']?.y3 ?? 0);

    const coreYears = {
        experience: { y1: experienceCombinedY1, y2: experienceCombinedY2, y3: experienceCombinedY3 },
        training:   {
            y1: currentForecast.streams['training']?.y1 ?? 0,
            y2: currentForecast.streams['training']?.y2 ?? 0,
            y3: currentForecast.streams['training']?.y3 ?? 0,
        },
    };

    const chartData = [
        { id:'experience', name:'Experience Center', revenue:experienceCombinedY1, color:STREAM_COLORS['experience'], isCore:true },
        { id:'training',   name:'Training',          revenue:currentForecast.streams['training']?.y1 ?? 0, color:STREAM_COLORS['training'], isCore:true },
        ...SUPPORT_IDS.map(id => ({
            id, isCore: false,
            name: BASELINE_STREAMS.find(s => s.stream_id === id)?.stream_title ?? id,
            revenue: currentForecast.streams[id]?.y1 ?? 0,
            color: STREAM_COLORS[id],
        })),
    ];

    // ── Investor calculator — fixed 10% simple interest note, payback period is the variable ──
    const paybackYears    = paybackMonths / 12;
    const totalRepaid     = investAmount * (1 + ANNUAL_RETURN * paybackYears); // simple interest
    const investorReturn  = totalRepaid - investAmount;
    const monthlyPayment  = totalRepaid / paybackMonths;
    const freeMonthlyCash = freeCash / 12;
    const coveragePct     = freeMonthlyCash > 0 ? (monthlyPayment / freeMonthlyCash) * 100 : 0;

    const displayY1 = useAnimatedValue(Math.round(totalY1));
    const displayY2 = useAnimatedValue(Math.round(totalY2));
    const displayY3 = useAnimatedValue(Math.round(totalY3));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-16 px-4 md:px-6">
            <div className="max-w-7xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Interactive Financial Model</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
                        Two Direct Streams. Six That Scale.
                    </h2>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-xl md:text-2xl font-semibold mb-3">
                        The property unlocks Experience Center and Training. Six digital lines extend the model.
                    </p>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm">
                        Slide the two direct drivers to see how they clear debt — then watch the six supporting streams stack on top.
                    </p>
                </motion.div>

                {/* 3-Year Totals */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label:'Year 1', val:displayY1, sub:'Months 1–12 · Base' },
                        { label:'Year 2', val:displayY2, sub:'Months 13–24 · Base' },
                        { label:'Year 3', val:displayY3, sub:'Months 25–36 · Base' },
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label:'Annual Revenue',         value:formatCurrency(displayY1, true), color:'#ffffff', sub:`${formatCurrency(Math.round(totalY1/12),true)}/mo avg` },
                        { label:'Net Profit (~63%)',       value:formatCurrency(totalProfit,true), color:'#4ade80', sub:'After ops & overhead' },
                        { label:'Debt Coverage',           value:`${totalDscr}x`,                  color:dscrColor, sub:`vs $${(ANNUAL_DEBT_SERVICE/1000).toFixed(0)}K/yr service` },
                        { label:'Location-Free Revenue',  value:`${locationFreePct}%`,            color:'#22d3ee', sub:'Earnable from anywhere' },
                    ].map((s, i) => (
                        <div key={i} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">{s.label}</div>
                            <motion.div key={s.value} initial={{scale:0.9,opacity:0.5}} animate={{scale:1,opacity:1}}
                                className="text-2xl md:text-3xl font-bold" style={{color:s.color}}>
                                {s.value}
                            </motion.div>
                            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── CASH WATERFALL (Option 2) ── */}
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    className="mb-6 bg-slate-900/60 border border-slate-700 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Cash Waterfall · Year 1 Base</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                        {[
                            { label:'Gross Revenue',   value: formatCurrency(totalY1, true),      color:'text-white',      bg:'bg-slate-800',           border:'border-slate-600' },
                            { label:'Net Profit (63%)',value: formatCurrency(totalProfit, true),   color:'text-green-400',  bg:'bg-green-950/40',        border:'border-green-800/50' },
                            { label:'Debt Service',    value:`–${formatCurrency(ANNUAL_DEBT_SERVICE, true)}`, color:'text-red-400', bg:'bg-red-950/30', border:'border-red-800/40' },
                            { label:'Free Cash',       value: formatCurrency(freeCash, true),      color:'text-emerald-300',bg:'bg-emerald-950/40',      border:'border-emerald-700/50' },
                        ].map(({ label, value, color, bg, border }, i, arr) => (
                            <React.Fragment key={label}>
                                <div className={`flex-1 min-w-[120px] rounded-xl px-4 py-3 border ${bg} ${border} text-center`}>
                                    <div className="text-xs text-slate-500 mb-1">{label}</div>
                                    <div className={`text-lg font-bold ${color}`}>{value}</div>
                                </div>
                                {i < arr.length - 1 && (
                                    <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        After servicing the SBA note, <span className="text-emerald-300 font-semibold">{formatCurrency(freeCash, true)}</span> in Year 1 free cash is available for distribution, reinvestment, or investor repayment.
                    </p>
                </motion.div>

                {/* Main grid: sliders + chart */}
                <div className="grid lg:grid-cols-2 gap-6 mb-6">

                    {/* Left: Core sliders */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold flex items-center gap-2">
                                <Zap className="w-4 h-4 text-cyan-400" />Direct Stream Drivers
                            </h3>
                            <button onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Reset
                            </button>
                        </div>

                        <div className="space-y-3">
                            {CORE_CONFIGS.map(line => (
                                <LineCard key={line.id} line={line} value={values[line.id]}
                                    onChange={v => handleChange(line.id, v)}
                                    y1={coreYears[line.id].y1}
                                    y2={coreYears[line.id].y2}
                                    y3={coreYears[line.id].y3} />
                            ))}
                        </div>

                        <div className="mt-4 bg-slate-800/20 border border-slate-700/40 rounded-xl px-4 py-3">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                <strong className="text-slate-400">+ 6 supporting streams</strong>{' '}
                                (Retrofit, Retail, Monitoring, Rentals, Refrigeration, ISP) run at base — included in all totals above.
                            </p>
                        </div>
                    </div>

                    {/* Right: Chart */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-5 flex-1">
                            <h3 className="text-white font-semibold mb-4">Year 1 Revenue by Stream</h3>
                            <ResponsiveContainer width="100%" height={260}>
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
                                            return (
                                                <div className="p-2 space-y-1 text-slate-200">
                                                    <div className="font-semibold">{entry.name}{entry.isCore ? ' ✦' : ''}</div>
                                                    <div className="text-xs border-t border-slate-600 pt-1 mt-1">
                                                        <div>Year 1: <strong>{formatCurrency(entry.revenue)}</strong></div>
                                                        {entry.isCore && <div className="text-cyan-400 mt-1">Slider-adjustable</div>}
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
                    </div>
                </div>

                {/* ── INVESTOR RETURN CALCULATOR (Option 1) ── */}
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                    className="bg-gradient-to-br from-slate-900/80 to-purple-950/20 border border-purple-800/30 rounded-2xl p-6">

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-semibold">Repayment Calculator</span>
                        </div>
                        {/* Fixed rate badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                            <span className="text-green-400 text-xs font-bold">10% annual return · no equity</span>
                        </div>
                        <span className="text-xs text-slate-500">Base scenario · projections only</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* Left: controls */}
                        <div className="space-y-5">
                            {/* Amount chips */}
                            <div>
                                <p className="text-xs text-slate-400 mb-2">Investment Amount</p>
                                <div className="flex gap-2 flex-wrap">
                                    {INVEST_AMOUNTS.map(amt => (
                                        <button key={amt} onClick={() => setInvestAmount(amt)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                                investAmount === amt
                                                    ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                    : 'bg-slate-800/60 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                                            }`}>
                                            {formatCurrency(amt, true)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payback period chips */}
                            <div>
                                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Payback Period
                                    <span className="text-slate-600 ml-1">— shorter = higher monthly payment</span>
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    {PAYBACK_MONTHS.map(mo => (
                                        <button key={mo} onClick={() => setPaybackMonths(mo)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                                paybackMonths === mo
                                                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                                    : 'bg-slate-800/60 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                                            }`}>
                                            {mo === 12 ? '1 yr' : mo === 24 ? '2 yr' : mo === 36 ? '3 yr' : mo === 48 ? '4 yr' : '5 yr'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Structure note */}
                            <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3 space-y-1.5 text-xs text-slate-400">
                                <div className="flex justify-between">
                                    <span>Principal</span>
                                    <span className="text-slate-200 font-medium">{formatCurrency(investAmount, true)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Return (10% × {paybackYears.toFixed(1)} yr)</span>
                                    <span className="text-green-400 font-medium">+ {formatCurrency(Math.round(investorReturn), true)}</span>
                                </div>
                                <div className="border-t border-slate-700 pt-1.5 flex justify-between">
                                    <span className="font-semibold text-slate-300">Total Repaid</span>
                                    <span className="text-white font-bold">{formatCurrency(Math.round(totalRepaid), true)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: output cards */}
                        <div className="grid grid-cols-2 gap-3 content-start">
                            {[
                                {
                                    label: 'Monthly Payment',
                                    value: formatCurrency(Math.round(monthlyPayment), true),
                                    color: '#a78bfa',
                                    sub: `over ${paybackMonths} months`,
                                },
                                {
                                    label: 'Investor Return',
                                    value: formatCurrency(Math.round(investorReturn), true),
                                    color: '#4ade80',
                                    sub: `10% · ${paybackYears.toFixed(1)}-yr note`,
                                },
                                {
                                    label: 'Payment vs Free Cash',
                                    value: `${coveragePct.toFixed(1)}%`,
                                    color: coveragePct < 10 ? '#4ade80' : coveragePct < 25 ? '#22d3ee' : '#facc15',
                                    sub: `of ${formatCurrency(Math.round(freeMonthlyCash), true)}/mo free cash`,
                                },
                                {
                                    label: 'Free Cash / Month',
                                    value: formatCurrency(Math.round(freeMonthlyCash), true),
                                    color: '#a3e635',
                                    sub: 'after debt service · Y1',
                                },
                            ].map(card => (
                                <div key={card.label} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3 text-center">
                                    <div className="text-xs text-slate-500 mb-1">{card.label}</div>
                                    <motion.div key={card.value} initial={{scale:0.9,opacity:0.5}} animate={{scale:1,opacity:1}}
                                        className="text-xl font-bold" style={{color:card.color}}>
                                        {card.value}
                                    </motion.div>
                                    <div className="text-xs text-slate-600 mt-1">{card.sub}</div>
                                </div>
                            ))}

                            <div className="col-span-2 bg-slate-800/20 border border-slate-700/30 rounded-xl px-3 py-2">
                                <p className="text-xs text-slate-500 leading-relaxed text-center">
                                    Simple interest note. No equity. Actual terms subject to agreement.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}