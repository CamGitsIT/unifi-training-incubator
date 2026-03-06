import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
            {/* Background with gradient overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/5956c075a_unifi-experiance-center.png')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-16 py-24">
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9 }}
                    className="max-w-xl"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-500/20 mb-8"
                    >
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-medium tracking-wide">System Architecture</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-5 leading-[1.05] tracking-tight"
                    >
                        We aren't just a service provider;
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-1">
                            we are the engine.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-slate-300 leading-snug"
                    >
                        A technological shift powered by three synergistic accelerators working in perfect harmony.
                    </motion.p>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-slate-600/60 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}