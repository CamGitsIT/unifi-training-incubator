import React, { useState } from 'react';
import { TrendingUp, PieChart, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const yearlyData = [
    { year: '2026', revenue: 160552, profit: 97858 },
    { year: '2027', revenue: 346602, profit: 226632 },
    { year: '2028', revenue: 606360, profit: 470753 }
];

const revenueBreakdown2028 = [
    { name: 'Training', value: 303821 },
    { name: 'Retrofit', value: 216039 },
    { name: 'Experience Center', value: 72000 },
    { name: 'Sager Project', value: 14500 }
];

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
                                { label: 'Year 1 Revenue', value: '$161K', sub: '61% net margin' },
                                { label: 'Year 2 Revenue', value: '$347K', sub: '65% net margin' },
                                { label: 'Year 3 Revenue', value: '$606K', sub: '78% net margin' },
                                { label: 'Year 3 Profit', value: '$471K', sub: 'Free cash flow' }
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
                        <h3 className="text-xl font-bold text-white mb-4">2028 Revenue Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueBreakdown2028}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
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