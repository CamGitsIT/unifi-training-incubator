import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Building2 } from 'lucide-react';
import { STREAMS, SCENARIO_MULTIPLIERS } from './revenueConfig';
import StreamDrawer from './StreamDrawer';

const YEAR_OPTIONS = [
    { key: 'y1', label: 'Y1' },
    { key: 'y2', label: 'Y2' },
    { key: 'y3', label: 'Y3' },
    { key: 'runRate', label: 'Run-rate' },
];

const SCENARIO_OPTIONS = Object.entries(SCENARIO_MULTIPLIERS).map(([k, v]) => ({ key: k, ...v }));

const fmt = (v) => {
    if (!v && v !== 0) return '—';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
};

function useDriverValues() {
    const defaults = Object.fromEntries(STREAMS.map(s => [s.id, s.driver.defaultValue]));
    const [values, setValues] = useState(defaults);
    const reset = () => setValues(defaults);
    const set = (id, v) => setValues(prev => ({ ...prev, [id]: v }));
    return { values, set, reset };
}

export default function Slide2Mission({ onInteracted }) {
    const [yearView, setYearView] = useState('y1');
    const [scenario, setScenario] = useState('base');
    const [excluded, setExcluded] = useState(new Set());
    const [activeStream, setActiveStream] = useState(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { values, set, reset } = useDriverValues();

    const handleInteract = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            onInteracted();
        }
    };

    const handleCardClick = (stream) => {
        setActiveStream(stream);
        handleInteract();
    };

    const handleToggleExclude = (e, id) => {
        e.stopPropagation();
        setExcluded(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        handleInteract();
    };

    const handleReset = () => {
        setYearView('y1');
        setScenario('base');
        setExcluded(new Set());
        reset();
    };

    const revenues = useMemo(() => {
        return Object.fromEntries(
            STREAMS.map(s => [s.id, s.computeRevenue(values[s.id], scenario, yearView)])
        );
    }, [values, scenario, yearView]);

    const total = useMemo(() => {
        return STREAMS.filter(s => !excluded.has(s.id))
            .reduce((sum, s) => {
                const rev = revenues[s.id];
                return sum + (s.isPipelinePrimary ? (rev?.selectedYear ?? 0) * 0 : (rev?.selectedYear ?? 0));
            }, 0);
    }, [revenues, excluded]);

    // Count included non-pipeline streams
    const includedCount = STREAMS.filter(s => !excluded.has(s.id) && !s.isPipelinePrimary).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto w-full">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">One Mission, One Roof</h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
                            Eight revenue lines that compound under one facility and one trusted brand.
                        </p>
                    </div>

                    {/* Global Controls */}
                    <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                        {/* Year selector */}
                        <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                            {YEAR_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setYearView(opt.key); handleInteract(); }}
                                    className={`px-3 py-2 text-xs font-semibold transition-colors ${yearView === opt.key ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Scenario selector */}
                        <div className="flex bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                            {SCENARIO_OPTIONS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => { setScenario(opt.key); handleInteract(); }}
                                    className={`px-3 py-2 text-xs font-semibold transition-colors ${scenario === opt.key ? 'text-slate-950' : 'text-slate-400 hover:text-white'}`}
                                    style={scenario === opt.key ? { backgroundColor: opt.color } : {}}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset to Base
                        </button>
                    </div>
                </motion.div>

                {/* Stream Cards */}
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {STREAMS.map((stream, i) => {
                        const isExcluded = excluded.has(stream.id);
                        const rev = revenues[stream.id];
                        const displayRev = stream.isPipelinePrimary ? null : rev?.selectedYear;

                        return (
                            <motion.div
                                key={stream.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                onClick={() => !isExcluded && handleCardClick(stream)}
                                className={`relative rounded-2xl border p-4 transition-all duration-200 ${
                                    isExcluded
                                        ? 'bg-slate-900/30 border-slate-800 opacity-40 cursor-not-allowed'
                                        : 'bg-slate-800/40 border-slate-700 hover:border-opacity-80 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
                                }`}
                                style={!isExcluded ? { borderColor: `${stream.color}30` } : {}}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    {/* Left: emoji + title */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <span className="text-2xl flex-shrink-0 mt-0.5">{stream.emoji}</span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-white font-semibold text-sm">{stream.title}</span>
                                                {stream.proven && (
                                                    <span className="text-xs bg-green-900/50 text-green-400 border border-green-800/50 px-1.5 py-0.5 rounded-full font-medium">
                                                        ✓ Proven
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5 truncate">{stream.subtitle}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {stream.tags.map(t => (
                                                    <span key={t} className="text-xs px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-500">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: revenue + toggle */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        <div className="text-right">
                                            {stream.isPipelinePrimary ? (
                                                <div>
                                                    <div className="text-xs text-slate-500 mb-0.5">Pipeline</div>
                                                    <div className="text-sm font-bold text-cyan-400">
                                                        {Math.round(values[stream.id] * stream.pipelineOutputs.retrofitConversion)} leads/mo
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-xs text-slate-500 mb-0.5">
                                                        {YEAR_OPTIONS.find(y => y.key === yearView)?.label} Revenue
                                                    </div>
                                                    <motion.div
                                                        key={displayRev}
                                                        initial={{ opacity: 0.5 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-lg font-bold tabular-nums"
                                                        style={{ color: stream.color }}
                                                    >
                                                        {fmt(displayRev)}
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Include toggle */}
                                        <button
                                            onClick={(e) => handleToggleExclude(e, stream.id)}
                                            className={`text-xs px-2 py-1 rounded-lg border transition-all font-medium ${
                                                isExcluded
                                                    ? 'border-slate-700 text-slate-600 bg-slate-800/50'
                                                    : 'border-green-800/60 text-green-400 bg-green-950/30 hover:bg-green-950/60'
                                            }`}
                                        >
                                            {isExcluded ? 'Excluded' : 'Included'}
                                        </button>
                                    </div>
                                </div>

                                {/* Click hint */}
                                {!isExcluded && (
                                    <div className="absolute bottom-3 right-4 text-xs text-slate-600">
                                        tap to explore →
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Total panel */}
                <motion.div
                    layout
                    className="bg-gradient-to-r from-slate-800/60 to-slate-800/40 border border-slate-700 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-cyan-400" />
                        <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                                Total — {YEAR_OPTIONS.find(y => y.key === yearView)?.label} · {SCENARIO_MULTIPLIERS[scenario].label}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {includedCount} of {STREAMS.filter(s => !s.isPipelinePrimary).length} revenue streams included
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <motion.div
                            key={total}
                            initial={{ scale: 0.95, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-bold text-white tabular-nums"
                        >
                            {fmt(total)}
                        </motion.div>
                        <span className="text-slate-400 text-sm mb-1">/year</span>
                    </div>
                    <p className="text-xs text-amber-500/60 w-full italic">
                        ⚠ Modeled (placeholder) — to be replaced with Master Forecast data.
                    </p>
                </motion.div>

                {/* Continue hint */}
                <div className="text-center mt-4">
                    {hasInteracted ? (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-semibold text-sm">
                            ✓ Click Next to continue
                        </motion.p>
                    ) : (
                        <p className="text-slate-500 text-sm animate-pulse">👆 Click any card to explore a stream</p>
                    )}
                </div>
            </div>

            {/* Drawer */}
            {activeStream && (
                <StreamDrawer
                    stream={activeStream}
                    scenario={scenario}
                    yearView={yearView}
                    onClose={() => setActiveStream(null)}
                />
            )}
        </div>
    );
}