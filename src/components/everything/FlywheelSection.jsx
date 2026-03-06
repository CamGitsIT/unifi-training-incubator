import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Zap, CheckCircle, TrendingUp } from 'lucide-react';

export default function FlywheelSection() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            label: 'Training Creates Installers',
            icon: Users,
            description: 'We train certified professionals in our on-site studio.',
            color: 'from-blue-500 to-blue-400',
        },
        {
            label: 'Installers Need Projects',
            icon: Briefcase,
            description: 'Our graduates seek real-world installations.',
            color: 'from-cyan-500 to-cyan-400',
        },
        {
            label: 'AI Finds Projects',
            icon: Zap,
            description: 'Our AI identifies bloated subscription models in target orgs.',
            color: 'from-purple-500 to-purple-400',
        },
        {
            label: 'Experience Center Closes',
            icon: CheckCircle,
            description: 'Decision-makers visit, see ROI, and commit.',
            color: 'from-green-500 to-green-400',
        },
        {
            label: 'Revenue Flows Back',
            icon: TrendingUp,
            description: 'Profits fund training, keeping the cycle alive.',
            color: 'from-amber-500 to-amber-400',
        },
    ];

    const RADIUS = 140;
    const CENTER_X = 200;
    const CENTER_Y = 200;

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
                    <p className="text-cyan-400 text-sm font-semibold tracking-widest mb-4">THE SELF-SUSTAINING CYCLE</p>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                        The Flywheel Effect
                    </h3>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Every element accelerates the next. Once momentum builds, the engine sustains itself.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Circular Diagram */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <svg width="400" height="400" className="drop-shadow-lg">
                            {/* Background circle */}
                            <circle
                                cx={CENTER_X}
                                cy={CENTER_Y}
                                r={RADIUS}
                                fill="none"
                                stroke="hsl(15, 23%, 20%)"
                                strokeWidth="2"
                                opacity="0.3"
                            />

                            {/* Animated rotating border */}
                            <motion.circle
                                cx={CENTER_X}
                                cy={CENTER_Y}
                                r={RADIUS}
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                opacity="0.6"
                                strokeDasharray="440"
                                strokeDashoffset="0"
                                animate={{ strokeDashoffset: -440 }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            />

                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                                    <stop offset="25%" stopColor="rgb(59, 130, 246)" />
                                    <stop offset="50%" stopColor="rgb(168, 85, 247)" />
                                    <stop offset="75%" stopColor="rgb(34, 197, 94)" />
                                    <stop offset="100%" stopColor="rgb(34, 197, 94)" />
                                </linearGradient>
                            </defs>

                            {/* Step circles */}
                            {steps.map((step, idx) => {
                                const angle = (idx / steps.length) * Math.PI * 2 - Math.PI / 2;
                                const x = CENTER_X + RADIUS * Math.cos(angle);
                                const y = CENTER_Y + RADIUS * Math.sin(angle);

                                const Icon = step.icon;
                                const isActive = idx === activeStep;

                                return (
                                    <g key={idx}>
                                        {/* Step circle background */}
                                        <circle
                                            cx={x}
                                            cy={y}
                                            r={isActive ? 32 : 28}
                                            fill="hsl(0, 0%, 15%)"
                                            stroke={isActive ? 'hsl(0, 84.2%, 60.2%)' : 'hsl(200, 90%, 50%)'}
                                            strokeWidth={isActive ? 2 : 1}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setActiveStep(idx)}
                                            className="transition-all duration-300"
                                        />
                                        {/* Icon would go here (using text as fallback) */}
                                        <text
                                            x={x}
                                            y={y}
                                            textAnchor="middle"
                                            dy=".3em"
                                            fontSize="16"
                                            fill={isActive ? 'hsl(0, 84.2%, 60.2%)' : 'hsl(200, 90%, 50%)'}
                                            className="font-bold pointer-events-none"
                                        >
                                            {idx + 1}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Center hub */}
                            <circle cx={CENTER_X} cy={CENTER_Y} r="24" fill="hsl(0, 0%, 20%)" stroke="hsl(200, 90%, 50%)" strokeWidth="2" />
                            <text
                                x={CENTER_X}
                                y={CENTER_Y}
                                textAnchor="middle"
                                dy=".3em"
                                fontSize="14"
                                fill="hsl(200, 90%, 50%)"
                                className="font-bold pointer-events-none"
                            >
                                Growth
                            </text>
                        </svg>
                    </motion.div>

                    {/* Step Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isActive = idx === activeStep;

                                return (
                                    <motion.div
                                        key={idx}
                                        onClick={() => setActiveStep(idx)}
                                        className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-slate-800/80 border-cyan-500/50'
                                                : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                                        }`}
                                        animate={{ scale: isActive ? 1.02 : 1 }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${step.color} text-slate-950 flex-shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-2">{step.label}</h4>
                                                {isActive && (
                                                    <p className="text-sm text-slate-400">{step.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}