import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, BookOpen, Zap, ArrowRight } from 'lucide-react';

const engines = [
    {
        title: 'The UniFi Stack',
        subtitle: 'The Foundation',
        icon: HardDrive,
        description: 'Replacing high-cost OpEx subscriptions with owned, license-free hardware.',
        label: 'Product',
        color: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/30',
        bgColor: 'bg-blue-500/5',
    },
    {
        title: 'National Certified Training',
        subtitle: 'The Fuel',
        icon: BookOpen,
        description: "We don't just sell the tech; we train the nation's installers in our on-site studio.",
        label: 'Scale',
        color: 'from-purple-500 to-pink-500',
        borderColor: 'border-purple-500/30',
        bgColor: 'bg-purple-500/5',
    },
    {
        title: 'AI-Driven Lead Gen',
        subtitle: 'The Ignition',
        icon: Zap,
        description: 'Our AI identifies bloated subscription models in large orgs and matches them with certified graduates.',
        label: 'Growth',
        color: 'from-emerald-500 to-cyan-500',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/5',
    },
];

export default function ThreeCoreEngine() {
    return (
        <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Three-Core Engine</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Each accelerator feeds the next, creating a self-sustaining ecosystem.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {engines.map((engine, idx) => {
                        const Icon = engine.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                viewport={{ once: true }}
                                className={`relative ${engine.bgColor} border ${engine.borderColor} rounded-2xl p-8 hover:border-opacity-100 transition-all group`}
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${engine.color} mb-6`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Label Badge */}
                                <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/80 mb-4">
                                    {engine.label}
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-white mb-1">{engine.title}</h3>
                                <p className={`text-sm font-semibold bg-gradient-to-r ${engine.color} bg-clip-text text-transparent mb-4`}>
                                    {engine.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-slate-300 text-base leading-relaxed">{engine.description}</p>

                                {/* Arrow indicator for next item */}
                                {idx < engines.length - 1 && (
                                    <motion.div
                                        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10"
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-6 h-6 text-cyan-400/60" />
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}