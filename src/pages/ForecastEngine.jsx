import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { BASELINE_STREAMS, DEPENDENCIES, SCENARIO_MULTIPLIERS, STREAM_COLORS, runForecast, formatCurrency } from '@/components/forecast/forecastEngine';
import StreamForecastCard from '@/components/forecast/StreamForecastCard';
import DependencyGraph from '@/components/forecast/DependencyGraph';

const MONTH_LABELS = Array.from({ length: 36 }, (_, i) => `M${i + 1}`);

export default function ForecastEngine() {
  const [scenario, setScenario] = useState('base');
  const [streams, setStreams] = useState(BASELINE_STREAMS.map(s => ({ ...s })));
  const [activeStream, setActiveStream] = useState(null);

  const forecast = useMemo(() => runForecast(streams, scenario), [streams, scenario]);

  const chartData = MONTH_LABELS.map((label, i) => {
    const row = { month: label };
    streams.filter(s => s.enabled).forEach(s => {
      row[s.stream_id] = Math.round(forecast.streams[s.stream_id]?.monthly[i] || 0);
    });
    row.total = Math.round(forecast.totalMonthly[i]);
    return row;
  });

  const barData = [
    { year: 'Year 1', ...Object.fromEntries(streams.filter(s=>s.enabled).map(s => [s.stream_id, Math.round(forecast.streams[s.stream_id]?.y1)])), total: Math.round(forecast.totalY1) },
    { year: 'Year 2', ...Object.fromEntries(streams.filter(s=>s.enabled).map(s => [s.stream_id, Math.round(forecast.streams[s.stream_id]?.y2)])), total: Math.round(forecast.totalY2) },
    { year: 'Year 3', ...Object.fromEntries(streams.filter(s=>s.enabled).map(s => [s.stream_id, Math.round(forecast.streams[s.stream_id]?.y3)])), total: Math.round(forecast.totalY3) },
  ];

  function updateStream(id, field, value) {
    setStreams(prev => prev.map(s => s.stream_id === id ? { ...s, [field]: value } : s));
  }

  function resetToBaseline() {
    setStreams(BASELINE_STREAMS.map(s => ({ ...s })));
  }

  const scenarioColor = SCENARIO_MULTIPLIERS[scenario].color;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Forecast Engine</h1>
            <p className="text-slate-400 text-sm">36-month compound growth simulator with upstream dependencies</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Scenario selector */}
            <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
              {Object.entries(SCENARIO_MULTIPLIERS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setScenario(key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    scenario === key ? 'text-slate-950 font-bold shadow-lg' : 'text-slate-400 hover:text-white'
                  }`}
                  style={scenario === key ? { backgroundColor: val.color } : {}}
                >
                  {val.label}
                </button>
              ))}
            </div>
            <button
              onClick={resetToBaseline}
              className="px-3 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
            >
              Reset to Baseline
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {/* KPI Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Year 1 Total', value: forecast.totalY1, sub: 'Months 1–12' },
            { label: 'Year 2 Total', value: forecast.totalY2, sub: 'Months 13–24' },
            { label: 'Year 3 Total', value: forecast.totalY3, sub: 'Months 25–36' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-slate-800/60 border border-slate-700 rounded-xl p-5"
            >
              <div className="text-slate-400 text-sm mb-1">{kpi.label}</div>
              <div className="text-3xl font-bold" style={{ color: scenarioColor }}>
                {formatCurrency(kpi.value, true)}
              </div>
              <div className="text-slate-500 text-xs mt-1">{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* 36-Month Stacked Area Chart */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h2 className="text-slate-200 font-semibold mb-4">36-Month Revenue Trajectory</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                {streams.filter(s => s.enabled).map(s => (
                  <linearGradient key={s.stream_id} id={`grad_${s.stream_id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={STREAM_COLORS[s.stream_id]} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={STREAM_COLORS[s.stream_id]} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false}
                interval={5} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => formatCurrency(v, true)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(v, name) => [formatCurrency(v), streams.find(s=>s.stream_id===name)?.stream_title || name]}
              />
              {streams.filter(s => s.enabled).map(s => (
                <Area
                  key={s.stream_id}
                  type="monotone"
                  dataKey={s.stream_id}
                  stackId="1"
                  stroke={STREAM_COLORS[s.stream_id]}
                  fill={`url(#grad_${s.stream_id})`}
                  strokeWidth={1.5}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Annual Bar Chart */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
          <h2 className="text-slate-200 font-semibold mb-4">Annual Revenue by Stream</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => formatCurrency(v, true)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(v, name) => [formatCurrency(v), streams.find(s=>s.stream_id===name)?.stream_title || name]}
              />
              {streams.filter(s => s.enabled).map(s => (
                <Bar key={s.stream_id} dataKey={s.stream_id} stackId="a"
                  fill={STREAM_COLORS[s.stream_id]} radius={s.stream_id === 'experience' ? [4,4,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stream Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-200 font-semibold">Stream Controls</h2>
            <p className="text-slate-500 text-xs">Adjust drivers to see live impact on 36-month forecast</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {streams.map((stream) => (
              <StreamForecastCard
                key={stream.stream_id}
                stream={stream}
                result={forecast.streams[stream.stream_id]}
                scenario={scenario}
                isActive={activeStream === stream.stream_id}
                onSelect={() => setActiveStream(activeStream === stream.stream_id ? null : stream.stream_id)}
                onUpdateDriver={(val) => updateStream(stream.stream_id, 'plan_driver_m1', val)}
                onUpdateGrowth={(val) => updateStream(stream.stream_id, 'monthly_growth', val)}
                onToggle={() => updateStream(stream.stream_id, 'enabled', !stream.enabled)}
              />
            ))}
          </div>
        </div>

        {/* Dependency Graph */}
        <DependencyGraph streams={streams} dependencies={DEPENDENCIES} />

      </div>
    </div>
  );
}