import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Hammer, Lightbulb, Building2, TrendingUp } from 'lucide-react';

const flywheelSteps = [
    { icon: BookOpen, label: 'Training', color: 'from-blue-500 to-cyan-500', angle: 0 },
    { icon: Hammer, label: 'Installers', color: 'from-purple-500 to-pink-500', angle: 72 },
    { icon: Lightbulb, label: 'Projects', color: 'from-emerald-500 to-cyan-500', angle: 144 },
    { icon: Building2, label: 'Experience Center', color: 'from-orange-500 to-red-500', angle: 216 },
    { icon: TrendingUp, label: 'Revenue', color: 'from-green-500 to-emerald-500', angle: 288 },
];

export default function Flywheel() {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="py-24 px-6 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Self-Sustaining Flywheel</h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Revenue flows back to fuel growth, creating a virtuous cycle.</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Circular Diagram */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-1 relative w-full max-w-md h-96 mx-auto"
                    >
                        {/* Rotating outer circle */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-cyan-500/20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Center circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                <div className="text-center">
                                    <p className="text-white text-xs font-bold uppercase tracking-wider">Self-</p>
                                    <p className="text-white text-xs font-bold uppercase tracking-wider">Sustaining</p>
                                </div>
                            </div>
                        </div>

                        {/* Step icons in circle */}
                        {flywheelSteps.map((step, idx) => {
                            const Icon = step.icon;
                            const rad = (step.angle * Math.PI) / 180;
                            const x = Math.cos(rad) * 130;
                            const y = Math.sin(rad) * 130;

                            return (
                                <motion.div
                                    key={idx}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                                    onMouseEnter={() => setActiveStep(idx)}
                                    whileHover={{ scale: 1.15 }}
                                >
                                    <motion.div
                                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center cursor-pointer shadow-lg transition-all ${
                                            activeStep === idx ? 'ring-2 ring-white/60' : ''
                                        }`}
                                        animate={{ scale: activeStep === idx ? 1.1 : 1 }}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </motion.div>
                                </motion.div>
                            );
                        })}

                        {/* Arrows between steps */}
                        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                            {flywheelSteps.map((_, idx) => {
                                const nextIdx = (idx + 1) % flywheelSteps.length;
                                const rad1 = (flywheelSteps[idx].angle * Math.PI) / 180;
                                const rad2 = (flywheelSteps[nextIdx].angle * Math.PI) / 180;
                                const x1 = 50 + Math.cos(rad1) * 30;
                                const y1 = 50 + Math.sin(rad1) * 30;
                                const x2 = 50 + Math.cos(rad2) * 30;
                                const y2 = 50 + Math.sin(rad2) * 30;

                                return (
                                    <motion.path
                                        key={idx}
                                        d={`M ${x1}% ${y1}% Q 50% 50% ${x2}% ${y2}%`}
                                        stroke="#06B6D4"
                                        strokeWidth="2"
                                        fill="none"
                                        opacity={activeStep === idx ? 0.8 : 0.2}
                                        animate={{ opacity: activeStep === idx ? 0.8 : 0.2 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                );
                            })}
                        </svg>
                    </motion.div>

                    {/* Step Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <div className="space-y-6">
                            {flywheelSteps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        onClick={() => setActiveStep(idx)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border ${
                                            activeStep === idx
                                                ? `bg-white/10 border-cyan-500/50`
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}
                                        animate={{ x: activeStep === idx ? 8 : 0 }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{step.label}</h3>
                                                <p className="text-slate-400 text-sm mt-1">
                                                    {idx === 0 && "Create certified installers through hands-on training at our hub."}
                                                    {idx === 1 && "Graduates go into the field, ready to deploy UniFi systems."}
                                                    {idx === 2 && "AI identifies companies bleeding money on subscriptions."}
                                                    {idx === 3 && "Decision-makers visit the Experience Center and see ROI."}
                                                    {idx === 4 && "Projects close. Revenue flows back to fund more training."}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}