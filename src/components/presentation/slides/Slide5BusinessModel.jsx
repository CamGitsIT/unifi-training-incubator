import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle, Layers, GitMerge, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

import { BASELINE_STREAMS, STREAM_COLORS } from '@/components/forecast/forecastEngine';

const STREAM_DISPLAY = {
  experience:    { icon: Camera,       color: 'cyan',   title: 'Experience Center',       subtitle: 'Zero-inventory UniFi showroom',         tag: 'Direct Revenue',      description: 'A live UniFi demo environment that drives hardware sales and qualifies prospects for every other service line — without holding inventory.', metrics: ['High-confidence sales environment', 'No inventory risk', 'Qualifies buyers for downstream services'] },
  retrofit:      { icon: Building2,    color: 'purple', title: 'Access Control Retrofit',  subtitle: 'Replacing legacy intercom systems',      tag: 'Project Revenue',     description: 'Replace aging DoorKing and legacy access systems with subscription-free UniFi hardware — executed through certified installer partners.', metrics: ['Avg. deal: $9,000 · Fee: ~12.5%', 'Partner-executed — no labor bottleneck', 'Creates monitoring candidates'] },
  training:      { icon: GraduationCap,color: 'green',  title: 'Certification Training',   subtitle: 'Authorized Ubiquiti education',          tag: 'Recurring Revenue',   description: 'National training center delivering Ubiquiti certifications. Produces the certified workforce that powers all downstream service lines.', metrics: ['$2,000/seat · cohorts of 4–12', 'In-person or remote delivery', 'Feeds 5 downstream revenue streams'] },
  retail:        { icon: Store,        color: 'amber',  title: 'Retail Network Rollouts',  subtitle: 'UniFi for multi-location brands',        tag: 'Retainer Revenue',    description: 'Standardized UniFi deployments for retail chains, franchise groups, and multi-location operators — with ongoing support retainers.', metrics: ['Per-brand retainer × multiple sites', '2 national accounts = significant volume', 'Each rollout creates monitoring demand'] },
  monitoring:    { icon: Shield,       color: 'red',    title: 'Professional Monitoring',  subtitle: 'Replacing ADT, Brinks & legacy vendors', tag: 'MRR',                 description: 'UniFi-compatible alarm and security monitoring, replacing overpriced legacy vendors with modern, lower-cost recurring service.', metrics: ['$100/site/month MRR', 'Fed by retrofit, retail, and ISP lines', 'Compounds as infrastructure grows'] },
  rentals:       { icon: Camera,       color: 'indigo', title: 'Infrastructure Rentals',   subtitle: 'Deployments for film & production',      tag: 'Asset Revenue',       description: 'Reusable UniFi packages rented to film productions and live events — high-margin income from existing gear with no new CapEx.', metrics: ['$800/avg per production', 'No per-project capital outlay', 'ATL film industry relationships'] },
  refrigeration: { icon: Thermometer,  color: 'orange', title: 'Temp & Compliance Monitoring', subtitle: 'FDA-grade refrigeration logging',   tag: 'MRR',                 description: 'Automated sensor monitoring for commercial refrigeration, eliminating manual logs and reducing spoilage risk for food and pharma clients.', metrics: ['$83/location/month recurring', 'Eliminates manual compliance labor', 'Scales across chains'] },
  isp:           { icon: Wifi,         color: 'teal',   title: 'Micro ISP',                subtitle: 'Community broadband for HOAs',           tag: 'Infrastructure MRR', description: 'HOA-owned broadband built on UniFi fiber and wireless — undercutting monopoly pricing while generating recurring net revenue.', metrics: ['$100/building/month net margin', 'Underserved by Comcast/AT&T', 'Training graduates drive rollout'] },
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

const FRAMEWORK = [
  {
    icon: Layers,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-900/40',
    heading: 'Standalone Revenue',
    body: 'Each of the 8 lines generates revenue independently — no single line depends on another to operate or close.',
  },
  {
    icon: GitMerge,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-900/40',
    heading: 'Expansion Opportunities',
    body: 'A retrofit client can become a monitoring client. A training graduate becomes a deployment partner. Each engagement opens a natural next conversation.',
  },
  {
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-900/40',
    heading: 'Lower Risk · Higher LTV',
    body: 'Concentration risk is distributed across eight paths. As each line matures, it compounds lifetime customer value across the portfolio.',
  },
];

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
  const [expanded, setExpanded] = useState(new Set());
  const [timerDone, setTimerDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (timerDone) { if (onUnlockMessage) onUnlockMessage(null); return; }
    if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
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
    if (allExpanded && !timerDone) { setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null); }
  }, [allExpanded]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-3">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            One Platform. Eight Revenue Paths.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Each line generates revenue independently. Together, they form a cross-sell engine that distributes risk and compounds customer lifetime value.
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

        {/* 3-Part Framework */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {FRAMEWORK.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={`rounded-2xl border ${item.border} bg-slate-800/30 px-5 py-5 flex flex-col gap-3`}>
                <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${item.color} mb-1`}>{item.heading}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.body}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Divider note */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-slate-600 text-xs">
          Built entirely on the UniFi ecosystem — one core expertise, eight monetization paths.
        </motion.p>

        {allExpanded && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
            ✓ All 8 lines explored — click Next to continue
          </motion.p>
        )}
      </div>
    </div>
  );
}