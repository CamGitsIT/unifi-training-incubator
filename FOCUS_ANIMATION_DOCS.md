# Focus Animation System Documentation

## Overview

The Focus Animation System is a centralized, premium animation framework for sagerapp.com that creates a guided presentation experience. The system progressively emphasizes content areas, creating smooth transitions between focus states while maintaining a cohesive, elegant aesthetic.

## Design Philosophy

- **Narrative Flow**: Content reveals in a story-like sequence
- **Subtle Emphasis**: Active items brighten/sharpen, inactive items dim slightly
- **Continuous Motion**: Smooth auto-progression, not jarring transitions
- **Accessibility-First**: Full reduced-motion support
- **Performance**: Optimized for 60fps animations

## Architecture

### Core Files

```
src/
├── lib/
│   └── focusAnimation.js          # Animation variants, timing, easing
├── hooks/
│   ├── useFocusAnimation.js       # Focus progression hook
│   └── useInView.js               # Viewport detection
└── components/focus/
    ├── FocusSection.jsx           # Section wrapper
    ├── FocusItem.jsx              # Item wrapper
    ├── FocusGroup.jsx             # Auto-progressing group
    └── index.js                   # Exports
```

## Global Configuration

### Animation Timing

Located in `src/lib/focusAnimation.js`:

```javascript
export const ANIMATION_TIMING = {
  quick: 0.3,      // Hover interactions
  standard: 0.5,   // State transitions
  smooth: 0.7,     // Emphasis changes (main timing)
  entrance: 0.9,   // Section entrances
  narrative: 1.2,  // Story-paced reveals
};
```

**To adjust site-wide animation speed**: Modify these values. All components reference this central config.

### Stagger Timing

Controls delay between sequential reveals:

```javascript
export const STAGGER = {
  tight: 0.1,      // Dense content
  standard: 0.15,  // Standard spacing (default)
  spread: 0.25,    // Spread out reveals
  narrative: 0.4,  // Story-like pacing
};
```

### Easing Curves

```javascript
export const EASING = {
  smooth: [0.4, 0.0, 0.2, 1],     // Standard (most common)
  entrance: [0.0, 0.0, 0.2, 1],   // Section entrances
  exit: [0.4, 0.0, 1, 1],         // Exit animations
  spring: { type: "spring", stiffness: 100, damping: 15 },
  gentle: { type: "spring", stiffness: 80, damping: 20 },
};
```

## Components

### FocusSection

Wrapper for sections with scroll-triggered reveals.

**Usage:**

```jsx
import { FocusSection } from '@/components/focus';

<FocusSection stagger once>
  {/* Children reveal with staggered timing */}
</FocusSection>
```

**Props:**
- `stagger` (boolean): Enable staggered children animation
- `once` (boolean): Trigger animation only once
- `variants` (object): Custom animation variants
- `className` (string): Additional CSS classes

### FocusItem

Individual item with focus states.

**Focus States:**
- `inactive`: Dimmed, slightly blurred (opacity: 0.5)
- `active`: Normal state (opacity: 1)
- `focused`: Emphasized (opacity: 1, scale: 1.02, brightness: 1.1)

**Variants:**
- `item`: Standard item (default)
- `card`: Card with elevation changes
- `text`: Text-only with color emphasis
- `stagger`: For use within staggered containers

**Usage:**

```jsx
import { FocusItem } from '@/components/focus';

<FocusItem 
  focusState={isFocused ? 'focused' : 'inactive'}
  variant="card"
>
  {/* Content */}
</FocusItem>
```

### FocusGroup

Auto-progressing group with managed focus.

**Usage:**

```jsx
import { FocusGroup } from '@/components/focus';

<FocusGroup
  items={myItems}
  duration={4000}
  autoPlay={true}
  loop={true}
  variant="card"
  renderItem={(item, index, isFocused) => (
    <div>{item.content}</div>
  )}
/>
```

**Props:**
- `items` (array): Items to display
- `renderItem` (function): Render function for each item
- `duration` (number): Milliseconds each item stays focused (default: 3000)
- `autoPlay` (boolean): Enable auto-progression (default: true)
- `loop` (boolean): Loop back to start (default: true)
- `variant` (string): FocusItem variant type

## Hooks

### useFocusAnimation

Main hook for managing focus progression.

