import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

import { BASELINE_STREAMS, runForecast, STREAM_COLORS } from '@/components/forecast/forecastEngine';
import RevenueFlywheelAnimation from './RevenueFlywheelAnimation';

const STREAM_DISPLAY = {
  experience: { icon: Camera, color: 'cyan', subtitle: 'Zero-Inventory Retail Showroom', description: 'Live UniFi Experience Center showroom driving zero-inventory hardware sales and demand for every other service line.', metrics: ['Live demo environment drives high-confidence purchases', 'Zero inventory risk — orders fulfilled direct to customer', 'Doubles as marketing engine for all other business lines'] },
  retrofit: { icon: Building2, color: 'purple', subtitle: 'The DoorKing Killer', description: 'Retrofit DoorKing-style systems with subscription-free UniFi access control, delivering faster ROI and lower lifetime cost.', metrics: ['Average deal size: $9,000 · Our fee: ~12.5%', 'Partner-executed installs — no install labor bottleneck', 'Every retrofit is a monitoring candidate'] },
  training: { icon: GraduationCap, color: 'green', subtitle: 'Authorized Ubiquiti Education', description: 'National Training Center delivering Ubiquiti / UniFi certifications that create the workforce powering all eight revenue streams.', metrics: ['$2,000/seat — cohorts of 4–12 students', 'In-person or remote delivery', 'Training graduates feed 5 downstream streams'] },
  retail: { icon: Store, color: 'amber', subtitle: 'Site Magic for Multi-Location Brands', description: 'UniFi networks for multi-location retail brands, reducing operational cost while standardizing secure, scalable infrastructure.', metrics: ['Retainer per brand × 20 sites × $3,500/site/mo', 'Stretch: 2 national accounts add significant volume', 'Each rollout feeds Professional Monitoring'] },
  monitoring: { icon: Shield, color: 'red', subtitle: 'Replacing ADT, Brinks & Legacy Systems', description: 'UniFi-compatible monitoring replacing legacy alarm vendors, creating sticky recurring revenue with lower OpEx for clients.', metrics: ['$100/site/month recurring MRR', 'Fed by every infrastructure stream (0.14× elasticity each)', 'Compounding as retrofit, retail, and ISP grow'] },
  rentals: { icon: Camera, color: 'indigo', subtitle: 'Film & Production Deployments', description: 'Reusable UniFi infrastructure packages rented to film productions, generating high-margin income without new CapEx each project.', metrics: ['$800 avg per production rental', 'Reusable gear — no per-project capital outlay', 'Builds relationships in ATL film industry'] },
  refrigeration: { icon: Thermometer, color: 'orange', subtitle: 'FDA Compliance Automation', description: 'Automated UniFi sensor monitoring for refrigeration, eliminating manual logs and avoiding spoilage across food and pharma locations.', metrics: ['$83/location/month recurring', 'Eliminates manual logging labor', 'Scalable across restaurant and pharmacy chains'] },
  isp: { icon: Wifi, color: 'teal', subtitle: 'Breaking the Monopoly on Internet', description: 'Micro ISP built on UniFi infrastructure, offering HOAs community-owned broadband that undercuts monopoly pricing.', metrics: ['$100/building/month net margin', 'Serves HOAs underserved by Comcast/AT&T', 'Training graduates drive deployment (0.4× elasticity)'] }
};

const colorMap = {
  cyan: { bg: 'from-cyan-950/30', border: 'border-cyan-900/50', icon: 'bg-cyan-500/10', iconColor: 'text-cyan-400', accent: 'text-cyan-400', hex: STREAM_COLORS.experience },
  purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400', hex: STREAM_COLORS.retrofit },
  green: { bg: 'from-green-950/30', border: 'border-green-900/50', icon: 'bg-green-500/10', iconColor: 'text-green-400', accent: 'text-green-400', hex: STREAM_COLORS.training },
  amber: { bg: 'from-amber-950/30', border: 'border-amber-900/50', icon: 'bg-amber-500/10', iconColor: 'text-amber-400', accent: 'text-amber-400', hex: STREAM_COLORS.retail },
  red: { bg: 'from-red-950/30', border: 'border-red-900/50', icon: 'bg-red-500/10', iconColor: 'text-red-400', accent: 'text-red-400', hex: STREAM_COLORS.monitoring },
  indigo: { bg: 'from-indigo-950/30', border: 'border-indigo-900/50', icon: 'bg-indigo-500/10', iconColor: 'text-indigo-400', accent: 'text-indigo-400', hex: STREAM_COLORS.rentals },
  orange: { bg: 'from-orange-950/30', border: 'border-orange-900/50', icon: 'bg-orange-500/10', iconColor: 'text-orange-400', accent: 'text-orange-400', hex: STREAM_COLORS.refrigeration },
  teal: { bg: 'from-teal-950/30', border: 'border-teal-900/50', icon: 'bg-teal-500/10', iconColor: 'text-teal-400', accent: 'text-teal-400', hex: STREAM_COLORS.isp }
};

