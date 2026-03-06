import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, HardHat, Bot, Camera, TrendingUp } from 'lucide-react';

const STEPS = [
    { icon: GraduationCap, label: 'Training',         sub: 'creates Installers',           color: '#34d399', angle: -90 },
    { icon: HardHat,       label: 'Installers',       sub: 'need Projects',                color: '#60a5fa', angle: -18 },
    { icon: Bot,           label: 'AI',               sub: 'finds Qualified Projects',     color: '#a78bfa', angle: 54  },
    { icon: Camera,        label: 'Experience Center',sub: 'closes Projects',              color: '#22d3ee', angle: 126 },
    { icon: TrendingUp,    label: 'Revenue',          sub: 'flows back to Training',       color: '#fb923c', angle: 198 },
];

const toXY = (angleDeg, r) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
};

const CX = 160, CY = 160, R = 110, NODE_R = 28;

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
        const t = setInterval(() => setActive(a => (a + 1) % STEPS.length), 1600);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <svg width="320" height="320" viewBox="0 0 320 320" className="overflow-visible">
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
                            strokeWidth={isActive ? 2.5 : 1.5}
                            strokeDasharray="6 4"
                            animate={{ opacity: isActive ? 1 : 0.35 }}
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
                    return (
                        <g key={step.label}>
                            <motion.circle
                                cx={cx} cy={cy} r={NODE_R}
                                fill={isActive ? `${step.color}22` : '#1e293b'}
                                stroke={isActive ? step.color : '#475569'}
                                strokeWidth={isActive ? 2 : 1}
                                animate={{ r: isActive ? NODE_R + 3 : NODE_R }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* Render icon via foreignObject */}
                            <foreignObject x={cx - 12} y={cy - 12} width={24} height={24}>
                                <div xmlns="http://www.w3.org/1999/xhtml" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <Icon style={{ width: 14, height: 14, color: isActive ? step.color : '#94a3b8' }} />
                                </div>
                            </foreignObject>

                            {/* Label outside */}
                            <motion.text
                                x={cx + (x > 0 ? 38 : x < -5 ? -38 : 0)}
                                y={cy + (y > 5 ? 44 : y < -5 ? -38 : 4)}
                                textAnchor={x > 5 ? 'start' : x < -5 ? 'end' : 'middle'}
                                fontSize={10}
                                fontWeight={isActive ? 700 : 400}
                                fill={isActive ? step.color : '#94a3b8'}
                                animate={{ opacity: 1 }}
                            >
                                {step.label}
                            </motion.text>
                            <text
                                x={cx + (x > 0 ? 38 : x < -5 ? -38 : 0)}
                                y={cy + (y > 5 ? 57 : y < -5 ? -27 : 16)}
                                textAnchor={x > 5 ? 'start' : x < -5 ? 'end' : 'middle'}
                                fontSize={8}
                                fill={isActive ? '#cbd5e1' : '#475569'}
                            >
                                {step.sub}
                            </text>
                        </g>
                    );
                })}

                {/* Center label */}
                <text x={CX} y={CY - 6} textAnchor="middle" fontSize={9} fill="#64748b">Revenue</text>
                <text x={CX} y={CY + 8} textAnchor="middle" fontSize={9} fill="#64748b">Flywheel</text>
            </svg>
        </div>
    );
}