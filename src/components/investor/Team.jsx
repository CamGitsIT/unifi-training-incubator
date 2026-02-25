import React, { useState } from 'react';
import { Users, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";

export default function Team() {
    const [investmentAmount, setInvestmentAmount] = useState(25000);
    const targetReturn = investmentAmount * 1.10;
    const avgMonthlyRevenue = 50530;
    const monthlyPayment = avgMonthlyRevenue * 0.05;
    const estimatedMonths = Math.ceil(targetReturn / monthlyPayment);
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
                        Lean Team, AI-Powered Scale
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Four people. AI-driven operations. National reach without massive overhead.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
                    >
                        <Users className="w-10 h-10 text-cyan-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">Core Team (4 FTEs)</h3>
                        <div className="space-y-4">
                            {[
                                { role: "Executive 1", focus: "Principal/Trainer", salary: "$98,591" },
                                { role: "Executive 2", focus: "Principal/Operations", salary: "$98,591" },
                                { role: "Network Technician", focus: "Support for Retrofits/VILT", salary: "$53,927" },
                                { role: "Admin Assistant", focus: "Customer Handoff/Admin", salary: "$42,090" }
                            ].map((person, i) => (
                                <div key={i} className="flex justify-between items-start pb-3 border-b border-slate-700 last:border-0">
                                    <div>
                                        <div className="font-semibold text-white">{person.role}</div>
                                        <div className="text-sm text-slate-400">{person.focus}</div>
                                    </div>
                                    <div className="text-cyan-400 font-mono text-sm">{person.salary}</div>
                                </div>
                            ))}
                            <div className="pt-4 border-t-2 border-cyan-700/50">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-white">Total Payroll (w/ benefits)</span>
                                    <span className="text-2xl font-bold text-cyan-400">$366,498</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-purple-950/30 to-slate-900/30 border border-purple-700/50 rounded-2xl p-8"
                    >
                        <Cpu className="w-10 h-10 text-purple-400 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">AI-Integrated Stack</h3>
                        <p className="text-slate-300 mb-6">
                            What would traditionally require 50+ people, we accomplish with AI agents and automation.
                        </p>
                        <div className="space-y-3">
                            {[
                                "AI SDRs handle 7,500 outreach/month nationally",
                                "Automated ROI calculators and proposal generation",
                                "AI-curated prospect lists filtered by DoorKing density",
                                "Automated meeting scheduling and qualification"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-purple-700/50">
                            <div className="text-sm text-slate-400 mb-2">AI Stack Cost</div>
                            <div className="text-2xl font-bold text-purple-400">$120K/year</div>
                            <div className="text-xs text-slate-500 mt-1">Replaces $2.5M+ in traditional sales/marketing payroll</div>
                        </div>
                    </motion.div>
                </div>

                {/* Use of Funds */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Use of Funds</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { label: "Property Acquisition", amount: "$800,000", pct: "89%" },
                            { label: "Showroom Build-out", amount: "$25,000", pct: "3%" },
                            { label: "Training Lab Equipment", amount: "$30,000", pct: "3%" },
                            { label: "Working Capital (6mo)", amount: "$45,000", pct: "5%" }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-xl p-6 text-center border border-slate-700">
                                <div className="text-3xl font-bold text-cyan-400 mb-2">{item.pct}</div>
                                <div className="text-sm text-slate-400 mb-3">{item.label}</div>
                                <div className="text-lg font-semibold text-white">{item.amount}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                        <span className="text-slate-400">Total Needed: </span>
                        <span className="text-4xl font-bold text-white">$900,000</span>
                    </div>
                </motion.div>

                {/* Investment Calculator */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/30 rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">Investment Calculator</h3>
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <div className="flex justify-between mb-3">
                                <span className="text-slate-300">Investment Amount</span>
                                <span className="text-2xl font-bold text-cyan-400">${investmentAmount.toLocaleString()}</span>
                            </div>
                            <Slider
                                value={[investmentAmount]}
                                onValueChange={(val) => setInvestmentAmount(val[0])}
                                min={5000}
                                max={100000}
                                step={5000}
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>$5,000</span>
                                <span>$100,000</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-slate-950/50 rounded-xl p-6">
                                <div className="text-sm text-slate-400 mb-1">Your Total Return</div>
                                <div className="text-3xl font-bold text-green-400">${targetReturn.toLocaleString()}</div>
                                <div className="text-xs text-slate-500 mt-1">10% total return</div>
                            </div>
                            <div className="bg-slate-950/50 rounded-xl p-6">
                                <div className="text-sm text-slate-400 mb-1">Estimated Payback Period</div>
                                <div className="text-3xl font-bold text-purple-400">{estimatedMonths} months</div>
                                <div className="text-xs text-slate-500 mt-1">Based on ~$2,500/mo payments (5% of revenue)</div>
                            </div>
                        </div>

                        <div className="bg-cyan-950/20 border border-cyan-700/50 rounded-xl p-4">
                            <p className="text-sm text-slate-300">
                                <strong className="text-cyan-400">Note:</strong> If revenue exceeds projections (Base case scenario), 
                                your payback accelerates dramatically. We're incentivized to grow fast and make you whole quickly.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}