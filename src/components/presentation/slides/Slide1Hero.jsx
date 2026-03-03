import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowDown } from 'lucide-react';

export default function Slide1Hero({ onInteracted, onNext }) {
    const [acknowledged, setAcknowledged] = useState(false);

    const handleStart = () => {
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
                        <span className="text-cyan-400 text-sm font-medium">UniFi Experience Center &amp; Training Hub</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        The Mission: A
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Subscription-Free Future
                        </span>
                        of Business and Residential Infrastructure
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Launch a live-work <strong className="text-white">UniFi Experience Center and UniFi Training Hub</strong> that proves a modern, owned technology stack can run organizations <strong className="text-white">more securely and efficiently—without subscriptions in perpetuity</strong>.
                    </p>

                    <div className="text-left max-w-3xl mx-auto mb-10 space-y-4">
                        {[
                            { label: 'The global disruption', text: 'Businesses are moving to superior, integrated infrastructure—Networking, Security, Access, Cameras, Storage, and Multi-Site management—that they own and control, breaking the "rent forever" subscription model for core operations.' },
                            { label: 'The proof & ROI', text: 'Across our first 8 target industries, adoption delivers measurable ROI through lower recurring costs, fewer vendors, simpler administration, and stronger security—and the value is easiest to understand when it\'s seen live in a working environment.' },
                            { label: 'Why us', text: 'As certified experts and live and proven pilot market validation, we\'ll introduce just eight initial revenue streams showcasing the capabilities of this newly emerging offering.' },
                        ].map((b, i) => (
                            <div key={i} className="flex items-start gap-4 bg-slate-800/40 border border-slate-700 rounded-xl px-5 py-4">
                                <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    <strong className="text-white">{b.label}:</strong> {b.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">77%</div>
                            <div className="text-slate-300 text-sm">TCO Savings vs. Legacy Systems</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-purple-400 mb-2">16 mo</div>
                            <div className="text-slate-300 text-sm">Investment Tipping Point</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-green-400 mb-2">$6.7B</div>
                            <div className="text-slate-300 text-sm">Total Addressable Market</div>
                        </div>
                    </div>

                    {!acknowledged ? (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            onClick={handleStart}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-cyan-500/30 transition-all hover:-translate-y-1 flex items-center gap-3 mx-auto"
                        >
                            Start Here
                            <ArrowDown className="w-5 h-5" />
                        </motion.button>
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