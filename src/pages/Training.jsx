import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, GraduationCap, Users, TrendingUp, DollarSign, Wifi, Award, ArrowRight, Building2, Cpu, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const pillars = [
    {
        id: 'incubator',
        number: '01',
        title: 'Incubating the Next IT Workforce',
        color: 'emerald',
        icon: Users,
        headline: 'SBA Job Creation Mandate',
        content: `The SBA's core mission is job creation and community economic development. By approving this loan, the SBA directly funds an incubator that trains independent IT professionals — not W-2 employees, but self-sustaining small business owners who create their own jobs and hire others.`,
        details: [
            {
                title: 'The Multiplier Effect',
                body: 'Every graduate of the OverIT training program becomes an independent contractor with the skills, certifications, and connections to build their own IT service business. One student trained = multiple jobs created downstream.',
            },
            {
                title: 'National Alumni Network',
                body: 'Graduates join a certified peer network that spans every major metro area. This network becomes the deployment force for OverIT\'s Micro ISP, refrigeration monitoring, and rental services — creating a national franchise-like model without franchise fees.',
            },
            {
                title: 'Training Independent IT Professionals',
                body: 'We are not training employees. We are incubating entrepreneurs. Students leave with Ubiquiti certifications, a book of business introductions, and the technical capability to immediately generate income.',
            },
        ],
        stats: [
            { label: 'Target Grads/Year', value: '100+' },
            { label: 'Avg Starting Income', value: '$60K+' },
            { label: 'Career Placement', value: '85%' },
        ],
    },
    {
        id: 'studio',
        number: '02',
        title: 'National Training Studio',
        color: 'cyan',
        icon: Cpu,
        headline: 'Glen Iris Drive — Certified Training Facility',
        content: `455 Glen Iris Drive NE is more than a showroom. The property becomes OverIT's certified Ubiquiti training studio — a live, production-grade UniFi environment where students train on real gear solving real problems.`,
        details: [
            {
                title: 'Live Lab Environment',
                body: 'The entire building is wired with UniFi infrastructure: access points, switches, cameras, access control, and VoIP — all live and operational. Students train in the same environment they\'ll deploy in the field.',
            },
            {
                title: 'Authorized Ubiquiti Education Partner',
                body: 'OverIT operates as an authorized Ubiquiti Academy, giving graduates certifications that are globally recognized and increasingly required by property managers, enterprise clients, and ISPs.',
            },
            {
                title: 'Virtual + In-Person Hybrid',
                body: 'The studio doubles as a professional broadcast facility for virtual instructor-led training (VILT). Students anywhere in the country — or world — can take OverIT courses. This is how training revenue scales beyond the Atlanta market.',
            },
        ],
        stats: [
            { label: 'In-Person Tuition', value: '$1,995/seat' },
            { label: 'Virtual Tuition', value: 'Up to $5,000/seat' },
            { label: 'Format', value: 'Hybrid VILT' },
        ],
    },
    {
        id: 'center',
        number: '03',
        title: 'National Training Center Revenue',
        color: 'purple',
        icon: DollarSign,
        headline: 'Training Alone Covers the SBA Debt 10x Over',
        content: `The training business is not a charitable add-on. It is a high-margin, scalable revenue engine. In-person courses and virtual instructor-led training generate premium tuition with minimal marginal cost per student.`,
        details: [
            {
                title: 'In-Person Revenue Model',
                body: 'At $1,995/seat with 12 students per cohort, each in-person training session generates $23,940 gross. After instructor cost and materials ($420 net per seat), each cohort nets $19,080. Running 8 cohorts/year = $152,640 from in-person alone.',
            },
            {
                title: 'Virtual Revenue Model',
                body: 'Virtual sessions seat up to 20 students at up to $5,000/seat for advanced tracks. Lower delivery cost, higher margin, unlimited geographic reach. A single virtual cohort can generate $50,000–$100,000 gross.',
            },
            {
                title: 'Year 3 Projections',
                body: 'Combined in-person and virtual training is projected to generate $304,000 in Year 3 revenue with a 78% net margin — $236,000 net income from training alone. This single line item services the entire SBA loan and then some.',
            },
        ],
        stats: [
            { label: 'Year 3 Training Revenue', value: '$304K' },
            { label: 'Net Margin', value: '78%' },
            { label: 'Net Income (Training)', value: '$236K' },
        ],
    },
    {
        id: 'network',
        number: '04',
        title: 'Certified Peers & Alumni Network',
        color: 'orange',
        icon: Globe,
        headline: 'A National Network of Certified Professionals',
        content: `The long-term value of OverIT is not just the revenue it generates — it's the network it builds. Every graduate becomes a node in a national mesh of certified UniFi professionals who trust each other, refer work to each other, and collectively power OverIT's service lines.`,
        details: [
            {
                title: 'Peer Referral Economy',
                body: 'Alumni in Atlanta refer leads to peers in Dallas, Miami, or Chicago — and those peers return the favor. OverIT takes a modest referral fee on cross-market placements, creating a revenue stream that grows automatically as the network expands.',
            },
            {
                title: 'Certified Deployment Force',
                body: 'When OverIT wins a national refrigeration monitoring contract or a multi-city Micro ISP deployment, alumni are the boots on the ground. OverIT earns the contract margin; alumni earn the deployment fee. No payroll. No overhead.',
            },
            {
                title: 'The Alumni Advantage',
                body: 'Alumni receive preferred access to OverIT rental inventory, priority deal flow from the SDR team, co-marketing support, and early access to new certification tracks. Staying in the network has compounding value.',
            },
        ],
        stats: [
            { label: 'Network Growth', value: '100+/yr' },
            { label: 'Referral Revenue', value: 'Passive' },
            { label: 'Deployment Model', value: '1099/Contract' },
        ],
    },
];