const businessLines = BASELINE_STREAMS.map((s) => {
  const display = STREAM_DISPLAY[s.stream_id];
  return {
    id: s.stream_id,
    icon: display.icon,
    title: s.stream_title,
    subtitle: display.subtitle,
    color: display.color,
    hex: colorMap[display.color].hex,
    description: display.description,
    metrics: display.metrics
  };
});



export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
  const [expanded, setExpanded] = useState(new Set());
  const [timerDone, setTimerDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (timerDone) {if (onUnlockMessage) onUnlockMessage(null);return;}
    if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
  }, [secondsLeft, timerDone]);

  useEffect(() => {
    if (timerDone) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {clearInterval(interval);setTimerDone(true);onInteracted();return 0;}
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
    if (allExpanded && !timerDone) {setTimerDone(true);onInteracted();if (onUnlockMessage) onUnlockMessage(null);}
  }, [allExpanded]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Multiple Revenue Lines Reduces Risk</h2>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Diversification usually means distraction. For us, it means resilience.
                    </p>
                </motion.div>

                {/* Flywheel animation — centered, full width */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex justify-center mb-5">
                    <RevenueFlywheelAnimation />
                </motion.div>

                {/* Interdependence statement */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8 rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-800/20 px-6 py-5 text-center">
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-3">
                        Because these lines are <span className="text-cyan-400 font-semibold">interdependent</span>, the success of one guarantees the growth of the others — making this a <span className="text-green-400 font-semibold">low-risk, high-impact</span> investment.
                    </p>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                        Our business lines are designed to be <span className="text-violet-400 font-semibold">synergistic</span>, where everything works together to create greater impact: <span className="text-green-400 font-medium">Certified training programs</span> produce skilled installers who accelerate UniFi deployments for clients, and our <span className="text-violet-400 font-medium">AI-powered matching</span> connects projects nationwide, fostering local jobs. Yet, they're not dependent — our in-person <span className="text-cyan-400 font-medium">Experience Center</span> generates <span className="text-amber-400 font-semibold">standalone revenue</span> through events and demos, our video studio supports independent online courses, and consulting services offer flexible, on-demand expertise. This structure <span className="text-green-400 font-semibold">minimizes risk</span>, ensuring that even if one area faces challenges (e.g., a dip in physical attendance), the others continue driving growth and ROI.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {businessLines.map((line, i) => {
            const colors = colorMap[line.color];
            const Icon = line.icon;
            const isOpen = expanded.has(i);
            return (
              <motion.div key={line.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} onClick={() => handleExpand(i)}
              className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02] flex flex-col items-center text-center gap-2 ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}>
                                <div className={`w-9 h-9 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    {isOpen ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Icon className={`w-4 h-4 ${colors.iconColor}`} />}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white leading-tight">{line.title}</h3>
                                    <p className={`text-xs ${colors.accent} mt-0.5`}>{line.subtitle}</p>
                                </div>
                                {isOpen &&
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-slate-700/50 w-full text-left">
                                        <p className="text-slate-300 text-xs mb-2">{line.description}</p>
                                        <div className="space-y-1">
                                            {line.metrics.map((m, j) =>
                    <div key={j} className="flex items-start gap-1.5 text-xs text-slate-400">
                                                    <ArrowRight className={`w-3 h-3 flex-shrink-0 mt-0.5 ${colors.iconColor}`} />
                                                    <span>{m}</span>
                                                </div>
                    )}
                                        </div>
                                    </motion.div>
                }
                            </motion.div>);

          })}
                </div>



                {allExpanded &&
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ All 8 lines explored — click Next to continue
                    </motion.p>
        }
            </div>
        </div>);

}