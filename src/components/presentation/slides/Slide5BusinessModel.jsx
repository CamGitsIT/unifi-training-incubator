import React, { useState, useEffect } from 'react';
import { Building2, GraduationCap, Store, Shield, Camera, Thermometer, Wifi, ArrowRight, X } from 'lucide-react';
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
  cyan:   { border: '#164e63', iconBg: '#0e7490', tagBg: '#083344', tagText: '#67e8f9', accent: '#22d3ee', hex: '#22d3ee', gradFrom: '#083344' },
  purple: { border: '#4c1d95', iconBg: '#7c3aed', tagBg: '#2e1065', tagText: '#c4b5fd', accent: '#a78bfa', hex: '#a78bfa', gradFrom: '#2e1065' },
  green:  { border: '#14532d', iconBg: '#16a34a', tagBg: '#052e16', tagText: '#86efac', accent: '#4ade80', hex: '#4ade80', gradFrom: '#052e16' },
  amber:  { border: '#78350f', iconBg: '#d97706', tagBg: '#451a03', tagText: '#fcd34d', accent: '#fbbf24', hex: '#fbbf24', gradFrom: '#451a03' },
  red:    { border: '#7f1d1d', iconBg: '#dc2626', tagBg: '#450a0a', tagText: '#fca5a5', accent: '#f87171', hex: '#f87171', gradFrom: '#450a0a' },
  indigo: { border: '#312e81', iconBg: '#4f46e5', tagBg: '#1e1b4b', tagText: '#a5b4fc', accent: '#818cf8', hex: '#818cf8', gradFrom: '#1e1b4b' },
  orange: { border: '#7c2d12', iconBg: '#ea580c', tagBg: '#431407', tagText: '#fdba74', accent: '#fb923c', hex: '#fb923c', gradFrom: '#431407' },
  teal:   { border: '#134e4a', iconBg: '#0d9488', tagBg: '#042f2e', tagText: '#5eead4', accent: '#2dd4bf', hex: '#2dd4bf', gradFrom: '#042f2e' },
};

const businessLines = BASELINE_STREAMS
  .filter(s => STREAM_DISPLAY[s.stream_id])
  .map(s => ({ id: s.stream_id, ...STREAM_DISPLAY[s.stream_id] }));

const getLine = (id) => businessLines.find(l => l.id === id);

// SVG canvas — all layout in viewBox units, scales perfectly to any container
const VB = 600;
const CX = VB / 2;        // 300
const CY = VB / 2;        // 300
const ORBIT_R = 210;
const NODE_R  = 58;
const CENTER_W = 152;
const CENTER_H = 82;
const CENTER_GAP = 10;
const TOTAL_H = CENTER_H * 2 + CENTER_GAP;

// 6 orbital IDs in clockwise order starting top-right
const ORBITAL_IDS = ['retrofit', 'isp', 'retail', 'monitoring', 'refrigeration', 'rentals'];

const orbitalPositions = ORBITAL_IDS.map((id, i) => {
  const angle = ((i * 60) - 90) * (Math.PI / 180);
  return { id, x: CX + Math.cos(angle) * ORBIT_R, y: CY + Math.sin(angle) * ORBIT_R };
});

const STACK_DATA = [
  { label: 'Standalone',    standalone: 40, expansion: 0,  compounding: 0  },
  { label: '+ Expansion',   standalone: 40, expansion: 35, compounding: 0  },
  { label: '+ Compounding', standalone: 40, expansion: 35, compounding: 25 },
];

// Embed a lucide icon inside SVG via foreignObject
function SvgIcon({ Icon, x, y, size, color }) {
  return (
    <foreignObject x={x - size / 2} y={y - size / 2} width={size} height={size}>
      <div xmlns="http://www.w3.org/1999/xhtml"
        style={{ display:'flex', alignItems:'center', justifyContent:'center', width:size, height:size }}>
        <Icon style={{ width: size * 0.65, height: size * 0.65, color }} />
      </div>
    </foreignObject>
  );
}

function OrbitalNode({ id, x, y, isExpanded, onClick }) {
  const line = getLine(id);
  const c = colorMap[line.color];
  const Icon = line.icon;
  const words = line.title.split(' ');
  const mid = Math.ceil(words.length / 2);
  const t1 = words.slice(0, mid).join(' ');
  const t2 = words.slice(mid).join(' ');

  return (
    <g onClick={() => onClick(id)} style={{ cursor: 'pointer' }}>
      {isExpanded && <circle cx={x} cy={y} r={NODE_R + 7} fill="none" stroke={c.hex} strokeWidth="2" opacity="0.45" />}
      <circle cx={x} cy={y} r={NODE_R} fill={c.gradFrom} stroke={c.border} strokeWidth="1.5" />
      <SvgIcon Icon={Icon} x={x} y={y - 20} size={30} color={c.hex} />
      <rect x={x - 24} y={y - 4} width={48} height={15} rx={7.5} fill={c.tagBg} />
      <text x={x} y={y + 8} textAnchor="middle" fill={c.tagText} fontSize="7.5" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">{line.tag}</text>
      <text x={x} y={y + 24} textAnchor="middle" fill="white" fontSize="9.5" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">{t1}</text>
      {t2 && <text x={x} y={y + 36} textAnchor="middle" fill="white" fontSize="9.5" fontWeight="700" fontFamily="ui-sans-serif,system-ui,sans-serif">{t2}</text>}
    </g>
  );
}

