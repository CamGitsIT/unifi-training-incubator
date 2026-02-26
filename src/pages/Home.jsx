import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Users, TrendingUp, Shield, Zap, DollarSign } from 'lucide-react';
import Hero from '../components/investor/Hero';
import Problem from '../components/investor/Problem';
import Solution from '../components/investor/Solution';
import BusinessModel from '../components/investor/BusinessModel';
import Financials from '../components/investor/Financials';
import Investment from '../components/investor/Investment';
import Mission from '../components/investor/Mission';
import Property from '../components/investor/Property';
import Team from '../components/investor/Team';
import SocialImpact from '../components/investor/SocialImpact';
import CTA from '../components/investor/CTA';
import Pledge from '../components/investor/Pledge';

export default function Home() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -80; // Account for fixed nav
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'auto' }); // instant jump
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Fixed Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6 text-cyan-400" />
                            <span className="font-bold text-xl text-white">OverIT</span>
                            <span className="text-slate-400 text-sm hidden md:inline">UniFi Experience Center</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <button onClick={() => scrollToSection('mission')} className="text-slate-300 hover:text-cyan-400 transition-colors">Mission</button>
                            <button onClick={() => scrollToSection('problem')} className="text-slate-300 hover:text-cyan-400 transition-colors">Problem</button>
                            <button onClick={() => scrollToSection('solution')} className="text-slate-300 hover:text-cyan-400 transition-colors">Solution</button>
                            <button onClick={() => scrollToSection('property')} className="text-slate-300 hover:text-cyan-400 transition-colors">Property</button>
                            <button onClick={() => scrollToSection('team')} className="text-slate-300 hover:text-cyan-400 transition-colors">Team</button>
                        </div>
                        <Button 
                            onClick={() => scrollToSection('pledge')}
                            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                        >
                            Pledge Capital
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16">
                <Hero scrollToSection={scrollToSection} />
                <Mission />
                <Problem />
                <Solution />
                <BusinessModel />
                <Property />
                <Financials />
                <Investment />
                <Team />
                <SocialImpact />
                <Pledge />
                <CTA />
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-cyan-400" />
                                <span className="font-bold text-white">OverIT</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Liberating properties and businesses from oppressive subscription fees with UniFi technology.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Location</h4>
                            <p className="text-slate-400 text-sm">
                                455 Glen Iris Drive NE<br />
                                Sager Lofts, Old Fourth Ward<br />
                                Atlanta, GA 30308
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">The Mission</h4>
                            <p className="text-slate-400 text-sm">
                                Train technicians. Eliminate subscriptions. Empower communities.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between text-slate-500 text-sm">
                        <span>© 2026 OverIT. Building freedom through technology.</span>
                        <a 
                            href="https://sba.overithelp.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-400 transition-colors text-xs"
                        >
                            Versions
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}