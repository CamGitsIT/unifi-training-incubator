import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, RefreshCw, XCircle } from 'lucide-react';

const UNLOCK_SECONDS = 8;

export default function Slide2Problem({ onInteracted }) {
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(UNLOCK_SECONDS);

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
    }, [timerDone, onInteracted]);

    const problems = [
        { icon: DollarSign, label: 'Recurring Fees', color: '#ef4444' },
        { icon: RefreshCw, label: 'Auto-Renewal Traps', color: '#f59e0b' },
        { icon: XCircle, label: 'Fragmented Systems', color: '#f97316' },
        { icon: AlertTriangle, label: 'Support Failures', color: '#dc2626' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 border border-slate-500/20 mb-6">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400 text-sm font-medium">The Problem</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                        The Problem
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 md:p-12 mb-8"
                >
                    <div className="prose prose-lg prose-invert max-w-none">
                        <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-6">
                            Mid-market businesses and property operators are <strong className="text-white">bleeding thousands of dollars every month</strong> — locked into <strong className="text-white">recurring, contractual software subscriptions</strong> built on aging, fragmented technology that was never designed to work together.
                        </p>
                        
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                            <strong className="text-white">Separate vendors</strong> for networking, surveillance, access control, and communications. <strong className="text-white">Contracts that auto-renew.</strong> Support that doesn't show up. And a <strong className="text-white">total cost of ownership that compounds every year</strong> with no end in sight.
                        </p>
                        
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                            <strong className="text-cyan-400">Ubiquiti and UniFi</strong> solved this — through both hardware and software — by building a <strong className="text-white">unified, subscription-free technology stack</strong> that replaces all of it. The problem is <strong className="text-white">there are very few experts</strong> who know how to deploy it, teach it, and scale it.
                        </p>
                        
                        <p className="text-cyan-400 text-lg md:text-xl font-semibold leading-relaxed">
                            That's exactly what OverISP is.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {problems.map((problem, i) => {
                        const Icon = problem.icon;
                        return (
                            <motion.div
                                key={problem.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 text-center hover:border-slate-600 transition-all"
                            >
                                <div
                                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${problem.color}20` }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: problem.color }} />
                                </div>
                                <p className="text-slate-300 text-sm font-medium">{problem.label}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {timerDone && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-green-400 font-semibold mt-8"
                    >
                        ✓ Click Next to continue
                    </motion.p>
                )}
                {!timerDone && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-500 text-sm mt-8"
                    >
                        Unlocking in {secondsLeft}s
                    </motion.p>
                )}
            </div>
        </div>
    );
}