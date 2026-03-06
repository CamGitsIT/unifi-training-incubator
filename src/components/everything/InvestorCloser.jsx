import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, TrendingUp, Zap } from 'lucide-react';

export default function InvestorCloser() {
    const benefits = [
        {
            icon: Shield,
            title: 'Low Risk',
            description: 'Diversified revenue streams across education, technology, and AI.',
        },
        {
            icon: Users,
            title: 'Community Building',
            description: 'Creates jobs and stabilizes communities with trained professionals.',
        },
        {
            icon: TrendingUp,
            title: 'Self-Sustaining',
            description: 'Each division funds the others. One growth cycle feeds the next.',
        },
        {
            icon: Zap,
            title: 'Proven Model',
            description: 'The flywheel is proven. Revenue flows back into training, perpetually.',
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-24">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <p className="text-cyan-400 text-sm font-semibold tracking-widest mb-4">WHY THIS WORKS</p>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Not Just a Business.
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
                            A Self-Sustaining Ecosystem.
                        </span>
                    </h3>
                </motion.div>

                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-cyan-500/20 rounded-3xl p-12 md:p-16 mb-12">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl text-slate-300 leading-relaxed mb-12"
                    >
                        By diversifying into three synergistic lines—<strong className="text-white">Education, Technology, and AI</strong>—we aren't just one business exposed to market fluctuations. We are a self-sustaining ecosystem where every part strengthens the whole, stabilizes local communities, and creates meaningful employment.
                    </motion.p>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {benefits.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/40 transition-all duration-300"
                                >
                                    <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-blue-500 text-slate-950 rounded-lg mb-4">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-white mb-2">{benefit.title}</h4>
                                    <p className="text-sm text-slate-400">{benefit.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        This is capital deployment with purpose. Investment that builds infrastructure, educates the workforce, and creates economic resilience.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}