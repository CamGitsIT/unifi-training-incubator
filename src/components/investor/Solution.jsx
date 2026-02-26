import React from 'react';
import { CheckCircle, Zap, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Solution() {
    return (
        <section id="solution" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">The OverIT Solution</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        The "No-OpEx" Revolution
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Replace recurring fees with one-time capital investment using Ubiquiti's UniFi ecosystem.
                    </p>
                </motion.div>

                <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900/30 border border-cyan-900/50 rounded-2xl p-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-8 flex justify-center"
                    >
                        <img 
                            src="https://sba.overithelp.com/public/landing-industry-leading-layer-1-PqjdRKw7.png"
                            alt="UniFi Experience"
                            className="max-w-full h-auto rounded-xl"
                        />
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <Zap className="w-10 h-10 text-cyan-400 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-4">Modern UniFi Approach</h3>
                            <div className="space-y-3 text-slate-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span>$1,196 hardware (2 units @ $598 each)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span>$3,000 professional installation with PoE wiring</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span>$0/month - Uses existing internet connection</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                                    <span>$0 subscription fees - EVER</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-cyan-900/50">
                                <div className="text-4xl font-bold text-green-400">$4,196</div>
                                <div className="text-sm text-slate-400">Total 3-Year Cost</div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className="bg-slate-950/50 rounded-xl p-6 border border-green-500/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingDown className="w-8 h-8 text-green-400" />
                                    <div className="text-3xl font-bold text-green-400">86%</div>
                                </div>
                                <div className="text-lg text-white font-semibold mb-2">Hardware Savings</div>
                                <div className="text-slate-400 text-sm mb-6">
                                    Compared to legacy DoorKing systems
                                </div>

                                <div className="border-t border-slate-700 pt-4">
                                    <div className="text-5xl font-bold text-cyan-400 mb-1">77%</div>
                                    <div className="text-white font-semibold mb-2">Total Cost Savings</div>
                                    <div className="text-slate-400 text-sm">
                                        Over 3 years vs. legacy systems
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/30 rounded-2xl p-8 text-center"
                >
                    <div className="text-lg text-purple-300 mb-2">Investment Tipping Point</div>
                    <div className="text-5xl font-bold text-white mb-4">Month 16</div>
                    <p className="text-slate-300 max-w-2xl mx-auto">
                        By month 16, savings from eliminated phone lines and avoided subscriptions have fully 
                        reimbursed the property. Every month after is pure budgetary relief for the HOA.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}