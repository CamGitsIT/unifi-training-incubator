/**
 * motionConfig.js — Site-wide motion system for sagerapp.com
 *
 * Centralises all animation configuration so every page and slide shares
 * the same timing language.  Import what you need:
 *
 *   import { fadeUp, staggerContainer, staggerChild } from '@/lib/motionConfig';
 *   import { useFocusProgression, useMotionConfig }  from '@/lib/motionConfig';
 *
 * Tune globally here — duration tokens, easing, focus timing — and the
 * change propagates everywhere at once.
 */

import { useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';

// ── Duration tokens (seconds) ─────────────────────────────────────────────────
export const DURATION = {
    fast:   0.2,
    normal: 0.4,
    slow:   0.6,
};

// ── Easing curves ─────────────────────────────────────────────────────────────
export const EASE = {
    /** Expo-out: snappy enter, gentle tail */
    out:   [0.16, 1, 0.3, 1],
    /** Standard ease-in-out for reversible transitions */
    inOut: [0.42, 0, 0.58, 1],
};

// ── Core animation variants ───────────────────────────────────────────────────

/** Fade up from below — use for section headers and body copy. */
export const fadeUp = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.out } },
};

/** Simple opacity fade — use when spatial motion isn't appropriate. */
export const fadeIn = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.normal, ease: EASE.out } },
};

/**
 * Stagger container — wraps a list whose children animate in sequence.
 *
 * @param {number} stagger       Delay between each child (seconds). Default 0.1.
 * @param {number} delayChildren Initial delay before the first child (seconds). Default 0.15.
 */
export const staggerContainer = (stagger = 0.1, delayChildren = 0.15) => ({
    hidden:  {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Stagger child — pair with staggerContainer on the parent. */
export const staggerChild = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE.out } },
};

// ── Focus state variants ──────────────────────────────────────────────────────
/**
 * Three named states for focus progression.
 *
 *  active   — this element has current narrative focus
 *  inactive — another element has focus; this one softens
 *  idle     — no element is focused yet (default on entry)
 */
export const focusVariants = {
    active: {
        opacity:    1,
        scale:      1,
        filter:     'brightness(1) saturate(1)',
        transition: { duration: 0.4, ease: EASE.inOut },
    },
    inactive: {
        opacity:    0.52,
        scale:      0.984,
        filter:     'brightness(0.7) saturate(0.85)',
        transition: { duration: 0.4, ease: EASE.inOut },
    },
    idle: {
        opacity:    1,
        scale:      1,
        filter:     'brightness(1) saturate(1)',
        transition: { duration: 0.35, ease: EASE.inOut },
    },
};

// ── Page-level slide transitions (direction-aware) ────────────────────────────
/**
 * Framer Motion variants for full-page slide transitions.
 * Use these with `custom={direction}` on both `AnimatePresence` and `motion.div`,
 * where direction = 1 (forward / next) or -1 (backward / prev).
 *
 * The exit variant receives the **current** custom value from AnimatePresence,
 * so the old slide exits in the correct direction even when the user reverses.
 */
export const pageVariants = {
    initial: (dir) => ({ opacity: 0, x: 56 * dir }),
    animate: {
        opacity: 1,
        x:       0,
        transition: { duration: 0.48, ease: EASE.out },
    },
    exit: (dir) => ({
        opacity: 0,
        x:       -40 * dir,
        transition: { duration: 0.30, ease: EASE.inOut },
    }),
};

// ── Focus progression hook ────────────────────────────────────────────────────
/**
 * Cycles focus through `count` items at `intervalMs` milliseconds each.
 *
 * Hover-pause: call pause(index) on hover enter, resume() on hover leave.
 * Starts after an initial delay so entry animations finish first.
 *
 * @param {number} count      Number of items in the group.
 * @param {number} intervalMs Milliseconds per item. Default 2400.
 *
 * @returns {{ focusIndex: number|null, pause(idx?): void, resume(): void, getFocusState(idx): string }}
 */
export function useFocusProgression(count, intervalMs = 2400) {
    const reduced = useReducedMotion();

    const [focusIndex, setFocusIndex] = useState(null);
    const [paused,     setPaused]     = useState(false);
    const [started,    setStarted]    = useState(false);

    // Delay start so entry stagger animation completes first.
    useEffect(() => {
        if (reduced || count <= 1) return;
        const t = setTimeout(() => setStarted(true), 1100);
        return () => clearTimeout(t);
    }, [count, reduced]);

    // Auto-cycle.
    useEffect(() => {
        if (!started || paused || reduced || count <= 1) return;
        setFocusIndex(prev => (prev === null ? 0 : prev));
        const id = setInterval(() => {
            setFocusIndex(prev => (prev === null ? 0 : (prev + 1) % count));
        }, intervalMs);
        return () => clearInterval(id);
    }, [started, paused, count, intervalMs, reduced]);

    /** Pause auto-cycle, optionally locking focus to a specific index. */
    const pause = useCallback((idx) => {
        setPaused(true);
        if (idx !== undefined) setFocusIndex(idx);
    }, []);

    /** Resume auto-cycle. */
    const resume = useCallback(() => setPaused(false), []);

    /**
     * Returns 'active' | 'inactive' | 'idle' for a given item index.
     * Use this to drive a motion.div's animate prop via focusVariants.
     */
    const getFocusState = useCallback(
        (idx) => {
            if (!started || focusIndex === null) return 'idle';
            return focusIndex === idx ? 'active' : 'inactive';
        },
        [started, focusIndex],
    );

    return { focusIndex, pause, resume, getFocusState };
}

// ── Reduced-motion aware config hook ─────────────────────────────────────────
/**
 * Returns the motion config appropriate for the user's OS preference.
 * When prefers-reduced-motion is set, spatial transforms are stripped and
 * only opacity changes remain.
 *
 * Usage:
 *   const { fadeUp, staggerChild, focusVariants } = useMotionConfig();
 */
export function useMotionConfig() {
    const reduced = useReducedMotion();

    if (reduced) {
        const t = { duration: 0.15 };
        return {
            fadeUp:           { hidden: { opacity: 0 }, visible: { opacity: 1, transition: t } },
            fadeIn:           { hidden: { opacity: 0 }, visible: { opacity: 1, transition: t } },
            staggerChild:     { hidden: { opacity: 0 }, visible: { opacity: 1, transition: t } },
            staggerContainer: (s = 0.05) => ({ hidden: {}, visible: { transition: { staggerChildren: s } } }),
            focusVariants: {
                active:   { opacity: 1,    transition: t },
                inactive: { opacity: 0.52, transition: t },
                idle:     { opacity: 1,    transition: t },
            },
        };
    }

    return { fadeUp, fadeIn, staggerChild, staggerContainer, focusVariants };
}