**Usage:**

```jsx
import { useFocusAnimation } from '@/hooks/useFocusAnimation';

function MyComponent() {
  const {
    focusedIndex,    // Current focused index
    isPlaying,       // Is auto-play active
    next,            // Go to next item
    previous,        // Go to previous item
    goTo,            // Jump to specific index
    play,            // Start auto-play
    pause,           // Pause auto-play
    toggle,          // Toggle play/pause
    getFocusState,   // Get state for item (returns 'focused' | 'inactive')
    isFocused,       // Check if item is focused
  } = useFocusAnimation({
    itemCount: 5,
    duration: 3000,
    autoPlay: true,
    loop: true,
  });

  return (
    <div>
      {items.map((item, idx) => (
        <div 
          key={idx}
          className={isFocused(idx) ? 'active' : 'inactive'}
          onClick={() => goTo(idx)}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

### useInView

Viewport detection with reduced-motion support.

**Usage:**

```jsx
import { useInView } from '@/hooks/useInView';

function MyComponent() {
  const { ref, isInView, hasBeenInView } = useInView({
    once: false,
    margin: '-10%',
    threshold: 0.3,
  });

  return (
    <div ref={ref}>
      {isInView && <p>I'm visible!</p>}
    </div>
  );
}
```

## Real-World Examples

### Example 1: CoreEngineCards

Progressive focus through 3 cards, 4 seconds each.

```jsx
import { useFocusAnimation } from '@/hooks/useFocusAnimation';
import { FocusSection, FocusItem } from '@/components/focus';

export default function CoreEngineCards() {
  const { getFocusState, isFocused } = useFocusAnimation({
    itemCount: 3,
    duration: 4000,
    autoPlay: true,
    loop: true,
  });

  return (
    <FocusSection once>
      {cards.map((card, idx) => {
        const focusState = getFocusState(idx);
        const focused = isFocused(idx);
        
        return (
          <FocusItem
            key={idx}
            focusState={focusState}
            variant="card"
          >
            {/* Card content */}
          </FocusItem>
        );
      })}
    </FocusSection>
  );
}
```

### Example 2: Flywheel with Manual Override

Auto-progression with user interaction.

```jsx
import { useFocusAnimation } from '@/hooks/useFocusAnimation';

export default function Flywheel() {
  const [manualStep, setManualStep] = useState(null);
  
  const { focusedIndex, goTo, isFocused } = useFocusAnimation({
    itemCount: 5,
    duration: 3500,
    autoPlay: true,
    loop: true,
  });

  const activeStep = manualStep !== null ? manualStep : focusedIndex;

  const handleClick = (idx) => {
    setManualStep(idx);
    goTo(idx);
    setTimeout(() => setManualStep(null), 7000); // Resume auto after 7s
  };

  // Render with activeStep
}
```

### Example 3: Staggered Text Reveal

Progressive text entrance.

```jsx
import { FocusSection } from '@/components/focus';
import { staggerItemVariants } from '@/lib/focusAnimation';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <FocusSection stagger>
      <motion.div variants={staggerItemVariants}>
        <span>Badge</span>
      </motion.div>
      
      <motion.h1 variants={staggerItemVariants}>
        Main Headline
      </motion.h1>
      
      <motion.p variants={staggerItemVariants}>
        Subheading text
      </motion.p>
    </FocusSection>
  );
}
```

## Tuning Guide

### Adjust Global Speed

**Make animations faster across the site:**

In `src/lib/focusAnimation.js`:

```javascript
export const ANIMATION_TIMING = {
  quick: 0.2,      // was 0.3
  standard: 0.3,   // was 0.5
  smooth: 0.5,     // was 0.7
  entrance: 0.6,   // was 0.9
  narrative: 0.8,  // was 1.2
};
```

**Make animations slower:**

Increase the values proportionally (e.g., multiply by 1.5).

### Adjust Focus Duration

**CoreEngineCards - longer focus per card:**

In `src/components/everything/CoreEngineCards.jsx`:

```javascript
const { getFocusState } = useFocusAnimation({
  itemCount: engines.length,
  duration: 6000,  // was 4000 (now 6 seconds per card)
  autoPlay: true,
  loop: true,
});
```

**Flywheel - faster cycling:**

In `src/components/everything/Flywheel.jsx`:

```javascript
const { focusedIndex } = useFocusAnimation({
  itemCount: flywheelSteps.length,
  duration: 2500,  // was 3500 (now 2.5 seconds per step)
  autoPlay: true,
  loop: true,
});
```

### Adjust Emphasis Intensity

**Make focused items more prominent:**

In `src/lib/focusAnimation.js`:

```javascript
export const focusItemVariants = {
  focused: {
    opacity: 1,
    scale: 1.05,              // was 1.02 (more scale)
    filter: "blur(0px) brightness(1.2)",  // was 1.1 (brighter)
    transition: {
      duration: ANIMATION_TIMING.smooth,
      ease: EASING.smooth,
    },
  },
};
```

**Make inactive items less prominent:**

```javascript
export const focusItemVariants = {
  inactive: {
    opacity: 0.3,    // was 0.5 (dimmer)
    scale: 0.95,     // was 0.98 (smaller)
    filter: "blur(1px)",  // was 0.5px (more blur)
  },
};
```

### Adjust Stagger Delays

**Faster reveals:**

In `src/lib/focusAnimation.js`:

```javascript
export const STAGGER = {
  tight: 0.05,     // was 0.1
  standard: 0.1,   // was 0.15
  spread: 0.15,    // was 0.25
  narrative: 0.25, // was 0.4
};
```

### Disable Auto-Play

For any component using `useFocusAnimation`, set:

```javascript
const { ... } = useFocusAnimation({
  autoPlay: false,  // Disable auto-progression
});
```

## Accessibility

### Reduced Motion Support

The system automatically detects `prefers-reduced-motion: reduce` and:

1. **Disables auto-play** in `useFocusAnimation`
2. **Skips animations** in `useInView` (content appears immediately)
3. **Reduces transition duration** to 0.01s via `getTransition()`

**Test reduced motion:**

In browser DevTools:
1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "Emulate CSS prefers-reduced-motion"
3. Select "prefers-reduced-motion: reduce"

### Keyboard Navigation

Components using `FocusItem` support click handlers. Consider adding:

```jsx
<FocusItem
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(idx);
    }
  }}
