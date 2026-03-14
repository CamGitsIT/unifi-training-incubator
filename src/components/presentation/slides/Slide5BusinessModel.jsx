import React, { useState, useEffect, useRef } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { BASELINE_STREAMS, STREAM_COLORS } from '@/components/forecast/forecastEngine';

const STREAM_DISPLAY = {
  experience:    { icon: Camera,        color: 'cyan',   title: 'Experience Center',       subtitle: 'Live showroom',                      tag: 'Direct',         description: 'Live UniFi showroom.', metrics: ['No inventory.', 'Qualifies buyers.', 'Feeds every other line.'] },
  training:      { icon: GraduationCap, color: 'green',  title: 'Certification Training',  subtitle: 'Official UniFi training',            tag: 'Direct',         description: 'Official UniFi bootcamps.', metrics: ['$2,000/seat.', 'In-person or remote.', 'Builds talent pipeline.'] },
  retrofit:      { icon: Building2,     color: 'purple', title: 'Access Control Retrofit', subtitle: 'Modern entry upgrades',              tag: 'Project',        description: 'Modern entry upgrades.', metrics: ['Avg $9K deal. 12.5% fee.', 'Design & scope → integration partner.'] },
  retail:        { icon: Store,         color: 'amber',  title: 'Multi-Location Retail',   subtitle: 'Standardized retail rollouts',       tag: 'Recurring',      description: 'Standardized chain rollouts.', metrics: ['Adopt standardized systems across chain.', 'Manage sites from one Admin Portal.', 'Recurring support across sites.'] },
  monitoring:    { icon: Shield,        color: 'red',    title: 'Professional Monitoring', subtitle: 'Modern security monitoring',         tag: 'Recurring',      description: 'Modern security monitoring.', metrics: ['First to partner UniFi with Monitoring.', 'Endless pipeline with recurring fee per UniFi referred sites.', 'Repeatable mold for across industries.'] },
  rentals:       { icon: Camera,        color: 'indigo', title: 'Infrastructure Rentals',  subtitle: 'Production-ready gear rentals',      tag: 'Asset',          description: 'Production-ready gear rentals.', metrics: ['$800 avg per job.', 'No client capex.'] },
  refrigeration: { icon: Thermometer,   color: 'orange', title: 'Compliance Monitoring',   subtitle: 'Temperature and compliance logging', tag: 'Recurring',      description: 'Temp & compliance monitoring.', metrics: ['$1,000/year/location.', 'Cuts manual work and error.'] },
  isp:           { icon: Wifi,          color: 'teal',   title: 'Micro ISP',               subtitle: 'Community broadband for HOAs',       tag: 'Infrastructure', description: 'HOA community broadband.', metrics: ['$55/unit/mo net.', 'Beats incumbent pricing.', 'Portion goes back to HOA/Property.'] },
};

const colorMap = {
  cyan:   { bg: 'from-cyan-950/30',   border: 'border-cyan-900/50',   icon: 'bg-cyan-500/10',   iconColor: 'text-cyan-400',   accent: 'text-cyan-400',   tag: 'bg-cyan-900/40 text-cyan-300',    hex: '#22d3ee' },
  purple: { bg: 'from-purple-950/30', border: 'border-purple-900/50', icon: 'bg-purple-500/10', iconColor: 'text-purple-400', accent: 'text-purple-400', tag: 'bg-purple-900/40 text-purple-300', hex: '#a78bfa' },
  green:  { bg: 'from-green-950/30',  border: 'border-green-900/50',  icon: 'bg-green-500/10',  iconColor: 'text-green-400',  accent: 'text-green-400',  tag: 'bg-green-900/40 text-green-300',  hex: '#34d399' },
  amber:  { bg: 'from-amber-950/30',  border: 'border-amber-900/50',  icon: 'bg-amber-500/10',  iconColor: 'text-amber-400',  accent: 'text-amber-400',  tag: 'bg-amber-900/40 text-amber-300',  hex: '#fbbf24' },
  red:    { bg: 'from-red-950/30',    border: 'border-red-900/50',    icon: 'bg-red-500/10',    iconColor: 'text-red-400',    accent: 'text-red-400',    tag: 'bg-red-900/40 text-red-300',      hex: '#f87171' },
  indigo: { bg: 'from-indigo-950/30', border: 'border-indigo-900/50', icon: 'bg-indigo-500/10', iconColor: 'text-indigo-400', accent: 'text-indigo-400', tag: 'bg-indigo-900/40 text-indigo-300', hex: '#818cf8' },
  orange: { bg: 'from-orange-950/30', border: 'border-orange-900/50', icon: 'bg-orange-500/10', iconColor: 'text-orange-400', accent: 'text-orange-400', tag: 'bg-orange-900/40 text-orange-300', hex: '#fb923c' },
  teal:   { bg: 'from-teal-950/30',   border: 'border-teal-900/50',   icon: 'bg-teal-500/10',   iconColor: 'text-teal-400',   accent: 'text-teal-400',   tag: 'bg-teal-900/40 text-teal-300',    hex: '#2dd4bf' },
};

