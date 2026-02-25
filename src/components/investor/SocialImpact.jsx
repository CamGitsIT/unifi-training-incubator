import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, TrendingUp, Award, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const certifications = [
    {
        id: 'ufsp',
        name: 'UniFi Full Stack Pro (UFSP)',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6a2744e35_UFSP.png',
        color: 'cyan',
        description: 'Master-level certification covering all UniFi ecosystems: Network, Access, Protect, and Talk. The gold standard for enterprise UniFi deployments.',
        jobRoles: [
            'Senior Network Engineer',
            'UniFi Systems Architect',
            'IT Infrastructure Consultant',
            'Enterprise Solutions Engineer'
        ],
        salaryRange: '$75,000 - $120,000',
        avgSalary: '$95,000',
        testimonial: {
            quote: "UFSP certification opened doors I didn't know existed. I went from fixing computers to designing entire building networks.",
            author: "Marcus T.",
            role: "Independent Network Consultant",
            outcome: "Now billing $125/hr, 3x previous income"
        },
        skillsGained: ['Advanced networking', 'Multi-site deployments', 'Enterprise security', 'System integration']
    },
    {
        id: 'uwa',
        name: 'UniFi Wireless Admin (UWA)',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c09284845_UWA.png',
        color: 'purple',
        description: 'Specialized in wireless network design, deployment, and optimization. Perfect for RF specialists and wireless infrastructure professionals.',
        jobRoles: [
            'Wireless Network Specialist',
            'RF Engineer',
            'WiFi Infrastructure Technician',
            'Network Performance Analyst'
        ],
        salaryRange: '$55,000 - $85,000',
        avgSalary: '$68,000',
        testimonial: {
            quote: "UWA gave me the skills to turn WiFi problems into business opportunities. Every apartment complex needs someone who understands this.",
            author: "Sarah K.",
            role: "Wireless Solutions Contractor",
            outcome: "Built $180K/year business in 18 months"
        },
        skillsGained: ['RF planning', 'Coverage optimization', 'Client troubleshooting', 'Performance tuning']
    },
    {
        id: 'unp',
        name: 'UniFi Network Pro (UNP)',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bd417d1c5_badge_-_unp.png',
        color: 'green',
        description: 'Core networking certification focused on switching, routing, and network management. The foundation for all UniFi careers.',
        jobRoles: [
            'Network Technician',
            'IT Support Specialist',
            'Systems Administrator',
            'Network Operations Tech'
        ],
        salaryRange: '$45,000 - $70,000',
        avgSalary: '$55,000',
        testimonial: {
            quote: "UNP was my entry ticket into IT. Three months after certification, I had steady contract work and real career momentum.",
            author: "DeShawn R.",
            role: "Network Technician",
            outcome: "From retail to IT in 6 months"
        },
        skillsGained: ['Network fundamentals', 'VLAN configuration', 'Security basics', 'Troubleshooting']
    },
    {
        id: 'ubwa',
        name: 'UISP Broadband Wireless Admin',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/83afa6889_UBWA.png',
        color: 'blue',
        description: 'Specialized in wireless ISP infrastructure and point-to-point/point-to-multipoint deployments. Critical for rural connectivity projects.',
        jobRoles: [
            'WISP Technician',
            'Broadband Installation Specialist',
            'Rural Connectivity Engineer',
            'Fixed Wireless Installer'
        ],
        salaryRange: '$50,000 - $80,000',
        avgSalary: '$62,000',
        testimonial: {
            quote: "UISP certification let me bring internet to underserved communities while building a sustainable business. It's work with real impact.",
            author: "James L.",
            role: "WISP Installer",
            outcome: "Serving 200+ rural customers"
        },
        skillsGained: ['WISP deployment', 'Point-to-point links', 'LOS planning', 'Outdoor installations']
    },
    {
        id: 'ubws',
        name: 'UISP Broadband Wireless Specialist',
        badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/1d2fd55e5_UBWS.png',
        color: 'orange',
        description: 'Advanced WISP operations including network planning, subscriber management, and ISP business operations.',
        jobRoles: [
            'WISP Network Manager',
            'Broadband Operations Lead',
            'ISP Solutions Architect',
            'Rural Telecom Consultant'
        ],
        salaryRange: '$60,000 - $95,000',
        avgSalary: '$75,000',
        testimonial: {
            quote: "Started as a technician, got UBWS certified, now I manage networks for three rural ISPs. The demand is endless.",
            author: "Patricia M.",
            role: "Regional WISP Manager",
            outcome: "Managing 1,500+ subscribers across 3 counties"
        },
        skillsGained: ['ISP operations', 'Network design', 'Subscriber management', 'Business planning']
    }
];

const colorClasses = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', ring: 'ring-cyan-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', ring: 'ring-purple-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', ring: 'ring-green-500' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', ring: 'ring-orange-500' }
};

