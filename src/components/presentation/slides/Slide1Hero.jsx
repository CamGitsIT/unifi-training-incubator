import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Shared copy ───────────────────────────────────────────────
const COPY = {
    kicker: 'UniFi Experience Center and Training Hub',
    headlinePart1: 'Everything works',
    headlinePart2: 'better together.',
    subline: 'Teach. Simplify. Save. Enjoy. Repeat.',
    support: 'We combine UniFi infrastructure, certified training, and AI-driven lead generation into one growth engine.',
    cta: 'Learn How →',
};

const BUTTON_UNLOCK_SECONDS = 10;

// ─── Variation A: "Deep Space" — dark void + cyan grid + hard glow ───
function VariationA({ onCTA }) {
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center" style={{ background: '#020B18' }}>

            {/* Grid overlay */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
            }} />

            {/* Hard cyan glow — top right corner */}
            <div className="absolute -top-32 right-0 w-[700px] h-[700px] rounded-full" style={{
                background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(14,165,233,0.06) 40%, transparent 70%)',
            }} />

            {/* Subtle bottom left glow */}
            <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full" style={{
                background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            }} />

            {/* Horizontal light streak */}
            <div className="absolute top-[38%] left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.25) 30%, rgba(34,211,238,0.6) 50%, rgba(34,211,238,0.25) 70%, transparent 100%)',
            }} />

            {/* Content */}
            <div className="relative z-10 px-16 md:px-24 max-w-5xl">

                {/* Kicker */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <span className="block w-8 h-px bg-cyan-400" />
                    <span className="text-cyan-400 text-xs font-semibold tracking-[0.25em] uppercase">{COPY.kicker}</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black leading-[1.0] tracking-tight mb-8"
                    style={{ fontSize: 'clamp(3.5rem, 8vw, 7.5rem)' }}
                >
                    <span className="text-white block">{COPY.headlinePart1}</span>
                    <span className="block" style={{
                        background: 'linear-gradient(135deg, #22d3ee 0%, #38bdf8 40%, #818cf8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 40px rgba(34,211,238,0.5))',
                    }}>
                        {COPY.headlinePart2}
                    </span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.7 }}
                    className="text-2xl md:text-3xl font-bold text-slate-200 mb-5 tracking-tight"
                >
                    {COPY.subline}
                </motion.p>

                {/* Support */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="text-slate-400 text-base md:text-lg max-w-xl mb-12 leading-relaxed"
                >
                    {COPY.support}
                </motion.p>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.5 }}
                    onClick={onCTA}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative px-10 py-4 rounded-full text-white font-bold text-lg overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #0891b2, #4f46e5)',
                        boxShadow: '0 0 40px rgba(34,211,238,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                >
                    <span className="relative z-10">{COPY.cta}</span>
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }} />
                </motion.button>
            </div>

            {/* Right-side vertical accent line */}
            <div className="absolute right-16 top-1/4 bottom-1/4 w-px" style={{
                background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.4), transparent)',
            }} />
        </div>
    );
}

