import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, RefreshCw, XCircle } from 'lucide-react';
import { fadeUp, focusVariants, useFocusProgression } from '@/lib/motionConfig';

export default function Slide2Problem({ onInteracted }) {
    useEffect(() => { onInteracted(); }, []);

    const problems = [
        { icon: DollarSign, label: 'Recurring Fees', color: '#ef4444' },
        { icon: RefreshCw, label: 'Auto-Renewal Monopolies', color: '#f59e0b' },
        { icon: XCircle, label: 'Fragmented Systems', color: '#f97316' },
        { icon: AlertTriangle, label: 'Dated Technology', color: '#dc2626' },
    ];

    const { getFocusState, pause, resume } = useFocusProgression(problems.length, 2200);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
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
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 md:p-12 mb-8"
                >
                    <div className="prose prose-lg prose-invert max-w-none">
                        <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-6">
                            Multi-site businesses and property groups <strong className="text-white">pay forever</strong> for <strong className="text-white">fragmented systems</strong> that were never built to work together — across networking, surveillance, access, and communications.
                        </p>
                        
                        <div className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 space-y-2">
                            <p><strong className="text-white">Recurring fees</strong> drain millions.</p>
                            <p><strong className="text-white">Auto-renewals</strong> lock you in.</p>
                            <p><strong className="text-white">Fragmented tools</strong> create management chaos.</p>
                            <p><strong className="text-white">Dated tech</strong> holds everyone back.</p>
                        </div>

                        {/* Problem cards — stagger entry, then cycle focus (two-layer pattern) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {problems.map((problem, i) => {
                                const Icon = problem.icon;
                                return (
                                    // Outer: focus state overlay (opacity / scale / filter)
                                    <motion.div
                                        key={problem.label}
                                        initial="idle"
                                        animate={getFocusState(i)}
                                        variants={focusVariants}
                                        onHoverStart={() => pause(i)}
                                        onHoverEnd={resume}
                                    >
                                        {/* Inner: staggered entry animation */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className="bg-slate-800/40 border border-slate-700 rounded-xl p-6 text-center cursor-default"
                                        >
                                            <div
                                                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${problem.color}20` }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: problem.color }} />
                                            </div>
                                            <p className="text-slate-300 text-sm font-medium">{problem.label}</p>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                        
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                            UniFi replaces it with <strong className="text-cyan-400">one integrated, subscription-free stack</strong>.
                        </p>
                        
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
                            What's missing: the expertise to deploy, teach, and scale it.
                        </p>
                        
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                            <strong className="text-cyan-400">OverISP</strong> <strong className="text-white">is that layer</strong>.
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}