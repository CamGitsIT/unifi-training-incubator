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
        <div className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">

            {/* === BACKGROUND PHOTO === */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/1234a93d7_experience-center_backdrop.png')` }}
            />
            {/* Dark left-side gradient so text is legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/10" />
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />

            {/* Animated particles */}
            {particles.map((p, i) => (
                <Particle key={i} style={p} />
            ))}

            {/* === CONTENT — left aligned === */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-16 py-24">
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9 }}
                    className="max-w-xl"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-500/20 mb-8"
                    >
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-medium tracking-wide">UniFi Experience Center and Training Hub</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mb-5"
                    >
                        <p className="text-cyan-400 text-lg md:text-xl font-semibold tracking-wide mb-2">Finally.</p>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                            Everything works
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                better together.
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl font-semibold text-slate-300 mb-4 leading-snug"
                    >
                        Teach. Simplify. Save. {' '}
                        <strong className="text-white">Enjoy.</strong> Repeat.
                    </motion.p>

                    {/* Short paragraph */}
 //#                   <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65 }}
                        className="text-slate-400 text-base mb-10 leading-relaxed"
                    >
                        Welcome to the future of IT infrastructure and software. We’ve <b>combined</b> the power of the Ubiquiti's newly released, market disrupting subscription-free tech stack <b>with</b> our first ever UniFi Experience Center for real-estate developers, professional property managers, and multi-location business operators. In parallel, we create a network of experts with our national Certification Training Center. Advanced AI-driven lead generation creates a truly synergistic business model. Here, no division operates in a silo. Every vertical feeds the others, driving seamless growth for us and delivering unmatched, frictionless value for our clients.
                        <br>Welcome to the future of IT infrastructure and software. We’ve <b>fused</b> Ubiquiti’s newly released, subscription-free, market-disrupting technology stack <b>with</b> our first-ever UniFi Experience Center—purpose-built for real estate developers, professional property managers, and multi-location operators who are tired of overpaying for fragmented systems.<br>                   At the same time, we’re building a national bench of experts through our Certification Training Center, while advanced AI-driven lead generation helps keep the entire machine moving.<br> This is a deliberately connected ecosystem. The showroom supports the sales process. The training center builds authority and talent. The technology stack solves real operational problems. Each part feeds the others. The result is a scalable, efficient model for us—and a smoother, smarter, more frictionless experience for our clients.
                    </motion.p>
                    {/* CTA */}
                    {!acknowledged ? (
                        <div className="flex flex-col items-start gap-3">
                            <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                onClick={handleStart}
                                disabled={!canClick}
                                whileHover={canClick ? { scale: 1.03, y: -2 } : {}}
                                whileTap={canClick ? { scale: 0.97 } : {}}
                                className={`
                                    font-bold text-base px-8 py-4 rounded-full shadow-2xl transition-all flex items-center gap-3
                                    ${canClick
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/40 cursor-pointer'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                    }
                                `}
                            >
                                Learn How →
                            </motion.button>

                            {!canClick ? (
                                <p className="text-slate-500 text-sm">
                                    Available in <span className="text-cyan-400 font-bold tabular-nums">{countdown}s</span>
                                </p>
                            ) : (
                                <p className="text-slate-500 text-xs flex items-center gap-1.5">
                                    <span className="w-3.5 h-3.5 rounded-full border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-[9px]">↺</span>
                                    Step into a smarter way to own your IT infrastructure *and* your data.
                                </p>
                            )}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-3 bg-green-500/10 backdrop-blur-xl border border-green-500/30 text-green-400 font-semibold px-7 py-3.5 rounded-full"
                        >
                            ✓ Acknowledged — continue
                        </motion.div>
                    )}

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