const colorMap = {
    emerald: {
        bg: 'from-emerald-950/40 to-slate-900/30',
        border: 'border-emerald-800/50',
        icon: 'bg-emerald-500/10 text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        accent: 'text-emerald-400',
        number: 'text-emerald-900/40',
        stat: 'text-emerald-400',
        detail: 'border-l-emerald-500/50',
    },
    cyan: {
        bg: 'from-cyan-950/40 to-slate-900/30',
        border: 'border-cyan-800/50',
        icon: 'bg-cyan-500/10 text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        accent: 'text-cyan-400',
        number: 'text-cyan-900/40',
        stat: 'text-cyan-400',
        detail: 'border-l-cyan-500/50',
    },
    purple: {
        bg: 'from-purple-950/40 to-slate-900/30',
        border: 'border-purple-800/50',
        icon: 'bg-purple-500/10 text-purple-400',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        accent: 'text-purple-400',
        number: 'text-purple-900/40',
        stat: 'text-purple-400',
        detail: 'border-l-purple-500/50',
    },
    orange: {
        bg: 'from-orange-950/40 to-slate-900/30',
        border: 'border-orange-800/50',
        icon: 'bg-orange-500/10 text-orange-400',
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        accent: 'text-orange-400',
        number: 'text-orange-900/40',
        stat: 'text-orange-400',
        detail: 'border-l-orange-500/50',
    },
};

function PillarCard({ pillar, index }) {
    const [expanded, setExpanded] = useState(false);
    const colors = colorMap[pillar.color];
    const Icon = pillar.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl overflow-hidden`}
        >
            <div className="p-8 md:p-10">
                {/* Header Row */}
                <div className="flex items-start gap-6 mb-6">
                    <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-3 ${colors.badge}`}>
                            PILLAR {pillar.number}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{pillar.title}</h3>
                        <p className={`text-sm font-semibold ${colors.accent}`}>{pillar.headline}</p>
                    </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 text-lg">{pillar.content}</p>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-4 mb-6">
                    {pillar.stats.map((stat, i) => (
                        <div key={i} className="bg-slate-950/50 border border-slate-700 rounded-xl px-5 py-3 text-center flex-1 min-w-[120px]">
                            <div className={`text-xl font-bold ${colors.stat}`}>{stat.value}</div>
                            <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`flex items-center gap-2 text-sm font-semibold ${colors.accent} hover:opacity-80 transition-opacity`}
                >
                    {expanded ? 'Collapse Details' : 'See Full Details'}
                    <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                </button>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 md:px-10 pb-8 pt-0 border-t border-slate-700/50">
                            <div className="pt-6 space-y-5">
                                {pillar.details.map((detail, i) => (
                                    <div key={i} className={`border-l-4 ${colors.detail} pl-4`}>
                                        <h4 className="font-bold text-white mb-1">{detail.title}</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">{detail.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Training() {
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
                        <Link to={createPageUrl('Ecosystem')} className="text-slate-300 hover:text-cyan-400 transition-colors">← The Ecosystem</Link>
                        <Link to={createPageUrl('Home')} className="text-slate-300 hover:text-purple-400 transition-colors">Home</Link>
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                            <GraduationCap className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 text-sm font-medium">National Training Program</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            Educating the Tech<br />
                            <span className="text-purple-400">Business Leaders of Tomorrow</span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-6">
                            A national network of Certified Peers and Alumni — trained in Atlanta, deployed everywhere.
                        </p>
                        <div className="inline-block bg-emerald-900/20 border border-emerald-700/50 rounded-xl px-6 py-4 max-w-2xl">
                            <p className="text-lg font-semibold text-emerald-400">
                                Since 2012, Ubiquiti Academy has trained 50,000+ students worldwide. OverIT brings this engine to the American community — turning certifications into careers and careers into businesses.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pillars */}
                    <div className="space-y-8 mb-20">
                        {pillars.map((pillar, index) => (
                            <PillarCard key={pillar.id} pillar={pillar} index={index} />
                        ))}
                    </div>

                    {/* Revenue Summary Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-purple-900/30 via-cyan-900/20 to-emerald-900/30 border border-purple-700/50 rounded-2xl p-10 text-center mb-12"
                    >
                        <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Training Revenue Alone Services the SBA Loan
                        </h3>
                        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-8">
                            <div className="bg-slate-900/50 rounded-xl p-6">
                                <div className="text-4xl font-bold text-purple-400 mb-2">$304K</div>
                                <div className="text-slate-300">Year 3 Training Revenue</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-6">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">78%</div>
                                <div className="text-slate-300">Net Profit Margin</div>
                            </div>
                            <div className="bg-slate-900/50 rounded-xl p-6">
                                <div className="text-4xl font-bold text-emerald-400 mb-2">10x</div>
                                <div className="text-slate-300">Loan Coverage Ratio</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <Link
                            to={createPageUrl('Ecosystem')}
                            className="bg-gradient-to-br from-cyan-950/40 to-slate-900/30 border border-cyan-800/50 rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform"
                        >
                            <Building2 className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">The OverIT Ecosystem</h4>
                            <p className="text-slate-400 text-sm mb-4">See how training powers Tech Rentals, Refrigeration Monitoring, and Micro ISP.</p>
                            <span className="text-cyan-400 font-semibold flex items-center justify-center gap-2">
                                Explore Ecosystem <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>

                        <Link
                            to={createPageUrl('Home')}
                            className="bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-slate-700 rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform"
                        >
                            <Shield className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">Full Investor Deck</h4>
                            <p className="text-slate-400 text-sm mb-4">Review financials, the property, the team, and pledge capital.</p>
                            <span className="text-slate-300 font-semibold flex items-center justify-center gap-2">
                                Back to Home <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}