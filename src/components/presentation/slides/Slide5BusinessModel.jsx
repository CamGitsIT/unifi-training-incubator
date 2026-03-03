import React, { useState } from 'react';
import { Building2, GraduationCap, Store, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const businessLines = [
    { icon: Building2, title: 'Multi-Family Retrofit', subtitle: 'The DoorKing Killer', color: 'cyan', revenue: '$216K', margin: '90%', description: 'Replace legacy access control systems with subscription-free UniFi solutions.', metrics: ['Average deal size: $15,000', '40% gross margin per project', '16-month ROI tipping point for clients'] },
    { icon: GraduationCap, title: 'National Training Center', subtitle: 'Authorized Ubiquiti Education', color: 'purple', revenue: '$304K', margin: '78%', description: 'Certify IT professionals in UniFi technology through hands-on training.', metrics: ['In-person: $1,995/seat, $1,575 net', 'Virtual training: Up to $5,000/seat', 'Training revenue alone covers debt 10x over'] },
    { icon: Store, title: 'Retail Modernization', subtitle: 'Site Magic for Multi-Location Brands', color: 'green', revenue: '$72K', margin: '15%', description: 'Eliminate $45K/year in VPN costs for franchise owners through standardized UniFi rollouts.', metrics: ['15% uplift on MSP implementation', 'Scalable to 270+ locations in Year 1', 'Minimal overhead, architect-hour constrained only'] }
];

const colorMap = {
    cyan: { bg: 'from-cyan-950/30', border: 'border-cyan-900/50', icon: 'bg-cyan-500/10', iconColor: 'text-cyan-400', accent: 'text-cyan-400' },
    purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400' },
    green: { bg: 'from-green-950/30', border: 'border-green-900/50', icon: 'bg-green-500/10', iconColor: 'text-green-400', accent: 'text-green-400' }
};

export default function Slide5BusinessModel({ onInteracted }) {
    const [expanded, setExpanded] = useState(new Set());

    const handleExpand = (i) => {
        const next = new Set(expanded);
        next.add(i);
        setExpanded(next);
        if (next.size === businessLines.length) onInteracted();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">One Mission, One Room</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Multiple Lines of Business — all operating under one roof, sharing costs, sharing mission, multiplying impact.
                    </p>
                    <p className="text-sm text-cyan-400 mt-4 animate-pulse">👇 Click each business line to expand</p>
                </motion.div>

                <div className="space-y-4">
                    {businessLines.map((line, i) => {
                        const colors = colorMap[line.color];
                        const Icon = line.icon;
                        const isOpen = expanded.has(i);
                        return (
                            <motion.div
                                key={line.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => handleExpand(i)}
                                className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01] ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{line.title}</h3>
                                        <p className={`text-sm ${colors.accent}`}>{line.subtitle}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${colors.accent}`}>{line.revenue}</div>
                                        <div className="text-xs text-slate-400">Year 3 Revenue</div>
                                    </div>
                                </div>
                                {isOpen && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-slate-700/50">
                                        <p className="text-slate-300 mb-3">{line.description}</p>
                                        <div className="space-y-2">
                                            {line.metrics.map((m, j) => (
                                                <div key={j} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <ArrowRight className={`w-4 h-4 ${colors.iconColor}`} />
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
                    <div className="text-sm text-cyan-400 font-semibold mb-1">TOTAL YEAR 3 REVENUE</div>
                    <div className="text-5xl font-bold text-white mb-1">$606,360</div>
                    <div className="text-slate-400 text-sm">78% net profit margin = $470,753 net income</div>
                </div>

                {expanded.size === businessLines.length && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ Click Next to see the property
                    </motion.p>
                )}
            </div>
        </div>
    );
}