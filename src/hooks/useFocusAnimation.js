/**
 * useFocusAnimation Hook
 * 
 * Main hook for managing focus states and progressive animations
 * Handles auto-progression through focus states with configurable timing
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/focusAnimation';

/**
 * Hook to manage focus progression through multiple items
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.itemCount - Total number of items to focus
 * @param {number} options.duration - Duration to focus each item (ms, default: 3000)
 * @param {boolean} options.autoPlay - Auto-progress through items (default: true)
 * @param {boolean} options.loop - Loop back to start (default: true)
 * @param {number} options.initialIndex - Starting index (default: 0)
 * @returns {Object} Focus state and controls
 */
export const useFocusAnimation = ({
  itemCount,
  duration = 3000,
  autoPlay = true,
  loop = true,
  initialIndex = 0,
} = {}) => {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef(null);
  const reducedMotion = prefersReducedMotion();

  // Progress to next item
  const next = useCallback(() => {
    setFocusedIndex((current) => {
      const nextIndex = current + 1;
      if (nextIndex >= itemCount) {
        return loop ? 0 : current;
      }
      return nextIndex;
    });
  }, [itemCount, loop]);

  // Progress to previous item
  const previous = useCallback(() => {
    setFocusedIndex((current) => {
      const prevIndex = current - 1;
      if (prevIndex < 0) {
        return loop ? itemCount - 1 : 0;
      }
      return prevIndex;
    });
  }, [itemCount, loop]);

  // Jump to specific index
  const goTo = useCallback((index) => {
    if (index >= 0 && index < itemCount) {
      setFocusedIndex(index);
    }
  }, [itemCount]);

  // Play/pause controls
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((playing) => !playing), []);

  // Auto-progression effect
  useEffect(() => {
    // Don't auto-play if reduced motion is enabled
    if (reducedMotion) {
      setIsPlaying(false);
      return;
    }

    if (!isPlaying || !autoPlay) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      next();
    }, duration);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, autoPlay, duration, next, reducedMotion]);

  // Helper to get focus state for an item
  const getFocusState = useCallback((index) => {
    if (index === focusedIndex) return 'focused';
    return 'inactive';
  }, [focusedIndex]);

  // Helper to check if an item is focused
  const isFocused = useCallback((index) => {
    return index === focusedIndex;
  }, [focusedIndex]);

  return {
    focusedIndex,
    isPlaying,
    next,
    previous,
    goTo,
    play,
    pause,
    toggle,
    getFocusState,
    isFocused,
  };
};

export default useFocusAnimation;
