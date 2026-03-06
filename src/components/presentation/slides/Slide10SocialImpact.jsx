import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, TrendingUp, Award, Users, Lightbulb, Sparkles, Wifi, Lock, Globe, Server, GraduationCap, Cpu, Building2, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
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
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' }
};

function EcosystemFlywheel() {
    const [activeStep, setActiveStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(3000);

    const coreColor = "#3B82F6";

    const steps = [
        { id: 'training', title: 'Training', description: 'Creates qualified Installers', icon: <GraduationCap className="w-8 h-8" /> },
        { id: 'installers', title: 'Installers', description: 'Need a steady stream of work', icon: <Users className="w-8 h-8" /> },
        { id: 'ai', title: 'AI Lead Gen', description: 'Finds and identifies Projects', icon: <Cpu className="w-8 h-8" /> },
        { id: 'experience', title: 'Experience Center', description: 'Closes Projects with customers', icon: <Building2 className="w-8 h-8" /> },
        { id: 'revenue', title: 'Revenue', description: 'Flows back into more Training', icon: <DollarSign className="w-8 h-8" /> },
    ];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
            }, speed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, speed, steps.length]);

    const radius = 160;
    const centerX = 250;
    const centerY = 250;

    const getCoordinates = (index, total) => {
        const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
        return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
    };

    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="p-8 text-center border-b border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-2">UniFi Ecosystem Flywheel</h3>
                <p className="text-slate-400 max-w-lg mx-auto">A self-sustaining cycle where AI and specialized centers drive continuous growth and revenue.</p>
            </div>

            <div className="flex flex-col lg:flex-row p-8 gap-12 items-center">
                <div className="relative w-full max-w-[500px] aspect-square flex-shrink-0">
                    <svg viewBox="0 0 500 500" className="w-full h-full">
                        <circle cx="250" cy="250" r="210" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                        {steps.map((_, i) => {
                            const start = getCoordinates(i, steps.length);
                            const end = getCoordinates((i + 1) % steps.length, steps.length);
                            const isTransitioning = activeStep === i;
                            return (
                                <g key={`path-${i}`}>
                                    <path
                                        d={`M ${start.x} ${start.y} Q ${250 + (start.x + end.x - 500) * 0.3} ${250 + (start.y + end.y - 500) * 0.3} ${end.x} ${end.y}`}
                                        fill="none"
                                        stroke={isTransitioning ? coreColor : '#334155'}
                                        strokeWidth={isTransitioning ? "4" : "2"}
                                        className="transition-all duration-700"
                                        strokeDasharray={isTransitioning ? "none" : "5 5"}
                                    />
                                    {isTransitioning && isPlaying && (
                                        <circle r="6" fill={coreColor}>
                                            <animateMotion
                                                dur={`${speed / 1000}s`}
                                                repeatCount="indefinite"
                                                path={`M ${start.x} ${start.y} Q ${250 + (start.x + end.x - 500) * 0.3} ${250 + (start.y + end.y - 500) * 0.3} ${end.x} ${end.y}`}
                                            />
                                            <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                </g>
                            );
                        })}
                        {steps.map((step, i) => {
                            const { x, y } = getCoordinates(i, steps.length);
                            const isSource = activeStep === i;
                            const isDestination = activeStep === (i === 0 ? steps.length - 1 : i - 1);
                            const isActive = isSource || isDestination;
                            return (
                                <g key={step.id} className="cursor-pointer" onClick={() => setActiveStep(i)}>
                                    {isActive && (
                                        <circle cx={x} cy={y} r="50" fill={coreColor} fillOpacity="0.1">
                                            <animate attributeName="r" values="45;55;45" dur="3s" repeatCount="indefinite" />
                                        </circle>
                                    )}
                                    <circle cx={x} cy={y} r={isSource ? 42 : 36} fill="#1e293b" stroke={isActive ? coreColor : '#475569'} strokeWidth={isSource ? 4 : 2} className="transition-all duration-500" />
                                    <foreignObject x={x - 20} y={y - 20} width="40" height="40">
                                        <div className={`flex items-center justify-center w-full h-full transition-all duration-500 ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>{step.icon}</div>
                                    </foreignObject>
                                    <text x={x} y={y + 55} textAnchor="middle" fontSize="10" fontWeight="bold" fill={isActive ? '#f1f5f9' : '#64748b'} className="transition-all duration-500">{step.title}</text>
                                </g>
                            );
                        })}
                        <circle cx="250" cy="250" r="65" fill="#1e293b" stroke={coreColor} strokeWidth="2" />
                        <circle cx="250" cy="250" r="58" fill={coreColor} />
                        <foreignObject x="200" y="215" width="100" height="70">
                            <div className="flex flex-col items-center justify-center h-full text-center p-2">
                                <span className="text-white font-bold text-[10px] leading-tight tracking-tight uppercase">UniFi</span>
                                <span className="text-white font-black text-[11px] leading-tight uppercase">Ecosystem</span>
                            </div>
                        </foreignObject>
                    </svg>
                </div>

                <div className="w-full flex-1 space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-2xl mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            Active Phase
                        </h4>
                        <div className="bg-slate-900 p-6 rounded-xl border border-blue-500/20 transition-all duration-500">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">{steps[activeStep].icon}</div>
                                <div className="flex items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">STEP {activeStep + 1} OF 5</div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{steps[activeStep].title}</h3>
                            <p className="text-slate-400 mb-6">{steps[activeStep].description}</p>
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 cursor-pointer" onClick={() => setActiveStep((activeStep + 1) % steps.length)}>
                                Next: {steps[(activeStep + 1) % steps.length].title}
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3">
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setActiveStep(i)} className={`h-2 rounded-full transition-all duration-300 ${activeStep === i ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600'}`} />
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-700 flex items-center justify-between">
                        <div className="flex gap-3">
                            <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${isPlaying ? 'bg-slate-700 text-white' : 'bg-blue-500 text-white'}`}>
                                {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
                            </button>
                            <button onClick={() => setActiveStep(0)} className="p-2 rounded-full text-slate-400 hover:text-slate-300 hover:bg-slate-700 transition-colors">
                                <RotateCcw size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Tempo</span>
                            <div className="flex bg-slate-800 rounded-lg p-1">
                                {[5000, 3000, 1000].map((s, idx) => (
                                    <button key={s} onClick={() => setSpeed(s)} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${speed === s ? 'bg-slate-600 text-blue-400' : 'text-slate-500'}`}>
                                        {['Slow', 'Mid', 'Fast'][idx]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Slide10SocialImpact({ onInteracted }) {
    const [activeCert, setActiveCert] = useState('ufsp');
    const [visited, setVisited] = useState(new Set(['ufsp']));
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        if (timerDone || visited.size === certifications.length) return;
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
    }, [timerDone, visited]);

    const handleTab = (val) => {
        setActiveCert(val);
        const next = new Set(visited);
        next.add(val);
        setVisited(next);
        if (next.size === certifications.length) onInteracted();
    };

    const currentCert = certifications.find(c => c.id === activeCert);
    const colors = colorClasses[currentCert?.color || 'cyan'];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black py-24 px-6">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium">SBA Community Impact</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Creating the Next IT Workforce</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                        Ubiquiti Academy has certified 50,000+ students worldwide. OverIT's National Training Center brings that engine home—creating certified UniFi and UISP professionals in our region.
                    </p>
                    <p className="text-sm text-cyan-400 animate-pulse">👇 Click all 5 certification badges to continue</p>
                </motion.div>

                {/* Certifications That Change Lives — summary panel */}
                <div className="grid md:grid-cols-2 gap-6 mb-8 bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-3">Certifications That Change Lives</h3>
                        <p className="text-slate-300 text-sm mb-3">
                            Ubiquiti Academy's global certification program has trained more than <strong className="text-white">50,000 students worldwide</strong>. OverIT channels that momentum into a local UniFi Experience Center and National Training Center.
                        </p>
                        <p className="text-slate-300 text-sm mb-3">
                            <strong className="text-white">The OverIT Multiplier Effect:</strong> we don't staff a huge installer workforce. We certify professionals, then route retrofit, retail, and ISP projects directly to our alumni and partner businesses.
                        </p>
                        <p className="text-cyan-400 text-sm font-medium">
                            By approving this loan, the SBA is not just funding a building; it is funding an incubator that creates independent contractors and tax-contributing small businesses across the region.
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-600 rounded-xl p-5 flex flex-col gap-4">
                       <img
                           src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/6c072e701_certification-program2.png"
                           alt="Ubiquiti Certifications"
                           className="w-full rounded-lg object-contain"
                       />
                       <ul className="space-y-2">
                           {certifications.map((cert) => (
                               <li key={cert.id} className="flex items-center gap-3 text-slate-200 text-sm">
                                   <img src={cert.badge} alt={cert.name} className="w-7 h-7 flex-shrink-0 rounded-md" />
                                   <span>{cert.name}</span>
                               </li>
                           ))}
                       </ul>
                    </div>
                </div>

                <Tabs value={activeCert} onValueChange={handleTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 p-2 rounded-xl mb-6 h-auto gap-1">
                        {certifications.map(cert => (
                            <TabsTrigger key={cert.id} value={cert.id} className="data-[state=active]:bg-slate-700 rounded-lg hover:scale-105 transition-transform relative p-1.5">
                                <img src={cert.badge} alt={cert.name} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                                {visited.has(cert.id) && cert.id !== activeCert && (
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full" />
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <AnimatePresence mode="wait">
                        {certifications.map(cert => (
                            <TabsContent key={cert.id} value={cert.id}>
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                    <div className={`bg-slate-800/30 border ${colorClasses[cert.color].border} rounded-2xl p-6`}>
                                        <div className="flex items-start gap-5 mb-6">
                                            <img src={cert.badge} alt={cert.name} className="w-20 h-20 flex-shrink-0 rounded-xl" />
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-2">{cert.name}</h3>
                                                <p className="text-slate-300">{cert.description}</p>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                                            <Card className="bg-slate-900/50 border-slate-700">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Briefcase className={`w-4 h-4 ${colorClasses[cert.color].text}`} />
                                                        <h4 className="font-semibold text-white text-sm">Job Roles</h4>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {cert.jobRoles.map((role, i) => (
                                                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                                                <span className={`${colorClasses[cert.color].text} mt-1`}>•</span>{role}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-slate-900/50 border-slate-700">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <DollarSign className={`w-4 h-4 ${colorClasses[cert.color].text}`} />
                                                        <h4 className="font-semibold text-white text-sm">Earning Potential</h4>
                                                    </div>
                                                    <div className="text-xs text-slate-400 mb-1">Salary Range</div>
                                                    <div className="text-sm font-bold text-white mb-2">{cert.salaryRange}</div>
                                                    <div className="text-xs text-slate-400 mb-1">Average Starting</div>
                                                    <div className={`text-xl font-bold ${colorClasses[cert.color].text}`}>{cert.avgSalary}/yr</div>
                                                </CardContent>
                                            </Card>
                                            <Card className="bg-slate-900/50 border-slate-700">
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Award className={`w-4 h-4 ${colorClasses[cert.color].text}`} />
                                                        <h4 className="font-semibold text-white text-sm">Skills Gained</h4>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {cert.skillsGained.map((s, i) => (
                                                            <span key={i} className={`${colorClasses[cert.color].bg} ${colorClasses[cert.color].text} text-xs px-2 py-1 rounded-full border ${colorClasses[cert.color].border}`}>{s}</span>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className={`${colorClasses[cert.color].bg} border ${colorClasses[cert.color].border} rounded-xl p-4`}>
                                            <div className="flex items-start gap-3">
                                                <TrendingUp className={`w-5 h-5 ${colorClasses[cert.color].text} flex-shrink-0 mt-1`} />
                                                <div>
                                                    <blockquote className="text-white italic mb-2 text-sm">"{cert.testimonial.quote}"</blockquote>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-semibold text-white text-sm">{cert.testimonial.author}</div>
                                                            <div className="text-xs text-slate-400">{cert.testimonial.role}</div>
                                                        </div>
                                                        <div className={`${colorClasses[cert.color].text} font-bold text-right text-sm`}>{cert.testimonial.outcome}</div>
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

                <div className="mt-8">
                    <EcosystemFlywheel />
                </div>

                {(visited.size === certifications.length || timerDone) && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ Click Next to take action
                    </motion.p>
                )}
                {visited.size < certifications.length && !timerDone && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-cyan-400 text-sm mt-6">
                        Or unlock in {secondsLeft}s
                    </motion.p>
                )}
            </div>
        </div>
    );
}