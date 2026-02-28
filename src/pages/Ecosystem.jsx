import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, ChevronUp, Wifi, Thermometer, Server, GraduationCap, ArrowRight, DollarSign, TrendingUp, Users, Building2 } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

const businessLines = [
    {
        id: 'tech-rentals',
        icon: Server,
        color: 'cyan',
        pillar: 'Pillar 01',
        title: 'Tech Infrastructure Rentals',
        subtitle: 'The Film & TV Industry Play',
        tagline: 'Renting premium UniFi gear to productions that can\'t afford downtime.',
        overview: 'Atlanta and the Southeast have become the Hollywood of the East. Major productions need enterprise-grade networking gear on demand — and they pay premium day rates. OverIT rents UniFi infrastructure packages to film/TV productions, corporate events, and pop-up locations.',
        keyPoints: [
            'Daily/weekly/monthly rental model — no subscription lock-in for the client',
            'UniFi gear has zero ongoing licensing fees, making margins exceptional',
            'Graduate technicians from the training center become independent rental operators',
            'Gear returns to inventory between gigs, maintaining asset utilization above 70%',
            'Competitive comparison: Meter.com charges $5/port/month plus subscriptions — OverIT eliminates that entirely',
        ],
        metrics: [
            { label: 'Average Daily Rental Rate', value: '$2,500+' },
            { label: 'Asset Utilization Target', value: '70%+' },
            { label: 'Net Margin', value: '85%+' },
        ],
        synergy: 'Training graduates become independent contractors who manage rental deployments — creating jobs while reducing OverIT\'s labor cost.'
    },
    {
        id: 'refrigeration',
        icon: Thermometer,
        color: 'blue',
        pillar: 'Pillar 02',
        title: 'Refrigeration Temperature Monitoring',
        subtitle: 'Food Safety Compliance as a Service',
        tagline: 'Automated compliance. Real-time alerts. National reach. Zero OpEx for the client.',
        overview: 'Restaurants, grocery chains, and food distributors face strict FDA and local health compliance requirements for refrigeration. Manual temperature logs are error-prone and labor-intensive. OverIT deploys UniFi-based IoT sensors that automate this entirely — generating compliance reports automatically and sending real-time alerts when temperatures deviate.',
        keyPoints: [
            'Uses UniFi sensors already in the OverIT ecosystem — no new hardware learning curve',
            'Asset-light model: low deployment cost, high recurring monitoring value',
            'Automated FDA-compliant temperature logs eliminate manual employee tasks',
            'Real-time SMS/email alerts prevent spoilage and health code violations',
            'Scales nationally through certified alumni network — any city, any chain',
            'Students learn IoT deployment during training, then earn fees managing client networks',
        ],
        metrics: [
            { label: 'Monthly Monitoring Fee', value: '$150–$400/location' },
            { label: 'Deployment Cost', value: 'Sub-$500/location' },
            { label: 'National Reach', value: 'Via Alumni Network' },
        ],
        synergy: 'Trained OverIT alumni in any city can deploy and manage refrigeration monitoring contracts — the training center creates the workforce that powers this business line nationwide.'
    },
    {
        id: 'micro-isp',
        icon: Wifi,
        color: 'purple',
        pillar: 'Pillar 03',
        title: 'Micro ISP',
        subtitle: 'Ubiquiti UISP Architecture — Disrupting MDU/MTE Telecom',
        tagline: 'We don\'t compete with Comcast. We make Comcast irrelevant for entire buildings.',
        overview: 'Multi-Dwelling Units (MDUs) and Multi-Tenant Environments (MTEs) — apartment complexes, condominiums, office parks — are captive audiences for overpriced ISPs. OverIT deploys Ubiquiti UISP infrastructure to deliver building-wide internet at a fraction of the cost, with an 80/20 revenue-sharing model that benefits property owners.',
        keyPoints: [
            '80/20 revenue share: OverIT keeps 80%, property owner earns 20% passively',
            'Residents get competitive broadband pricing with no ISP contracts',
            'UISP architecture is purpose-built for multi-tenant ISP deployments',
            'Property owners benefit from a new revenue stream — often their first',
            'Trained OverIT students become UISP certified and manage local installations',
            'Creates recurring monthly revenue that grows with each building onboarded',
        ],
        metrics: [
            { label: 'Revenue Share (OverIT)', value: '80%' },
            { label: 'Property Owner Passive Income', value: '20%' },
            { label: 'Model', value: 'Recurring Monthly' },
        ],
        synergy: 'The Micro ISP model is the capstone of the student journey — UISP Broadband certification from the training center feeds directly into managing live ISP networks.'
    },
];

const colorMap = {
    cyan: {
        bg: 'from-cyan-950/40 to-slate-900/30',
        border: 'border-cyan-800/50',
        icon: 'bg-cyan-500/10 text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        accent: 'text-cyan-400',
        metricBg: 'bg-cyan-950/30 border-cyan-800/30',
        synergy: 'bg-cyan-950/20 border-cyan-700/40 text-cyan-300',
    },
    blue: {
        bg: 'from-blue-950/40 to-slate-900/30',
        border: 'border-blue-800/50',
        icon: 'bg-blue-500/10 text-blue-400',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        accent: 'text-blue-400',
        metricBg: 'bg-blue-950/30 border-blue-800/30',
        synergy: 'bg-blue-950/20 border-blue-700/40 text-blue-300',
    },
    purple: {
        bg: 'from-purple-950/40 to-slate-900/30',
        border: 'border-purple-800/50',
        icon: 'bg-purple-500/10 text-purple-400',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        accent: 'text-purple-400',
        metricBg: 'bg-purple-950/30 border-purple-800/30',
        synergy: 'bg-purple-950/20 border-purple-700/40 text-purple-300',
    },
};

