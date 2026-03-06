import React from 'react';
import Hero from '@/components/everything/Hero';
import CoreEngineCards from '@/components/everything/CoreEngineCards';
import ExperienceCenterHighlight from '@/components/everything/ExperienceCenterHighlight';
import FlywheelSection from '@/components/everything/FlywheelSection';
import InvestorCloser from '@/components/everything/InvestorCloser';
import ThreeCoreEngine from '@/components/everything/ThreeCoreEngine';
import ExperienceCenter from '@/components/everything/ExperienceCenter';
import Flywheel from '@/components/everything/Flywheel';
import LowRiskCloser from '@/components/everything/LowRiskCloser';

export default function EverythingWorksTogether() {
    return (
        <div className="bg-slate-950 text-white">
            <Hero />
            <CoreEngineCards />
            <ExperienceCenterHighlight />
            <FlywheelSection />
            <InvestorCloser />
            <ThreeCoreEngine />
            <ExperienceCenter />
            <Flywheel />
            <LowRiskCloser />
        </div>
    );
}