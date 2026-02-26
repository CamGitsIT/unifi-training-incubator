import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, Clock, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ComparisonResults({ financingModel, units, laborRate, electricRate, internetCost }) {
    const calculateProjections = () => {
        const doorking = {
            hardware: 150 * units,
            installation: 2 * units * laborRate,
            monthlyOpex: (8.50 * units) + (25 * units),
            annualMaintenance: 1200
        };

        const unifi = {
            hardware: 200 * units,
            installation: 1.5 * units * laborRate,
            monthlyOpex: 0,
            annualMaintenance: 200
        };

        const data = [];
        let doorkingCumulative = doorking.hardware + doorking.installation;
        let unifiCumulative = unifi.hardware + unifi.installation;

        if (financingModel === 'lease') {
            doorkingCumulative = 0;
            unifiCumulative = 0;
        } else if (financingModel === 'financing') {
            doorkingCumulative = 0;
            unifiCumulative = 0;
        }

        for (let month = 0; month <= 36; month++) {
            if (month > 0) {
                doorkingCumulative += doorking.monthlyOpex;
                if (month % 12 === 0) {
                    doorkingCumulative += doorking.annualMaintenance;
                    unifiCumulative += unifi.annualMaintenance;
                }

                if (financingModel === 'lease') {
                    const doorkingUpfront = doorking.hardware + doorking.installation;
                    const unifiUpfront = unifi.hardware + unifi.installation;
                    doorkingCumulative += (doorkingUpfront * 1.10) / 36;
                    unifiCumulative += (unifiUpfront * 1.10) / 36;
                } else if (financingModel === 'financing') {
                    const rate = 0.07 / 12;
                    const periods = 60;
                    const doorkingUpfront = doorking.hardware + doorking.installation;
                    const unifiUpfront = unifi.hardware + unifi.installation;
                    const doorkingPayment = (doorkingUpfront * rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
                    const unifiPayment = (unifiUpfront * rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
                    doorkingCumulative += doorkingPayment;
                    unifiCumulative += unifiPayment;
                }
            }

            data.push({
                month,
                DoorKing: Math.round(doorkingCumulative),
                UniFi: Math.round(unifiCumulative)
            });
        }

        return data;
    };

    const projectionData = calculateProjections();
    const finalDoorking = projectionData[projectionData.length - 1].DoorKing;
    const finalUnifi = projectionData[projectionData.length - 1].UniFi;
    const savings = finalDoorking - finalUnifi;
    const breakEvenMonth = projectionData.findIndex(d => d.UniFi < d.DoorKing && d.month > 0);

    return (
        <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
                <CardTitle className="text-2xl text-white">3-Year Cost Projection</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 border border-green-700/50 rounded-xl p-6">
                        <TrendingDown className="w-8 h-8 text-green-400 mb-2" />
                        <div className="text-sm text-green-400 mb-1">Total Savings</div>
                        <div className="text-3xl font-bold text-white">${savings.toLocaleString()}</div>
                        <div className="text-xs text-slate-400 mt-1">Over 3 years</div>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-700/50 rounded-xl p-6">
                        <Clock className="w-8 h-8 text-cyan-400 mb-2" />
                        <div className="text-sm text-cyan-400 mb-1">Break-Even Point</div>
                        <div className="text-3xl font-bold text-white">Month {breakEvenMonth}</div>
                        <div className="text-xs text-slate-400 mt-1">UniFi becomes cheaper</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-950/30 to-pink-950/30 border border-purple-700/50 rounded-xl p-6">
                        <Zap className="w-8 h-8 text-purple-400 mb-2" />
                        <div className="text-sm text-purple-400 mb-1">Monthly Savings</div>
                        <div className="text-3xl font-bold text-white">${Math.round(savings / 36).toLocaleString()}</div>
                        <div className="text-xs text-slate-400 mt-1">Average per month</div>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Cumulative Cost Over Time</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={projectionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis 
                                dataKey="month" 
                                stroke="#94a3b8"
                                label={{ value: 'Months', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                            />
                            <YAxis 
                                stroke="#94a3b8"
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="DoorKing" 
                                stroke="#ef4444" 
                                strokeWidth={3} 
                                dot={false}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="UniFi" 
                                stroke="#22d3ee" 
                                strokeWidth={3} 
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}