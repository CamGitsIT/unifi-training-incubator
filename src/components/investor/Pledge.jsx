import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Rocket, Sparkles, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Pledge() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        amount: '50000',
        tier: 'growth_accelerator'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const tiers = [
        { value: 'participant', label: '$5,000 — Participant', amount: 5000 },
        { value: 'junior_contributor', label: '$10,000 — Junior Contributor', amount: 10000 },
        { value: 'senior_contributor', label: '$25,000 — Senior Contributor', amount: 25000 },
        { value: 'growth_accelerator', label: '$50,000 — Growth Accelerator', amount: 50000 },
        { value: 'mentor', label: '$75,000 — Mentor', amount: 75000 },
        { value: 'growth_leader', label: '$100,000+ — Growth Leader', amount: 100000 },
        { value: 'custom', label: 'Request Custom Participation Terms', amount: 1 }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.full_name.trim() || !formData.email.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await base44.entities.CapitalPledge.create({
                ...formData,
                amount: parseFloat(formData.amount)
            });

            setShowSuccess(true);
            toast.success('Capital intent registered successfully!');
        } catch (error) {
            console.error('Failed to submit pledge:', error);
            toast.error('Failed to register intent. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setShowSuccess(false);
        setFormData({
            full_name: '',
            email: '',
            amount: '50000',
            tier: 'growth_accelerator'
        });
    };

    const handleTierChange = (tier) => {
        const selectedTier = tiers.find(t => t.value === tier);
        setFormData({
            ...formData,
            tier,
            amount: String(selectedTier?.amount || 50000)
        });
    };

    return (
        <section id="pledge" className="py-28 bg-slate-900">
            <div className="max-w-4xl mx-auto px-6">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 md:p-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.h2 
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-semibold text-white tracking-tight"
                        >
                            Fuel the Disruption
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 text-slate-300 max-w-2xl mx-auto"
                        >
                            Secure your position in the OverIT revenue-share ecosystem. We are raising growth capital to scale—offering high-yield participation without cap-table dilution.
                        </motion.p>
                    </div>

                    {!showSuccess ? (
                        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl">
                            {/* Donation Section */}
                            <div className="mb-8 p-6 bg-slate-900/60 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-center">
                                <Sparkles className="w-8 h-8 text-cyan-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">Feeling Generous?</h3>
                                <p className="text-sm text-slate-400 mb-6">
                                    Your help launches the flagship experience center that creates jobs and independent businesses across Georgia.
                                </p>
                                <Button
                                    onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg"
                                >
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Make a Donation
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-slate-700" />
                                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wide">
                                    Or Register Capital Intent
                                </span>
                                <div className="flex-grow border-t border-slate-700" />
                            </div>

                            {/* Pledge Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                                            Full Name / Entity
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            placeholder="e.g. Jane Doe Capital"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                                            Contact Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="jane@example.com"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">
                                        Capital Tier &amp; Participation Level
                                    </label>
                                    <Select value={formData.tier} onValueChange={handleTierChange}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-cyan-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiers.map(tier => (
                                                <SelectItem key={tier.value} value={tier.value}>
                                                    {tier.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 text-lg rounded-xl shadow-md"
                                >
                                    {isSubmitting ? 'Registering...' : 'Register Funding Intent'}
                                </Button>

                                <p className="text-xs text-slate-400 text-center">
                                    Note: This is a debt/revenue-participation offering. No equity or voting shares are issued.
                                </p>
                            </form>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-6">
                                <Rocket className="w-20 h-20 mx-auto text-cyan-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-4">Intent Registered!</h3>
                            <p className="text-slate-300 max-w-xl mx-auto mb-8">
                                Your interest in the OverIT growth round has been logged. Our team will reach out with the participation agreement and yield schedule.
                            </p>
                            <Button
                                onClick={handleReset}
                                variant="link"
                                className="text-cyan-400 hover:text-cyan-300 underline"
                            >
                                Submit another pledge
                            </Button>
                        </motion.div>
                    )}
                </Card>
            </div>
        </section>
    );
}