>
```

## Performance Tips

1. **Use `once` prop** on FocusSection for sections that don't need re-animation
2. **Limit concurrent animations** - avoid 10+ items auto-cycling simultaneously
3. **Prefer CSS transitions** for simple hover states
4. **Use `will-change` sparingly** - Framer Motion handles this automatically

## Migration from Old Patterns

**Old pattern (manual delays):**

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
>
```

**New pattern (staggered):**

```jsx
<FocusSection stagger>
  <motion.div variants={staggerItemVariants}>
    {/* Auto-staggered, no manual delays */}
  </motion.div>
</FocusSection>
```

**Old pattern (static states):**

```jsx
<div className={isActive ? 'active' : 'inactive'}>
```

**New pattern (animated states):**

```jsx
<FocusItem focusState={isActive ? 'focused' : 'inactive'}>
```

## Troubleshooting

### Animations not triggering

- Check that component is wrapped in `FocusSection` or using `useInView`
- Verify `viewport={{ once: true }}` isn't preventing re-triggers
- Ensure element has enough height to intersect viewport

### Auto-play not working

- Check `autoPlay={true}` is set
- Verify reduced-motion isn't enabled in browser
- Check console for errors in `useFocusAnimation`

### Jerky animations

- Reduce number of concurrent animations
- Check for heavy computations during render
- Verify CSS transforms are GPU-accelerated (use `transform` not `left/top`)

## Future Enhancements

Potential additions to the system:

1. **Direction control**: Left-to-right vs top-to-bottom emphasis flow
2. **Custom focus indicators**: Optional rings, glows, or overlays
3. **Sound integration**: Optional audio cues for focus changes (accessibility)
4. **Analytics**: Track which items get most manual interactions
5. **A/B testing helpers**: Easy timing/duration experimentation

## Support

For questions or issues with the focus animation system:

1. Check this documentation first
2. Review component examples in `/src/components/everything/`
3. Test with browser DevTools animation timeline
4. Verify Framer Motion version: `npm list framer-motion`

---

**Version**: 1.0.0  
**Last Updated**: March 14, 2026  
**Dependencies**: React 18.2+, Framer Motion 11.16+
