import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const businessLines = [
    {
        icon: Camera,
        title: 'Experience Center',
        subtitle: 'Zero-Inventory Retail Showroom',
        color: 'cyan',
        revenue: '$120K',
        description: 'Live UniFi Experience Center showroom driving zero-inventory hardware sales and demand for every other service line.',
        metrics: ['Live demo environment drives high-confidence purchases', 'Zero inventory risk — orders fulfilled direct to customer', 'Doubles as marketing engine for all other business lines']
    },
    {
        icon: Building2,
        title: 'Keyless Property Access (Retrofit)',
        subtitle: 'The DoorKing Killer',
        color: 'purple',
        revenue: '$216K',
        description: 'Retrofit DoorKing-style systems with subscription-free UniFi access control, delivering faster ROI and lower lifetime cost.',
        metrics: ['Average deal size: $15,000', '40% gross margin per project', '16-month ROI tipping point for clients']
    },
    {
        icon: GraduationCap,
        title: 'Ubiquiti / UniFi Training',
        subtitle: 'Authorized Ubiquiti Education',
        color: 'green',
        revenue: '$304K',
        description: 'National Training Center delivering Ubiquiti / UniFi certifications that create the workforce powering all eight revenue streams.',
        metrics: ['In-person: $1,995/seat, $1,575 net', 'Virtual training: Up to $5,000/seat', 'Training revenue alone covers debt 10x over']
    },
    {
        icon: Store,
        title: 'Multi-Location Retail Businesses',
        subtitle: 'Site Magic for Multi-Location Brands',
        color: 'amber',
        revenue: '$72K',
        description: 'UniFi networks for multi-location retail brands, reducing operational cost while standardizing secure, scalable infrastructure.',
        metrics: ['Eliminate $45K+/year in legacy VPN costs per client', 'Scalable to 270+ locations in Year 1', '15% uplift on MSP implementation']
    },
    {
        icon: Shield,
        title: 'Professional Monitoring',
        subtitle: 'Replacing ADT, Brinks & Legacy Systems',
        color: 'red',
        revenue: '$96K',
        description: 'UniFi-compatible monitoring replacing legacy alarm vendors, creating sticky recurring revenue with lower OpEx for clients.',
        metrics: ['Lower monthly cost than ADT/Brinks', 'Fully compatible with UniFi cameras and access', 'Recurring revenue stream with strong retention']
    },
    {
        icon: Camera,
        title: 'Tech Infrastructure Rentals',
        subtitle: 'Film & Production Deployments',
        color: 'indigo',
        revenue: '$48K',
        description: 'Reusable UniFi infrastructure packages rented to film productions, generating high-margin income without new CapEx each project.',
        metrics: ['High-margin rental income per production', 'Reusable gear — no per-project capital outlay', 'Builds relationships in ATL film industry']
    },
    {
        icon: Thermometer,
        title: 'Refrigeration & Temperature Monitoring',
        subtitle: 'FDA Compliance Automation',
        color: 'orange',
        revenue: '$60K',
        description: 'Automated UniFi sensor monitoring for refrigeration, eliminating manual logs and avoiding spoilage across food and pharma locations.',
        metrics: ['Eliminates manual logging labor', 'Real-time alerts prevent costly spoilage', 'Scalable across restaurant and pharmacy chains']
    },
    {
        icon: Wifi,
        title: 'Micro ISP',
        subtitle: 'Breaking the Monopoly on Internet',
        color: 'teal',
        revenue: '$144K',
        description: 'Micro ISP built on UniFi infrastructure, offering HOAs community-owned broadband that undercuts monopoly pricing.',
        metrics: ['Predictable recurring revenue', 'Serves HOAs underserved by Comcast/AT&T', 'UniFi infrastructure enables rapid deployment']
    }
];

