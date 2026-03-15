import React, { useState, useEffect } from 'react';
import { Users, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import FoundersCard from './FoundersCard';
import { fadeUp, staggerContainer, staggerChild } from '@/lib/motionConfig';

export default function Slide9Team({ onInteracted }) {
    const [investmentAmount, setInvestmentAmount] = useState(25000);

    const targetReturn = investmentAmount * 1.10;
    const monthlyPayment = 50530 * 0.05;
    const estimatedMonths = Math.ceil(targetReturn / monthlyPayment);

    useEffect(() => { onInteracted(); }, []);

    const handleSlide = (val) => {
        setInvestmentAmount(val[0]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">The Team</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">Four full-time leaders, amplified by an AI-first stack—delivering national reach without building a bloated payroll.</p>
                </motion.div>

                <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="mb-8">
                    <FoundersCard />
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/30 rounded-2xl p-6 mb-8"
                >
                    <h3 className="text-xl font-bold text-white mb-4 text-center">Resource Planning — Investment Calculator</h3>
                    <motion.div
                        variants={staggerContainer(0.08, 0.1)}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-4 gap-4 mb-6"
                    >
                        {[
                            { label: 'Property Acquisition', amount: '$800,000', pct: '89%' },
                            { label: 'Showroom Build-out', amount: '$25,000', pct: '3%' },
                            { label: 'Training Lab Equipment', amount: '$30,000', pct: '3%' },
                            { label: 'Working Capital (6mo)', amount: '$45,000', pct: '5%' }
                        ].map((item, i) => (
                            <motion.div key={i} variants={staggerChild} className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700">
                                <div className="text-2xl font-bold text-cyan-400 mb-1">{item.pct}</div>
                                <div className="text-xs text-slate-400 mb-2">{item.label}</div>
                                <div className="text-sm font-semibold text-white">{item.amount}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <div className="text-center pb-4 border-b border-slate-700">
                        <span className="text-slate-400">Total Needed: </span>
                        <span className="text-3xl font-bold text-white">$900,000</span>
                    </div>
                </motion.div>

                <motion.div
                    variants={staggerContainer(0.1, 0.35)}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-3 gap-6 mb-8"
                >
                    <motion.div variants={staggerChild} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <Users className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="text-lg font-bold text-white mb-4">Leadership</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                                <span className="text-slate-300 text-sm">Cameron Champion</span>
                                <span className="text-cyan-400 font-mono text-xs">Founder</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                                <span className="text-slate-300 text-sm">John Shea</span>
                                <span className="text-cyan-400 font-mono text-xs">Ops Lead</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerChild} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <Users className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="text-lg font-bold text-white mb-4">Core Team (4 FTEs)</h3>
                        <div className="space-y-3">
                            {[
                                { role: 'Principal/Trainer', salary: '$98,591' },
                                { role: 'Principal/Operations', salary: '$98,591' },
                                { role: 'Network Technician', salary: '$53,927' },
                                { role: 'Admin Assistant', salary: '$42,090' }
                            ].map((p, i) => (
                                <div key={i} className="flex justify-between items-center pb-2 border-b border-slate-700 last:border-0">
                                    <span className="text-slate-300 text-sm">{p.role}</span>
                                    <span className="text-cyan-400 font-mono text-sm">{p.salary}</span>
                                </div>
                            ))}
                            <div className="pt-2 flex justify-between">
                                <span className="font-bold text-white text-sm">Total Payroll (w/ benefits)</span>
                                <span className="text-xl font-bold text-cyan-400">$366,498</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={staggerChild} className="bg-gradient-to-br from-purple-950/30 to-slate-900/30 border border-purple-700/50 rounded-2xl p-6">
                        <Cpu className="w-8 h-8 text-purple-400 mb-3" />
                        <h3 className="text-lg font-bold text-white mb-3">AI-Integrated Stack</h3>
                        <div className="space-y-2 mb-4">
                            {[
                                'AI SDRs handle 7,500 outreach/month nationally',
                                'Automated ROI calculators and proposal generation',
                                'AI-curated prospect lists filtered by DoorKing density',
                                'Automated meeting scheduling and qualification'
                            ].map((f, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                                    <span className="text-slate-300 text-sm">{f}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-purple-700/50 pt-4">
                            <div className="text-sm text-slate-400 mb-1">AI Stack Cost</div>
                            <div className="text-2xl font-bold text-purple-400">$120K/year</div>
                            <div className="text-xs text-slate-500 mt-1">Replaces $2.5M+ in traditional sales, ops, and marketing headcount.</div>
                        </div>
                    </motion.div>
                </motion.div>



            </div>
        </div>
    );
}