export default function SocialImpact() {
    const [activeCert, setActiveCert] = useState('ufsp');
    const [showTabHint, setShowTabHint] = useState(true);
    const currentCert = certifications.find(c => c.id === activeCert);
    const colors = colorClasses[currentCert?.color || 'cyan'];

    // Auto-rotate certifications to show interactivity
    React.useEffect(() => {
        const hintTimer = setTimeout(() => setShowTabHint(false), 5000);
        return () => clearTimeout(hintTimer);
    }, []);

    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">SBA Community Impact</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Creating the Next IT Workforce
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                        Since 2012, Ubiquiti Academy has trained <strong className="text-white">50,000+ students worldwide</strong>. 
                        OverIT brings this engine to the local community—training independent contractors, not W-2 employees.
                    </p>
                    <div className="inline-block bg-emerald-900/20 border border-emerald-700/50 rounded-xl px-6 py-4">
                        <p className="text-lg font-semibold text-emerald-400">
                            By approving this loan, the SBA is funding an incubator that creates independent 
                            contractors and tax-contributing small businesses across the region.
                        </p>
                    </div>
                </motion.div>

                {/* Interactive Certification Case Studies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Tabs value={activeCert} onValueChange={(val) => { setActiveCert(val); setShowTabHint(false); }} className="w-full">
                        <div className="relative">
                            {showTabHint && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-sm text-cyan-400 whitespace-nowrap animate-bounce z-10">
                                    👇 Click badges to explore different certifications
                                </div>
                            )}
                            <TabsList className={`grid w-full grid-cols-5 bg-slate-800/50 p-2 rounded-xl mb-8 ${showTabHint ? 'ring-2 ring-cyan-500/50 animate-pulse' : ''}`}>
                                {certifications.map(cert => (
                                    <TabsTrigger 
                                        key={cert.id} 
                                        value={cert.id}
                                        className="data-[state=active]:bg-slate-700 rounded-lg hover:scale-110 transition-transform"
                                    >
                                        <img src={cert.badge} alt={cert.name} className="w-8 h-8" />
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <AnimatePresence mode="wait">
                            {certifications.map(cert => (
                                <TabsContent key={cert.id} value={cert.id}>
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`bg-slate-800/30 border ${colorClasses[cert.color].border} rounded-2xl p-8`}>
                                            {/* Header */}
                                            <div className="flex items-start gap-6 mb-8">
                                                <img src={cert.badge} alt={cert.name} className="w-20 h-20 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <h3 className="text-3xl font-bold text-white mb-3">{cert.name}</h3>
                                                    <p className="text-lg text-slate-300">{cert.description}</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                                {/* Job Roles */}
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Briefcase className={`w-5 h-5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white">Job Roles</h4>
                                                        </div>
                                                        <ul className="space-y-2">
                                                            {cert.jobRoles.map((role, i) => (
                                                                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                                    <span className={`${colorClasses[cert.color].text} mt-1`}>•</span>
                                                                    {role}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>

                                                {/* Salary Info */}
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <DollarSign className={`w-5 h-5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white">Earning Potential</h4>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">Salary Range</div>
                                                                <div className="text-lg font-bold text-white">{cert.salaryRange}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-xs text-slate-400 mb-1">Average Starting</div>
                                                                <div className={`text-2xl font-bold ${colorClasses[cert.color].text}`}>
                                                                    {cert.avgSalary}/year
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Skills */}
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <Award className={`w-5 h-5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white">Skills Gained</h4>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cert.skillsGained.map((skill, i) => (
                                                                <span 
                                                                    key={i} 
                                                                    className={`${colorClasses[cert.color].bg} ${colorClasses[cert.color].text} text-xs px-3 py-1 rounded-full border ${colorClasses[cert.color].border}`}
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            {/* Testimonial */}
                                            <div className={`${colorClasses[cert.color].bg} border ${colorClasses[cert.color].border} rounded-xl p-6`}>
                                                <div className="flex items-start gap-4">
                                                    <TrendingUp className={`w-6 h-6 ${colorClasses[cert.color].text} flex-shrink-0 mt-1`} />
                                                    <div className="flex-1">
                                                        <blockquote className="text-lg text-white mb-4 italic">
                                                            "{cert.testimonial.quote}"
                                                        </blockquote>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-semibold text-white">{cert.testimonial.author}</div>
                                                                <div className="text-sm text-slate-400">{cert.testimonial.role}</div>
                                                            </div>
                                                            <div className={`${colorClasses[cert.color].text} font-bold text-right`}>
                                                                <div className="text-xs text-slate-400">Success Story</div>
                                                                <div>{cert.testimonial.outcome}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            ))}
                        </AnimatePresence>
                    </Tabs>
                </motion.div>

                {/* Impact Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-emerald-950/50 to-cyan-950/50 border border-emerald-700/50 rounded-2xl p-12 text-center"
                >
                    <Lightbulb className="w-12 h-12 text-emerald-400 mx-auto mb-6" />
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        We don't hire installers. We create them.
                    </h3>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                        Training 100+ local IT professionals per year through Ubiquiti Academy and feeding them 
                        turnkey projects. Each graduate becomes an independent small business creating jobs and tax revenue.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-slate-900/50 rounded-xl p-6">
                            <div className="text-4xl font-bold text-emerald-400 mb-2">100+</div>
                            <div className="text-slate-300">Technicians Trained/Year</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">$60K+</div>
                            <div className="text-slate-300">Average Starting Salary</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-xl p-6">
                            <div className="text-4xl font-bold text-purple-400 mb-2">85%</div>
                            <div className="text-slate-300">Career Placement Rate</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}