import React from 'react';
import { Heart, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Mission() {
    return (
        <section id="mission" className="py-24 bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        More Than a Business
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        In a world that's increasingly hard, where people feel trapped by endless subscriptions and 
                        rising costs, we're creating something different: a path to freedom through ownership and education.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all"
                    >
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Heart className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Rescue Communities</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Free HOAs and property managers from the burden of $3,000-$15,000 annual subscription fees. 
                            Give them permanent solutions, not perpetual payments.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all"
                    >
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                            <GraduationCap className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Train the Next Generation</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Certify technicians in modern networking and security, creating skilled professionals 
                            who can work as independent contractors with dignity and fair pay.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-all"
                    >
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Build Sustainable Value</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Every dollar we make comes from solving real problems for real people. 
                            High margins, low overhead, maximum impact.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}