import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { BASELINE_STREAMS, STREAM_COLORS } from '@/components/forecast/forecastEngine';

const STREAM_DISPLAY = {
  experience:    { icon: Camera,       color: 'cyan',   title: 'Experience Center',            subtitle: 'Live showroom · zero inventory',    tag: 'Direct Revenue',     description: 'A live demo environment that drives hardware sales and qualifies prospects for every other service line — without holding inventory.', metrics: ['High-confidence sales environment', 'No inventory risk', 'Qualifies buyers for downstream services'] },
  experience_design_consulting: { icon: Camera, color: 'cyan', title: 'Experience Center — Design', subtitle: '2hr consult billed per visit · $300', tag: 'Direct Revenue', description: 'Every qualified visitor receives a 2-hour design consultation at $150/hr — a separate, predictable revenue line tied 1:1 to visit volume.', metrics: ['$300/visit (2hr × $150)', 'Tied 1:1 to visit volume', 'Predictable, immediate revenue'] },
  retrofit:      { icon: Building2,    color: 'purple', title: 'Access Control Retrofit',       subtitle: 'Replacing legacy intercom systems', tag: 'Project Revenue',    description: 'Replace aging legacy access systems with modern hardware — executed through certified installer partners at a scalable margin.', metrics: ['Avg. deal: $9,000 · Fee: ~12.5%', 'Partner-executed — no labor bottleneck', 'Natural lead-in to monitoring'] },
  training:      { icon: GraduationCap,color: 'green',  title: 'Certification Training',        subtitle: 'Authorized Ubiquiti education',     tag: 'Direct Revenue',     description: 'Nationally recognized certifications delivered in-person or remotely. Produces the skilled workforce that supports all downstream lines.', metrics: ['$2,000/seat · cohorts of 4–12', 'In-person or remote', 'Feeds 5 downstream revenue paths'] },
  retail:        { icon: Store,        color: 'amber',  title: 'Multi-Location Retail',         subtitle: 'Network rollouts for retail chains', tag: 'Retainer Revenue',   description: 'Standardized network deployments for retail brands and franchise groups, with recurring support retainers per location.', metrics: ['Per-brand retainer × multiple sites', '2 accounts = meaningful volume', 'Each rollout feeds monitoring'] },
  monitoring:    { icon: Shield,       color: 'red',    title: 'Professional Monitoring',       subtitle: 'Recurring security monitoring MRR', tag: 'MRR',                description: 'Modern alarm and security monitoring replacing legacy vendors — sticky recurring revenue at lower cost for clients.', metrics: ['$100/site/month MRR', 'Fed by retrofit, retail, and ISP lines', 'Compounds as infrastructure grows'] },
  rentals:       { icon: Camera,       color: 'indigo', title: 'Infrastructure Rentals',        subtitle: 'Film & production deployments',     tag: 'Asset Revenue',      description: 'Reusable gear packages rented to film productions and live events — high-margin income from existing inventory with no new CapEx.', metrics: ['$800 avg per production', 'No per-project capital outlay', 'Builds ATL industry relationships'] },
  refrigeration: { icon: Thermometer,  color: 'orange', title: 'Compliance Monitoring',         subtitle: 'Refrigeration & temp logging',      tag: 'MRR',                description: 'Automated sensor monitoring for commercial refrigeration — eliminating manual logs and reducing spoilage risk across food and pharma clients.', metrics: ['$83/location/month recurring', 'Replaces manual compliance labor', 'Scales across chains'] },
  isp:           { icon: Wifi,         color: 'teal',   title: 'Micro ISP',                     subtitle: 'Community broadband for HOAs',      tag: 'Infrastructure MRR', description: 'HOA-owned broadband that undercuts monopoly pricing — generating recurring net revenue on infrastructure we deploy and manage.', metrics: ['$100/building/month net', 'Underserved by incumbents', 'Training graduates drive rollout'] },
};

