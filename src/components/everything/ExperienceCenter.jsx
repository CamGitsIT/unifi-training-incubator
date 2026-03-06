import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export default function ExperienceCenter() {
    return (
        <section className="py-24 px-6 bg-slate-900">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
                    >
                        <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/5956c075a_unifi-experiance-center.png"
                            alt="UniFi Experience Center"
                            className="w-full h-96 object-cover"
                        />
                    </motion.div>

                    {/* Right: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-xs font-medium tracking-wide">The Physical Hub</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            They have to touch it to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">"get" it.</span>
                        </h2>

                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                            The UniFi Experience Center and Training Hub isn't just a showroom—it's the closing tool for large real estate developers and enterprise decision-makers.
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-1 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />
                                <div>
                                    <h3 className="font-bold text-white mb-1">See ROI in Real-Time</h3>
                                    <p className="text-slate-400 text-sm">Walk through a fully deployed UniFi stack and watch how infrastructure simplification cuts costs across an entire portfolio.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent rounded-full" />
                                <div>
                                    <h3 className="font-bold text-white mb-1">Train On-Site</h3>
                                    <p className="text-slate-400 text-sm">Our certified instructors guide teams through hands-on training, turning skeptics into champions.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-1 bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
                                <div>
                                    <h3 className="font-bold text-white mb-1">Close Large Deals</h3>
                                    <p className="text-slate-400 text-sm">For enterprise clients managing hundreds of properties, seeing it work is worth millions in confidence.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}