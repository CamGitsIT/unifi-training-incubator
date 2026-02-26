import React, { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, Shield, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Financials() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isPulsing, setIsPulsing] = useState(true);

    // Auto-rotate tabs to show interactivity
    React.useEffect(() => {
        const timer = setTimeout(() => setIsPulsing(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const yearlyData = [
        { year: '2026', revenue: 160552, profit: 97858, margin: 61 },
        { year: '2027', revenue: 346602, profit: 226632, margin: 65 },
        { year: '2028', revenue: 606360, profit: 470753, margin: 78 }
    ];

    const revenueBreakdown2028 = [
        { name: 'Training', value: 303821, color: '#a78bfa' },
        { name: 'Retrofit', value: 216039, color: '#22d3ee' },
        { name: 'Experience Center', value: 72000, color: '#4ade80' },
        { name: 'Sager Project', value: 14500, color: '#fb923c' }
    ];

    return (
        <section id="financials" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Financial Projections</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Conservative Growth, Exceptional Margins
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Even in the "Floor" scenario, we generate enough to service debt with massive safety margins.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <div className="mb-12 relative">
                    {isPulsing && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm font-medium text-cyan-400 whitespace-nowrap animate-bounce">
                            👇 Click to explore different financial views
                        </div>
                    )}
                    <div className={`grid grid-cols-3 gap-4 max-w-4xl mx-auto ${isPulsing ? 'scale-105' : ''} transition-transform`}>
                        {[
                            { id: 'overview', label: 'Overview', icon: PieChart, gradient: 'from-cyan-500 to-blue-500', description: 'Key metrics at a glance' },
                            { id: 'revenue', label: 'Revenue Growth', icon: BarChart3, gradient: 'from-purple-500 to-pink-500', description: 'Income breakdown' },
                            { id: 'safety', label: 'Safety Margins', icon: Shield, gradient: 'from-green-500 to-emerald-500', description: 'Risk analysis' }
                        ].map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setIsPulsing(false); }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                                        isActive
                                            ? `bg-gradient-to-br ${tab.gradient} shadow-2xl shadow-cyan-500/50`
                                            : 'bg-slate-800/50 hover:bg-slate-800/70 border border-slate-700'
                                    }`}
                                >
                                    {/* Glow effect when active */}
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                    )}
                                    
                                    <div className="relative z-10">
                                        <Icon className={`w-8 h-8 mx-auto mb-2 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <div className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                            {tab.label}
                                        </div>
                                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                                            {tab.description}
                                        </div>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { label: "Year 1 Revenue", value: "$161K", subtext: "61% net margin" },
                                { label: "Year 2 Revenue", value: "$347K", subtext: "65% net margin" },
                                { label: "Year 3 Revenue", value: "$606K", subtext: "78% net margin" },
                                { label: "Year 3 Profit", value: "$471K", subtext: "Free cash flow" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                                    <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-xs text-green-400">{stat.subtext}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6">Revenue Growth Trajectory</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="year" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} name="Revenue" />
                                    <Line type="monotone" dataKey="profit" stroke="#4ade80" strokeWidth={3} name="Net Profit" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Revenue Tab */}
                {activeTab === 'revenue' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">2028 Revenue Breakdown</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={revenueBreakdown2028}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {revenueBreakdown2028.map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: item.color }} />
                                    <div className="text-sm text-slate-400">{item.name}</div>
                                    <div className="font-bold text-white">${(item.value / 1000).toFixed(0)}K</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Safety Tab */}
                {activeTab === 'safety' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <div className="bg-gradient-to-br from-green-950/30 to-slate-900/30 border border-green-900/50 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Shield className="w-8 h-8 text-green-400" />
                                <h3 className="text-2xl font-bold text-white">Debt Service Coverage Ratio (DSCR)</h3>
                            </div>
                            <p className="text-slate-300 mb-6">
                                Banking standard requires 1.25x. We exceed this even in worst-case scenarios.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-950/50 rounded-xl p-6">
                                    <div className="text-sm text-slate-400 mb-2">"Floor" Model (Conservative)</div>
                                    <div className="text-5xl font-bold text-green-400 mb-2">1.54x</div>
                                    <div className="text-slate-300 text-sm">
                                        Training revenue alone covers debt 10x over
                                    </div>
                                </div>
                                <div className="bg-slate-950/50 rounded-xl p-6">
                                    <div className="text-sm text-slate-400 mb-2">"Base" Model (Market Potential)</div>
                                    <div className="text-5xl font-bold text-cyan-400 mb-2">52.9x</div>
                                    <div className="text-slate-300 text-sm">
                                        Could pay off building in under 18 months
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-4">Stress Test: Combined Worst-Case</h3>
                            <p className="text-slate-300 mb-6">
                                What if volume drops 25%, labor pricing falls 10%, AND scope creep increases 20%?
                            </p>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-400 mb-1">-25%</div>
                                    <div className="text-sm text-slate-400">Volume Shock</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-400 mb-1">-10%</div>
                                    <div className="text-sm text-slate-400">Pricing Pressure</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-400 mb-1">+20%</div>
                                    <div className="text-sm text-slate-400">Scope Creep</div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                                <div className="text-sm text-slate-400 mb-2">Adjusted Gross Profit (Retrofit Only)</div>
                                <div className="text-4xl font-bold text-green-400">$28,500</div>
                                <p className="text-slate-400 text-sm mt-2">
                                    + $586K training revenue = Still highly viable
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                            <h4 className="font-semibold text-white mb-3">Annual Debt Service</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-white">$55,200</span>
                                <span className="text-slate-400">/ year</span>
                                <span className="text-slate-500">($4,600/month)</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}