function BusinessLineCard({ line, index }) {
    const [expanded, setExpanded] = useState(false);
    const colors = colorMap[line.color];
    const Icon = line.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}
        >
            {/* Header */}
            <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold mb-2 ${colors.badge}`}>
                                {line.pillar}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{line.title}</h3>
                            <p className={`text-sm font-medium ${colors.accent} mb-2`}>{line.subtitle}</p>
                            <p className="text-slate-300 italic">"{line.tagline}"</p>
                        </div>
                    </div>

                    {/* Metrics Summary */}
                    <div className="hidden md:flex gap-3 flex-shrink-0">
                        {line.metrics.map((m, i) => (
                            <div key={i} className={`${colors.metricBg} border rounded-xl p-3 text-center min-w-[100px]`}>
                                <div className={`text-lg font-bold ${colors.accent}`}>{m.value}</div>
                                <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-slate-300 mt-4 leading-relaxed">{line.overview}</p>

                {/* Mobile Metrics */}
                <div className="flex md:hidden gap-3 mt-4 flex-wrap">
                    {line.metrics.map((m, i) => (
                        <div key={i} className={`${colors.metricBg} border rounded-xl p-3 text-center flex-1 min-w-[100px]`}>
                            <div className={`text-lg font-bold ${colors.accent}`}>{m.value}</div>
                            <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`mt-6 flex items-center gap-2 text-sm font-semibold ${colors.accent} hover:opacity-80 transition-opacity`}
                >
                    {expanded ? 'Show Less' : 'See Full Details'}
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-8 pt-0 border-t border-slate-700/50">
                            <div className="pt-6">
                                <h4 className="text-white font-semibold mb-4 text-lg">Key Business Points</h4>
                                <div className="space-y-3 mb-6">
                                    {line.keyPoints.map((point, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <ArrowRight className={`w-4 h-4 ${colors.accent} flex-shrink-0 mt-1`} />
                                            <span className="text-slate-300 text-sm">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={`${colors.synergy} border rounded-xl p-4`}>
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">Training Synergy</div>
                                            <p className="text-sm">{line.synergy}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Ecosystem() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Shield className="w-6 h-6 text-cyan-400" />
                        <span className="font-bold text-xl text-white">OverIT</span>
                    </Link>
                    <div className="flex items-center gap-4 text-sm">
                        <Link to={createPageUrl('Home')} className="text-slate-300 hover:text-cyan-400 transition-colors">← Home</Link>
                        <Link to={createPageUrl('Training')} className="text-slate-300 hover:text-purple-400 transition-colors">Training Program →</Link>
                    </div>
                </div>
            </nav>

            <div className="pt-24 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                            <Building2 className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm font-medium">The OverIT Ecosystem</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Three Business Lines.<br />
                            <span className="text-cyan-400">One Ecosystem.</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                            Every business line reinforces the others. Training creates the workforce. The workforce powers the services. The services fund more training. It's a flywheel — not a startup.
                        </p>

                        {/* Flywheel visual */}
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            {['Train → ', 'Deploy → ', 'Earn → ', 'Train More'].map((step, i) => (
                                <div key={i} className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    i === 3
                                        ? 'bg-cyan-500 text-slate-950'
                                        : 'bg-slate-800 text-cyan-400 border border-slate-700'
                                }`}>
                                    {step}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Business Lines */}
                    <div className="space-y-8 mb-20">
                        {businessLines.map((line, index) => (
                            <BusinessLineCard key={line.id} line={line} index={index} />
                        ))}
                    </div>

                    {/* Combined Revenue Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700 rounded-2xl p-10 text-center mb-12"
                    >
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            {[
                                { label: 'Multi-Family Retrofit', value: '$216K', color: 'text-cyan-400' },
                                { label: 'National Training', value: '$304K', color: 'text-purple-400' },
                                { label: 'Retail / Rentals', value: '$72K', color: 'text-green-400' },
                                { label: 'Monitoring / ISP', value: 'Growing', color: 'text-blue-400' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className={`text-3xl font-bold ${item.color} mb-1`}>{item.value}</div>
                                    <div className="text-sm text-slate-400">{item.label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-700 pt-8">
                            <div className="text-sm text-cyan-400 font-semibold mb-2">TOTAL YEAR 3 COMBINED REVENUE</div>
                            <div className="text-6xl font-bold text-white mb-2">$606,360+</div>
                            <div className="text-slate-400">with 78% net profit margin = $470,753 net income</div>
                        </div>
                    </motion.div>

                    {/* CTA to Training Page */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-purple-950/50 to-cyan-950/50 border border-purple-700/50 rounded-2xl p-10 text-center"
                    >
                        <GraduationCap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-4">
                            The Engine Behind Everything: Training
                        </h3>
                        <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                            Every business line above is powered by certified graduates from OverIT's National Training Center. 
                            Learn how we're building the tech workforce of tomorrow.
                        </p>
                        <Link
                            to={createPageUrl('Training')}
                            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                        >
                            Explore the Training Program
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}