import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SlideNav({ current, total, onNext, onPrev, canAdvance, slideLabel, hideNext, countdown }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Slide dots */}
                <div className="flex items-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${
                                i === current
                                    ? 'w-6 h-2 bg-cyan-400'
                                    : i < current
                                    ? 'w-2 h-2 bg-slate-500'
                                    : 'w-2 h-2 bg-slate-700'
                            }`}
                        />
                    ))}
                </div>

                {/* Right side: Back + Next grouped together */}
                <div className="flex items-center gap-4">
                    {/* Back */}
                    <button
                        onClick={onPrev}
                        disabled={current === 0}
                        className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back
                    </button>

                    {/* Next */}
                    <AnimatePresence mode="wait">
                        {!hideNext && current < total - 1 ? (
                            canAdvance ? (
                                <motion.button
                                    key="next-active"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={onNext}
                                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-full transition-all text-sm shadow-lg shadow-cyan-500/30"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="next-locked"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-0.5 text-sm font-medium select-none"
                                >
                                    {countdown > 0 && (
                                        <span className="text-cyan-400 font-bold tabular-nums text-xs">{countdown}s</span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <span className="text-slate-600">Interact to continue</span>
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </div>
                                </motion.div>
                            )
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}