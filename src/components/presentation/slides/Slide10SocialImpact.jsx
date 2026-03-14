import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, TrendingUp, Award, Users, Sparkles, Wifi, Lock, Globe, Server, GraduationCap, Cpu, Building2, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const certifications = [
    { id: 'ufsp', name: 'UniFi Full Stack Pro (UFSP)', badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/7c8142c84_UFSP.png', icon: Sparkles, color: 'cyan', description: 'Master-level certification covering all UniFi ecosystems.', jobRoles: ['Senior Network Engineer', 'UniFi Systems Architect', 'IT Infrastructure Consultant', 'Enterprise Solutions Engineer'], salaryRange: '$75,000 – $120,000', avgSalary: '$95,000', testimonial: { quote: "UFSP certification opened doors I didn't know existed. I went from fixing computers to designing entire building networks.", author: 'Marcus T.', role: 'Independent Network Consultant', outcome: 'Now billing $125/hr, 3x previous income' }, skillsGained: ['Advanced networking', 'Multi-site deployments', 'Enterprise security', 'System integration'] },
    { id: 'uwa', name: 'UniFi Wireless Admin (UWA)', badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/9f314185d_UWA.png', icon: Wifi, color: 'purple', description: 'Specialized in wireless network design, deployment, and optimization.', jobRoles: ['Wireless Network Specialist', 'RF Engineer', 'WiFi Infrastructure Technician', 'Network Performance Analyst'], salaryRange: '$55,000 – $85,000', avgSalary: '$68,000', testimonial: { quote: 'UWA gave me the skills to turn WiFi problems into business opportunities.', author: 'Sarah K.', role: 'Wireless Solutions Contractor', outcome: 'Built $180K/year business in 18 months' }, skillsGained: ['RF planning', 'Coverage optimization', 'Client troubleshooting', 'Performance tuning'] },
    { id: 'unp', name: 'UniFi Network Pro (UNP)', badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/92d16a714_badge_-_unp.png', icon: Server, color: 'green', description: 'Core networking certification focused on switching, routing, and network management.', jobRoles: ['Network Technician', 'IT Support Specialist', 'Systems Administrator', 'Network Operations Tech'], salaryRange: '$45,000 – $70,000', avgSalary: '$55,000', testimonial: { quote: 'UNP was my entry ticket into IT. Three months after certification, I had steady contract work.', author: 'DeShawn R.', role: 'Network Technician', outcome: 'From retail to IT in 6 months' }, skillsGained: ['Network fundamentals', 'VLAN configuration', 'Security basics', 'Troubleshooting'] },
    { id: 'ubwa', name: 'UISP Broadband Wireless Admin (UBWA)', badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/d8c4f8c6a_UBWA.png', icon: Globe, color: 'blue', description: 'Specialized in wireless ISP infrastructure and point-to-point deployments.', jobRoles: ['WISP Technician', 'Broadband Installation Specialist', 'Rural Connectivity Engineer', 'Fixed Wireless Installer'], salaryRange: '$50,000 – $80,000', avgSalary: '$62,000', testimonial: { quote: 'UISP certification let me bring internet to underserved communities while building a sustainable business.', author: 'James L.', role: 'WISP Installer', outcome: 'Serving 200+ rural customers' }, skillsGained: ['WISP deployment', 'Point-to-point links', 'LOS planning', 'Outdoor installations'] },
    { id: 'ubws', name: 'UISP Broadband Wireless Specialist (UBWS)', badge: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/3544350df_UBWS.png', icon: Lock, color: 'orange', description: 'Advanced WISP operations including network planning and ISP business operations.', jobRoles: ['WISP Network Manager', 'Broadband Operations Lead', 'ISP Solutions Architect', 'Rural Telecom Consultant'], salaryRange: '$60,000 – $95,000', avgSalary: '$75,000', testimonial: { quote: 'Started as a technician, got UBWS certified, now I manage networks for three rural ISPs.', author: 'Patricia M.', role: 'Regional WISP Manager', outcome: 'Managing 1,500+ subscribers across 3 counties' }, skillsGained: ['ISP operations', 'Network design', 'Subscriber management', 'Business planning'] }
];

const colorClasses = {
    cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400'   },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400'  },
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400'   },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' }
};

function EcosystemFlywheel() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const SPEED = 3000;
    const coreColor = "#3B82F6";

    const steps = [
        { id: 'training',    title: 'Training',          description: 'Creates job-ready, certified installers.',         icon: <GraduationCap className="w-7 h-7" /> },
        { id: 'installers',  title: 'Installers',        description: 'Alumni need a steady pipeline of paid work.',      icon: <Users className="w-7 h-7" /> },
        { id: 'ai',          title: 'AI Lead Gen',       description: 'Finds and qualifies projects for the network.',    icon: <Cpu className="w-7 h-7" /> },
        { id: 'experience',  title: 'Experience Center', description: 'Closes deals. Demos convert to signed contracts.', icon: <Building2 className="w-7 h-7" /> },
        { id: 'revenue',     title: 'Revenue',           description: 'Flows back — funds more training, more cohorts.',  icon: <DollarSign className="w-7 h-7" /> },
    ];

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => setActiveStep(p => (p + 1) % steps.length), SPEED);
        return () => clearInterval(interval);
    }, [isPlaying, steps.length]);

    const radius = 150;
    const cx = 240, cy = 240;

    const getCoords = (i) => {
        const angle = (i * 2 * Math.PI) / steps.length - Math.PI / 2;
        return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    };

    return (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
                {/* SVG wheel */}
                <div className="flex-shrink-0 w-full lg:w-[420px] p-6 flex items-center justify-center">
                    <svg viewBox="0 0 480 480" className="w-full max-w-[360px]">
                        <circle cx={cx} cy={cy} r="195" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" />
                        {steps.map((_, i) => {
                            const start = getCoords(i);
                            const end   = getCoords((i + 1) % steps.length);
                            const isActive = activeStep === i;
                            const qx = cx + (start.x + end.x - cx * 2) * 0.25;
                            const qy = cy + (start.y + end.y - cy * 2) * 0.25;
                            const pathD = `M ${start.x} ${start.y} Q ${qx} ${qy} ${end.x} ${end.y}`;
                            return (
                                <g key={`arc-${i}`}>
                                    <path d={pathD} fill="none"
                                        stroke={isActive ? coreColor : '#334155'}
                                        strokeWidth={isActive ? 3 : 1.5}
                                        strokeDasharray={isActive ? 'none' : '4 4'}
                                        className="transition-all duration-500" />
                                    {isActive && isPlaying && (
                                        <circle r="5" fill={coreColor} opacity="0.9">
                                            <animateMotion dur={`${SPEED / 1000}s`} repeatCount="indefinite" path={pathD} />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}
                        {steps.map((step, i) => {
                            const { x, y } = getCoords(i);
                            const isSrc  = activeStep === i;
                            const isDest = activeStep === (i === 0 ? steps.length - 1 : i - 1);
                            const isLit  = isSrc || isDest;
                            return (
                                <g key={step.id} className="cursor-pointer" onClick={() => setActiveStep(i)}>
                                    {isLit && <circle cx={x} cy={y} r="46" fill={coreColor} fillOpacity="0.08">
                                        <animate attributeName="r" values="42;50;42" dur="2.5s" repeatCount="indefinite" />
                                    </circle>}
                                    <circle cx={x} cy={y} r={isSrc ? 38 : 32}
                                        fill="#1e293b"
                                        stroke={isLit ? coreColor : '#475569'}
                                        strokeWidth={isSrc ? 3 : 1.5}
                                        className="transition-all duration-500" />
                                    <foreignObject x={x - 16} y={y - 16} width="32" height="32">
                                        <div className={`flex items-center justify-center w-full h-full transition-colors duration-500 ${isLit ? 'text-blue-400' : 'text-slate-500'}`}>
                                            {step.icon}
                                        </div>
                                    </foreignObject>
                                    <text x={x} y={y + 50} textAnchor="middle" fontSize="9" fontWeight="700"
                                        fill={isLit ? '#f1f5f9' : '#64748b'} className="transition-all duration-500">
                                        {step.title}
                                    </text>
                                </g>
                            );
                        })}
                        {/* Center */}
                        <circle cx={cx} cy={cy} r="52" fill="#1e293b" stroke={coreColor} strokeWidth="1.5" />
                        <circle cx={cx} cy={cy} r="46" fill={coreColor} />
                        <foreignObject x={cx - 38} y={cy - 18} width="76" height="36">
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <span className="text-white font-black text-[9px] uppercase tracking-tight leading-tight">UniFi</span>
                                <span className="text-white font-black text-[10px] uppercase tracking-tight leading-tight">Ecosystem</span>
                            </div>
                        </foreignObject>
                    </svg>
                </div>

                {/* Active step detail */}
                <div className="flex-1 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-700/60">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                            The Loop
                        </p>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeStep}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-slate-800/60 rounded-xl border border-blue-500/20 p-5 mb-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">{steps[activeStep].icon}</div>
                                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
                                        {activeStep + 1} / {steps.length}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">{steps[activeStep].title}</h4>
                                <p className="text-slate-400 text-sm">{steps[activeStep].description}</p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Step dots */}
                        <div className="flex gap-2 mb-6">
                            {steps.map((_, i) => (
                                <button key={i} onClick={() => setActiveStep(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-600 hover:bg-slate-500'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Controls — Play/Pause + Reset only */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-700/60">
                        <button onClick={() => setIsPlaying(p => !p)}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${isPlaying ? 'bg-slate-700 text-slate-300' : 'bg-blue-500 text-white'}`}>
                            {isPlaying ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Play</>}
                        </button>
                        <button onClick={() => { setActiveStep(0); }}
                            className="p-1.5 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                            <RotateCcw size={15} />
                        </button>
                        <button onClick={() => setActiveStep(p => (p + 1) % steps.length)}
                            className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Next: {steps[(activeStep + 1) % steps.length].title}
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Slide10SocialImpact({ onInteracted }) {
    const [activeCert, setActiveCert] = useState('ufsp');
    const [visited,    setVisited]    = useState(new Set(['ufsp']));

    useEffect(() => { onInteracted(); }, []);

    const handleTab = (val) => {
        setActiveCert(val);
        setVisited(prev => new Set([...prev, val]));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black py-16 px-6">
            <div className="max-w-6xl mx-auto w-full space-y-8">

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-semibold tracking-wide">SBA Community Impact</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Creating the Next IT Workforce</h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        50,000+ certified globally through Ubiquiti Academy. OverIT brings the pipeline home.
                    </p>
                </motion.div>

                {/* ── TWO COLUMNS: pitch left / badge image right ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-6 items-center">

                    <div className="space-y-3">
                        <h3 className="text-2xl font-extrabold text-white leading-tight">
                            We don't hire installers.<br />We create them.
                        </h3>
                        <p className="text-slate-400 text-sm">Graduates leave with credentials, a portfolio, and a pipeline of paid work — on day one.</p>

                        <div className="space-y-2 pt-1">
                            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3">
                                <span className="text-2xl font-black text-white leading-none mt-0.5">50K+</span>
                                <div>
                                    <p className="text-white text-sm font-semibold">Students certified worldwide</p>
                                    <p className="text-slate-500 text-xs">Ubiquiti Academy's global reach — we channel it locally.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-700 rounded-xl px-4 py-3">
                                <span className="text-2xl font-black text-emerald-400 leading-none mt-0.5">↑×</span>
                                <div>
                                    <p className="text-white text-sm font-semibold">The OverIT Multiplier</p>
                                    <p className="text-slate-500 text-xs">We certify, then route retrofit, retail, and ISP projects directly to alumni. No headcount. Pure margin.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl px-4 py-3">
                                <span className="text-2xl font-black text-cyan-400 leading-none mt-0.5">SBA</span>
                                <div>
                                    <p className="text-white text-sm font-semibold">An incubator, not just a building</p>
                                    <p className="text-cyan-400/70 text-xs">This loan creates independent contractors and tax-contributing small businesses across the region.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 flex items-center justify-center">
                        <img
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/6c072e701_certification-program2.png"
                            alt="Ubiquiti Certifications"
                            className="w-full rounded-lg object-contain"
                        />
                    </div>
                </motion.div>

                {/* ── CERT EXPLORER ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Tabs value={activeCert} onValueChange={handleTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 p-1.5 rounded-xl mb-4 h-auto gap-1">
                            {certifications.map(cert => (
                                <TabsTrigger key={cert.id} value={cert.id}
                                    className="data-[state=active]:bg-slate-700 rounded-lg hover:scale-105 transition-transform relative p-1.5 flex flex-col items-center gap-1">
                                    <img src={cert.badge} alt={cert.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{cert.id.toUpperCase()}</span>
                                    {visited.has(cert.id) && cert.id !== activeCert && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <AnimatePresence mode="wait">
                            {certifications.map(cert => (
                                <TabsContent key={cert.id} value={cert.id}>
                                    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                                        <div className={`bg-slate-800/30 border ${colorClasses[cert.color].border} rounded-2xl p-5`}>
                                            <div className="flex items-start gap-4 mb-5">
                                                <img src={cert.badge} alt={cert.name} className="w-16 h-16 flex-shrink-0 rounded-xl" />
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{cert.name}</h3>
                                                    <p className="text-slate-400 text-sm">{cert.description}</p>
                                                </div>
                                            </div>
                                            <div className="grid md:grid-cols-3 gap-3 mb-3">
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Briefcase className={`w-3.5 h-3.5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white text-xs">Job Roles</h4>
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {cert.jobRoles.map((role, i) => (
                                                                <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                                                    <span className={`${colorClasses[cert.color].text} mt-0.5`}>•</span>{role}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <DollarSign className={`w-3.5 h-3.5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white text-xs">Earning Potential</h4>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mb-0.5">Range</p>
                                                        <p className="text-sm font-bold text-white mb-2">{cert.salaryRange}</p>
                                                        <p className="text-xs text-slate-500 mb-0.5">Avg Starting</p>
                                                        <p className={`text-xl font-bold ${colorClasses[cert.color].text}`}>{cert.avgSalary}/yr</p>
                                                    </CardContent>
                                                </Card>
                                                <Card className="bg-slate-900/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Award className={`w-3.5 h-3.5 ${colorClasses[cert.color].text}`} />
                                                            <h4 className="font-semibold text-white text-xs">Skills Gained</h4>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {cert.skillsGained.map((s, i) => (
                                                                <span key={i} className={`${colorClasses[cert.color].bg} ${colorClasses[cert.color].text} text-xs px-2 py-0.5 rounded-full border ${colorClasses[cert.color].border}`}>{s}</span>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <div className={`${colorClasses[cert.color].bg} border ${colorClasses[cert.color].border} rounded-xl p-4`}>
                                                <div className="flex items-start gap-3">
                                                    <TrendingUp className={`w-4 h-4 ${colorClasses[cert.color].text} flex-shrink-0 mt-0.5`} />
                                                    <div>
                                                        <blockquote className="text-white italic text-sm mb-2">"{cert.testimonial.quote}"</blockquote>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold text-white text-sm">{cert.testimonial.author}</p>
                                                                <p className="text-xs text-slate-400">{cert.testimonial.role}</p>
                                                            </div>
                                                            <p className={`${colorClasses[cert.color].text} font-bold text-right text-sm`}>{cert.testimonial.outcome}</p>
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

                {/* ── ECOSYSTEM FLYWHEEL ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1 border-t border-slate-800" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">The Self-Sustaining Loop</p>
                        <div className="flex-1 border-t border-slate-800" />
                    </div>
                    <EcosystemFlywheel />
                </motion.div>

            </div>
        </div>
    );
}