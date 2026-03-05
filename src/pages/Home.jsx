import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import SlideNav from '../components/presentation/SlideNav';
import SideNav from '../components/presentation/SideNav';
import Slide1Hero from '../components/presentation/slides/Slide1Hero';
import Slide2Mission from '../components/presentation/slides/Slide2Mission';
import Slide5BusinessModel from '../components/presentation/slides/Slide5BusinessModel';
import Slide6Property from '../components/presentation/slides/Slide6Property';
import Slide7Financials from '../components/presentation/slides/Slide7Financials';
// import Slide8Investment from '../components/presentation/slides/Slide8Investment';
import Slide9Team from '../components/presentation/slides/Slide9Team';
import Slide10SocialImpact from '../components/presentation/slides/Slide10SocialImpact';
import Slide11CTA from '../components/presentation/slides/Slide11CTA';



const SLIDES = [
    { component: Slide1Hero, label: 'Welcome' },
    { component: Slide2Mission, label: 'Revenue Streams' },
    { component: Slide5BusinessModel, label: 'Business Model' },
    { component: Slide10SocialImpact, label: 'Impact' },
    { component: Slide6Property, label: 'Property' },
    { component: Slide7Financials, label: 'Financials' },
    // { component: Slide8Investment, label: 'Investment' },
    { component: Slide9Team, label: 'Team' },
    { component: Slide11CTA, label: 'Join Us' },
];

export default function Home() {
    const [current, setCurrent] = useState(0);
    const [interacted, setInteracted] = useState(new Array(SLIDES.length).fill(false));
    const [seen, setSeen] = useState(() => { const s = new Array(SLIDES.length).fill(false); s[0] = true; return s; });
    const [unlockMessage, setUnlockMessage] = useState(null);
    const [easterEggClicks, setEasterEggClicks] = useState(0);
    const easterEggTimerRef = useRef(null);
    const slideRef = useRef(null);

    const handleEasterEggClick = () => {
        if (easterEggTimerRef.current) clearTimeout(easterEggTimerRef.current);
        
        const newClicks = easterEggClicks + 1;
        setEasterEggClicks(newClicks);
        
        if (newClicks === 4) {
            setInteracted(prev => {
                const all = new Array(SLIDES.length).fill(true);
                return all;
            });
            setEasterEggClicks(0);
        } else {
            easterEggTimerRef.current = setTimeout(() => setEasterEggClicks(0), 3000);
        }
    };

    const markInteracted = (index) => {
        setInteracted(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
        });
    };

    const goToSlide = (index) => {
        setCurrent(index);
        setSeen(prev => { const next = [...prev]; next[index] = true; return next; });
        window.scrollTo({ top: 0 });
        if (slideRef.current) slideRef.current.scrollTop = 0;
    };

    const goNext = () => {
        if (current < SLIDES.length - 1) {
            const next = current + 1;
            goToSlide(next);
        }
    };

    const goPrev = () => {
        if (current > 0) {
            const prevIndex = current - 1;
            markInteracted(prevIndex);
            goToSlide(prevIndex);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0 });
        if (slideRef.current) slideRef.current.scrollTop = 0;
        setSeen(prev => { const next = [...prev]; next[current] = true; return next; });
    }, [current]);

    const SlideComponent = SLIDES[current].component;
    const canAdvance = interacted[current];

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Top Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 group">
                        <button
                            onClick={handleEasterEggClick}
                            className="flex items-center gap-2 cursor-pointer"
                            title={easterEggClicks > 0 ? `${easterEggClicks}/4` : ''}
                        >
                            <Shield className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                        </button>
                        <span className="font-bold text-xl text-white">OverISP</span>
                        <span className="text-slate-400 text-sm hidden md:inline">UniFi Experience Center & Training Hub</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-sm hidden md:inline">
                            {SLIDES[current].label}
                        </span>
                        <span className="text-slate-600 text-sm">{current + 1} / {SLIDES.length}</span>
                    </div>
                </div>
            </nav>

            {/* Side Nav */}
            <SideNav current={current} seen={seen} interacted={interacted} onNavigate={goToSlide} />

            {/* Slide Area */}
            <div ref={slideRef} className="flex-1 pt-16 pb-20 overflow-y-auto md:pl-48">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                    >
                        <SlideComponent
                            onInteracted={() => markInteracted(current)}
                            onNext={goNext}
                            onUnlockMessage={setUnlockMessage}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <SlideNav
                current={current}
                total={SLIDES.length}
                onNext={goNext}
                onPrev={goPrev}
                canAdvance={canAdvance}
                slideLabel={SLIDES[current].label}
                hideNext={current === 0}
                unlockMessage={unlockMessage}
            />
        </div>
    );
}