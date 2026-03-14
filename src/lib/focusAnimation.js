/**
 * Focus Animation System
 * 
 * Centralized animation variants and configuration for the site-wide focus system.
 * Provides smooth, elegant transitions with active/inactive states for content groups.
 */

// Animation timing presets - can be tuned globally
export const ANIMATION_TIMING = {
  quick: 0.3,      // Quick interactions (hover)
  standard: 0.5,   // Standard state transitions
  smooth: 0.7,     // Smooth emphasis changes
  entrance: 0.9,   // Section entrance animations
  narrative: 1.2,  // Narrative-paced reveals
};

// Easing presets for premium feel
export const EASING = {
  smooth: [0.4, 0.0, 0.2, 1],        // Standard smooth
  entrance: [0.0, 0.0, 0.2, 1],      // Entrance easing
  exit: [0.4, 0.0, 1, 1],            // Exit easing
  spring: { type: "spring", stiffness: 100, damping: 15 },
  gentle: { type: "spring", stiffness: 80, damping: 20 },
};

// Stagger timing for progressive reveals
export const STAGGER = {
  tight: 0.1,     // Dense content
  standard: 0.15, // Standard spacing
  spread: 0.25,   // Spread out reveals
  narrative: 0.4, // Story-like pacing
};

/**
 * Focus Section Variants
 * Controls the overall section activation state
 */
export const focusSectionVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMING.entrance,
      ease: EASING.smooth,
      staggerChildren: STAGGER.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -24,
    transition: {
      duration: ANIMATION_TIMING.standard,
      ease: EASING.exit,
    },
  },
};

/**
 * Focus Item Variants
 * Controls individual items within a section
 */
export const focusItemVariants = {
  inactive: {
    opacity: 0.5,
    scale: 0.98,
    filter: "blur(0.5px)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  active: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  focused: {
    opacity: 1,
    scale: 1.02,
    filter: "blur(0px) brightness(1.1)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
};

/**
 * Focus Card Variants
 * For card-based content with elevation changes
 */
export const focusCardVariants = {
  inactive: {
    opacity: 0.6,
    scale: 0.96,
    y: 8,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  active: {
    opacity: 1,
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  focused: {
    opacity: 1,
    scale: 1.03,
    y: -4,
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
};

/**
 * Staggered Container Variants
 * For progressive reveals of child elements
 */
export const staggerContainerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.standard,
      delayChildren: 0.1,
    },
  },
};

/**
 * Staggered Item Variants
 * Individual items within a staggered container
 */
export const staggerItemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.entrance,
    },
  },
};

/**
 * Text Focus Variants
 * For text elements with subtle emphasis changes
 */
export const textFocusVariants = {
  inactive: {
    opacity: 0.5,
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  active: {
    opacity: 1,
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
  focused: {
    opacity: 1,
    color: "rgb(6, 182, 212)", // cyan-500
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
};

/**
 * Scroll Reveal Variants
 * For elements that animate when scrolling into view
 */
export const scrollRevealVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_TIMING.entrance,
      ease: EASING.entrance,
    },
  },
};

/**
 * Configuration object for viewport intersection
 */
export const viewportConfig = {
  once: false,        // Allow re-triggering on re-enter
  margin: "-10% 0px", // Trigger slightly before element is fully visible
  amount: 0.3,        // 30% of element must be visible
};

/**
 * Helper function to check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get transition config with reduced motion support
 */
export const getTransition = (duration, easing = EASING.smooth) => {
  if (prefersReducedMotion()) {
    return { duration: 0.01 }; // Nearly instant for accessibility
  }
  return {
    duration,
    ease: easing,
  };
};

/**
 * Progressive focus timing helper
 * Calculates delay for sequential item reveals
 */
export const getFocusDelay = (index, baseDelay = STAGGER.standard) => {
  if (prefersReducedMotion()) return 0;
  return index * baseDelay;
};
