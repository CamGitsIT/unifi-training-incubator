import React, { useState } from 'react';
import { Coins, TrendingUp, Shield, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function Investment() {
    const [investmentAmount, setInvestmentAmount] = useState(25000);
    const [showSliderHint, setShowSliderHint] = useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setShowSliderHint(false), 4000);
        return () => clearTimeout(timer);
    }, []);
    
    // Revenue-based repayment calculation
    // Assume 5% of monthly revenue goes to investors until paid back with 10% return
    const targetReturn = investmentAmount * 1.10;
    const avgMonthlyRevenue = 50530; // Average from Year 1 projections
    const monthlyPayment = avgMonthlyRevenue * 0.05;
    const estimatedMonths = Math.ceil(targetReturn / monthlyPayment);

    return (
        <section id="investment" className="py-24 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium">Investment Opportunity</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Revenue-based Lending and Repayment
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                        We're raising funds from friends and supporters through revenue-sharing loans. 
                        Get paid back as we grow — quickly if things go well, flexibly if the world gets harder.
                    </p>
                    <p className="text-lg text-cyan-400 font-semibold">
                        No equity given up. Ever.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* How It Works */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-slate-800/30 border-slate-700 h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                                    How It Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { icon: CheckCircle, text: "You lend us capital to acquire the property and launch operations", color: "text-cyan-400" },
                                    { icon: DollarSign, text: "We pay you back 10% return through monthly revenue sharing (5% of revenue)", color: "text-green-400" },
                                    { icon: Clock, text: "If revenue is strong, you get paid back quickly (12-18 months)", color: "text-purple-400" },
                                    { icon: Shield, text: "If times are hard, payments flex with revenue — we won't be lazy, but we won't break either", color: "text-blue-400" }
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex items-start gap-3">
                                            <Icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-1`} />
                                            <span className="text-slate-300">{item.text}</span>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Calculator */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border-cyan-700/50 h-full">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Calculate Your Return</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="relative">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-slate-400">Your Investment</span>
                                        <span className="text-white font-bold">${investmentAmount.toLocaleString()}</span>
                                    </div>
                                    {showSliderHint && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-cyan-400 whitespace-nowrap animate-bounce">
                                            👈 Drag slider to calculate 👉
                                        </div>
                                    )}
                                    <Slider
                                        value={[investmentAmount]}
                                        onValueChange={(val) => { setInvestmentAmount(val[0]); setShowSliderHint(false); }}
                                        min={5000}
                                        max={100000}
                                        step={5000}
                                        className="mb-6"
                                    />
                                </div>

                                <div className="space-y-3 bg-slate-950/50 rounded-xl p-6">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Total Repayment (10% return)</span>
                                        <span className="text-white font-bold">${targetReturn.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Estimated Monthly Payment*</span>
                                        <span className="text-green-400 font-bold">${monthlyPayment.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Estimated Payback</span>
                                        <span className="text-cyan-400 font-bold">{estimatedMonths} months</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-700">
                                        <div className="text-xs text-slate-500">
                                            * Based on 5% of projected monthly revenue. Payments adjust with actual performance.
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-950/30 border border-purple-700/50 rounded-xl p-4">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-slate-300">
                                            If we hit our base projections, we'll pay you back so fast you'll want to 
                                            invest more to help us open Experience Center #2.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Why Revenue-Based? */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
                >
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                        Why Revenue-Based Repayment?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-2">Aligned Incentives</h4>
                            <p className="text-slate-400 text-sm">
                                You win when we win. We're motivated to grow revenue fast to pay you back and earn your trust for future centers.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-purple-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-2">Built-In Flexibility</h4>
                            <p className="text-slate-400 text-sm">
                                If the nuclear bomb drops or business slows, payments flex with revenue. We won't default — we'll adjust.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Coins className="w-6 h-6 text-green-400" />
                            </div>
                            <h4 className="font-semibold text-white mb-2">Fair Returns</h4>
                            <p className="text-slate-400 text-sm">
                                10% return is significantly better than savings accounts or bonds, with the satisfaction of funding a mission.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}