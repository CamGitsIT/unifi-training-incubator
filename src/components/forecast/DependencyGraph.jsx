import React from 'react';
import { STREAM_COLORS } from './forecastEngine';
import { ArrowRight } from 'lucide-react';

export default function DependencyGraph({ streams, dependencies }) {
  const streamMap = Object.fromEntries(streams.map(s => [s.stream_id, s]));

  // Group by upstream
  const byUpstream = {};
  dependencies.forEach(dep => {
    if (!byUpstream[dep.upstream]) byUpstream[dep.upstream] = [];
    byUpstream[dep.upstream].push(dep);
  });

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
      <h2 className="text-slate-200 font-semibold mb-1">Dependency Graph</h2>
      <p className="text-slate-500 text-xs mb-5">Upstream streams compound downstream drivers via elasticity coefficients</p>

      <div className="space-y-3">
        {Object.entries(byUpstream).map(([upId, deps]) => {
          const up = streamMap[upId];
          if (!up) return null;
          const upColor = STREAM_COLORS[upId] || '#94a3b8';
          return (
            <div key={upId} className="flex items-start gap-3 flex-wrap">
              {/* Upstream */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium flex-shrink-0"
                style={{ borderColor: upColor + '50', backgroundColor: upColor + '15', color: upColor }}
              >
                <span>{up.stream_title}</span>
              </div>

              {/* Arrows to downstreams */}
              <div className="flex flex-wrap gap-2 items-center">
                {deps.map(dep => {
                  const down = streamMap[dep.downstream];
                  if (!down) return null;
                  const downColor = STREAM_COLORS[dep.downstream] || '#94a3b8';
                  return (
                    <div key={dep.downstream} className="flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs"
                        style={{ borderColor: downColor + '40', backgroundColor: downColor + '10', color: downColor }}
                      >
                        <span>{down.stream_title}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-xs font-bold"
                          style={{ backgroundColor: downColor + '30' }}
                        >
                          {dep.elasticity}×
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-slate-600 text-xs mt-4">
        Elasticity = downstream driver % change per 1% upstream driver change above baseline
      </p>
    </div>
  );
}