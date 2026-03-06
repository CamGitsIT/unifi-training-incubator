import React, { useState } from 'react';
import { AlertCircle, DollarSign, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Slide3Problem({ onInteracted }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm font-medium">The Problem</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Subscription Prison</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Properties locked into never-ending OpEx for basic infrastructure—legacy analog lines or modern SaaS—creating perpetual budget liability with no equity.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-red-950/30 to-slate-900/30 border border-red-900/50 rounded-2xl p-8">
                        <Lock className="w-10 h-10 text-red-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">Legacy DoorKing Systems</h3>
                        <div className="space-y-3 text-slate-300">
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-red-400 rounded-full" /><span>$80/month per callbox for analog phone lines</span></div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-red-400 rounded-full" /><span>Some condos pay $1,900/month for multiple lines</span></div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-red-400 rounded-full" /><span>Copper infrastructure being phased out nationwide</span></div>
                            <div className="mt-6 pt-6 border-t border-red-900/50">
                                <div className="text-3xl font-bold text-red-400">$18,018</div>
                                <div className="text-sm text-slate-400">3-Year Total Cost of Ownership</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-orange-950/30 to-slate-900/30 border border-orange-900/50 rounded-2xl p-8">
                        <DollarSign className="w-10 h-10 text-orange-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">Modern "Solutions" (ButterflyMX)</h3>
                        <div className="space-y-3 text-slate-300">
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-400 rounded-full" /><span>$3,000–$15,000/year in subscription fees</span></div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-400 rounded-full" /><span>Perpetual liability on property budgets</span></div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-400 rounded-full" /><span>Fees often escalate year after year</span></div>
                            <div className="mt-6 pt-6 border-t border-orange-900/50">
                                <div className="text-3xl font-bold text-orange-400">Forever</div>
                                <div className="text-sm text-slate-400">Payment Obligation</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {!revealed ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => { setRevealed(true); onInteracted(); }}
                        className="w-full border border-slate-600 hover:border-cyan-500/50 bg-slate-800/30 hover:bg-slate-800/60 rounded-2xl p-6 text-slate-400 hover:text-slate-200 transition-all cursor-pointer text-center"
                    >
                        <p className="text-lg italic font-light">👆 Click to hear from a real HOA board member</p>
                    </motion.button>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <p className="text-2xl text-slate-200 font-light italic">
                            "I need to look my neighbors in the eye and tell them this investment will actually lower their monthly dues."
                        </p>
                        <p className="text-slate-400 mt-2">— HOA Board Treasurer</p>
                        <p className="text-green-400 font-semibold mt-4">✓ Click Next below to see the solution</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}