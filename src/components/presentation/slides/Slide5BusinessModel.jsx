import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { BASELINE_STREAMS, STREAM_COLORS } from '@/components/forecast/forecastEngine';

const STREAM_DISPLAY = {
  experience:    { icon: Camera,        color: 'cyan',   title: 'Experience Center',       subtitle: 'Live showroom · no inventory',          tag: 'Direct',      description: 'Live UniFi showroom.', metrics: ['No inventory.', 'Qualifies buyers.', 'Feeds every other line.'] },
  training:      { icon: GraduationCap, color: 'green',  title: 'Certification Training',  subtitle: 'Official UniFi training',               tag: 'Direct',      description: 'Official UniFi bootcamps.', metrics: ['$2,000/seat.', 'In-person or remote.', 'Builds talent pipeline.'] },
  retrofit:      { icon: Building2,     color: 'purple', title: 'Access Control Retrofit', subtitle: 'Modern entry upgrades',                 tag: 'Project',     description: 'Modern entry upgrades.', metrics: ['Avg $9K deal. 12.5% fee.', 'Design & scope → MSP partner.'] },
  retail:        { icon: Store,         color: 'amber',  title: 'Multi-Location Retail',   subtitle: 'Standardized retail rollouts',          tag: 'Recurring',   description: 'Standardized chain rollouts.', metrics: ['Recurring support across sites.'] },
  monitoring:    { icon: Shield,        color: 'red',    title: 'Professional Monitoring', subtitle: 'Modern security monitoring',            tag: 'Recurring',   description: 'Modern security monitoring.', metrics: ['Replaces legacy vendors. $100/site/mo.'] },
  rentals:       { icon: Camera,        color: 'indigo', title: 'Infrastructure Rentals',  subtitle: 'Production-ready gear rentals',         tag: 'Asset',       description: 'Production-ready gear rentals.', metrics: ['$800 avg per job.', 'No client capex.'] },
  refrigeration: { icon: Thermometer,   color: 'orange', title: 'Compliance Monitoring',   subtitle: 'Temperature and compliance logging',    tag: 'Recurring',   description: 'Temp & compliance monitoring.', metrics: ['$1,000/year/location.', 'Cuts manual work and error.'] },
  isp:           { icon: Wifi,          color: 'teal',   title: 'Micro ISP',                subtitle: 'Community broadband for HOAs',         tag: 'Infrastructure', description: 'HOA community broadband.', metrics: ['$55/unit/mo net.', 'Beats incumbents.'] },
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

const businessLines = BASELINE_STREAMS
  .filter(s => STREAM_DISPLAY[s.stream_id])
  .map((s) => {
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
    if (allExpanded && !timerDone) { setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null); } // eslint-disable-line
  }, [allExpanded]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-4">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Separate revenue lines.<br />Shared momentum.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            Each line earns on its own. Together they compound.
          </p>
          <p className="text-lg text-white max-w-2xl mx-auto mb-2">
            We're building both the Experience Center and National Training Center with this $300K raise (unlocking the SBA-backed $850K facility).
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We educate + demo, then design & scope complex projects — handing implementation design to our trained partners to implement for a fee.
          </p>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-4">
            8 connected streams complete the flywheel.
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
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase whitespace-nowrap">Why This Model Works — Standalone. Expandable. Compounding.</p>
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
                { color: 'bg-cyan-500/70', label: 'Standalone Revenue', desc: 'Each line can close and generate revenue on its own.' },
                { color: 'bg-violet-500/70', label: 'Expansion Revenue', desc: 'One deployment often opens the door to the next service.' },
                { color: 'bg-green-500/70', label: 'Lower Risk. More Value.', desc: 'Diversified revenue reduces dependency on any one offer and increases long-term client value.' },
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

        {/* All-explored message hidden */}
      </div>
    </div>
  );
}