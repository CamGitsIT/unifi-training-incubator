import React from 'react';
import { STREAM_COLORS, SCENARIO_MULTIPLIERS, formatCurrency } from './forecastEngine';

export default function StreamForecastCard({
  stream, result, scenario, isActive, onSelect, onUpdateDriver, onUpdateGrowth, onToggle
}) {
  const color = STREAM_COLORS[stream.stream_id] || '#22d3ee';
  const scenarioMult = SCENARIO_MULTIPLIERS[scenario].multiplier;

  const baseline = stream.stream_id;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        !stream.enabled
          ? 'border-slate-700 bg-slate-900/40 opacity-50'
          : isActive
          ? 'border-opacity-60 bg-slate-800/70'
          : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
      }`}
      style={isActive || stream.enabled ? { borderColor: color + '50' } : {}}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          <div>
            <div className="text-sm font-semibold text-white leading-tight">{stream.stream_title}</div>
            <div className="text-xs text-slate-400">{stream.driver_name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold" style={{ color }}>
              {result ? formatCurrency(result.y1, true) : '—'}
            </div>
            <div className="text-xs text-slate-500">Y1</div>
          </div>
          {/* Toggle */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`w-8 h-4 rounded-full transition-all relative flex-shrink-0 ${
              stream.enabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                stream.enabled ? 'left-4' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded controls */}
      {isActive && stream.enabled && (
        <div className="px-4 pb-4 border-t border-slate-700/60 pt-3 space-y-4">
          {/* Y1 / Y2 / Y3 */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Y1', val: result?.y1 },
              { label: 'Y2', val: result?.y2 },
              { label: 'Y3', val: result?.y3 },
            ].map(item => (
              <div key={item.label} className="bg-slate-900/60 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-sm font-bold" style={{ color }}>
                  {item.val != null ? formatCurrency(item.val, true) : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Run rate row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'M12/mo', val: result?.runRateM12 },
              { label: 'M24/mo', val: result?.runRateM24 },
              { label: 'M36/mo', val: result?.runRateM36 },
            ].map(item => (
              <div key={item.label} className="bg-slate-900/40 rounded-lg p-2 text-center">
                <div className="text-xs text-slate-500">{item.label}</div>
                <div className="text-xs font-semibold text-slate-300">
                  {item.val != null ? formatCurrency(item.val, true) : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Driver slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{stream.driver_name}</span>
              <span style={{ color }} className="font-semibold">
                {stream.plan_driver_m1} {stream.driver_unit}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={Math.max(stream.plan_driver_m1 * 5, 20)}
              step={stream.plan_driver_m1 >= 10 ? 1 : 0.5}
              value={stream.plan_driver_m1}
              onChange={e => onUpdateDriver(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
              style={{ accentColor: color }}
            />
          </div>

          {/* Growth rate slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Monthly growth rate</span>
              <span style={{ color }} className="font-semibold">
                {(stream.monthly_growth * 100).toFixed(1)}%/mo
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.005}
              value={stream.monthly_growth}
              onChange={e => onUpdateGrowth(parseFloat(e.target.value))}
              className="w-full"
              style={{ accentColor: color }}
            />
            <div className="flex justify-between text-xs text-slate-600 mt-0.5">
              <span>0%</span><span>50%</span>
            </div>
          </div>

          {/* Unit economics */}
          <div className="text-xs text-slate-500 bg-slate-900/40 rounded-lg p-3 space-y-1">
            <div className="flex justify-between">
              <span>Unit revenue</span>
              <span className="text-slate-300">{formatCurrency(stream.unit_revenue)}/unit</span>
            </div>
            <div className="flex justify-between">
              <span>Units per driver</span>
              <span className="text-slate-300">{stream.units_per_driver}×</span>
            </div>
            <div className="flex justify-between">
              <span>Scenario multiplier</span>
              <span className="text-slate-300">{scenarioMult}×</span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-1">
              <span>M1 monthly revenue</span>
              <span className="text-slate-200 font-medium">
                {formatCurrency(stream.plan_driver_m1 * stream.units_per_driver * stream.unit_revenue * scenarioMult)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}