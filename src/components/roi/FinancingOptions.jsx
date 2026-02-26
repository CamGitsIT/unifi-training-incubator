import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancingOptions({ financingModel, setFinancingModel }) {
    const options = [
        {
            id: 'purchase',
            label: 'Outright Purchase',
            icon: Wallet,
            description: 'Pay upfront, own immediately',
            color: 'from-cyan-500 to-blue-500'
        },
        {
            id: 'lease',
            label: 'Equipment Lease',
            icon: CreditCard,
            description: '36-month lease with buyout option',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'financing',
            label: 'Financing',
            icon: DollarSign,
            description: '5-year loan at 7% APR',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    return (
        <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
                <CardTitle className="text-2xl text-white">Select Financing Model</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                    {options.map(option => {
                        const Icon = option.icon;
                        const isActive = financingModel === option.id;
                        return (
                            <motion.button
                                key={option.id}
                                onClick={() => setFinancingModel(option.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 text-left ${
                                    isActive
                                        ? `bg-gradient-to-br ${option.color} shadow-xl`
                                        : 'bg-slate-900/50 border border-slate-700 hover:border-slate-600'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                                )}
                                <div className="relative z-10">
                                    <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                    <div className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                                        {option.label}
                                    </div>
                                    <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                                        {option.description}
                                    </div>
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFinancing"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}