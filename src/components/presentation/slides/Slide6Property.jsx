import React, { useState, useEffect } from 'react';
import { MapPin, Building, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    '3,160 sq ft mixed-use loft',
    '11-foot ceilings, floor-to-ceiling windows',
    'CMR zoning (Commercial Mixed-Use Residential)',
    '2-car private garage + guest parking',
    'Perfect for SBA owner-occupied financing',
    'Live, pilot early adopter'
];

export default function Slide6Property({ onInteracted, onUnlockMessage }) {
    const [checkedFeatures, setCheckedFeatures] = useState(new Set());
    const [timerDone, setTimerDone] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(10);

    useEffect(() => {
        if (timerDone) {
            if (onUnlockMessage) onUnlockMessage(null);
            return;
        }
        if (onUnlockMessage) onUnlockMessage(`Unlocking navigation in ${secondsLeft}s — explore freely in the meantime`);
    }, [secondsLeft, timerDone]);

    useEffect(() => {
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
    }, []);

    const handleFeature = (i) => {
        const next = new Set(checkedFeatures);
        next.add(i);
        setCheckedFeatures(next);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 py-24 px-6">
            <div className="max-w-6xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Foundation of it All: The Space</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4">
                        Award-winning Sager Lofts in Atlanta's Old Fourth Ward—an SBA-ready live-work flagship for the UniFi Experience Center, National Training Center, and on-site pilot deployments.
                    </p>
                    <p className="text-sm text-cyan-400 animate-pulse">👇 Click any feature to mark it reviewed</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden">
                        <div className="h-64 overflow-hidden">
                            <img src="https://sba.overithelp.com/public/455-glen-iris-dr-ne-unit-p-atlanta-ga-building-photo.jpg" alt="Sager Lofts" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-cyan-400 mb-2">
                                <MapPin className="w-5 h-5" />
                                <span className="font-semibold">Sager Lofts, Old Fourth Ward</span>
                            </div>
                            <p className="text-slate-300 text-sm">Walk Score 79 (Very Walkable) • 2 blocks from Beltline • Adjacent to Ponce City Market</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-slate-400 mb-1">Purchase Price</div>
                                    <div className="text-3xl font-bold text-white">$825,000</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400 mb-1">Appraised Value</div>
                                    <div className="text-3xl font-bold text-green-400">$850,000</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-400">
                                <TrendingUp className="w-4 h-4" />
                                <span>6.25% instant equity</span>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                            <div className="text-sm text-slate-400 mb-3">Property Features — <span className="text-cyan-400">click each to review</span></div>
                            <div className="space-y-2">
                                {features.map((f, i) => {
                                    const done = checkedFeatures.has(i);
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => handleFeature(i)}
                                            className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 transition-colors ${done ? 'text-green-400' : 'text-slate-300 hover:text-white'}`}
                                        >
                                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${done ? 'text-green-400' : 'text-slate-600'}`} />
                                            <span className="text-sm">{f}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-700/50 rounded-xl p-6">
                            <Building className="w-8 h-8 text-cyan-400 mb-3" />
                            <div className="text-white font-semibold mb-2">Multi-Functional Asset</div>
                            <p className="text-slate-300 text-sm">Experience Center + Training Studio + Pilot Property + Executive Workspace — multiple revenue-generating functions that provide a flagship property to experience the possibilities.</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-xl overflow-hidden border border-slate-700 h-40">
                        <img src="https://sba.overithelp.com/public/935478657142e45c960f3b1db567b694-cc_ft_1536.jpg" alt="Exterior" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-700 h-40">
                        <img src="https://sba.overithelp.com/public/b3556a907589f6fbfb44bfdf5f65d5bc-cc_ft_960.jpg" alt="Building" className="w-full h-full object-cover" />
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-700 h-40 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center">
                        <div className="text-center p-4">
                            <Building className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                            <div className="text-white font-semibold mb-1">3,160 sq ft</div>
                            <div className="text-slate-300 text-sm">Mixed-Use Loft</div>
                        </div>
                    </div>
                </div>

                {checkedFeatures.size === features.length && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ Click Next to explore the financials
                    </motion.p>
                )}
            </div>
        </div>
    );
}