import React from 'react';
import Hero from '@/components/everything/Hero';
import CoreEngineCards from '@/components/everything/CoreEngineCards';
import ExperienceCenter from '@/components/everything/ExperienceCenter';
import Flywheel from '@/components/everything/Flywheel';
import LowRiskCloser from '@/components/everything/LowRiskCloser';

export default function EverythingWorksTogether() {
    return (
        <div className="bg-slate-950 text-white">
            <Hero />
            <CoreEngineCards />
            <ExperienceCenter />
            <Flywheel />
            <LowRiskCloser />
        </div>
    );
}