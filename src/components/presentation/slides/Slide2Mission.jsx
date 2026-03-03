import React, { useState } from 'react';
import { Heart, Users, GraduationCap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const pillars = [
    {
        icon: Heart,
        color: 'cyan',
        title: 'Rescue Communities',
        desc: 'Free HOAs and property managers from the burden of $3,000–$15,000 annual subscription fees. Give them permanent solutions, not perpetual payments.'
    },
    {
        icon: GraduationCap,
        color: 'purple',
        title: 'Train the Next Generation',
        desc: 'Certify technicians in modern networking and security, creating skilled professionals who can work as independent contractors with dignity and fair pay.'
    },
    {
        icon: Users,
        color: 'green',
        title: 'Build Sustainable Value',
        desc: 'Every dollar we make comes from solving real problems for real people. High margins, low overhead, maximum impact.'
    }
];

const colorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:border-cyan-500/70',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:border-purple-500/70',
    green: 'bg-green-500/10 text-green-400 border-green-500/30 hover:border-green-500/70'
};

export default function Slide2Mission({ onInteracted }) {
    const [clicked, setClicked] = useState(new Set());

    const handleClick = (i) => {
        const next = new Set(clicked);
        next.add(i);
        setClicked(next);
        if (next.size === pillars.length) onInteracted();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900/50 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">More Than a Business</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        In a world that's increasingly hard, where people feel trapped by endless subscriptions and rising costs, 
                        we're creating something different: a path to freedom through ownership and education.
                    </p>
                    <p className="text-sm text-cyan-400 mt-4 animate-pulse">👇 Click each pillar to continue</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((p, i) => {
                        const Icon = p.icon;
                        const done = clicked.has(i);
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                onClick={() => handleClick(i)}
                                className={`cursor-pointer border rounded-2xl p-8 transition-all duration-300 ${colorMap[p.color]} ${done ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-current/10">
                                    {done
                                        ? <CheckCircle className="w-6 h-6 text-green-400" />
                                        : <Icon className="w-6 h-6" />
                                    }
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{p.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">{p.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {clicked.size === pillars.length && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-8">
                        ✓ All pillars explored — click Next below
                    </motion.p>
                )}
            </div>
        </div>
    );
}