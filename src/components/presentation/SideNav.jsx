import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';

// Maps slide indices to nav section indices
// SLIDES order: 0=Hero, 1=BusinessModel, 2=SocialImpact, 3=Property, 4=Financials, 5=Investment, 6=Team, 7=CTA
const NAV_SECTIONS = [
    { label: 'Intro: Our Mission', slideIndices: [0] },
    { label: 'One Vision, Endless Possibilities', slideIndices: [1] },
    { label: 'Job Creation', slideIndices: [2] },
    { label: 'The Foundation: Live-work Property', slideIndices: [3] },
    { 
        label: 'Projections and Lending', 
        parent: true,
        subItems: [
            { label: 'Projections/Margins', slideIndices: [4] },
            { label: 'Lender Repayment', slideIndices: [5] }
        ]
    },
    { label: 'Contributors', slideIndices: [6] },
    { label: 'Support Us!', slideIndices: [7] },
];

export default function SideNav({ current, seen, interacted = [], onNavigate }) {
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
     };

    return (
        <div className="fixed left-0 top-16 bottom-16 z-40 flex flex-col justify-center pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border-r border-slate-800 rounded-r-2xl py-4 px-3 pointer-events-auto shadow-xl">
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
                                                                : 'border border-transparent cursor-not-allowed'
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
                                            : 'border border-transparent cursor-not-allowed opacity-40'
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
            </div>
        </div>
    );
}