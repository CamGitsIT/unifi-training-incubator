import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowDown } from 'lucide-react';

export default function Slide1Hero({ onInteracted }) {
    const [acknowledged, setAcknowledged] = useState(false);

    const handleStart = () => {
        setAcknowledged(true);
        onInteracted();
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
                        <span className="text-cyan-400 text-sm font-medium">SBA 7(a) Loan Application + Community Investment</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Freedom from
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Subscriptions
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        We're going into business because there is a very real opportunity to do good — 
                        disrupting the greed that has left everyone entangled in subscriptions and unhappy about it. 
                        Every business line we enter is a win-win for everyone involved.
                    </p>

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