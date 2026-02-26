import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import FinancingOptions from '../components/roi/FinancingOptions';
import SystemComparison from '../components/roi/SystemComparison';
import CostInputs from '../components/roi/CostInputs';
import ComparisonResults from '../components/roi/ComparisonResults';
import EmailReport from '../components/roi/EmailReport';

export default function ROICalculator() {
    const [financingModel, setFinancingModel] = useState('purchase');
    const [units, setUnits] = useState(50);
    const [laborRate, setLaborRate] = useState(75);
    const [electricRate, setElectricRate] = useState(0.12);
    const [internetCost, setInternetCost] = useState(100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            {/* Header */}
            <div className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-cyan-400" />
                        <h1 className="text-xl font-bold text-white">Advanced ROI Calculator</h1>
                    </div>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Access Control System ROI Comparison
                    </h2>
                    <p className="text-xl text-slate-300">
                        Compare DoorKing vs. UniFi Access with flexible financing models and custom operational costs
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {/* Financing Options */}
                    <FinancingOptions 
                        financingModel={financingModel}
                        setFinancingModel={setFinancingModel}
                    />

                    {/* Cost Inputs */}
                    <CostInputs
                        units={units}
                        setUnits={setUnits}
                        laborRate={laborRate}
                        setLaborRate={setLaborRate}
                        electricRate={electricRate}
                        setElectricRate={setElectricRate}
                        internetCost={internetCost}
                        setInternetCost={setInternetCost}
                    />

                    {/* System Comparison */}
                    <SystemComparison 
                        financingModel={financingModel}
                        units={units}
                        laborRate={laborRate}
                        electricRate={electricRate}
                        internetCost={internetCost}
                    />

                    {/* Results */}
                    <ComparisonResults
                        financingModel={financingModel}
                        units={units}
                        laborRate={laborRate}
                        electricRate={electricRate}
                        internetCost={internetCost}
                    />

                    {/* Email Report */}
                    <EmailReport
                        financingModel={financingModel}
                        units={units}
                        laborRate={laborRate}
                        electricRate={electricRate}
                        internetCost={internetCost}
                    />
                </div>
            </div>
        </div>
    );
}