import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { SCENARIO_MULTIPLIERS, YEAR_RAMP } from './revenueConfig';

const fmt = (v) => {
    if (!v && v !== 0) return '—';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
};

export default function StreamDrawer({ stream, scenario, yearView, onClose }) {
    const [driverValue, setDriverValue] = useState(stream?.driver.defaultValue ?? 0);
    const [assumptionsOpen, setAssumptionsOpen] = useState(false);

    // Reset driver when stream changes
    useEffect(() => {
        if (stream) setDriverValue(stream.driver.defaultValue);
    }, [stream?.id]);

    if (!stream) return null;

    const rev = stream.computeRevenue(driverValue, scenario, yearView);
    const isPipeline = stream.isPipelinePrimary;

    const pipelineMetrics = isPipeline ? {
        retrofitLeads: Math.round(driverValue * stream.pipelineOutputs.retrofitConversion),
        trainingLeads: Math.round(driverValue * stream.pipelineOutputs.trainingConversion),
    } : null;

    const yearLabels = { y1: 'Y1', y2: 'Y2', y3: 'Y3', runRate: 'Run-rate' };

    return (
        <AnimatePresence>
            <motion.div
                key="drawer-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={onClose}
            />
            <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 260 }}
                className="fixed top-0 right-0 h-full w-full md:w-[520px] bg-slate-900 border-l border-slate-700 z-50 flex flex-col overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{stream.emoji}</span>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-tight">{stream.title}</h3>
                            <p className="text-slate-400 text-sm">{stream.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                    {/* Proven badge */}
                    {stream.proven && (
                        <div className="flex items-center gap-2 bg-green-950/50 border border-green-700/50 rounded-xl px-4 py-2">
                            <span className="text-green-400 text-xs font-bold uppercase tracking-wide">✓ {stream.proofBadge}</span>
                        </div>
                    )}

                    {/* Live Proof callout */}
                    {stream.liveProof && (
                        <div className="bg-cyan-950/30 border border-cyan-800/30 rounded-xl px-4 py-3">
                            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide mb-1">Live Proof</p>
                            <p className="text-slate-300 text-sm leading-relaxed italic">"{stream.liveProof}"</p>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {stream.tags.map(t => (
                            <span key={t} className="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-400 bg-slate-800/50">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* What / Who / How */}
                    <div className="space-y-4">
                        <Section label="What it is" text={stream.what} />
                        <Section label="Who it serves" text={stream.whoServes} />
                        <Section label="How we earn" text={stream.howWeEarn} />
                    </div>

                    {/* Driver control */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Driver</p>
                            <span className="text-xs text-slate-500 italic">Modeled (placeholder)</span>
                        </div>
                        <p className="text-white font-semibold mb-4">{stream.driver.name}</p>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold tabular-nums" style={{ color: stream.color }}>
                                {driverValue}
                            </span>
                            <span className="text-slate-400 text-sm">{stream.driver.unitLabel}</span>
                        </div>
                        <Slider
                            className="mt-3"
                            value={[driverValue]}
                            onValueChange={(v) => setDriverValue(v[0])}
                            min={stream.driver.min}
                            max={stream.driver.max}
                            step={stream.driver.step}
                        />
                        <div className="flex justify-between text-xs text-slate-600 mt-1">
                            <span>{stream.driver.min}</span>
                            <span>{stream.driver.max}</span>
                        </div>
                    </div>

                    {/* Outputs */}
                    {isPipeline ? (
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Pipeline Outputs</p>
                            <div className="grid grid-cols-2 gap-4">
                                <PipelineMetric label="Retrofit leads/mo" value={pipelineMetrics.retrofitLeads} color="#818cf8" />
                                <PipelineMetric label="Training inquiries/mo" value={pipelineMetrics.trainingLeads} color="#f472b6" />
                            </div>
                            <div className="border-t border-slate-700 pt-3">
                                <p className="text-xs text-slate-500 mb-2">Optional modeled contribution (events/sponsorships)</p>
                                <div className="text-xl font-bold" style={{ color: stream.color }}>{fmt(rev.selectedYear)}/yr</div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-4">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Revenue Outputs</p>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Selected Year ({yearLabels[yearView]})</p>
                                <motion.div
                                    key={rev.selectedYear}
                                    initial={{ opacity: 0.6, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-bold tabular-nums"
                                    style={{ color: stream.color }}
                                >
                                    {fmt(rev.selectedYear)}
                                </motion.div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700">
                                {(['y1', 'y2', 'y3', 'runRate']).map(yr => (
                                    <div
                                        key={yr}
                                        className={`text-center rounded-lg p-2 ${yearView === yr ? 'bg-slate-700' : 'bg-slate-800/50'}`}
                                    >
                                        <div className="text-xs text-slate-500 mb-1">{yearLabels[yr]}</div>
                                        <div className="text-sm font-bold text-white tabular-nums">{fmt(rev[yr])}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assumptions accordion */}
                    <div className="border border-slate-700 rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setAssumptionsOpen(o => !o)}
                            className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/30 hover:bg-slate-800/60 transition-colors"
                        >
                            <span className="text-sm font-semibold text-slate-300">Assumptions & Scenario Multipliers</span>
                            {assumptionsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        <AnimatePresence>
                            {assumptionsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 py-4 space-y-3 bg-slate-900/50">
                                        <AssumptionRow label="Unit revenue (modeled)" value={`$${stream.assumptions.unitRevenue}/unit`} />
                                        {stream.assumptions.feePercent && <AssumptionRow label="Fee %" value={`${stream.assumptions.feePercent}%`} />}
                                        {stream.assumptions.avgProjectValue && <AssumptionRow label="Avg project value" value={`$${stream.assumptions.avgProjectValue.toLocaleString()}`} />}
                                        {stream.assumptions.avgAnnualPerAccount && <AssumptionRow label="Avg annual / account" value={`$${stream.assumptions.avgAnnualPerAccount.toLocaleString()}`} />}
                                        <div className="border-t border-slate-800 pt-3">
                                            <p className="text-xs text-slate-400 font-semibold mb-2">Scenario multipliers</p>
                                            {Object.entries(SCENARIO_MULTIPLIERS).map(([k, v]) => (
                                                <AssumptionRow key={k} label={v.label} value={`${v.revenue}×`} color={v.color} />
                                            ))}
                                        </div>
                                        <div className="border-t border-slate-800 pt-3">
                                            <p className="text-xs text-slate-400 font-semibold mb-2">Year ramp factors</p>
                                            {Object.entries(YEAR_RAMP).map(([k, v]) => (
                                                <AssumptionRow key={k} label={k.toUpperCase()} value={`${(v * 100).toFixed(0)}%`} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 italic border-t border-slate-800 pt-3">
                                            {stream.assumptions.scenarioNote}
                                        </p>
                                        <p className="text-xs text-amber-500/70 italic">
                                            ⚠ All values are modeled placeholders. Replace with Master Forecast data when available.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Proof */}
                    {stream.proof?.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Proof & Traction</p>
                            {stream.proof.map((p, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function Section({ label, text }) {
    return (
        <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">{label}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
        </div>
    );
}

function AssumptionRow({ label, value, color }) {
    return (
        <div className="flex justify-between items-center text-xs py-0.5">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono font-semibold" style={{ color: color || '#94a3b8' }}>{value}</span>
        </div>
    );
}

function PipelineMetric({ label, value, color }) {
    return (
        <div className="text-center">
            <div className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{label}</div>
        </div>
    );
}