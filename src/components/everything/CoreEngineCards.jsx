import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Lightbulb, ArrowRight } from 'lucide-react';

export default function CoreEngineCards() {
    const engines = [
        {
            title: 'The Foundation',
            subtitle: 'UniFi Stack',
            description: 'Replacing high-cost OpEx subscriptions with owned, license-free hardware.',
            icon: Zap,
            color: 'from-cyan-500 to-cyan-400',
            label: 'Product',
        },
        {
            title: 'The Fuel',
            subtitle: 'National Certified Training',
            description: "We don't just sell the tech; we train the nation's installers in our on-site studio.",
            icon: Users,
            color: 'from-blue-500 to-blue-400',
            label: 'Scale',
        },
        {
            title: 'The Ignition',
            subtitle: 'AI-Driven Lead Gen',
            description: 'Our AI identifies bloated subscription models in large orgs and matches them with our certified graduates.',
            icon: Lightbulb,
            color: 'from-purple-500 to-purple-400',
            label: 'Growth',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="bg-slate-950 py-24">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-cyan-400 text-sm font-semibold tracking-widest mb-4">THE THREE-CORE ENGINE</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        How Everything Works Together
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Three synergistic accelerators that feed each other, creating a self-sustaining growth engine.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-6 mb-8"
                >
                    {engines.map((engine, idx) => {
                        const Icon = engine.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                <div className="relative bg-gradient-to-br from-slate-800/30 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/80 transition-all duration-300">
                                    {/* Label */}
                                    <div className={`inline-block bg-gradient-to-r ${engine.color} text-slate-950 text-xs font-bold px-3 py-1 rounded-full mb-4`}>
                                        {engine.label}
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex p-3 bg-gradient-to-br ${engine.color} text-slate-950 rounded-lg mb-6`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-sm text-slate-400 font-medium mb-1">{engine.title}</h3>
                                    <h4 className="text-2xl font-bold text-white mb-4">{engine.subtitle}</h4>
                                    <p className="text-slate-400 leading-relaxed">
                                        {engine.description}
                                    </p>

                                    {/* Arrow (except last card) */}
                                    {idx < engines.length - 1 && (
                                        <div className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2">
                                            <ArrowRight className="w-6 h-6 text-slate-600" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Connection text for mobile */}
                <div className="md:hidden flex justify-center">
                    <p className="text-slate-500 text-sm">Each accelerates the next →</p>
                </div>
            </div>
        </div>
    );
}