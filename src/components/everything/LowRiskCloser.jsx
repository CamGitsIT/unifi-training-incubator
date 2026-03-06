import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Users, Zap } from 'lucide-react';

const benefits = [
    {
        icon: Shield,
        title: 'Diversified Revenue',
        description: 'Education, Technology, and AI—three synergistic lines eliminate dependency on any single product.',
    },
    {
        icon: TrendingUp,
        title: 'Defensive Economics',
        description: 'Training revenue funds tech deployment. Tech deployments create demand for training. AI accelerates both.',
    },
    {
        icon: Users,
        title: 'Community Stabilization',
        description: 'Creates local, skilled jobs and reduces dependency on volatile subscription markets.',
    },
    {
        icon: Zap,
        title: 'Self-Sustaining Flywheel',
        description: 'Revenue reinvests into training, which scales deployments, which accelerates AI lead generation.',
    },
];

export default function LowRiskCloser() {
    return (
        <section className="py-24 px-6 bg-slate-950">
            <div className="max-w-6xl mx-auto">
                {/* Main Container */}
                <div className="relative">
                    {/* Gradient Background Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-emerald-500/30 rounded-3xl p-12 md:p-16 overflow-hidden"
                    >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mb-12"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-medium tracking-wide">SBA/Investor Thesis</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Low-Risk, High-Impact Infrastructure
                            </h2>

                            <p className="text-lg text-slate-300 leading-relaxed">
                                We aren't betting on one business line. By diversifying into Education + Technology + AI, OverIT becomes a{' '}
                                <strong className="text-white">self-sustaining ecosystem</strong> that stabilizes communities, creates local jobs, and generates predictable, multi-threaded revenue.
                            </p>
                        </motion.div>

                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {benefits.map((benefit, idx) => {
                                const Icon = benefit.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.15 + idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white mb-2">{benefit.title}</h3>
                                                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Bottom Statement */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="mt-12 pt-12 border-t border-white/10"
                        >
                            <p className="text-center text-xl text-slate-300">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold">
                                    This isn't a moonshot.
                                </span>{' '}
                                It's a blueprint for sustainable growth grounded in technology that works, people who can deploy it, and AI that finds the market. <strong className="text-white">That's repeatable. That's defensible. That's valuable.</strong>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}