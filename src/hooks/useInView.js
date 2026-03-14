/**
 * useInView Hook
 * 
 * Enhanced viewport detection with reduced-motion support
 * Tracks when elements enter/exit the viewport for scroll-triggered animations
 */

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/focusAnimation';

/**
 * Hook to detect when an element is in the viewport
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {boolean} options.once - Only trigger once (default: false)
 * @param {string} options.margin - Root margin (default: '0px')
 * @param {number} options.threshold - Intersection threshold (default: 0.3)
 * @returns {Object} { ref, isInView, hasBeenInView }
 */
export const useInView = ({
  once = false,
  margin = '0px',
  threshold = 0.3,
} = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If reduced motion is enabled, immediately set as in view
    if (reducedMotion) {
      setIsInView(true);
      setHasBeenInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }

        // If once is true and element has been in view, stop observing
        if (once && hasBeenInView) {
          observer.unobserve(element);
        }
      },
      {
        rootMargin: margin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [once, margin, threshold, hasBeenInView, reducedMotion]);

  return { ref, isInView, hasBeenInView };
};

export default useInView;
