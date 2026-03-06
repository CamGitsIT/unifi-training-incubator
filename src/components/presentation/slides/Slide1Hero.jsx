import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const BUTTON_UNLOCK_SECONDS = 10;

// Animated floating particle
function Particle({ style }) {
    return (
        <motion.div
            className="absolute rounded-full bg-cyan-400/20 blur-sm"
            style={style}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
        />
    );
}

const particles = [
    { width: 8, height: 8, top: '15%', left: '10%' },
    { width: 12, height: 12, top: '25%', left: '80%' },
    { width: 6, height: 6, top: '60%', left: '5%' },
    { width: 10, height: 10, top: '70%', left: '90%' },
    { width: 8, height: 8, top: '40%', left: '95%' },
    { width: 14, height: 14, top: '80%', left: '20%' },
    { width: 6, height: 6, top: '10%', left: '55%' },
    { width: 10, height: 10, top: '50%', left: '50%' },
];

export default function Slide1Hero({ onInteracted, onNext }) {
    const [acknowledged, setAcknowledged] = useState(false);
    const [countdown, setCountdown] = useState(BUTTON_UNLOCK_SECONDS);

    const canClick = countdown <= 0;

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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">

            {/* === LAYERED BACKGROUND === */}
            {/* Deep radial glow - cyan top-right */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_10%,_rgba(34,211,238,0.12),_transparent)]" />
            {/* Purple bottom-left glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_90%,_rgba(168,85,247,0.10),_transparent)]" />
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />
            {/* Center vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(2,6,23,0.7)_100%)]" />

            {/* Floating glowing orbs */}
            <div className="absolute top-[8%] right-[12%] w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] left-[8%] w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
            <div className="absolute top-[40%] left-[35%] w-64 h-64 bg-cyan-400/3 rounded-full blur-3xl" />

            {/* Animated particles */}
            {particles.map((p, i) => (
                <Particle key={i} style={p} />
            ))}

            {/* Faint logo watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src="https://sba.overithelp.com/public/logo-dark.png" alt="" className="w-[520px] h-[520px] object-contain" />
            </div>

            {/* === CONTENT === */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-500/20 mb-8 shadow-lg shadow-cyan-500/10"
                    >
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium tracking-wide">Train the workforce. Own the infrastructure. Scale the future.</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.05] tracking-tight"
                    >
                        Everything Works Together.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mt-1">
                            Finally.
                        </span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl md:text-2xl font-semibold text-slate-300 mb-5 max-w-2xl mx-auto leading-snug"
                    >
                        Discover the UniFi ecosystem—where hardware, software, and security unite seamlessly. The more you adopt, the more you save and simplify.
                    </motion.p>

                    {/* Paragraph */}
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="text-base md:text-lg text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed"
                    >
                        We're raising <strong className="text-cyan-400">$300K</strong> to build a real-world{' '}
                        <strong className="text-white">UniFi Experience Center in Atlanta</strong>. See, touch, and experience how it transforms businesses—escaping{' '}
                        <strong className="text-white">endless subscriptions</strong> for{' '}
                        <strong className="text-white">owned, efficient systems</strong>.
                    </motion.p>

                    {/* Stat Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto"
                    >
                        {/* Card 1 */}
                        <div className="relative group bg-white/5 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 shadow-xl shadow-cyan-500/5 hover:border-cyan-400/40 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl" />
                            <div className="relative">
                                <div className="text-4xl font-extrabold text-cyan-400 mb-2 tabular-nums drop-shadow-[0_0_16px_rgba(34,211,238,0.5)]">$300K</div>
                                <div className="text-white text-sm font-semibold mb-1">Raise Target</div>
                                <div className="text-slate-400 text-xs leading-relaxed">Unlocks SBA-backed purchase</div>
                            </div>
                        </div>
                        {/* Card 2 */}
                        <div className="relative group bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl shadow-purple-500/5 hover:border-purple-400/40 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl" />
                            <div className="relative">
                                <div className="text-4xl font-extrabold text-purple-400 mb-2 tabular-nums drop-shadow-[0_0_16px_rgba(168,85,247,0.5)]">$850K</div>
                                <div className="text-white text-sm font-semibold mb-1">Facility Value</div>
                                <div className="text-slate-400 text-xs leading-relaxed">UniFi Experience Center + National Training Center</div>
                            </div>
                        </div>
                        {/* Card 3 */}
                        <div className="relative group bg-white/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-xl shadow-green-500/5 hover:border-green-400/40 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl" />
                            <div className="relative">
                                <div className="text-4xl font-extrabold text-green-400 mb-2 drop-shadow-[0_0_16px_rgba(74,222,128,0.5)]">8</div>
                                <div className="text-white text-sm font-semibold mb-1">Revenue Streams</div>
                                <div className="text-slate-400 text-xs leading-relaxed">Synergistic, repeatable, low-risk model</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
                        {!acknowledged ? (
                            <div className="flex flex-col items-center gap-3">
                                <motion.button
                                    onClick={handleStart}
                                    disabled={!canClick}
                                    whileHover={canClick ? { scale: 1.04, y: -2 } : {}}
                                    whileTap={canClick ? { scale: 0.97 } : {}}
                                    className={`
                                        relative font-bold text-lg px-12 py-5 rounded-2xl shadow-2xl transition-all flex items-center gap-3 mx-auto overflow-hidden
                                        ${canClick
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/40 cursor-pointer'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                        }
                                    `}
                                >
                                    {canClick && (
                                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
                                    )}
                                    <span className="relative">Join the Movement →</span>
                                </motion.button>

                                {!canClick && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-sm">
                                        Available in <span className="text-cyan-400 font-bold tabular-nums">{countdown}s</span>
                                    </motion.p>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 bg-green-500/10 backdrop-blur-xl border border-green-500/30 text-green-400 font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-green-500/10"
                            >
                                ✓ Acknowledged — continue
                            </motion.div>
                        )}
                    </motion.div>

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