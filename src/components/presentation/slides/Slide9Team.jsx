import React, { useState } from 'react';
import { Users, Cpu, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";

export default function Slide9Team({ onInteracted }) {
    const [investmentAmount, setInvestmentAmount] = useState(25000);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    const targetReturn = investmentAmount * 1.10;
    const monthlyPayment = 50530 * 0.05;
    const estimatedMonths = Math.ceil(targetReturn / monthlyPayment);

    React.useEffect(() => {
        if (timerDone || hasInteracted) return;
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
    }, [timerDone, hasInteracted]);

    const handleSlide = (val) => {
        setInvestmentAmount(val[0]);
        if (!hasInteracted) { setHasInteracted(true); onInteracted(); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Lean Team, AI-Powered Scale</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">Four full-time leaders, amplified by an AI-first stack—delivering national reach without building a bloated payroll.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
                    {[
                        { name: 'Cameron Champion', role: 'Founder, & Principal Trainer', image: 'https://sba.overithelp.com/public/cameron-champion.png' },
                        { name: 'John Shea', role: 'Strategic Operations & Outreach', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/5d62c10c2_7A9EAD90-F0F1-49B4-ABAF-13F22710AFD7.PNG' }
                    ].map((person, i) => (
                        <div key={i} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 text-center group hover:border-cyan-500/50 transition-colors">
                            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                                <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1">{person.name}</h4>
                            <p className="text-sm text-cyan-400">{person.role}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <Users className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-4">Core Team (4 FTEs)</h3>
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
                    </div>

                    <div className="bg-gradient-to-br from-purple-950/30 to-slate-900/30 border border-purple-700/50 rounded-2xl p-6">
                        <Cpu className="w-8 h-8 text-purple-400 mb-3" />
                        <h3 className="text-xl font-bold text-white mb-3">AI-Integrated Stack</h3>
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
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/30 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 text-center">Use of Funds — Investment Calculator</h3>
                    <div className="grid md:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Property Acquisition', amount: '$800,000', pct: '89%' },
                            { label: 'Showroom Build-out', amount: '$25,000', pct: '3%' },
                            { label: 'Training Lab Equipment', amount: '$30,000', pct: '3%' },
                            { label: 'Working Capital (6mo)', amount: '$45,000', pct: '5%' }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-900/50 rounded-xl p-4 text-center border border-slate-700">
                                <div className="text-2xl font-bold text-cyan-400 mb-1">{item.pct}</div>
                                <div className="text-xs text-slate-400 mb-2">{item.label}</div>
                                <div className="text-sm font-semibold text-white">{item.amount}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mb-4 pb-4 border-b border-slate-700">
                        <span className="text-slate-400">Total Needed: </span>
                        <span className="text-3xl font-bold text-white">$900,000</span>
                    </div>

                    {!hasInteracted && <p className="text-center text-xs text-cyan-400 mb-3 animate-bounce">👇 Adjust the slider to explore your return</p>}
                    <div className="max-w-xl mx-auto">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-300 text-sm">Your Contribution</span>
                            <span className="text-xl font-bold text-cyan-400">${investmentAmount.toLocaleString()}</span>
                        </div>
                        <Slider value={[investmentAmount]} onValueChange={handleSlide} min={5000} max={100000} step={5000} className="[&>span]:bg-cyan-400" />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-slate-950/50 rounded-xl p-4 text-center">
                                <div className="text-sm text-slate-400 mb-1">Your Total Return</div>
                                <div className="text-2xl font-bold text-green-400">${targetReturn.toLocaleString()}</div>
                            </div>
                            <div className="bg-slate-950/50 rounded-xl p-4 text-center">
                                <div className="text-sm text-slate-400 mb-1">Est. Payback</div>
                                <div className="text-2xl font-bold text-purple-400">{estimatedMonths} months</div>
                            </div>
                        </div>
                    </div>
                </div>

                {(hasInteracted || timerDone) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ Click Next to see social impact
                    </motion.p>
                )}
                {!hasInteracted && !timerDone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-cyan-400 text-sm mt-6">
                        Or unlock in {secondsLeft}s
                    </motion.p>
                )}
            </div>
        </div>
    );
}