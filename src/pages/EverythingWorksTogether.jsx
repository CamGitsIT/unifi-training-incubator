import React from 'react';
import Hero from '@/components/everything/Hero.js';
import ThreeCoreEngine from '@/components/everything/ThreeCoreEngine.js';
import ExperienceCenter from '@/components/everything/ExperienceCenter.js';
import Flywheel from '@/components/everything/Flywheel.js';
import LowRiskCloser from '@/components/everything/LowRiskCloser.js';

export default function EverythingWorksTogether() {
    return (
        <div className="bg-slate-950 text-white">
            <Hero />
            <ThreeCoreEngine />
            <ExperienceCenter />
            <Flywheel />
            <LowRiskCloser />
        </div>
    );
}