// Order: center cards first (experience, training), then the 6 orbital ones
const CENTER_IDS = ['experience', 'training'];
const ORBITAL_IDS = ['retrofit', 'retail', 'monitoring', 'rentals', 'refrigeration', 'isp'];

const businessLines = BASELINE_STREAMS
  .filter(s => STREAM_DISPLAY[s.stream_id])
  .map(s => ({ id: s.stream_id, ...STREAM_DISPLAY[s.stream_id] }));

const getLine = (id) => businessLines.find(l => l.id === id);

const STACK_DATA = [
  { label: 'Standalone',    standalone: 40, expansion: 0,  compounding: 0  },
  { label: '+ Expansion',   standalone: 40, expansion: 35, compounding: 0  },
  { label: '+ Compounding', standalone: 40, expansion: 35, compounding: 25 },
];

// ─── Flywheel ─────────────────────────────────────────────────────────────────
function Flywheel({ expanded, onExpand }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(600);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width;
        setSize(Math.min(w, 680));
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  // Orbital radius scales with container: 36% of size, clamped
  const orbitR = Math.max(160, Math.min(size * 0.36, 240));
  // Circle node size
  const nodeR = Math.max(56, Math.min(size * 0.1, 72));

  const orbitalLines = ORBITAL_IDS.map((id, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180); // evenly spaced, start top
    return {
      line: getLine(id),
      x: cx + Math.cos(angle) * orbitR,
      y: cy + Math.sin(angle) * orbitR,
    };
  });

  // Spinning arrow dots along orbit ring
  const arrowCount = 12;

  return (
    <div ref={containerRef} className="w-full" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="relative" style={{ width: size, height: size, margin: '0 auto' }}>

        {/* SVG layer: orbit ring + animated arrows */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Orbit ring */}
          <circle
            cx={cx} cy={cy} r={orbitR}
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
          />

          {/* Spoke lines from center to each orbital */}
          {orbitalLines.map(({ line, x, y }) => {
            const colors = colorMap[line.color];
            return (
              <line
                key={line.id}
                x1={cx} y1={cy} x2={x} y2={y}
                stroke={colors.hex}
                strokeWidth="1"
                strokeOpacity="0.18"
              />
            );
          })}

          {/* Animated dots on orbit ring */}
          {Array.from({ length: arrowCount }).map((_, i) => {
            const delay = (i / arrowCount) * 8;
            const colorList = Object.values(colorMap).map(c => c.hex);
            const color = colorList[i % colorList.length];
            return (
              <circle key={i} r="3" fill={color} opacity="0.7">
                <animateMotion
                  dur="8s"
                  begin={`${-delay}s`}
                  repeatCount="indefinite"
                  path={`M ${cx + orbitR} ${cy} A ${orbitR} ${orbitR} 0 1 1 ${cx + orbitR - 0.001} ${cy}`}
                />
              </circle>
            );
          })}
        </svg>

        {/* ── Center hub: two cards stacked ── */}
        <div
          className="absolute flex flex-col gap-2 items-center"
          style={{
            left: cx,
            top: cy,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            width: Math.min(size * 0.28, 180),
          }}
        >
          {CENTER_IDS.map(id => {
            const line = getLine(id);
            const colors = colorMap[line.color];
            const Icon = line.icon;
            const idx = businessLines.indexOf(line);
            const isExpanded = expanded.has(idx);
            return (
              <motion.button
                key={id}
                onClick={() => onExpand(idx)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  w-full text-left rounded-xl border-2 p-3 cursor-pointer shadow-2xl
                  bg-gradient-to-br ${colors.bg} to-slate-900/30 ${colors.border}
                  ${isExpanded ? 'ring-2 ring-offset-1 ring-offset-slate-900' : ''}
                `}
                style={isExpanded ? { boxShadow: `0 0 0 2px ${colors.hex}55` } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${colors.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.tag}`}>{line.tag}</span>
                </div>
                <p className="text-xs font-bold text-white leading-tight">{line.title}</p>
                <p className={`text-[10px] ${colors.accent} mt-0.5`}>{line.subtitle}</p>
              </motion.button>
            );
          })}
        </div>

        {/* ── Orbital nodes ── */}
        {orbitalLines.map(({ line, x, y }) => {
          const colors = colorMap[line.color];
          const Icon = line.icon;
          const idx = businessLines.indexOf(line);
          const isExpanded = expanded.has(idx);
          return (
            <motion.button
              key={line.id}
              onClick={() => onExpand(idx)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ORBITAL_IDS.indexOf(line.id) * 0.07 + 0.2 }}
              className={`
                absolute flex flex-col items-center justify-center rounded-full
                border-2 cursor-pointer shadow-xl
                bg-gradient-to-br ${colors.bg} to-slate-900/20 ${colors.border}
              `}
              style={{
                width: nodeR * 2,
                height: nodeR * 2,
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
                boxShadow: isExpanded ? `0 0 20px ${colors.hex}55` : undefined,
              }}
            >
              <div className={`w-9 h-9 ${colors.icon} rounded-full flex items-center justify-center mb-1`}>
                <Icon className={`w-4 h-4 ${colors.iconColor}`} />
              </div>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${colors.tag} mb-1`}>{line.tag}</span>
              <p className="text-[10px] font-bold text-white text-center leading-tight px-2">{line.title}</p>
            </motion.button>
          );
        })}

      </div>
    </div>
  );
}

// ─── Expanded modal ────────────────────────────────────────────────────────────
function ExpandedModal({ line, onClose }) {
  if (!line) return null;
  const colors = colorMap[line.color];
  const Icon = line.icon;
  return (
    <AnimatePresence>
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        />
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto px-4"
        >
          <div className={`bg-gradient-to-br ${colors.bg} to-slate-900 border-2 ${colors.border} rounded-3xl p-8 shadow-2xl`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${colors.icon} rounded-2xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${colors.iconColor}`} />
                </div>
                <div>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${colors.tag} inline-block mb-2`}>{line.tag}</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">{line.title}</h3>
                  <p className={`text-base ${colors.accent} mt-1`}>{line.subtitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-slate-200 text-base leading-relaxed">{line.description}</p>
              <div className="bg-slate-900/40 rounded-2xl p-5 border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Key Benefits</h4>
                <div className="space-y-2">
                  {line.metrics.map((m, j) => (
                    <div key={j} className="flex items-start gap-3 text-base text-slate-300">
                      <ArrowRight className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.iconColor}`} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// ─── Main slide ────────────────────────────────────────────────────────────────
export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
  const [expanded, setExpanded] = useState(new Set());
  const [expandedCard, setExpandedCard] = useState(null);
  const [timerDone, setTimerDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (timerDone) { if (onUnlockMessage) onUnlockMessage(null); return; }
    if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
  }, [secondsLeft, timerDone]);

  useEffect(() => {
    if (timerDone) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); setTimerDone(true); onInteracted(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerDone]);

  const handleExpand = (i) => {
    const next = new Set(expanded);
    const line = businessLines[i];
    if (next.has(i)) {
      next.delete(i);
      setExpandedCard(null);
    } else {
      next.add(i);
      setExpandedCard(line);
    }
    setExpanded(next);
  };

  const allExpanded = expanded.size === businessLines.length;
  useEffect(() => {
    if (allExpanded && !timerDone) { setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null); }
  }, [allExpanded]);

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-4">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Separate revenue lines.<br />Shared momentum.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            Each line earns on its own. Together they compound.
          </p>
          <p className="text-lg text-white max-w-2xl mx-auto mb-2">
            We're building both the Experience Center and National Training Center with this $300K raise (unlocking the SBA-backed $850K facility).
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We educate + demo, then design & scope complex projects — handing implementation design to our trained partners to implement for a fee.
          </p>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-4">
            8 connected streams complete the flywheel.
          </p>
        </motion.div>

        {/* Flywheel */}
        <Flywheel expanded={expanded} onExpand={handleExpand} />

        {/* Modal */}
        <ExpandedModal line={expandedCard} onClose={() => setExpandedCard(null)} />

        {/* Section break */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-14 mb-8 flex items-center gap-4">
          <div className="flex-1 border-t border-slate-800" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase whitespace-nowrap">Why This Model Works — Standalone. Expandable. Compounding.</p>
          <div className="flex-1 border-t border-slate-800" />
        </motion.div>

        {/* Stacked visual framework */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-slate-800 bg-slate-800/20 px-6 py-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              {STACK_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 flex-shrink-0 text-right">{row.label}</span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden bg-slate-800/60 flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.standalone}%` }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-cyan-500/70"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.expansion}%` }}
                      transition={{ delay: 0.55 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-violet-500/70"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.compounding}%` }}
                      transition={{ delay: 0.7 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-green-500/70"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { color: 'bg-cyan-500/70',   label: 'Standalone Revenue',   desc: 'Each line can close and generate revenue on its own.' },
                { color: 'bg-violet-500/70', label: 'Expansion Revenue',    desc: 'One deployment often opens the door to the next service.' },
                { color: 'bg-green-500/70',  label: 'Lower Risk. More Value.', desc: 'Diversified revenue reduces dependency on any one offer and increases long-term client value.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-sm ${item.color} flex-shrink-0 mt-1`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-200 leading-tight">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
