import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function SystemComparison({ financingModel, units, laborRate }) {
    const calculateCosts = (system) => {
        const configs = {
            doorking: {
                hardwareCostPerUnit: 150,
                installationHoursPerUnit: 2,
                monthlyFeePerUnit: 8.50,
                maintenancePerYear: 1200,
                phoneLinePerUnit: 25
            },
            unifi: {
                hardwareCostPerUnit: 200,
                installationHoursPerUnit: 1.5,
                monthlyFeePerUnit: 0,
                maintenancePerYear: 200,
                phoneLinePerUnit: 0
            }
        };

        const config = configs[system];
        const hardwareCost = config.hardwareCostPerUnit * units;
        const installationCost = config.installationHoursPerUnit * units * laborRate;
        const totalUpfront = hardwareCost + installationCost;

        let monthlyPayment = 0;
        if (financingModel === 'lease') {
            monthlyPayment = (totalUpfront * 1.10) / 36; // 10% markup over 36 months
        } else if (financingModel === 'financing') {
            const rate = 0.07 / 12;
            const periods = 60;
            monthlyPayment = (totalUpfront * rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
        }

        const monthlyOperational = (config.monthlyFeePerUnit * units) + (config.phoneLinePerUnit * units);
        const annualOperational = (monthlyOperational * 12) + config.maintenancePerYear;

        return {
            hardwareCost,
            installationCost,
            totalUpfront,
            monthlyPayment,
            monthlyOperational,
            annualOperational,
            year3Total: financingModel === 'purchase' 
                ? totalUpfront + (annualOperational * 3)
                : (monthlyPayment + monthlyOperational) * 36 + config.maintenancePerYear * 3
        };
    };

    const doorking = calculateCosts('doorking');
    const unifi = calculateCosts('unifi');
    const savings = doorking.year3Total - unifi.year3Total;
    const savingsPercent = ((savings / doorking.year3Total) * 100).toFixed(0);

    const features = [
        { label: 'Monthly Subscription Fees', doorking: true, unifi: false },
        { label: 'Phone Line Required', doorking: true, unifi: false },
        { label: 'Mobile App Access', doorking: false, unifi: true },
        { label: 'Cloud Management', doorking: false, unifi: true },
        { label: 'Unlimited Users', doorking: false, unifi: true },
        { label: 'Video Integration', doorking: false, unifi: true }
    ];

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* DoorKing Card */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-white">DoorKing (Legacy)</CardTitle>
                        <Badge variant="destructive">High OpEx</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <div className="text-sm text-slate-400 mb-1">Hardware</div>
                            <div className="text-xl font-bold text-white">${doorking.hardwareCost.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <div className="text-sm text-slate-400 mb-1">Installation</div>
                            <div className="text-xl font-bold text-white">${doorking.installationCost.toLocaleString()}</div>
                        </div>
                    </div>

                    {financingModel !== 'purchase' && (
                        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                            <div className="text-sm text-red-400 mb-1">Monthly Payment ({financingModel})</div>
                            <div className="text-2xl font-bold text-red-300">${monthlyPayment.toFixed(0)}/mo</div>
                        </div>
                    )}

                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                        <div className="text-sm text-red-400 mb-1">Monthly Operational Costs</div>
                        <div className="text-2xl font-bold text-red-300">${doorking.monthlyOperational.toLocaleString()}/mo</div>
                        <div className="text-xs text-slate-400 mt-1">Subscriptions + Phone Lines</div>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                        <div className="text-sm text-slate-400 mb-1">3-Year Total Cost</div>
                        <div className="text-3xl font-bold text-white">${doorking.year3Total.toLocaleString()}</div>
                    </div>

                    <div className="space-y-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {f.doorking ? (
                                    <XCircle className="w-4 h-4 text-red-400" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-slate-600" />
                                )}
                                <span className="text-sm text-slate-300">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* UniFi Card */}
            <Card className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-700/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-cyan-500/20 to-transparent w-64 h-64 rounded-full blur-3xl" />
                <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl text-white">UniFi Access</CardTitle>
                        <Badge className="bg-green-500 text-white">Low OpEx</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <div className="text-sm text-slate-400 mb-1">Hardware</div>
                            <div className="text-xl font-bold text-white">${unifi.hardwareCost.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-950/50 rounded-lg p-4">
                            <div className="text-sm text-slate-400 mb-1">Installation</div>
                            <div className="text-xl font-bold text-white">${unifi.installationCost.toLocaleString()}</div>
                        </div>
                    </div>

                    {financingModel !== 'purchase' && (
                        <div className="bg-cyan-950/30 border border-cyan-700/50 rounded-lg p-4">
                            <div className="text-sm text-cyan-400 mb-1">Monthly Payment ({financingModel})</div>
                            <div className="text-2xl font-bold text-cyan-300">${monthlyPayment.toFixed(0)}/mo</div>
                        </div>
                    )}

                    <div className="bg-green-950/30 border border-green-700/50 rounded-lg p-4">
                        <div className="text-sm text-green-400 mb-1">Monthly Operational Costs</div>
                        <div className="text-2xl font-bold text-green-300">${unifi.monthlyOperational.toLocaleString()}/mo</div>
                        <div className="text-xs text-slate-400 mt-1">Zero subscriptions!</div>
                    </div>

                    <div className="border-t border-cyan-700/30 pt-4">
                        <div className="text-sm text-slate-400 mb-1">3-Year Total Cost</div>
                        <div className="text-3xl font-bold text-cyan-400">${unifi.year3Total.toLocaleString()}</div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="text-sm text-green-400 mb-1">You Save</div>
                        <div className="text-3xl font-bold text-green-300">${savings.toLocaleString()}</div>
                        <div className="text-sm text-slate-300 mt-1">{savingsPercent}% cost reduction vs. DoorKing</div>
                    </div>

                    <div className="space-y-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {f.unifi ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-slate-600" />
                                )}
                                <span className="text-sm text-slate-300">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}