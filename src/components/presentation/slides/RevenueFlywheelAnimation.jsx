import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, HardHat, Bot, Camera, TrendingUp } from 'lucide-react';

const STEPS = [
    { icon: GraduationCap, label: 'Training',          sub: 'creates Installers',        color: '#34d399', angle: -90 },
    { icon: HardHat,       label: 'Installers',        sub: 'need Projects',             color: '#60a5fa', angle: -18 },
    { icon: Bot,           label: 'AI Matching',       sub: 'finds Qualified Projects',  color: '#a78bfa', angle: 54  },
    { icon: Camera,        label: 'Experience Center', sub: 'closes Projects',           color: '#22d3ee', angle: 126 },
    { icon: TrendingUp,    label: 'Revenue',           sub: 'flows back to Training',    color: '#fb923c', angle: 198 },
];

const CX = 210, CY = 210, R = 150, NODE_R = 38;

const toXY = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
};

function arcPath(from, to, r) {
    const s = toXY(from.angle, r);
    const e = toXY(to.angle, r);
    const mx = CX + s.x, my = CY + s.y;
    const ex = CX + e.x, ey = CY + e.y;
    const dr = r * 1.1;
    return `M ${mx} ${my} A ${dr} ${dr} 0 0 1 ${ex} ${ey}`;
}

export default function RevenueFlywheelAnimation() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActive(a => (a + 1) % STEPS.length), 1800);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <svg width="420" height="420" viewBox="0 0 420 420" className="overflow-visible">
                {/* Arc connectors */}
                {STEPS.map((step, i) => {
                    const next = STEPS[(i + 1) % STEPS.length];
                    const isActive = active === i;
                    return (
                        <motion.path
                            key={`arc-${i}`}
                            d={arcPath(step, next, R)}
                            fill="none"
                            stroke={isActive ? step.color : '#334155'}
                            strokeWidth={isActive ? 3 : 1.5}
                            strokeDasharray="8 5"
                            animate={{ opacity: isActive ? 1 : 0.3 }}
                            transition={{ duration: 0.4 }}
                        />
                    );
                })}

                {/* Nodes */}
                {STEPS.map((step, i) => {
                    const { x, y } = toXY(step.angle, R);
                    const cx = CX + x, cy = CY + y;
                    const isActive = active === i;
                    const Icon = step.icon;

                    // Label positioning — push outward from center
                    const labelOffsetX = x > 5 ? 52 : x < -5 ? -52 : 0;
                    const labelOffsetY = y > 5 ? 56 : y < -5 ? -52 : 4;
                    const subOffsetY   = y > 5 ? 72 : y < -5 ? -36 : 20;

                    return (
                        <g key={step.label}>
                            <motion.circle
                                cx={cx} cy={cy} r={NODE_R}
                                fill={isActive ? `${step.color}20` : '#1e293b'}
                                stroke={isActive ? step.color : '#475569'}
                                strokeWidth={isActive ? 2.5 : 1.5}
                                animate={{ r: isActive ? NODE_R + 4 : NODE_R }}
                                transition={{ duration: 0.3 }}
                            />
                            <foreignObject x={cx - 16} y={cy - 16} width={32} height={32}>
                                <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <Icon style={{ width: 20, height: 20, color: isActive ? step.color : '#94a3b8' }} />
                                </div>
                            </foreignObject>

                            {/* Label */}
                            <motion.text
                                x={cx + labelOffsetX}
                                y={cy + labelOffsetY}
                                textAnchor={x > 5 ? 'start' : x < -5 ? 'end' : 'middle'}
                                fontSize={13}
                                fontWeight={isActive ? 700 : 500}
                                fill={isActive ? step.color : '#94a3b8'}
                                animate={{ opacity: 1 }}
                            >
                                {step.label}
                            </motion.text>
                            <text
                                x={cx + labelOffsetX}
                                y={cy + subOffsetY}
                                textAnchor={x > 5 ? 'start' : x < -5 ? 'end' : 'middle'}
                                fontSize={10}
                                fill={isActive ? '#cbd5e1' : '#475569'}
                            >
                                {step.sub}
                            </text>
                        </g>
                    );
                })}

                {/* Center label */}
                <text x={CX} y={CY - 10} textAnchor="middle" fontSize={13} fontWeight="600" fill="#64748b">Revenue</text>
                <text x={CX} y={CY + 8}  textAnchor="middle" fontSize={13} fontWeight="600" fill="#64748b">Flywheel</text>
            </svg>
        </div>
    );
}