import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Calendar, Rocket, DollarSign, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { formatCurrency } from '@/components/forecast/forecastEngine';

const ANNUAL_DEBT_SERVICE = 55200;
const MARGIN = 0.63;

const TIERS = [
    { value: 'participant',         label: '$10K',  amount: 10000  },
    { value: 'junior_contributor',  label: '$25K',  amount: 25000  },
    { value: 'senior_contributor',  label: '$50K',  amount: 50000  },
    { value: 'growth_accelerator',  label: '$75K',  amount: 75000  },
    { value: 'mentor',              label: '$100K', amount: 100000 },
    { value: 'growth_leader',       label: '$150K', amount: 150000 },
];

const PAYBACK_OPTIONS = [
    { months: 12, label: '1 yr' },
    { months: 24, label: '2 yr' },
    { months: 36, label: '3 yr' },
    { months: 48, label: '4 yr' },
];

export default function Slide11CTA({ onInteracted }) {
    const formRef = useRef(null);

    const [formData,     setFormData]     = useState({ full_name: '', email: '', amount: '25000', tier: 'junior_contributor' });
    const [selectedTier, setSelectedTier] = useState('junior_contributor');
    const [paybackMonths,setPaybackMonths]= useState(24);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess,  setShowSuccess]  = useState(false);

    const tier         = TIERS.find(t => t.value === selectedTier) ?? TIERS[3];
    const invest       = tier.amount;
    const paybackYears = paybackMonths / 12;
    const totalRepaid  = invest * (1 + 0.10 * paybackYears);
    const investReturn = totalRepaid - invest;
    const monthlyPmt   = totalRepaid / paybackMonths;

    const handleTierSelect = (t) => {
        setSelectedTier(t.value);
        setFormData(prev => ({ ...prev, tier: t.value, amount: String(t.amount) }));
    };

    const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name.trim() || !formData.email.trim()) { toast.error('Please fill in all required fields'); return; }
        setIsSubmitting(true);
        try {
            await base44.entities.CapitalPledge.create({ ...formData, amount: parseFloat(formData.amount) });
            setShowSuccess(true);
            onInteracted();
            toast.success('Capital intent registered!');
        } catch {
            toast.error('Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 py-16 px-6">
            <div className="max-w-5xl mx-auto w-full">

                {/* Header */}
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                        <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-semibold tracking-wide">Ready to Participate</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Join the Mission</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-base">
                        Three ways in. We're raising just $85K — the SBA down payment on an $850K facility. No equity offered — just a fair return, a front-row seat, or both.
                    </p>
                </motion.div>

                {/* Three action cards */}
                <div className="grid md:grid-cols-3 gap-5 mb-10">

                    {/* Invest */}
                    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
                        className="bg-slate-800/30 border border-cyan-500/30 rounded-xl p-6 flex flex-col items-center text-center hover:border-cyan-400/60 transition-all">
                        <Heart className="w-8 h-8 text-cyan-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">Invest as a Friend</h3>
                        <p className="text-slate-400 text-sm mb-5 flex-1">
                            Simple note. Fixed 10% annual return, repaid from operating revenue. Starting at $10K. No equity, no board seat.
                        </p>
                        <button onClick={scrollToForm}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/25 transition-all">
                            Register Intent <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>

                    {/* Gift */}
                    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
                        className="bg-slate-800/30 border border-purple-500/30 rounded-xl p-6 flex flex-col items-center text-center hover:border-purple-400/60 transition-all">
                        <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">Make a Gift</h3>
                        <p className="text-slate-400 text-sm mb-5 flex-1">
                            Help fund the flagship UniFi Experience Center and create training-led jobs across Georgia.
                        </p>
                        <Button onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm px-4 py-2 rounded-lg">
                            Donate
                        </Button>
                    </motion.div>

                    {/* Visit */}
                    <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                        className="bg-slate-800/30 border border-green-500/30 rounded-xl p-6 flex flex-col items-center text-center hover:border-green-400/60 transition-all">
                        <Calendar className="w-8 h-8 text-green-400 mb-3" />
                        <h3 className="font-bold text-white mb-2">Schedule a Visit</h3>
                        <p className="text-slate-400 text-sm mb-5 flex-1">
                            Tour Sager Lofts, see the space, and walk through the plan in person.
                        </p>
                        <Link to={createPageUrl('ScheduleMeeting')}>
                            <Button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg">
                                Book a Time
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Capital Intent Form */}
                <motion.div ref={formRef} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    {!showSuccess ? (
                        <>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Register Capital Intent</h3>
                                <p className="text-slate-400 text-sm mt-1">Non-binding. Revenue-based debt only — no equity or control rights.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">

                                {/* Left: form inputs */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Full Name / Entity</label>
                                        <Input value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="e.g. Jane Doe Capital"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Contact Email</label>
                                        <Input type="email" value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="jane@example.com"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" />
                                    </div>

                                    {/* Amount chips */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Investment Amount</label>
                                        <div className="flex flex-wrap gap-2">
                                            {TIERS.map(t => (
                                                <button key={t.value} type="button" onClick={() => handleTierSelect(t)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                                        selectedTier === t.value
                                                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                                            : 'bg-slate-800/60 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                                                    }`}>
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payback preference */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Preferred Payback Window</label>
                                        <div className="flex gap-2">
                                            {PAYBACK_OPTIONS.map(opt => (
                                                <button key={opt.months} type="button" onClick={() => setPaybackMonths(opt.months)}
                                                    className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                                        paybackMonths === opt.months
                                                            ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                                            : 'bg-slate-800/60 border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200'
                                                    }`}>
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isSubmitting}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 text-lg rounded-xl">
                                        {isSubmitting ? 'Registering...' : 'Register Funding Intent'}
                                    </Button>
                                    <p className="text-xs text-slate-500 text-center">
                                        Revenue-participation debt only. No equity or voting shares issued.
                                    </p>
                                </form>

                                {/* Right: live repayment preview */}
                                <div className="flex flex-col gap-4">
                                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Repayment Preview · 10% Fixed Return</p>

                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Principal</span>
                                                <span className="text-white font-semibold">{formatCurrency(invest, true)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Return (10% × {paybackYears.toFixed(1)} yr)</span>
                                                <span className="text-green-400 font-semibold">+ {formatCurrency(Math.round(investReturn), true)}</span>
                                            </div>
                                            <div className="border-t border-slate-700 pt-2 flex justify-between">
                                                <span className="text-slate-300 font-semibold">Total Repaid</span>
                                                <span className="text-white font-bold">{formatCurrency(Math.round(totalRepaid), true)}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
                                                <div className="text-xs text-slate-500 mb-1">Monthly Payment</div>
                                                <div className="text-lg font-bold text-purple-300">{formatCurrency(Math.round(monthlyPmt), true)}</div>
                                                <div className="text-xs text-slate-600">over {paybackMonths} mo</div>
                                            </div>
                                            <div className="bg-slate-700/40 rounded-lg p-3 text-center">
                                                <div className="text-xs text-slate-500 mb-1">Your Return</div>
                                                <div className="text-lg font-bold text-green-400">{formatCurrency(Math.round(investReturn), true)}</div>
                                                <div className="text-xs text-slate-600">10% simple interest</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-cyan-950/30 to-slate-800/30 border border-cyan-800/30 rounded-xl px-4 py-3">
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            <strong className="text-slate-200">No equity. No board seat.</strong>{' '}
                                            This is a simple promissory note between friends. You get your money back plus 10%, on a timeline that works for both sides.
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/30 border border-slate-700/40 rounded-xl px-4 py-3">
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            After submitting, we'll follow up with the full participation terms and repayment schedule for your review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="text-center py-10">
                            <Rocket className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                            <h3 className="text-3xl font-bold text-white mb-3">Intent Registered!</h3>
                            <p className="text-slate-300 max-w-xl mx-auto mb-6">
                                Your interest is logged. We'll follow up with the participation terms, repayment schedule, and next steps.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-4 rounded-xl">
                                    <DollarSign className="w-5 h-5 mr-2" /> Make a Gift Too
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

            </div>
        </div>
    );
}