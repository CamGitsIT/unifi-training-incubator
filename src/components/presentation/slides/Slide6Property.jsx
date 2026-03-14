import React, { useState, useEffect } from 'react';
import { MapPin, Building, TrendingUp, CheckCircle, GraduationCap, Cpu, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    '3,160 sq ft mixed-use loft',
    '11-foot ceilings, floor-to-ceiling windows',
    'CMR zoning (Commercial Mixed-Use Residential)',
    '2-car private garage + guest parking',
    'Perfect for SBA owner-occupied financing',
    'Live, pilot early adopter',
];

const functions = [
    { icon: Building,       label: 'Experience Center'  },
    { icon: GraduationCap,  label: 'Training Studio'    },
    { icon: Cpu,            label: 'Pilot Property'     },
    { icon: Briefcase,      label: 'Executive Workspace'},
];

const galleryPhotos = [
    { src: 'https://sba.overithelp.com/public/935478657142e45c960f3b1db567b694-cc_ft_1536.jpg',                                                                      alt: 'Exterior'              },
    { src: 'https://sba.overithelp.com/public/b3556a907589f6fbfb44bfdf5f65d5bc-cc_ft_960.jpg',                                                                       alt: 'Building'              },
    { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/59d9dc027_IMG_2146.jpg',  alt: 'Living Area'           },
    { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/649f775be_IMG_2169.jpg',  alt: 'Bedroom & Balcony'     },
    { src: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699f66fd689553aa3a1d8596/5ac0d64c3_IMG_2167.jpg',  alt: 'Staircase & Glass'     },
];

export default function Slide6Property({ onInteracted }) {
    const [checked, setChecked] = useState(new Set());

    useEffect(() => { onInteracted(); }, []);

    const toggle = (i) => setChecked(prev => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
    });

    return (
        <div className="min-h-screen bg-slate-950 py-10 px-6">
            <div className="max-w-6xl mx-auto w-full space-y-6">

                {/* ── HEADER ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-xs font-semibold tracking-wide">The Property</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Foundation of it All</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-base">
                        Sager Lofts, Old Fourth Ward — SBA-ready, already live, and built for every revenue function in the model.
                    </p>
                </motion.div>

                {/* ── HERO + DETAILS ── */}
                <div className="grid lg:grid-cols-[3fr_2fr] gap-5 items-start">

                    {/* Hero photo */}
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        className="relative rounded-2xl overflow-hidden h-[460px] border border-slate-700">
                        <img
                            src="https://sba.overithelp.com/public/455-glen-iris-dr-ne-unit-p-atlanta-ga-building-photo.jpg"
                            alt="Sager Lofts"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        {/* Gradient overlay with location */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-center gap-2 text-cyan-400 mb-1">
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="font-bold text-sm">Sager Lofts, Old Fourth Ward — Atlanta, GA</span>
                            </div>
                            <p className="text-slate-300 text-xs">
                                Walk Score 79 (Very Walkable) · 2 blocks from the Beltline · Adjacent to Ponce City Market
                            </p>
                        </div>
                    </motion.div>

                    {/* Right column */}
                    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

                        {/* Price card */}
                        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Purchase Price</p>
                                    <p className="text-2xl font-bold text-white">$825,000</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-1">Appraised Value</p>
                                    <p className="text-2xl font-bold text-green-400">$850,000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
                                <TrendingUp className="w-4 h-4" />
                                6.25% instant equity at close
                            </div>
                        </div>

                        {/* Features checklist */}
                        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Property Features</p>
                            <div className="space-y-1.5">
                                {features.map((f, i) => {
                                    const done = checked.has(i);
                                    return (
                                        <div key={i} onClick={() => toggle(i)}
                                            className={`flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 transition-all select-none
                                                ${done ? 'text-green-400 bg-green-500/5' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'}`}>
                                            <CheckCircle className={`w-4 h-4 flex-shrink-0 transition-colors ${done ? 'text-green-400' : 'text-slate-600'}`} />
                                            <span className="text-sm">{f}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Function chips */}
                        <div className="bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-800/30 rounded-xl p-5">
                            <p className="text-white font-semibold text-sm mb-1">One address. Four revenue functions.</p>
                            <p className="text-slate-500 text-xs mb-4">Every part of the model operates from this single asset.</p>
                            <div className="grid grid-cols-2 gap-2">
                                {functions.map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
                                        <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                                        <span className="text-xs font-medium text-slate-200">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── PHOTO GALLERY ── */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="grid grid-cols-5 gap-3">
                    {galleryPhotos.map((photo, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-slate-700/60 h-36 group">
                            <img src={photo.src} alt={photo.alt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    ))}
                </motion.div>

            </div>
        </div>
    );
}
