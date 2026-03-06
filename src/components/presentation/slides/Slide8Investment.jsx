import React, { useState } from 'react';
import { Coins, TrendingUp, Shield, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";

export default function Slide8Investment({ onInteracted }) {
    const [investmentAmount, setInvestmentAmount] = useState(25000);
    const [hasSlid, setHasSlid] = useState(false);
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    const targetReturn = investmentAmount * 1.10;
    const avgMonthlyRevenue = 50530;
    const monthlyPayment = avgMonthlyRevenue * 0.05;
    const estimatedMonths = Math.ceil(targetReturn / monthlyPayment);

    React.useEffect(() => {
        if (timerDone || hasSlid) return;
        const interval = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    setTimerDone(true);
                    onInteracted();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerDone, hasSlid]);

    const handleSlide = (val) => {
        setInvestmentAmount(val[0]);
        if (!hasSlid) { setHasSlid(true); onInteracted(); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <Coins className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium">Investment Opportunity</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Revenue-based Lending and Repayment</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                        You earn a fixed 10% return, repaid from 5% of revenue—faster if growth outperforms, slower but steady if it doesn't.
                    </p>
                    <p className="text-lg text-cyan-400 font-semibold">Conservative projections. Revenue-based repayments with aligned downside protection and upside speed.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                        <h3 className="text-2xl text-white font-bold flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-cyan-400" /> How It Works
                        </h3>
                        <div className="space-y-4">
                            {[
                                { icon: CheckCircle, text: 'You lend us capital to acquire the property and launch operations', color: 'text-cyan-400' },
                                { icon: DollarSign, text: 'We pay you back 10% return through monthly revenue sharing (5% of revenue)', color: 'text-green-400' },
                                { icon: Clock, text: 'If revenue is strong, you get paid back quickly (12–18 months)', color: 'text-purple-400' },
                                { icon: Shield, text: "If times are hard, payments flex with revenue — we won't be lazy, but we won't break either", color: 'text-blue-400' }
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-1`} />
                                        <span className="text-slate-300 text-sm">{item.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-700/50 rounded-2xl p-8">
                        <h3 className="text-2xl text-white font-bold mb-6">Calculate Your Return</h3>
                        <div className="mb-6">
                            <div className="flex justify-between mb-3">
                                <span className="text-slate-400">Your Investment</span>
                                <span className="text-white font-bold text-xl">${investmentAmount.toLocaleString()}</span>
                            </div>
                            {!hasSlid && (
                                <p className="text-xs text-cyan-400 text-center mb-2 animate-bounce">👈 Drag the slider to calculate 👉</p>
                            )}
                            <Slider value={[investmentAmount]} onValueChange={handleSlide} min={5000} max={100000} step={5000} className="mb-2 [&>span]:bg-cyan-400" />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>$5,000</span><span>$100,000</span>
                            </div>
                        </div>
                        <div className="space-y-3 bg-slate-950/50 rounded-xl p-5">
                            <div className="flex justify-between"><span className="text-slate-400">Total Repayment (10%)</span><span className="text-white font-bold">${targetReturn.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Est. Monthly Payment</span><span className="text-green-400 font-bold">${monthlyPayment.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Est. Payback</span><span className="text-cyan-400 font-bold">{estimatedMonths} months</span></div>
                            <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">Based on 5% of projected monthly revenue. Payments adjust with actual performance.</div>
                        </div>
                        <div className="bg-purple-950/30 border border-purple-700/50 rounded-xl p-4 mt-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-300">If we hit our base projections, we'll pay you back so fast you'll want to invest more to help us open Experience Center #2.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {(hasSlid || timerDone) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold">
                        ✓ Click Next to meet the team
                    </motion.p>
                )}
                {!hasSlid && !timerDone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-cyan-400 text-sm">
                        Or unlock in {secondsLeft}s
                    </motion.p>
                )}
            </div>
        </div>
    );
}