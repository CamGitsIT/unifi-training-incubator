import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, TrendingUp, ChevronRight } from 'lucide-react';
import { STREAMS, SCENARIO_MULTIPLIERS } from './revenueConfig';
import StreamDrawer from './StreamDrawer';

const YEAR_OPTIONS = [
    { key: 'y1',      label: 'Y1' },
    { key: 'y2',      label: 'Y2' },
    { key: 'y3',      label: 'Y3' },
    { key: 'runRate', label: 'Run-rate' },
];

const SCENARIO_OPTIONS = Object.entries(SCENARIO_MULTIPLIERS).map(([k, v]) => ({ key: k, ...v }));

const fmt = (v) => {
    if (v == null || isNaN(v)) return '—';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
    return `$${v}`;
};

export default function Slide2Mission({ onInteracted }) {
    const [yearView, setYearView]     = useState('y1');
    const [scenario, setScenario]     = useState('base');
    const [excluded, setExcluded]     = useState(new Set());
    const [activeStream, setActive]   = useState(null);
    const [hasInteracted, setInteracted] = useState(false);

    // Per-stream driver values (managed at parent so card + drawer stay in sync)
    const defaultDrivers = useMemo(() => Object.fromEntries(STREAMS.map(s => [s.id, s.driver.defaultValue])), []);
    const [drivers, setDrivers] = useState(defaultDrivers);

    const markInteracted = () => { if (!hasInteracted) { setInteracted(true); onInteracted(); } };

    const handleCardClick = (stream) => {
        if (excluded.has(stream.id)) return;
        setActive(stream);
        markInteracted();
    };

    const handleToggle = (e, id) => {
        e.stopPropagation();
        setExcluded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        markInteracted();
    };

    const handleReset = () => {
        setYearView('y1');
        setScenario('base');
        setExcluded(new Set());
        setDrivers(defaultDrivers);
    };

    // Compute all revenues
    const revenues = useMemo(() =>
        Object.fromEntries(STREAMS.map(s => [s.id, s.computeRevenue(drivers[s.id], scenario, yearView)]))
    , [drivers, scenario, yearView]);

    // Total excludes pipeline-primary and excluded streams
    const total = useMemo(() =>
        STREAMS
            .filter(s => !excluded.has(s.id) && !s.isPipelinePrimary)
            .reduce((sum, s) => sum + (revenues[s.id]?.selectedYear ?? 0), 0)
    , [revenues, excluded]);

    const includedCount  = STREAMS.filter(s => !excluded.has(s.id) && !s.isPipelinePrimary).length;
    const revenueStreams  = STREAMS.filter(s => !s.isPipelinePrimary).length;
    const scenarioColor  = SCENARIO_MULTIPLIERS[scenario].color;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 py-14 px-4 md:px-8">
            <div className="max-w-6xl mx-auto w-full">

                {/* ── HEADER ─────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10"
                >
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-cyan-400 text-xs font-semibold tracking-wide">Revenue Streams Console</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                            One Mission. Coalescing Possibilities.
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed">
                            Eight revenue streams share one UniFi expertise engine—training at the National Training Center, the UniFi Experience Center, and OverIT partners turning demand into scalable, recurring revenue.
                        </p>
                    </div>

                    {/* Global Controls */}
                    <div className="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
                        {/* Year selector */}
                        <div className="flex bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
                            {YEAR_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setYearView(opt.key); markInteracted(); }}
                                    className={`px-3.5 py-2 text-xs font-semibold transition-all ${
                                        yearView === opt.key
                                            ? 'bg-cyan-500 text-slate-950'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Scenario selector */}
                        <div className="flex bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden">
                            {SCENARIO_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setScenario(opt.key); markInteracted(); }}
                                    className={`px-3.5 py-2 text-xs font-semibold transition-all ${
                                        scenario === opt.key
                                            ? 'text-slate-950'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                                    style={scenario === opt.key ? { backgroundColor: opt.color } : {}}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-all"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset to Base
                        </button>
                    </div>
                </motion.div>

                {/* ── STREAM CARDS GRID ───────────────────────────── */}
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {STREAMS.map((stream, i) => {
                        const isExcluded   = excluded.has(stream.id);
                        const isActive     = activeStream?.id === stream.id;
                        const rev          = revenues[stream.id];
                        const driverVal    = drivers[stream.id];

                        return (
                            <motion.div
                                key={stream.id}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.055 }}
                                onClick={() => handleCardClick(stream)}
                                className={`
                                    relative rounded-2xl border p-5 transition-all duration-200 group
                                    ${isExcluded
                                        ? 'bg-slate-900/20 border-slate-800/60 opacity-40 cursor-not-allowed'
                                        : isActive
                                            ? 'bg-slate-800/70 cursor-pointer shadow-lg'
                                            : 'bg-slate-800/30 hover:bg-slate-800/60 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
                                    }
                                `}
                                style={
                                    !isExcluded
                                        ? { borderColor: isActive ? stream.color : `${stream.color}25` }
                                        : {}
                                }
                            >
                                {/* Active left accent */}
                                {isActive && !isExcluded && (
                                    <div
                                        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                                        style={{ background: stream.color }}
                                    />
                                )}

                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                                        style={{ background: `${stream.color}18`, border: `1px solid ${stream.color}30` }}
                                    >
                                        {stream.emoji}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            {/* Title + subtitle + tags */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-white font-semibold text-sm">{stream.title}</span>
                                                    {stream.proven && (
                                                        <span className="text-xs bg-green-900/50 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full font-medium">
                                                            ✓ Live
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{stream.subtitle}</p>
                                                <div className="flex flex-wrap gap-1 mt-2.5">
                                                    {stream.tags.map(t => (
                                                        <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60 text-slate-500">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Revenue + toggle */}
                                            <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                                                {/* Revenue display */}
                                                <div className="text-right">
                                                    {stream.isPipelinePrimary ? (
                                                        <>
                                                            <div className="text-xs text-slate-500 mb-0.5">Pipeline</div>
                                                            <div className="text-base font-bold tabular-nums" style={{ color: stream.color }}>
                                                                {Math.round(driverVal * stream.pipelineOutputs.retrofitConversion)} leads/mo
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-xs text-slate-500 mb-0.5">
                                                                {YEAR_OPTIONS.find(y => y.key === yearView)?.label} Revenue
                                                            </div>
                                                            <motion.div
                                                                key={rev?.selectedYear}
                                                                initial={{ opacity: 0.4 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-xl font-bold tabular-nums leading-tight"
                                                                style={{ color: stream.color }}
                                                            >
                                                                {fmt(rev?.selectedYear)}
                                                            </motion.div>
                                                            <div className="text-xs text-slate-600 italic">modeled</div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Include/Exclude toggle */}
                                                <button
                                                    onClick={e => handleToggle(e, stream.id)}
                                                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                                                        isExcluded
                                                            ? 'border-slate-700 text-slate-600 bg-slate-800/50 hover:text-slate-400'
                                                            : 'border-green-800/50 text-green-400 bg-green-950/30 hover:bg-green-950/60'
                                                    }`}
                                                >
                                                    {isExcluded ? 'Excluded' : 'Included'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tap hint */}
                                {!isExcluded && (
                                    <div className="absolute bottom-3.5 right-4 flex items-center gap-1 text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
                                        <span>explore</span>
                                        <ChevronRight className="w-3 h-3" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── BOTTOM SUMMARY PANEL ────────────────────────── */}
                <motion.div
                    layout
                    className="rounded-2xl border border-slate-700 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
                >
                    <div className="px-6 py-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full" style={{ background: scenarioColor }} />
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Total Revenue · {YEAR_OPTIONS.find(y => y.key === yearView)?.label} · {SCENARIO_MULTIPLIERS[scenario].label}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                {includedCount} of {revenueStreams} revenue streams included
                                <span className="ml-2 text-slate-600">· Experience Center drives pipeline (excluded from total)</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <motion.div
                                key={total}
                                initial={{ scale: 0.94, opacity: 0.4 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl md:text-5xl font-bold text-white tabular-nums"
                            >
                                {fmt(total)}
                            </motion.div>
                            <span className="text-slate-500 text-sm mt-0.5">/year</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 px-6 py-3 flex items-center justify-between gap-4">
                        <p className="text-xs text-amber-500/60 italic">
                            ⚠ Modeled (placeholder) — numbers will later link to Master Forecast Google Sheet.
                            {/* TODO: Wire to Google Sheet "master forecast" data source */}
                        </p>
                        {!hasInteracted && (
                            <p className="text-xs text-slate-500 animate-pulse flex-shrink-0">
                                👆 Click any card to explore
                            </p>
                        )}
                        {hasInteracted && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-green-400 font-semibold flex-shrink-0"
                            >
                                ✓ Click Next to continue
                            </motion.p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ── DRAWER ─────────────────────────────────────────── */}
            <AnimatePresence>
                {activeStream && (
                    <StreamDrawer
                        key={activeStream.id}
                        stream={activeStream}
                        scenario={scenario}
                        yearView={yearView}
                        onClose={() => setActive(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}