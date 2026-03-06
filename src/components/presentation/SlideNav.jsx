import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SlideNav({ current, total, onNext, onPrev, canAdvance, slideLabel, hideNext, unlockMessage }) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-t border-slate-800">
            {unlockMessage && (
                <div className="text-center py-1.5 text-sm text-slate-400 border-b border-slate-800/50">
                    <span className="inline-flex items-center gap-2">
                        <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                        {unlockMessage}
                    </span>
                </div>
            )}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-end">

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
                                    className="flex items-center gap-1 text-sm font-medium select-none"
                                >
                                    <span className="text-slate-600">Review this section to continue</span>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </motion.div>
                            )
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}