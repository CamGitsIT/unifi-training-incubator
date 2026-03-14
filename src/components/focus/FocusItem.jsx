/**
 * FocusItem Component
 * 
 * Individual item wrapper that responds to focus state.
 * Can be used for cards, text blocks, images, or any content that should
 * transition between inactive/active/focused states.
 */

import { motion } from 'framer-motion';
import {
  focusItemVariants,
  focusCardVariants,
  textFocusVariants,
  staggerItemVariants,
} from '@/lib/focusAnimation';

/**
 * FocusItem - Wrapper for individual focusable items
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Item content
 * @param {string} props.focusState - Current focus state: 'inactive' | 'active' | 'focused'
 * @param {string} props.variant - Animation variant type: 'item' | 'card' | 'text' | 'stagger'
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onHoverStart - Hover start handler
 * @param {Function} props.onHoverEnd - Hover end handler
 */
export const FocusItem = ({
  children,
  focusState = 'active',
  variant = 'item',
  className = '',
  onClick,
  onHoverStart,
  onHoverEnd,
  ...props
}) => {
  // Select appropriate variants based on type
  const getVariants = () => {
    switch (variant) {
      case 'card':
        return focusCardVariants;
      case 'text':
        return textFocusVariants;
      case 'stagger':
        return staggerItemVariants;
      default:
        return focusItemVariants;
    }
  };

  const variants = getVariants();

  // For stagger variant, use different animation states
  const animateState = variant === 'stagger' ? focusState : focusState;

  return (
    <motion.div
      variants={variants}
      animate={animateState}
      className={className}
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FocusItem;
