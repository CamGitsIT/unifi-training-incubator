import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Hero({ scrollToSection }) {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background gradient with UniFi branding */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-purple-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <img 
                    src="https://sba.overithelp.com/public/logo-dark.png" 
                    alt="UniFi"
                    className="w-96 h-96 object-contain"
                />
            </div>
            
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium">SBA 7(a) Loan Application + Community Investment</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Freedom from
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Subscriptions
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        We're going into business because there is a very real opportunity to do good — 
                        disrupting the greed that has left everyone entangled in subscriptions and unhappy about it. 
                        Every business line we enter is a win-win for everyone involved.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">77%</div>
                            <div className="text-slate-300 text-sm">TCO Savings vs. Legacy Systems</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-purple-400 mb-2">16 mo</div>
                            <div className="text-slate-300 text-sm">Investment Tipping Point</div>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="text-4xl font-bold text-green-400 mb-2">$6.7B</div>
                            <div className="text-slate-300 text-sm">Total Addressable Market</div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            size="lg"
                            onClick={() => scrollToSection('mission')}
                            className="bg-cyan-900 hover:bg-white text-cyan-100 hover:text-slate-950 font-semibold text-lg px-8 py-6 border border-cyan-700 hover:border-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            Start Here
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button 
                            size="lg"
                            onClick={() => scrollToSection('pledge')}
                            className="bg-purple-900 hover:bg-white text-purple-100 hover:text-slate-950 font-semibold text-lg px-8 py-6 border border-purple-700 hover:border-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            Pledge Capital
                        </Button>
                        <Link to={createPageUrl('ROICalculator')}>
                            <Button 
                                size="lg"
                                className="bg-cyan-900 hover:bg-white text-cyan-100 hover:text-slate-950 font-semibold text-lg px-8 py-6 border border-cyan-700 hover:border-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <Calculator className="mr-2 w-5 h-5" />
                                ROI Calculator
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}