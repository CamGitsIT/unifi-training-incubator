import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Sparkles, Calendar, Rocket, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const tiers = [
    { value: 'participant', label: '$5,000 — Participant', amount: 5000 },
    { value: 'junior_contributor', label: '$10,000 — Junior Contributor', amount: 10000 },
    { value: 'senior_contributor', label: '$25,000 — Senior Contributor', amount: 25000 },
    { value: 'growth_accelerator', label: '$50,000 — Growth Accelerator', amount: 50000 },
    { value: 'mentor', label: '$75,000 — Mentor', amount: 75000 },
    { value: 'growth_leader', label: '$100,000+ — Growth Leader', amount: 100000 },
    { value: 'custom', label: 'Request Custom Participation Terms', amount: 1 }
];

export default function Slide11CTA({ onInteracted }) {
    const [formData, setFormData] = useState({ full_name: '', email: '', amount: '50000', tier: 'growth_accelerator' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleTierChange = (tier) => {
        const selected = tiers.find(t => t.value === tier);
        setFormData({ ...formData, tier, amount: String(selected?.amount || 50000) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name.trim() || !formData.email.trim()) { toast.error('Please fill in all required fields'); return; }
        setIsSubmitting(true);
        try {
            await base44.entities.CapitalPledge.create({ ...formData, amount: parseFloat(formData.amount) });
            setShowSuccess(true);
            onInteracted();
            toast.success('Capital intent registered!');
        } catch (err) {
            toast.error('Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 py-24 px-6">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Join the Mission</h2>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Whether you're reviewing this SBA package or a friend who believes in OverIT, here's how to participate in the UniFi Experience Center and National Training Center launch.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-all flex flex-col items-center">
                        <Heart className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Invest as a Friend</h3>
                        <p className="text-slate-400 text-sm">Revenue-based loans starting at $5,000, repaid with a fixed 10% return from operating revenue.</p>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-purple-500/50 transition-all flex flex-col items-center">
                        <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Feeling Generous?</h3>
                        <p className="text-slate-400 text-sm mb-4">Help fund the flagship UniFi Experience Center and create training-led jobs across Georgia.</p>
                        <Button onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm px-4 py-2 rounded-lg">
                            Make a Donation
                        </Button>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 text-center hover:border-green-500/50 transition-all flex flex-col items-center">
                        <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <h3 className="font-bold text-white mb-2">Schedule a Visit</h3>
                        <p className="text-slate-400 text-sm mb-4">Tour the Sager Lofts property, review the plan in person, and see how the space works.</p>
                        <Link to={createPageUrl('ScheduleMeeting')}>
                            <Button className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg">Schedule a Visit</Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    {!showSuccess ? (
                        <>
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-white">Register Capital Intent</h3>
                                <p className="text-slate-400 text-sm mt-1">Non-binding expression of interest. Revenue-based debt only—no equity or control rights.</p>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Full Name / Entity</label>
                                        <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="e.g. Jane Doe Capital" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Contact Email</label>
                                        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jane@example.com" className="bg-white/10 border-white/20 text-white placeholder:text-slate-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Capital Tier</label>
                                    <Select value={formData.tier} onValueChange={handleTierChange}>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiers.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 text-lg rounded-xl">
                                    {isSubmitting ? 'Registering...' : 'Register Funding Intent'}
                                </Button>
                                <p className="text-xs text-slate-400 text-center">This is a revenue-participation debt offering. No equity or voting shares are issued.</p>
                            </form>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                            <Rocket className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                            <h3 className="text-3xl font-bold text-white mb-3">Intent Registered!</h3>
                            <p className="text-slate-300 max-w-xl mx-auto mb-6">Your interest in the OverIT growth round is logged. We'll follow up with the detailed participation terms, repayment schedule, and next steps.</p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => window.open('https://donate.stripe.com/aEU8xB9kM7IL8mo5kl', '_blank')} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-6 py-4 rounded-xl">
                                    <DollarSign className="w-5 h-5 mr-2" /> Make a Donation Too
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}