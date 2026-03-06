import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowDown } from 'lucide-react';

const BUTTON_UNLOCK_SECONDS = 10;

export default function Slide1Hero({ onInteracted, onNext }) {
    const [acknowledged, setAcknowledged] = useState(false);
    const [countdown, setCountdown] = useState(BUTTON_UNLOCK_SECONDS);

    const canClick = countdown <= 0;

    // Button unlock countdown (10s)
    useEffect(() => {
        if (acknowledged || countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown, acknowledged]);

    const handleStart = () => {
        if (!canClick) return;
        setAcknowledged(true);
        onInteracted();
        if (onNext) onNext();
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-purple-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <img src="https://sba.overithelp.com/public/logo-dark.png" alt="OverIT" className="w-96 h-96 object-contain" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium">The first-of-its-kind UniFi Experience Center — Atlanta, GA.</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Everything works together.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Finally.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl font-semibold text-slate-300 mb-5 max-w-2xl mx-auto leading-snug">
                        Own your IT infrastructure. End endless subscriptions. Simplify everything.
                    </p>

                    <p className="text-base md:text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                        We're raising <strong className="text-cyan-400">$300K</strong> to launch Atlanta's <strong className="text-white">first-ever UniFi Experience Center and Training Hub</strong>—proving smooth, integrated systems that <strong className="text-white">shift OpEx recurring fees to CapEx one-time installs.</strong>.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">$300K</div>
                            <div className="text-white text-sm font-semibold mb-1">Raise</div>
                            <div className="text-slate-400 text-xs">Unlocks SBA-backed purchase</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-purple-400 mb-2">$850K</div>
                            <div className="text-white text-sm font-semibold mb-1">Facility</div>
                            <div className="text-slate-400 text-xs">UniFi Experience Center + National Training Center</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-green-400 mb-2">8</div>
                            <div className="text-white text-sm font-semibold mb-1">Initial Revenue Streams</div>
                            <div className="text-slate-400 text-xs">Diversified, repeatable model and clear ROI</div>
                        </div>
                    </div>

                    {!acknowledged ? (
                        <div className="flex flex-col items-center gap-3">
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                onClick={handleStart}
                                disabled={!canClick}
                                className={`
                                    font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl transition-all flex items-center gap-3 mx-auto
                                    ${canClick
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-cyan-500/30 hover:-translate-y-1 cursor-pointer'
                                        : 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                                    }
                                `}
                            >
                                Join the Raise →
                            </motion.button>

                            {!canClick && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-400 text-sm"
                                >
                                    Available in <span className="text-cyan-400 font-bold tabular-nums">{countdown}s</span>
                                </motion.p>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold px-8 py-4 rounded-2xl"
                        >
                            ✓ Ready — click Next below to continue
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-24 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}