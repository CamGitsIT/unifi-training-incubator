import React from 'react';
import { MapPin, Building, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Property() {
    return (
        <section className="py-24 bg-slate-950">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        The Foundation: 455 Glen Iris Drive NE
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Award-winning Sager Lofts in Atlanta's Old Fourth Ward — the perfect Experience Center location.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden"
                    >
                        <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                            <img 
                                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop" 
                                alt="Modern Loft Building"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                <MapPin className="w-5 h-5" />
                                <span className="font-semibold">Sager Lofts, Old Fourth Ward</span>
                            </div>
                            <p className="text-slate-300 text-sm">
                                Walk Score 79 (Very Walkable) • 2 blocks from Beltline • Adjacent to Ponce City Market
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Purchase Price</div>
                                    <div className="text-3xl font-bold text-white">$800,000</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400 mb-1">Appraised Value</div>
                                    <div className="text-3xl font-bold text-green-400">$850,000</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>6.25% instant equity</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-sm text-slate-400 mb-3">Property Features</div>
                            <div className="space-y-2">
                                {[
                                    "3,160 sq ft mixed-use loft",
                                    "11-foot ceilings, floor-to-ceiling windows",
                                    "CMR zoning (Commercial Mixed-Use Residential)",
                                    "2-car private garage + guest parking",
                                    "Perfect for SBA owner-occupied financing"
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-300">
                                        <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-700/50 rounded-xl p-6">
                            <Building className="w-8 h-8 text-cyan-400 mb-3" />
                            <div className="text-white font-semibold mb-2">Multi-Functional Asset</div>
                            <p className="text-slate-300 text-sm">
                                Experience Center + Training Studio + Pilot Site + Executive Workspace. 
                                One property, four revenue-generating functions.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}