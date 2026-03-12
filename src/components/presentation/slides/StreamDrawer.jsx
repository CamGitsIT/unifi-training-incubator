import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { SCENARIO_MULTIPLIERS } from './revenueConfig';
import { BASELINE_STREAMS } from '@/components/forecast/forecastEngine';

const fmt = (v) => {
    if (v == null || isNaN(v)) return '—';
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
    if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
    return `$${v}`;
};

const YEAR_LABELS = { y1: 'Y1', y2: 'Y2', y3: 'Y3', runRate: 'Run-rate' };

export default function StreamDrawer({ stream, scenario, yearView, driverValue: externalDriverValue, onDriverChange, onClose }) {
    const [driverValue, setDriverValue] = useState(externalDriverValue ?? stream?.driver.defaultValue ?? 0);
    const [sitesPerAccount, setSitesPerAccount] = useState(stream?.sitesDriver?.defaultValue ?? 20);
    const [unitsPerBuilding, setUnitsPerBuilding] = useState(stream?.unitsDriver?.defaultValue ?? 20);
    const [assumptionsOpen, setAssumptionsOpen] = useState(false);

    const baselineStream = BASELINE_STREAMS.find(s => s.stream_id === (stream?.id === 'experience' ? 'experience' : stream?.id));
    const defaultGrowthPct = baselineStream ? parseFloat((baselineStream.monthly_growth * 100).toFixed(1)) : 7;
    const [customGrowthPct, setCustomGrowthPct] = useState(defaultGrowthPct);

    useEffect(() => {
        if (stream) {
            setDriverValue(externalDriverValue ?? stream.driver.defaultValue);
            setSitesPerAccount(stream.sitesDriver?.defaultValue ?? 20);
            setUnitsPerBuilding(stream.unitsDriver?.defaultValue ?? 20);
            setAssumptionsOpen(false);
            const bs = BASELINE_STREAMS.find(s => s.stream_id === stream.id);
            setCustomGrowthPct(bs ? parseFloat((bs.monthly_growth * 100).toFixed(1)) : 7);
        }
    }, [stream?.id]);

    const handleDriverChange = (val) => {
        setDriverValue(val);
        if (onDriverChange) onDriverChange(val);
    };

    if (!stream) return null;

    const momGrowth = defaultGrowthPct;
    const customGrowthRate = customGrowthPct / 100;

    const secondParam = stream.sitesDriver ? sitesPerAccount : (stream.unitsDriver ? unitsPerBuilding : undefined);
    const rev = stream.computeRevenue(driverValue, scenario, yearView, secondParam, customGrowthRate);
    const isPipeline = stream.isPipelinePrimary;
    // auto-open assumptions so formula is visible


    const pipelineMetrics = isPipeline ? {
        retrofitLeads: Math.round(driverValue * stream.pipelineOutputs.retrofitConversion),
        trainingLeads: Math.round(driverValue * stream.pipelineOutputs.trainingConversion),
    } : null;

    const stepDown = () => handleDriverChange(Math.max(stream.driver.min, driverValue - stream.driver.step));
    const stepUp = () => handleDriverChange(Math.min(stream.driver.max, driverValue + stream.driver.step));

    return (
        <>
            {/* Overlay */}
            <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={onClose}
            />

            {/* Drawer panel */}
            <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 280 }}
                className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl"
                style={{ width: 'min(520px, 100vw)', background: '#0f172a' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-start justify-between px-6 pt-6 pb-5 flex-shrink-0 border-b"
                    style={{ borderColor: `${stream.color}30`, background: `${stream.color}08` }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                            style={{ background: `${stream.color}20`, border: `1px solid ${stream.color}40` }}
                        >
                            {stream.emoji}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-tight">{stream.title}</h3>
                            <p className="text-slate-400 text-sm mt-0.5">{stream.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                    {/* Feed / feeder callout for connected streams */}
                    {stream.feedsInto && (
                        <div className="rounded-xl px-4 py-3 border border-cyan-900/40 bg-cyan-950/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">Feeds other revenue lines</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{stream.feedsInto}</p>
                        </div>
                    )}
                    {stream.fedBy && (
                        <div className="rounded-xl px-4 py-3 border border-purple-900/40 bg-purple-950/20">
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1.5">Driven by other lines</p>
                            <p className="text-slate-300 text-sm leading-relaxed">{stream.fedBy}</p>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {stream.proven && (
                            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-900/50 text-green-400 border border-green-700/50">
                                ✓ {stream.proofBadge}
                            </span>
                        )}
                        {momGrowth != null && (
                            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-700/50">
                                📈 {momGrowth}% MoM growth
                            </span>
                        )}
                        {stream.tags.map(t => (
                            <span key={t} className="text-xs px-3 py-1 rounded-full border border-slate-700 text-slate-400 bg-slate-800/60">
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Live Proof callout (Experience Center + Retrofit only) */}
                    {stream.liveProof && (
                        <div className="rounded-xl px-4 py-3 border" style={{ background: `${stream.color}0d`, borderColor: `${stream.color}30` }}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: stream.color }}>
                                Live deployments and proof points
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {stream.liveProof}
                            </p>
                        </div>
                    )}

                    {/* What / Who / How */}
                    <div className="space-y-4">
                        <InfoRow label="What this stream is" text={stream.what} />
                        <InfoRow label="Who this serves" text={stream.whoServes} />
                        <InfoRow label="How OverIT earns here" text={stream.howWeEarn} />
                    </div>

                    {/* ── Driver, Outputs, Assumptions, Proof — hidden for Experience Center ── */}
                    {stream.id !== 'experience' ? (<>
                        {/* ── Driver Control ── */}
                        <div className="rounded-2xl border border-slate-700 overflow-hidden" style={{ background: '#1e293b' }}>
                            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700/60">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Driver input (volume)
                                </p>
                                <span className="text-xs text-slate-500 italic">Adjust sliders to model different scenarios</span>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-white font-semibold text-sm mb-4">{stream.driver.name}</p>

                                {/* Stepper + value display */}
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={stepDown}
                                        className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="flex-1 text-center">
                                        <motion.span
                                            key={driverValue}
                                            initial={{ opacity: 0.5, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-3xl font-bold tabular-nums"
                                            style={{ color: stream.color }}
                                        >
                                            {driverValue}
                                        </motion.span>
                                        <span className="text-slate-400 text-sm ml-2">{stream.driver.unitLabel}</span>
                                    </div>
                                    <button
                                        onClick={stepUp}
                                        className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Slider */}
                                <Slider
                                    value={[driverValue]}
                                    onValueChange={v => handleDriverChange(v[0])}
                                    min={stream.driver.min}
                                    max={stream.driver.max}
                                    step={stream.driver.step}
                                    className="mb-1"
                                />
                                <div className="flex justify-between text-xs text-slate-600 mt-1">
                                    <span>{stream.driver.min} {stream.driver.unitLabel}</span>
                                    <span>{stream.driver.max} {stream.driver.unitLabel}</span>
                                </div>

                                {stream.unitsDriver && (
                                    <div className="mt-4 pt-4 border-t border-slate-700/60">
                                        <p className="text-white font-semibold text-sm mb-3">{stream.unitsDriver.name}</p>
                                        <div className="flex items-center gap-4 mb-3">
                                            <button
                                                onClick={() => setUnitsPerBuilding(u => Math.max(stream.unitsDriver.min, u - stream.unitsDriver.step))}
                                                className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="flex-1 text-center">
                                                <motion.span
                                                    key={unitsPerBuilding}
                                                    initial={{ opacity: 0.5, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="text-3xl font-bold tabular-nums"
                                                    style={{ color: stream.color }}
                                                >
                                                    {unitsPerBuilding}
                                                </motion.span>
                                                <span className="text-slate-400 text-sm ml-2">{stream.unitsDriver.unitLabel}</span>
                                            </div>
                                            <button
                                                onClick={() => setUnitsPerBuilding(u => Math.min(stream.unitsDriver.max, u + stream.unitsDriver.step))}
                                                className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Slider
                                            value={[unitsPerBuilding]}
                                            onValueChange={v => setUnitsPerBuilding(v[0])}
                                            min={stream.unitsDriver.min}
                                            max={stream.unitsDriver.max}
                                            step={stream.unitsDriver.step}
                                            className="mb-1"
                                        />
                                        <div className="flex justify-between text-xs text-slate-600 mt-1">
                                            <span>{stream.unitsDriver.min} {stream.unitsDriver.unitLabel}</span>
                                            <span>{stream.unitsDriver.max} {stream.unitsDriver.unitLabel}</span>
                                        </div>
                                    </div>
                                )}

                                {stream.sitesDriver && (
                                    <div className="mt-4 pt-4 border-t border-slate-700/60">
                                        <p className="text-white font-semibold text-sm mb-3">{stream.sitesDriver.name}</p>
                                        <div className="flex items-center gap-4 mb-3">
                                            <button
                                                onClick={() => setSitesPerAccount(s => Math.max(stream.sitesDriver.min, s - stream.sitesDriver.step))}
                                                className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="flex-1 text-center">
                                                <motion.span
                                                    key={sitesPerAccount}
                                                    initial={{ opacity: 0.5, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="text-3xl font-bold tabular-nums"
                                                    style={{ color: stream.color }}
                                                >
                                                    {sitesPerAccount}
                                                </motion.span>
                                                <span className="text-slate-400 text-sm ml-2">{stream.sitesDriver.unitLabel}</span>
                                            </div>
                                            <button
                                                onClick={() => setSitesPerAccount(s => Math.min(stream.sitesDriver.max, s + stream.sitesDriver.step))}
                                                className="w-8 h-8 rounded-lg border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <Slider
                                            value={[sitesPerAccount]}
                                            onValueChange={v => setSitesPerAccount(v[0])}
                                            min={stream.sitesDriver.min}
                                            max={stream.sitesDriver.max}
                                            step={stream.sitesDriver.step}
                                            className="mb-1"
                                        />
                                        <div className="flex justify-between text-xs text-slate-600 mt-1">
                                            <span>{stream.sitesDriver.min} {stream.sitesDriver.unitLabel}</span>
                                            <span>{stream.sitesDriver.max} {stream.sitesDriver.unitLabel}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Outputs Panel ── */}
                        {isPipeline ? (
                            <OutputsPanelPipeline
                                pipelineMetrics={pipelineMetrics}
                                eventRev={rev.selectedYear}
                                yearView={yearView}
                                color={stream.color}
                            />
                        ) : (
                            <OutputsPanel rev={rev} yearView={yearView} color={stream.color} />
                        )}

                        {/* ── Assumptions Accordion ── */}
                        <div className="rounded-2xl border border-slate-700 overflow-hidden">
                            <button
                                onClick={() => setAssumptionsOpen(o => !o)}
                                className="w-full flex items-center justify-between px-5 py-4 bg-slate-800/40 hover:bg-slate-800/70 transition-colors"
                            >
                                <span className="text-sm font-semibold text-slate-300">Assumptions, unit economics & multipliers</span>
                                {assumptionsOpen
                                    ? <ChevronUp className="w-4 h-4 text-slate-400" />
                                    : <ChevronDown className="w-4 h-4 text-slate-400" />
                                }
                            </button>
                            <AnimatePresence>
                                {assumptionsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 py-4 space-y-2 bg-slate-900/60 border-t border-slate-700">
                                            <p className="text-xs font-semibold text-slate-400 mb-3">Unit economics (per stream)</p>
                                            <ARow label="Unit revenue (modeled)" value={`$${stream.assumptions.unitRevenue}/unit`} />
                                            {stream.assumptions.feePercent != null &&
                                                <ARow label="Fee %" value={`${stream.assumptions.feePercent}%`} />}
                                            {stream.assumptions.avgProjectValue != null &&
                                                <ARow label="Avg project value" value={`$${stream.assumptions.avgProjectValue.toLocaleString()}`} />}
                                            {stream.assumptions.sitesPerAccount != null &&
                                                <ARow label="Sites per account (default)" value={`${stream.assumptions.sitesPerAccount} sites`} />}
                                            {stream.assumptions.projectValuePerSite != null &&
                                                <ARow label="Project value / site" value={`$${stream.assumptions.projectValuePerSite.toLocaleString()}`} />}
                                            {stream.assumptions.pricePerUnit != null &&
                                                <ARow label="Price per unit/mo" value={`$${stream.assumptions.pricePerUnit}`} />}
                                            {stream.assumptions.overiTakeRate != null &&
                                                <ARow label="OverIT share" value={`${stream.assumptions.overiTakeRate * 100}%`} />}
                                            {stream.assumptions.hoaKickback != null &&
                                                <ARow label="HOA/mgmt kickback" value={`${stream.assumptions.hoaKickback * 100}%`} />}
                                            {stream.assumptions.avgAnnualPerAccount != null &&
                                                <ARow label="Avg annual / account" value={`$${stream.assumptions.avgAnnualPerAccount.toLocaleString()}`} />}
                                            {stream.assumptions.avgCohortSize != null &&
                                                <ARow label="Avg cohort size" value={`${stream.assumptions.avgCohortSize} students`} />}

                                            <div className="border-t border-slate-800 pt-3 mt-3">
                                                <p className="text-xs font-semibold text-slate-400 mb-2">Scenario multipliers</p>
                                                {Object.entries(SCENARIO_MULTIPLIERS).map(([k, v]) => (
                                                    <ARow key={k} label={v.label} value={`${v.revenue}×`} color={v.color} />
                                                ))}
                                            </div>

                                               <div className="border-t border-slate-800 pt-3 mt-3">
                                                <p className="text-xs text-slate-500 italic">{stream.assumptions.scenarioNote}</p>
                                            </div>

                                            {stream.revenueFormula && (
                                                <div className="border-t border-slate-800 pt-3 mt-3">
                                                    <p className="text-xs font-semibold text-slate-400 mb-2">Revenue formula</p>
                                                    <div className="rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5">
                                                        {stream.revenueFormula(driverValue, secondParam ?? 20).split('\n').map((line, i) => (
                                                            <p key={i} className={`text-xs font-mono ${i === 0 ? 'text-cyan-300 font-semibold' : 'text-slate-500 mt-1'}`}>{line}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Proof Points ── */}
                        {stream.proof?.length > 0 && (
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Proof and traction</p>
                                <div className="space-y-2">
                                    {stream.proof.map((p, i) => (
                                        <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                            <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>) : null}

                    {/* Close button at bottom */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all text-sm font-medium"
                    >
                        Close stream details
                    </button>
                </div>
            </motion.div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────

function InfoRow({ label, text }) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{text}</p>
        </div>
    );
}

function OutputsPanel({ rev, yearView, color }) {
    return (
        <div className="rounded-2xl border border-slate-700 overflow-hidden" style={{ background: '#1e293b' }}>
            <div className="px-5 py-3 border-b border-slate-700/60">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenue outputs</p>
            </div>
            <div className="px-5 py-5">
                {/* Big selected year number */}
                <p className="text-xs text-slate-500 mb-1">
                    {YEAR_LABELS[yearView]} revenue
                </p>
                <motion.div
                    key={rev.selectedYear}
                    initial={{ opacity: 0.5, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-4xl font-bold tabular-nums mb-5"
                    style={{ color }}
                >
                    {fmt(rev.selectedYear)}
                </motion.div>

                {/* Y1 / Y2 / Y3 / Run-rate mini strip */}
                <div className="grid grid-cols-4 gap-2">
                    {(['y1', 'y2', 'y3', 'runRate']).map(yr => (
                        <div
                            key={yr}
                            className={`rounded-xl p-3 text-center border transition-all ${
                                yearView === yr
                                    ? 'border-slate-500 bg-slate-700/60'
                                    : 'border-slate-700/50 bg-slate-800/40'
                            }`}
                        >
                            <div className="text-xs text-slate-500 mb-1">{YEAR_LABELS[yr]}</div>
                            <div className="text-sm font-bold text-white tabular-nums">{fmt(rev[yr])}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function OutputsPanelPipeline({ pipelineMetrics, eventRev, yearView, color }) {
    return (
        <div className="rounded-2xl border border-slate-700 overflow-hidden" style={{ background: '#1e293b' }}>
            <div className="px-5 py-3 border-b border-slate-700/60">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline outputs</p>
                <p className="text-xs text-slate-500 italic mt-0.5">Downstream leads generated (modeled placeholder)</p>
            </div>
            <div className="px-5 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-center">
                        <div className="text-2xl font-bold tabular-nums text-indigo-400">{pipelineMetrics.retrofitLeads}</div>
                        <div className="text-xs text-slate-400 mt-1">Retrofit leads/mo</div>
                        <div className="text-xs text-slate-600 italic mt-0.5">12% visit conversion</div>
                    </div>
                    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-4 text-center">
                        <div className="text-2xl font-bold tabular-nums text-pink-400">{pipelineMetrics.trainingLeads}</div>
                        <div className="text-xs text-slate-400 mt-1">Training inquiries/mo</div>
                        <div className="text-xs text-slate-600 italic mt-0.5">8% visit conversion</div>
                    </div>
                </div>
                <div className="border-t border-slate-700 pt-4">
                    <p className="text-xs text-slate-500 mb-1">Modeled event/sponsorship revenue ({YEAR_LABELS[yearView]})</p>
                    <div className="text-2xl font-bold tabular-nums" style={{ color }}>{fmt(eventRev)}</div>
                    <p className="text-xs text-slate-600 italic mt-0.5">Secondary — main value is downstream retrofit and training pipeline</p>
                </div>
            </div>
        </div>
    );
}

function ARow({ label, value, color }) {
    return (
        <div className="flex justify-between items-center text-xs py-0.5">
            <span className="text-slate-400">{label}</span>
            <span className="font-mono font-semibold" style={{ color: color || '#94a3b8' }}>{value}</span>
        </div>
    );
}