const colorMap = {
  cyan:   { bg: 'from-cyan-950/30',   border: 'border-cyan-900/50',   icon: 'bg-cyan-500/10',   iconColor: 'text-cyan-400',   accent: 'text-cyan-400',   tag: 'bg-cyan-900/40 text-cyan-300',   hex: STREAM_COLORS.experience },
  purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400', tag: 'bg-purple-900/40 text-purple-300', hex: STREAM_COLORS.retrofit },
  green:  { bg: 'from-green-950/30',  border: 'border-green-900/50',  icon: 'bg-green-500/10',  iconColor: 'text-green-400',  accent: 'text-green-400',  tag: 'bg-green-900/40 text-green-300',  hex: STREAM_COLORS.training },
  amber:  { bg: 'from-amber-950/30',  border: 'border-amber-900/50',  icon: 'bg-amber-500/10',  iconColor: 'text-amber-400',  accent: 'text-amber-400',  tag: 'bg-amber-900/40 text-amber-300',  hex: STREAM_COLORS.retail },
  red:    { bg: 'from-red-950/30',    border: 'border-red-900/50',    icon: 'bg-red-500/10',    iconColor: 'text-red-400',    accent: 'text-red-400',    tag: 'bg-red-900/40 text-red-300',      hex: STREAM_COLORS.monitoring },
  indigo: { bg: 'from-indigo-950/30', border: 'border-indigo-900/50', icon: 'bg-indigo-500/10', iconColor: 'text-indigo-400', accent: 'text-indigo-400', tag: 'bg-indigo-900/40 text-indigo-300', hex: STREAM_COLORS.rentals },
  orange: { bg: 'from-orange-950/30', border: 'border-orange-900/50', icon: 'bg-orange-500/10', iconColor: 'text-orange-400', accent: 'text-orange-400', tag: 'bg-orange-900/40 text-orange-300', hex: STREAM_COLORS.refrigeration },
  teal:   { bg: 'from-teal-950/30',   border: 'border-teal-900/50',   icon: 'bg-teal-500/10',   iconColor: 'text-teal-400',   accent: 'text-teal-400',   tag: 'bg-teal-900/40 text-teal-300',    hex: STREAM_COLORS.isp },
};

const businessLines = BASELINE_STREAMS.map((s) => {
  const display = STREAM_DISPLAY[s.stream_id];
  return { id: s.stream_id, ...display, color: display.color };
});

const STACK_DATA = [
  { label: 'Standalone', standalone: 40, expansion: 0, compounding: 0, color: '#22d3ee', desc: 'Each line closes on its own' },
  { label: '+ Expansion', standalone: 40, expansion: 35, compounding: 0, color: '#a78bfa', desc: 'One deployment opens the next' },
  { label: '+ Compounding', standalone: 40, expansion: 35, compounding: 25, color: '#34d399', desc: 'Diversified revenue, higher LTV' },
];

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
  const [expanded, setExpanded] = useState(new Set());
  const [timerDone, setTimerDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (timerDone) { if (onUnlockMessage) onUnlockMessage(null); return; }
    if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 9 cards to unlock now`);
  }, [secondsLeft, timerDone]);

  useEffect(() => {
    if (timerDone) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
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
    if (allExpanded && !timerDone) { setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null); } // eslint-disable-line
  }, [allExpanded]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-4">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            One Platform. Nine Revenue Paths.
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Independent revenue today. Expansion revenue tomorrow.
          </p>
        </motion.div>

        {/* Business Line Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {businessLines.map((line, i) => {
            const colors = colorMap[line.color];
            const Icon = line.icon;
            const isOpen = expanded.has(i);
            return (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleExpand(i)}
                className={`bg-gradient-to-br ${colors.bg} to-slate-900/20 border ${colors.border} rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-2 ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {isOpen
                      ? <CheckCircle className="w-4 h-4 text-green-400" />
                      : <Icon className={`w-4 h-4 ${colors.iconColor}`} />}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.tag}`}>{line.tag}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">{line.title}</h3>
                  <p className={`text-xs ${colors.accent} mt-0.5 leading-snug`}>{line.subtitle}</p>
                </div>

                {isOpen && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-slate-700/50">
                    <p className="text-slate-300 text-xs mb-2 leading-relaxed">{line.description}</p>
                    <div className="space-y-1">
                      {line.metrics.map((m, j) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-slate-400">
                          <ArrowRight className={`w-3 h-3 flex-shrink-0 mt-0.5 ${colors.iconColor}`} />
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

        {/* Section break */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-14 mb-8 flex items-center gap-4">
          <div className="flex-1 border-t border-slate-800" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase whitespace-nowrap">Why This Model Works</p>
          <div className="flex-1 border-t border-slate-800" />
        </motion.div>

        {/* Stacked visual framework */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-slate-800 bg-slate-800/20 px-6 py-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* Left: stacked bars */}
            <div className="space-y-3">
              {STACK_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 flex-shrink-0 text-right">{row.label}</span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden bg-slate-800/60 flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.standalone}%` }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-cyan-500/70"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.expansion}%` }}
                      transition={{ delay: 0.55 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-violet-500/70"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.compounding}%` }}
                      transition={{ delay: 0.7 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-green-500/70"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: legend */}
            <div className="space-y-4">
              {[
                { color: 'bg-cyan-500/70', label: 'Standalone Revenue', desc: 'Each line can close on its own.' },
                { color: 'bg-violet-500/70', label: 'Expansion Opportunities', desc: 'One deployment often opens the next service.' },
                { color: 'bg-green-500/70', label: 'Lower Risk, Higher Value', desc: 'Diversified revenue reduces dependency and increases client value.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-sm ${item.color} flex-shrink-0 mt-1`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-200 leading-tight">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        {allExpanded && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
            ✓ All 9 lines explored — click Next to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}