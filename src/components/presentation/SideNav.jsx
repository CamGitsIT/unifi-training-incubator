import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';

// SIDENAV – components/presentation/SideNav.jsx (one directory up from slides)
// Maps slide indices to nav section indices
// SLIDES order: 0=Hero, 1=BusinessModel, 2=SocialImpact, 3=Property, 4=Financials, 5=Investment, 6=Team, 7=CTA
const NAV_SECTIONS = [
    { label: 'Overview', slideIndices: [0] },
    { label: 'Revenue Streams', slideIndices: [1] },
    { label: 'Community Impact', slideIndices: [2] },
    { label: 'Flagship Property', slideIndices: [3] },
    { 
        label: 'Financials', 
        parent: true,
        subItems: [
            { label: 'Revenue Model', slideIndices: [4] },
            { label: 'Investment Terms', slideIndices: [5] }
        ]
    },
    { label: 'Leadership', slideIndices: [6] },
    { label: 'Invest Now', slideIndices: [7] },
];

function NavContent({ current, seen, interacted = [], onNavigate, onClose }) {
     // A section is "accessible" if ALL prior sections have had their slides interacted with
     const getSectionState = (sectionIdx) => {
         const section = NAV_SECTIONS[sectionIdx];
         const allSlideIndices = section.parent 
             ? section.subItems.flatMap(s => s.slideIndices)
             : section.slideIndices;
         const isActive = allSlideIndices.includes(current);
         const isSeen = allSlideIndices.some(i => seen[i]);

         // First section is always accessible
         if (sectionIdx === 0) return { isActive, isSeen, isAccessible: true };

         // Check all prior sections: at least one of their slides must have been interacted with
         let isAccessible = true;
         for (let i = 0; i < sectionIdx; i++) {
             const prev = NAV_SECTIONS[i];
             const prevSlides = prev.parent ? prev.subItems.flatMap(s => s.slideIndices) : prev.slideIndices;
             if (!prevSlides.some(idx => interacted[idx])) {
                 isAccessible = false;
                 break;
             }
         }

         return { isActive, isSeen, isAccessible };
     };

     const handleClick = (sectionIdx, subIdx = null) => {
         const { isAccessible } = getSectionState(sectionIdx);
         if (!isAccessible) return;
         const section = NAV_SECTIONS[sectionIdx];
         const slideIdx = subIdx !== null 
             ? section.subItems[subIdx].slideIndices[0]
             : (section.parent ? section.subItems[0].slideIndices[0] : section.slideIndices[0]);
         onNavigate(slideIdx);
         if (onClose) onClose();
     };

    return (
        <div className="space-y-1">
            {NAV_SECTIONS.map((section, idx) => {
                        const { isActive, isSeen, isAccessible } = getSectionState(idx);
                        
                        if (section.parent) {
                            return (
                                <div key={idx}>
                                    <div className={`
                                        w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200
                                        ${isActive ? 'bg-cyan-500/20 border border-cyan-500/40' : isAccessible ? 'border border-transparent' : 'bg-slate-800/40 border border-slate-700/50 opacity-70'}
                                    `}>
                                        {/* Indicator dot */}
                                        <div className={`
                                            w-2 h-2 rounded-full flex-shrink-0 transition-all
                                            ${isActive ? 'bg-cyan-400 shadow-[0_0_6px_2px_rgba(34,211,238,0.5)]' : isSeen ? 'bg-emerald-400' : 'bg-slate-600'}
                                        `} />
                                        <span className={`
                                            text-xs font-medium leading-tight flex-1
                                            ${isActive ? 'text-cyan-300' : isAccessible ? 'text-slate-300' : 'text-slate-500'}
                                        `}>
                                            {section.label}
                                        </span>
                                        {!isAccessible && <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                                    </div>
                                    <div className="ml-3 space-y-0.5 mt-1">
                                        {section.subItems.map((sub, subIdx) => {
                                            const subActive = sub.slideIndices.includes(current);
                                            return (
                                                <motion.button
                                                    key={`${idx}-${subIdx}`}
                                                    onClick={() => handleClick(idx, subIdx)}
                                                    disabled={!isAccessible}
                                                    className={`
                                                        w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs
                                                        ${subActive
                                                            ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                                                            : isAccessible
                                                                ? 'hover:bg-slate-800/40 border border-transparent text-slate-400 cursor-pointer'
                                                                : 'bg-slate-800/30 border border-slate-700/30 text-slate-500 cursor-not-allowed opacity-70'
                                                        }
                                                    `}
                                                    whileHover={isAccessible ? { x: 1 } : {}}
                                                >
                                                    <span className="flex-1">- {sub.label}</span>
                                                    {subActive && <ChevronRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <motion.button
                                key={idx}
                                onClick={() => handleClick(idx)}
                                disabled={!isAccessible}
                                className={`
                                    w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-cyan-500/20 border border-cyan-500/40'
                                        : isAccessible
                                            ? 'hover:bg-slate-800/60 border border-transparent cursor-pointer'
                                            : 'bg-slate-800/40 border border-slate-700/50 cursor-not-allowed opacity-70'
                                    }
                                `}
                                whileHover={isAccessible ? { x: 2 } : {}}
                            >
                                {/* Indicator dot */}
                                <div className={`
                                    w-2 h-2 rounded-full flex-shrink-0 transition-all
                                    ${isActive ? 'bg-cyan-400 shadow-[0_0_6px_2px_rgba(34,211,238,0.5)]' : isSeen ? 'bg-emerald-400' : 'bg-slate-600'}
                                `} />

                                <span className={`
                                    text-xs font-medium leading-tight flex-1
                                    ${isActive ? 'text-cyan-300' : isAccessible ? 'text-slate-300' : 'text-slate-500'}
                                `}>
                                    {section.label}
                                </span>

                                {!isAccessible && (
                                    <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                )}
                                {isAccessible && isActive && (
                                    <ChevronRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                                )}
                            </motion.button>
                        );
            })}
        </div>
    );
}

export default function SideNav({ current, seen, interacted = [], onNavigate }) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Desktop: fixed sidebar */}
            <div className="hidden md:flex fixed left-0 top-16 bottom-16 z-40 flex-col justify-center pointer-events-none">
                <div className="bg-slate-900/80 backdrop-blur-md border-r border-slate-800 rounded-r-2xl py-4 px-3 pointer-events-auto shadow-xl">
                    <NavContent current={current} seen={seen} interacted={interacted} onNavigate={onNavigate} />
                </div>
            </div>

            {/* Mobile: hamburger + sheet */}
            <div className="md:hidden fixed left-3 top-[18px] z-[60]">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 rounded-lg bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-300">
                            <Menu className="w-5 h-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 p-0 bg-slate-900 border-slate-800">
                        <div className="pt-4 px-2">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-3 mb-3">Navigation</p>
                            <NavContent current={current} seen={seen} interacted={interacted} onNavigate={onNavigate} onClose={() => setOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}