const colorMap = {
    cyan:   { bg: 'from-cyan-950/30',   border: 'border-cyan-900/50',   icon: 'bg-cyan-500/10',   iconColor: 'text-cyan-400',   accent: 'text-cyan-400' },
    purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400' },
    green:  { bg: 'from-green-950/30',  border: 'border-green-900/50',  icon: 'bg-green-500/10',  iconColor: 'text-green-400',  accent: 'text-green-400' },
    amber:  { bg: 'from-amber-950/30',  border: 'border-amber-900/50',  icon: 'bg-amber-500/10',  iconColor: 'text-amber-400',  accent: 'text-amber-400' },
    red:    { bg: 'from-red-950/30',    border: 'border-red-900/50',    icon: 'bg-red-500/10',    iconColor: 'text-red-400',    accent: 'text-red-400' },
    indigo: { bg: 'from-indigo-950/30', border: 'border-indigo-900/50', icon: 'bg-indigo-500/10', iconColor: 'text-indigo-400', accent: 'text-indigo-400' },
    orange: { bg: 'from-orange-950/30', border: 'border-orange-900/50', icon: 'bg-orange-500/10', iconColor: 'text-orange-400', accent: 'text-orange-400' },
    teal:   { bg: 'from-teal-950/30',   border: 'border-teal-900/50',   icon: 'bg-teal-500/10',   iconColor: 'text-teal-400',   accent: 'text-teal-400' },
};

const TOTAL_REVENUE = '$1,060,000';
const NET_MARGIN = '~$740,000';

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
    const [expanded, setExpanded] = useState(new Set());
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        if (timerDone) {
            if (onUnlockMessage) onUnlockMessage(null);
            return;
        }
        if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
    }, [secondsLeft, timerDone]);

    useEffect(() => {
        if (timerDone) return;
        const interval = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    setTimerDone(true);
                    onInteracted();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerDone]);

    const handleExpand = (i) => {
        const next = new Set(expanded);
        if (next.has(i)) {
            next.delete(i);
        } else {
            next.add(i);
        }
        setExpanded(next);
    };

    const allExpanded = expanded.size === businessLines.length;

    useEffect(() => {
        if (allExpanded && !timerDone) {
            setTimerDone(true);
            onInteracted();
            if (onUnlockMessage) onUnlockMessage(null);
        }
    }, [allExpanded]);

    return (
        <div className="min-h-screen bg-slate-900 py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">One Mission, One Roof</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Eight UniFi-powered business lines under one roof—aligned to the UniFi Experience Center and National Training Center.
                    </p>
                    <p className="text-sm text-cyan-400 mt-4 animate-pulse">👇 Click any card to expand or collapse details</p>
                </motion.div>

                <div className="space-y-3">
                    {businessLines.map((line, i) => {
                        const colors = colorMap[line.color];
                        const Icon = line.icon;
                        const isOpen = expanded.has(i);
                        return (
                            <motion.div
                                key={line.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                onClick={() => handleExpand(i)}
                                className={`bg-gradient-to-br ${colors.bg} to-slate-900/30 border ${colors.border} rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.005] ${isOpen ? 'ring-1 ring-offset-1 ring-offset-slate-900' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        {isOpen
                                            ? <CheckCircle className="w-5 h-5 text-green-400" />
                                            : <Icon className={`w-5 h-5 ${colors.iconColor}`} />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white leading-tight">{line.title}</h3>
                                        <p className={`text-xs ${colors.accent}`}>{line.subtitle}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className={`text-xl font-bold ${colors.accent}`}>{line.revenue}</div>
                                        <div className="text-xs text-slate-400">Yr 3 Revenue</div>
                                    </div>
                                </div>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 pt-4 border-t border-slate-700/50"
                                    >
                                        <p className="text-slate-300 mb-3 text-sm">{line.description}</p>
                                        <div className="space-y-1.5">
                                            {line.metrics.map((m, j) => (
                                                <div key={j} className="flex items-center gap-2 text-sm text-slate-400">
                                                    <ArrowRight className={`w-4 h-4 flex-shrink-0 ${colors.iconColor}`} />
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
                    <div className="text-sm text-cyan-400 font-semibold mb-1">COMBINED YEAR 3 REVENUE</div>
                    <div className="text-5xl font-bold text-white mb-1">{TOTAL_REVENUE}</div>
                    <div className="text-slate-400 text-sm">Estimated net income: {NET_MARGIN} across all 8 business lines</div>
                </div>

                {allExpanded && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ All 8 lines explored — click Next to continue
                    </motion.p>
                )}
            </div>
        </div>
    );
}