function CenterCard({ id, isExpanded, onClick, yOffset }) {
  const line = getLine(id);
  const c = colorMap[line.color];
  const Icon = line.icon;
  const fx = CX - CENTER_W / 2;
  const fy = CY - TOTAL_H / 2 + yOffset;

  return (
    <foreignObject x={fx} y={fy} width={CENTER_W} height={CENTER_H}>
      <div xmlns="http://www.w3.org/1999/xhtml"
        onClick={() => onClick(id)}
        style={{
          background: `linear-gradient(135deg, ${c.gradFrom}dd, #0f172a)`,
          border: `2px solid ${c.border}`,
          borderRadius: 14,
          padding: '9px 11px',
          cursor: 'pointer',
          width: CENTER_W,
          height: CENTER_H,
          boxSizing: 'border-box',
          boxShadow: isExpanded ? `0 0 20px ${c.hex}55` : '0 4px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ background: c.iconBg + '44', borderRadius:8, padding:4, display:'flex' }}>
            <Icon style={{ width:14, height:14, color:c.hex }} />
          </div>
          <span style={{ background:c.tagBg, color:c.tagText, fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:20 }}>{line.tag}</span>
        </div>
        <div style={{ color:'white', fontSize:11, fontWeight:700, lineHeight:1.3 }}>{line.title}</div>
        <div style={{ color:c.accent, fontSize:9, lineHeight:1.2 }}>{line.subtitle}</div>
      </div>
    </foreignObject>
  );
}

function ExpandedModal({ line, onClose }) {
  if (!line) return null;
  const c = colorMap[line.color];
  const Icon = line.icon;
  return (
    <AnimatePresence>
      <>
        <motion.div key="bd" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
        <motion.div key="md" initial={{opacity:0,scale:0.9,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.9,y:20}}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto px-4">
          <div style={{ background:`linear-gradient(135deg,${c.gradFrom}ee,#0f172a)`, border:`2px solid ${c.border}`, borderRadius:24, padding:32 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ background:c.iconBg+'33', borderRadius:16, padding:12, display:'flex' }}>
                  <Icon style={{ width:28, height:28, color:c.hex }} />
                </div>
                <div>
                  <span style={{ background:c.tagBg, color:c.tagText, fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20, display:'inline-block', marginBottom:6 }}>{line.tag}</span>
                  <div style={{ color:'white', fontSize:22, fontWeight:700 }}>{line.title}</div>
                  <div style={{ color:c.accent, fontSize:14, marginTop:2 }}>{line.subtitle}</div>
                </div>
              </div>
              <button onClick={onClose} style={{ color:'#94a3b8', background:'none', border:'none', cursor:'pointer' }}>
                <X style={{ width:22, height:22 }} />
              </button>
            </div>
            <p style={{ color:'#e2e8f0', fontSize:15, lineHeight:1.6, marginBottom:16 }}>{line.description}</p>
            <div style={{ background:'rgba(15,23,42,0.5)', borderRadius:16, padding:20, border:'1px solid #334155' }}>
              <div style={{ color:'#94a3b8', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>Key Benefits</div>
              {line.metrics.map((m, j) => (
                <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <ArrowRight style={{ width:16, height:16, color:c.hex, flexShrink:0, marginTop:2 }} />
                  <span style={{ color:'#cbd5e1', fontSize:14 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

export default function Slide5BusinessModel({ onInteracted, onUnlockMessage }) {
  const [expanded, setExpanded]       = useState(new Set());
  const [expandedLine, setExpandedLine] = useState(null);
  const [timerDone, setTimerDone]     = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  useEffect(() => {
    if (timerDone) { if (onUnlockMessage) onUnlockMessage(null); return; }
    if (onUnlockMessage) onUnlockMessage(`Unlocking in ${secondsLeft}s — or expand all 8 cards to unlock now`);
  }, [secondsLeft, timerDone]);

  useEffect(() => {
    if (timerDone) return;
    const iv = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(iv); setTimerDone(true); onInteracted(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [timerDone]);

  const handleClick = (id) => {
    const line = getLine(id);
    const idx  = businessLines.indexOf(line);
    const next = new Set(expanded);
    if (next.has(idx)) { next.delete(idx); setExpandedLine(null); }
    else               { next.add(idx);    setExpandedLine(line); }
    setExpanded(next);
    if (!timerDone && next.size === businessLines.length) {
      setTimerDone(true); onInteracted(); if (onUnlockMessage) onUnlockMessage(null);
    }
  };

  const dotColors = ['#22d3ee','#a78bfa','#4ade80','#fbbf24','#f87171','#818cf8','#fb923c','#2dd4bf'];

  return (
    <div className="min-h-screen bg-slate-900 py-24 px-6">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest text-cyan-500 uppercase mb-4">Business Model</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Separate revenue lines.<br />Shared momentum.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">Each line earns on its own. Together they compound.</p>
          <p className="text-lg text-white max-w-2xl mx-auto mb-2">
            We're building both the Experience Center and National Training Center with this $300K raise (unlocking the SBA-backed $850K facility).
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We educate + demo, then design & scope complex projects — handing implementation design to our trained partners to implement for a fee.
          </p>
          <p className="text-base text-slate-300 max-w-2xl mx-auto mt-4">8 connected streams complete the flywheel.</p>
        </motion.div>

        {/* Flywheel — pure SVG viewBox, always perfectly centered */}
        <div style={{ width:'100%', maxWidth:640, margin:'0 auto' }}>
          <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" style={{ display:'block', overflow:'visible' }}>
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx={CX} cy={CY} r={ORBIT_R+50} fill="url(#glow)" />
            <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="rgba(148,163,184,0.14)" strokeWidth="1.5" strokeDasharray="6 10" />

            {/* Spokes */}
            {orbitalPositions.map(({ id, x, y }) => {
              const c = colorMap[getLine(id).color];
              return <line key={id} x1={CX} y1={CY} x2={x} y2={y} stroke={c.hex} strokeWidth="1" strokeOpacity="0.15" />;
            })}

            {/* Animated orbit dots */}
            {dotColors.map((col, i) => (
              <circle key={i} r="3.5" fill={col} opacity="0.85">
                <animateMotion dur={`${6.5 + i * 0.25}s`} begin={`${-(i / dotColors.length) * 6.5}s`} repeatCount="indefinite"
                  path={`M ${CX+ORBIT_R} ${CY} A ${ORBIT_R} ${ORBIT_R} 0 1 1 ${CX+ORBIT_R-0.001} ${CY}`} />
              </circle>
            ))}

            {/* Orbital circles */}
            {orbitalPositions.map(({ id, x, y }) => {
              const idx = businessLines.indexOf(getLine(id));
              return <OrbitalNode key={id} id={id} x={x} y={y} isExpanded={expanded.has(idx)} onClick={handleClick} />;
            })}

            {/* Center cards — anchored to exact SVG center */}
            <CenterCard id="experience" isExpanded={expanded.has(businessLines.indexOf(getLine('experience')))} onClick={handleClick} yOffset={0} />
            <CenterCard id="training"   isExpanded={expanded.has(businessLines.indexOf(getLine('training')))}   onClick={handleClick} yOffset={CENTER_H + CENTER_GAP} />
          </svg>
        </div>

        <ExpandedModal line={expandedLine} onClose={() => setExpandedLine(null)} />

        {/* Divider */}
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.25}} className="mt-14 mb-8 flex items-center gap-4">
          <div className="flex-1 border-t border-slate-800" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase whitespace-nowrap">Why This Model Works — Standalone. Expandable. Compounding.</p>
          <div className="flex-1 border-t border-slate-800" />
        </motion.div>

        {/* Stacked bars */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
          className="rounded-2xl border border-slate-800 bg-slate-800/20 px-6 py-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3">
              {STACK_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-28 flex-shrink-0 text-right">{row.label}</span>
                  <div className="flex-1 h-7 rounded-lg overflow-hidden bg-slate-800/60 flex">
                    <motion.div initial={{width:0}} animate={{width:`${row.standalone}%`}} transition={{delay:0.4+i*0.15,duration:0.6,ease:'easeOut'}} className="h-full bg-cyan-500/70" />
                    <motion.div initial={{width:0}} animate={{width:`${row.expansion}%`}}  transition={{delay:0.55+i*0.15,duration:0.5,ease:'easeOut'}} className="h-full bg-violet-500/70" />
                    <motion.div initial={{width:0}} animate={{width:`${row.compounding}%`}} transition={{delay:0.7+i*0.15,duration:0.5,ease:'easeOut'}} className="h-full bg-green-500/70" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                { color:'bg-cyan-500/70',   label:'Standalone Revenue',      desc:'Each line can close and generate revenue on its own.' },
                { color:'bg-violet-500/70', label:'Expansion Revenue',       desc:'One deployment often opens the door to the next service.' },
                { color:'bg-green-500/70',  label:'Lower Risk. More Value.', desc:'Diversified revenue reduces dependency on any one offer and increases long-term client value.' },
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