// ─── Variation B: "Glass Architecture" — frosted panels + photo bg ───
function VariationB({ onCTA }) {
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center"
            style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b2a 60%, #071020 100%)' }}
        >
            {/* Background photo — architectural, blurred */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/1234a93d7_experience-center_backdrop.png')`,
                    opacity: 0.18,
                    filter: 'blur(2px) saturate(0.6)',
                }}
            />

            {/* Left gradient overlay for text contrast */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(100deg, rgba(4,9,20,0.98) 0%, rgba(4,9,20,0.92) 45%, rgba(4,9,20,0.4) 75%, transparent 100%)',
            }} />

            {/* Frosted glass panel — decorative right side */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block" style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.03) 0%, rgba(99,102,241,0.06) 100%)',
                backdropFilter: 'blur(1px)',
                borderLeft: '1px solid rgba(34,211,238,0.08)',
            }} />

            {/* Diagonal accent stripe */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute" style={{
                    top: '-20%', left: '42%', width: '1px', height: '160%',
                    background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.2), rgba(99,102,241,0.15), transparent)',
                    transform: 'rotate(12deg)',
                }} />
            </div>

            {/* Glow orb — upper right */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px]" style={{
                background: 'radial-gradient(ellipse at top right, rgba(34,211,238,0.12) 0%, transparent 60%)',
            }} />

            {/* Content */}
            <div className="relative z-10 px-16 md:px-24 max-w-[54%]">

                {/* Kicker */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full"
                    style={{
                        background: 'rgba(34,211,238,0.07)',
                        border: '1px solid rgba(34,211,238,0.2)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 text-xs font-semibold tracking-[0.2em] uppercase">{COPY.kicker}</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="font-black leading-[0.95] tracking-tight mb-8"
                    style={{ fontSize: 'clamp(3rem, 7.5vw, 7rem)' }}
                >
                    <span className="block text-white">{COPY.headlinePart1}</span>
                    <span className="block" style={{
                        background: 'linear-gradient(90deg, #67e8f9 0%, #22d3ee 35%, #a78bfa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: 'none',
                        filter: 'drop-shadow(0 0 60px rgba(34,211,238,0.4))',
                    }}>
                        {COPY.headlinePart2}
                    </span>
                </motion.h1>

                {/* Subline */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="mb-5"
                >
                    <p className="text-2xl md:text-[1.75rem] font-bold text-white/90 tracking-tight leading-tight">
                        {COPY.subline}
                    </p>
                </motion.div>

                {/* Support */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="text-slate-400 text-base max-w-lg mb-12 leading-relaxed"
                >
                    {COPY.support}
                </motion.p>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onClick={onCTA}
                    whileHover={{ scale: 1.04, x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="group flex items-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg"
                    style={{
                        background: 'linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(99,102,241,0.15) 100%)',
                        border: '1px solid rgba(34,211,238,0.35)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 0 30px rgba(34,211,238,0.15)',
                    }}
                >
                    {COPY.cta}
                </motion.button>
            </div>
        </div>
    );
}

// ─── Variation C: "Minimal Typographic" — pure dark, oversized type, color on type only ───
function VariationC({ onCTA }) {
    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center"
            style={{ background: '#03070F' }}
        >
            {/* Massive ambient glow top-center */}
            <div className="absolute inset-0 pointer-events-none">
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '900px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%)',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-15%',
                    right: '-5%',
                    width: '700px',
                    height: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 65%)',
                }} />
            </div>

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '128px 128px',
            }} />

            {/* Thin top rule */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5) 30%, rgba(34,211,238,0.5) 70%, transparent)',
            }} />
            {/* Thin bottom rule */}
            <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4) 30%, rgba(99,102,241,0.4) 70%, transparent)',
            }} />

            {/* Left edge accent */}
            <div className="absolute left-10 top-1/4 bottom-1/4 w-px" style={{
                background: 'linear-gradient(to bottom, transparent, rgba(34,211,238,0.5), transparent)',
            }} />

            {/* Content */}
            <div className="relative z-10 px-20 md:px-28">

                {/* Kicker */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.8 }}
                    className="text-xs font-bold tracking-[0.35em] uppercase text-slate-500 mb-8"
                >
                    {COPY.kicker}
                </motion.p>

                {/* Headline — oversized, spans most of viewport width */}
                <div className="overflow-hidden mb-3">
                    <motion.h1
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="font-black text-white leading-[0.9] tracking-tight"
                        style={{ fontSize: 'clamp(4rem, 9.5vw, 8.5rem)' }}
                    >
                        {COPY.headlinePart1}
                    </motion.h1>
                </div>
                <div className="overflow-hidden mb-10">
                    <motion.h1
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="font-black leading-[0.9] tracking-tight"
                        style={{
                            fontSize: 'clamp(4rem, 9.5vw, 8.5rem)',
                            background: 'linear-gradient(90deg, #22d3ee 0%, #67e8f9 45%, #c084fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 80px rgba(34,211,238,0.45))',
                        }}
                    >
                        {COPY.headlinePart2}
                    </motion.h1>
                </div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="origin-left mb-8 h-px w-64"
                    style={{ background: 'linear-gradient(90deg, rgba(34,211,238,0.7), transparent)' }}
                />

                {/* Subline + support in a two-column inline block */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="flex flex-col md:flex-row items-start gap-6 mb-12 max-w-3xl"
                >
                    <p className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">{COPY.subline}</p>
                    <div className="hidden md:block w-px h-8 self-center" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{COPY.support}</p>
                </motion.div>

                {/* CTA */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    onClick={onCTA}
                    whileHover={{ letterSpacing: '0.08em', color: '#22d3ee' }}
                    whileTap={{ scale: 0.97 }}
                    className="text-white font-bold text-lg tracking-wide flex items-center gap-3 transition-all duration-300"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                    <span className="w-8 h-px bg-cyan-400 inline-block" />
                    {COPY.cta}
                </motion.button>
            </div>
        </div>
    );
}

// ─── Wrapper + variation selector ─────────────────────────────
const VARIATIONS = [
    { id: 'A', label: 'Deep Space',      Component: VariationA },
    { id: 'B', label: 'Glass Arch',      Component: VariationB },
    { id: 'C', label: 'Bold Type',       Component: VariationC },
];

export default function Slide1Hero({ onInteracted, onNext }) {
    const [variant, setVariant] = useState('A');
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

    const { Component } = VARIATIONS.find(v => v.id === variant);

    return (
        <div className="relative">
            {/* Variation Picker — floating top right */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-1 rounded-full px-1.5 py-1.5"
                style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {VARIATIONS.map(v => (
                    <button
                        key={v.id}
                        onClick={() => setVariant(v.id)}
                        className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200"
                        style={variant === v.id
                            ? { background: 'rgba(34,211,238,0.2)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.4)' }
                            : { color: 'rgba(148,163,184,0.8)', border: '1px solid transparent' }
                        }
                    >
                        {v.label}
                    </button>
                ))}
            </div>

            {/* Slide */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={variant}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <Component onCTA={handleStart} />
                </motion.div>
            </AnimatePresence>

            {/* Countdown / Acknowledged overlay (bottom-left) */}
            <div className="absolute bottom-8 left-8 z-50">
                {acknowledged ? (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-green-400 text-sm font-semibold"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400" />
                        Acknowledged — continue
                    </motion.div>
                ) : !canClick ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-500 text-xs"
                    >
                        Button available in <span className="text-cyan-400 font-bold tabular-nums">{countdown}s</span>
                    </motion.p>
                ) : null}
            </div>
        </div>
    );
}