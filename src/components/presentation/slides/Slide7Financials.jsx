import React, { useState } from 'react';
import { TrendingUp, PieChart, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// All 8 business lines, Year 1 / Year 2 / Year 3 revenue (aligned with Slide5 Yr3 totals)
const businessLineData = [
    { name: 'Experience Center',        y1: 30000,  y2: 75000,  y3: 120000 },
    { name: 'Keyless Retrofit',         y1: 54000,  y2: 135000, y3: 216000 },
    { name: 'UniFi Training',           y1: 76000,  y2: 190000, y3: 304000 },
    { name: 'Multi-Location Retail',    y1: 18000,  y2: 45000,  y3: 72000  },
    { name: 'Pro Monitoring',           y1: 24000,  y2: 60000,  y3: 96000  },
    { name: 'Tech Rentals',             y1: 12000,  y2: 30000,  y3: 48000  },
    { name: 'Refrigeration Monitoring', y1: 15000,  y2: 37500,  y3: 60000  },
    { name: 'Micro ISP',                y1: 36000,  y2: 90000,  y3: 144000 },
];

const totalByYear = (key) => businessLineData.reduce((s, b) => s + b[key], 0);
const y1Total = totalByYear('y1');  // 265000
const y2Total = totalByYear('y2');  // 662500
const y3Total = totalByYear('y3'); // 1060000

// Estimated net margins
const y1Profit = Math.round(y1Total * 0.61);
const y2Profit = Math.round(y2Total * 0.65);
const y3Profit = Math.round(y3Total * 0.70);

const yearlyData = [
    { year: 'Year 1', revenue: y1Total, profit: y1Profit },
    { year: 'Year 2', revenue: y2Total, profit: y2Profit },
    { year: 'Year 3', revenue: y3Total, profit: y3Profit },
];

const formatK = (v) => `$${(v / 1000).toFixed(0)}K`;

const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'revenue', label: 'Revenue Growth', icon: BarChart3 },
    { id: 'safety', label: 'Safety Margins', icon: Shield }
];

export default function Slide7Financials({ onInteracted }) {
    const [visitedTabs, setVisitedTabs] = useState(new Set(['overview']));
    const [activeTab, setActiveTab] = useState('overview');

    const handleTab = (id) => {
        setActiveTab(id);
        const next = new Set(visitedTabs);
        next.add(id);
        setVisitedTabs(next);
        if (next.size === tabs.length) onInteracted();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 py-24 px-6">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Financial Projections</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Conservative Growth, Exceptional Margins</h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">Even in the "Floor" scenario, we generate enough to service debt with massive safety margins.</p>
                    <p className="text-sm text-cyan-400 mt-4 animate-pulse">👇 Click all 3 tabs to continue</p>
                </motion.div>

                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        const visited = visitedTabs.has(tab.id);
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTab(tab.id)}
                                className={`relative rounded-2xl p-4 transition-all duration-300 flex flex-col items-center gap-2 ${isActive ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-xl' : 'bg-slate-800/50 border border-slate-700 hover:border-slate-500'}`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : visited ? 'text-green-400' : 'text-slate-400'}`} />
                                <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>{tab.label}</span>
                                {visited && !isActive && <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full" />}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { label: 'Year 1 Revenue', value: formatK(y1Total), sub: '61% net margin' },
                                { label: 'Year 2 Revenue', value: formatK(y2Total), sub: '65% net margin' },
                                { label: 'Year 3 Revenue', value: formatK(y3Total), sub: '70% net margin' },
                                { label: 'Year 3 Profit', value: formatK(y3Profit), sub: 'Free cash flow' }
                            ].map((s, i) => (
                                <div key={i} className="bg-slate-800/30 border border-slate-700 rounded-xl p-5">
                                    <div className="text-sm text-slate-400 mb-2">{s.label}</div>
                                    <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                                    <div className="text-xs text-green-400">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Revenue Growth Trajectory</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="year" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} name="Revenue" />
                                    <Line type="monotone" dataKey="profit" stroke="#4ade80" strokeWidth={3} name="Net Profit" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'revenue' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Revenue Growth by Business Line</h3>
                        <p className="text-slate-400 text-sm mb-4">All 8 lines across Year 1 → Year 3</p>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={businessLineData} margin={{ bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                                <YAxis stroke="#94a3b8" tickFormatter={formatK} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                                    formatter={(v) => [`$${v.toLocaleString()}`, '']}
                                />
                                <Legend verticalAlign="top" />
                                <Bar dataKey="y1" name="Year 1" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="y2" name="Year 2" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="y3" name="Year 3" fill="#4ade80" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                )}

                {activeTab === 'safety' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="bg-gradient-to-br from-green-950/30 to-slate-900/30 border border-green-900/50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-8 h-8 text-green-400" />
                                <h3 className="text-xl font-bold text-white">Debt Service Coverage Ratio (DSCR)</h3>
                            </div>
                            <p className="text-slate-300 mb-4 text-sm">Banking standard requires 1.25x. We exceed this even in worst-case scenarios.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 rounded-xl p-5">
                                    <div className="text-sm text-slate-400 mb-1">"Floor" Model (Conservative)</div>
                                    <div className="text-5xl font-bold text-green-400 mb-1">1.54x</div>
                                    <div className="text-slate-300 text-sm">Training revenue alone covers debt 10x over</div>
                                </div>
                                <div className="bg-slate-950/50 rounded-xl p-5">
                                    <div className="text-sm text-slate-400 mb-1">"Base" Model (Market Potential)</div>
                                    <div className="text-5xl font-bold text-cyan-400 mb-1">52.9x</div>
                                    <div className="text-slate-300 text-sm">Could pay off building in under 18 months</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
                            <h4 className="font-semibold text-white mb-2">Annual Debt Service</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">$55,200</span>
                                <span className="text-slate-400">/ year ($4,600/month)</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {visitedTabs.size === tabs.length && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-400 font-semibold mt-6">
                        ✓ Click Next to see the investment opportunity
                    </motion.p>
                )}
            </div>
        </div>
    );
}