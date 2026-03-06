import React from 'react';
import { motion } from 'framer-motion';

export default function ExperienceCenterHighlight() {
    return (
        <div className="bg-slate-900 py-24">
            <div className="max-w-6xl mx-auto px-8 md:px-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/1234a93d7_experience-center_backdrop.png"
                                alt="UniFi Experience Center"
                                className="w-full h-auto"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-cyan-400 text-sm font-semibold tracking-widest mb-4">EXPERIENCE CENTER</p>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            They have to touch it to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">"get" it.</span>
                        </h3>
                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                            Our Atlanta-based UniFi Experience Center is more than a showroom—it's a closing tool for enterprise real estate developers. When decision-makers see the fully integrated system in action, when they watch our certified trainers demonstrate ROI in real-time, the value becomes undeniable.
                        </p>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            This is where subscriptions end and ownership begins. Where training happens. Where the next generation of IT experts is born.
                        </p>
                        <div className="flex items-center gap-3 text-cyan-400 font-semibold">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            The physical proof of concept that changes minds.
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}