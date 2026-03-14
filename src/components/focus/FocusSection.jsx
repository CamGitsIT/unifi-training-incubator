/**
 * FocusSection Component
 * 
 * Wrapper component for sections that implements the focus animation system.
 * Handles scroll-triggered reveals and staggered child animations.
 */

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import {
  focusSectionVariants,
  staggerContainerVariants,
  viewportConfig,
} from '@/lib/focusAnimation';

/**
 * FocusSection - Section wrapper with entrance animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Section content
 * @param {boolean} props.stagger - Enable staggered children (default: false)
 * @param {Object} props.variants - Custom animation variants (optional)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.once - Trigger animation once (default: false)
 */
export const FocusSection = ({
  children,
  stagger = false,
  variants,
  className = '',
  once = false,
  ...props
}) => {
  const { ref, isInView } = useInView({
    once,
    margin: viewportConfig.margin,
    threshold: viewportConfig.amount,
  });

  const animationVariants = variants || (stagger ? staggerContainerVariants : focusSectionVariants);
  const initialState = stagger ? 'hidden' : 'initial';
  const animateState = isInView ? (stagger ? 'visible' : 'enter') : initialState;

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={animateState}
      variants={animationVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FocusSection;
