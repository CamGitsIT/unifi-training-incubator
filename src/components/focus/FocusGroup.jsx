/**
 * FocusGroup Component
 * 
 * Container for multiple FocusItems with managed focus progression.
 * Automatically handles focus state distribution and timing.
 */

import { motion } from 'framer-motion';
import { useFocusAnimation } from '@/hooks/useFocusAnimation';
import { FocusItem } from './FocusItem';

/**
 * FocusGroup - Manages focus progression across multiple items
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.renderItem - Function to render each item (item, index, isFocused) => ReactNode
 * @param {number} props.duration - Duration each item stays focused (ms, default: 3000)
 * @param {boolean} props.autoPlay - Auto-progress through items (default: true)
 * @param {boolean} props.loop - Loop back to start (default: true)
 * @param {string} props.variant - FocusItem variant type
 * @param {string} props.className - Container CSS classes
 * @param {string} props.itemClassName - Individual item CSS classes
 */
export const FocusGroup = ({
  items = [],
  renderItem,
  duration = 3000,
  autoPlay = true,
  loop = true,
  variant = 'item',
  className = '',
  itemClassName = '',
  ...props
}) => {
  const {
    focusedIndex,
    getFocusState,
    isFocused,
    goTo,
  } = useFocusAnimation({
    itemCount: items.length,
    duration,
    autoPlay,
    loop,
  });

  return (
    <div className={className} {...props}>
      {items.map((item, index) => {
        const focusState = getFocusState(index);
        const focused = isFocused(index);

        return (
          <FocusItem
            key={index}
            focusState={focusState}
            variant={variant}
            className={itemClassName}
            onClick={() => goTo(index)}
          >
            {renderItem ? renderItem(item, index, focused) : item}
          </FocusItem>
        );
      })}
    </div>
  );
};

export default FocusGroup;
