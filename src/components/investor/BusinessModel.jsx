import React from 'react';
import { Building2, GraduationCap, Store, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BusinessModel() {
    const businessLines = [
        {
            icon: Building2,
            title: "Multi-Family Retrofit",
            subtitle: "The DoorKing Killer",
            color: "cyan",
            revenue: "$216K",
            margin: "90%",
            description: "Replace legacy access control systems with subscription-free UniFi solutions.",
            metrics: [
                "Average deal size: $15,000",
                "40% gross margin per project",
                "16-month ROI tipping point for clients"
            ]
        },
        {
            icon: GraduationCap,
            title: "National Training Center",
            subtitle: "Authorized Ubiquiti Education",
            color: "purple",
            revenue: "$304K",
            margin: "78%",
            description: "Certify IT professionals in UniFi technology through hands-on training.",
            metrics: [
                "In-person: $1,995/seat, $1,575 net",
                "Virtual training: Up to $5,000/seat",
                "Training revenue alone covers debt 10x over"
            ]
        },
        {
            icon: Store,
            title: "Retail Modernization",
            subtitle: "Site Magic for Multi-Location Brands",
            color: "green",
            revenue: "$72K",
            margin: "15%",
            description: "Eliminate $45K/year in VPN costs for franchise owners through standardized UniFi rollouts.",
            metrics: [
                "15% uplift on MSP implementation",
                "Scalable to 270+ locations in Year 1",
                "Minimal overhead, architect-hour constrained only"
            ]
        }
    ];

    const colorMap = {
        cyan: { bg: "from-cyan-950/30", border: "border-cyan-900/50", icon: "bg-cyan-500/10", iconColor: "text-cyan-400", accent: "text-cyan-400" },
        purple: { bg: "from-purple-950/30", border: "border-purple-900/50", icon: "bg-purple-500/10", iconColor: "text-purple-400", accent: "text-purple-400" },
        green: { bg: "from-green-950/30", border: "border-green-900/50", icon: "bg-green-500/10", iconColor: "text-green-400", accent: "text-green-400" }
    };

    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        One Mission, One Room
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Multiple Lines of Business — all operating under one roof, sharing costs, sharing mission, multiplying impact.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {businessLines.map((line, index) => {
                        const colors = colorMap[line.color];
                        const Icon = line.icon;
                        
                        return (
                            <motion.div
                                key={line.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-8 hover:scale-[1.02] transition-transform`}
                            >
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <Icon className={`w-6 h-6 ${colors.iconColor}`} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">{line.title}</h3>
                                                <p className={`text-sm ${colors.accent} font-medium`}>{line.subtitle}</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-300 mb-4">{line.description}</p>
                                        <div className="space-y-2">
                                            {line.metrics.map((metric, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <ArrowRight className={`w-4 h-4 ${colors.iconColor}`} />
                                                    <span>{metric}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:w-48 flex md:flex-col gap-4 md:gap-6">
                                        <div className="flex-1 bg-slate-950/50 rounded-xl p-4 border border-slate-700">
                                            <div className="text-sm text-slate-400 mb-1">Year 3 Revenue</div>
                                            <div className={`text-2xl font-bold ${colors.accent}`}>{line.revenue}</div>
                                        </div>
                                        <div className="flex-1 bg-slate-950/50 rounded-xl p-4 border border-slate-700">
                                            <div className="text-sm text-slate-400 mb-1">Net Margin</div>
                                            <div className="text-2xl font-bold text-green-400">{line.margin}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center bg-gradient-to-r from-slate-800/30 to-slate-800/10 border border-slate-700 rounded-2xl p-8"
                >
                    <div className="text-sm text-cyan-400 font-semibold mb-2">TOTAL YEAR 3 REVENUE</div>
                    <div className="text-6xl font-bold text-white mb-2">$606,360</div>
                    <div className="text-slate-400">with 78% net profit margin = $470,753 net income</div>
                </motion.div>
            </div>
        </section>
    );
}