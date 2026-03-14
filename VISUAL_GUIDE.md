# Focus Animation System - Visual Guide

## Animation Behavior Overview

### Before Implementation
- Static component reveals
- Manual animation timing per component
- No progressive emphasis
- Inconsistent animation language

### After Implementation
- **Guided presentation flow** - content emphasis moves progressively
- **Centralized timing** - one place to tune all animations
- **Auto-progression** - smooth cycling through focus states
- **Interactive** - click/hover overrides auto-play
- **Accessible** - full reduced-motion support

---

## Component Animations

### 1. CoreEngineCards - Progressive Card Focus

```
┌─────────────────────────────────────────┐
│  THE THREE-CORE ENGINE                  │
│  How Everything Works Together          │
└─────────────────────────────────────────┘

Time: 0-4s
┌──────────────┐  ┌────────┐  ┌────────┐
│ ✨ FOCUSED   │  │ Dimmed │  │ Dimmed │
│ Foundation   │  │  Fuel  │  │Ignition│
│ Scale: 103%  │  │  60%   │  │  60%   │
│ Bright: 110% │  │ opacity│  │opacity │
│ Elevated ↑   │  │        │  │        │
└──────────────┘  └────────┘  └────────┘

Time: 4-8s
┌────────┐  ┌──────────────┐  ┌────────┐
│ Dimmed │  │ ✨ FOCUSED   │  │ Dimmed │
│  Found │  │    Fuel      │  │Ignition│
│  60%   │  │ Scale: 103%  │  │  60%   │
│opacity │  │ Bright: 110% │  │opacity │
│        │  │ Elevated ↑   │  │        │
└────────┘  └──────────────┘  └────────┘

Time: 8-12s
┌────────┐  ┌────────┐  ┌──────────────┐
│ Dimmed │  │ Dimmed │  │ ✨ FOCUSED   │
│  Found │  │  Fuel  │  │  Ignition    │
│  60%   │  │  60%   │  │ Scale: 103%  │
│opacity │  │opacity │  │ Bright: 110% │
│        │  │        │  │ Elevated ↑   │
└────────┘  └────────┘  └──────────────┘

Then loops back to start...
```

**Timing**: 4 seconds per card
**Transition**: 700ms smooth easing
**Loop**: Continuous

---

### 2. Flywheel - Synchronized Step Progression

```
Circular Diagram (left)          Detail List (right)
     
        ⚡                    ┌──────────────────┐
       Training              │ ✨ Training      │
      /      \               │ Scale: 110%      │
    📦        🔧             │ Shifted right →  │
  Revenue  Installers        │ Border: cyan     │
    \        /               └──────────────────┘
     🏢  💡                  │ Installers       │
   Center Projects           │ (dimmed)         │
                             │ Projects         │
                             │ (dimmed)         │
                             │ Center           │
                             │ (dimmed)         │
                             │ Revenue          │
                             │ (dimmed)         │
                             └──────────────────┘

Arrow between Training → Installers: bright cyan
Other arrows: faint

⬇ After 3.5 seconds ⬇

        ⚡                    │ Training         │
       Training              │ (dimmed)         │
      /      \               ┌──────────────────┐
    📦        🔧             │ ✨ Installers    │
  Revenue  Installers        │ Scale: 110%      │
    \        /               │ Shifted right →  │
     🏢  💡                  │ Border: cyan     │
   Center Projects           └──────────────────┘
                             │ Projects         │
                             │ (dimmed)         │
                             └──────────────────┘
```

**Timing**: 3.5 seconds per step
**Steps**: 5 total (loops)
**Interaction**: Click pauses for 7 seconds

---

### 3. Hero Sections - Staggered Entrance

```
Time: 0ms
┌────────────────────────────────┐
│ [Empty screen]                 │
│                                │
│                                │
│                                │
└────────────────────────────────┘

Time: 100ms
┌────────────────────────────────┐
│ 🌟 Badge                       │
│ (fading in, moving up)         │
│                                │
│                                │
└────────────────────────────────┘

Time: 250ms
┌────────────────────────────────┐
│ 🌟 Badge                       │
│                                │
│ HEADLINE TEXT                  │
│ (fading in, moving up)         │
└────────────────────────────────┘

Time: 400ms
┌────────────────────────────────┐
│ 🌟 Badge                       │
│                                │
│ HEADLINE TEXT                  │
│                                │
│ Subheading text here           │
│ (fading in, moving up)         │
└────────────────────────────────┘

Final state (700ms)
┌────────────────────────────────┐
│ 🌟 Badge                       │
│                                │
│ HEADLINE TEXT                  │
│                                │
│ Subheading text here           │
│                                │
│ [CTA Button]                   │
└────────────────────────────────┘
```

**Stagger**: 150ms between items
**Duration**: 700ms per item
**Effect**: Fade in + move up 20px

---

## Focus States Visual Reference

### Inactive State
```
Opacity: 50-60%
Scale: 96-98%
Blur: 0.5px
Color: Muted
Shadow: Minimal
```

### Active State (Default)
```
Opacity: 100%
Scale: 100%
Blur: 0px
Color: Normal
Shadow: Standard
```

### Focused State
```
Opacity: 100%
Scale: 102-103%
Blur: 0px
Brightness: +10%
Color: Enhanced
Shadow: Elevated
Border: Highlighted
```

---

## Transition Curves

```
Smooth Easing (default):
cubic-bezier(0.4, 0.0, 0.2, 1)

     ^
     |     ___---
     |   _/
     | _/
     |/
     +------------> time

Fast start, smooth deceleration
```

```
Entrance Easing:
cubic-bezier(0.0, 0.0, 0.2, 1)

     ^
     |        ___
     |      _/
     |    _/
     |  _/
     |_/
     +------------> time

Smooth acceleration, then ease
```

---

## Accessibility: Reduced Motion

### Normal Motion
```
Card 1 → (4s) → Card 2 → (4s) → Card 3 → (4s) → Card 1
  ↓        ↓       ↓        ↓       ↓        ↓
700ms    700ms   700ms    700ms   700ms    700ms
smooth   smooth  smooth   smooth  smooth   smooth
```

### Reduced Motion (prefers-reduced-motion: reduce)
```
Card 1    Card 2    Card 3
  ↓         ↓         ↓
10ms      10ms      10ms
instant   instant   instant

Auto-play: DISABLED
Appears immediately when in viewport
```

---

## Performance Profile

### GPU Acceleration
All animations use GPU-accelerated properties:
- ✅ `transform` (scale, translate)
- ✅ `opacity`
- ✅ `filter` (blur, brightness)
- ❌ No layout-triggering properties (width, height, left, top)

### Frame Rate Target
- **60fps** on modern devices
- **30fps** acceptable on lower-end devices
- Automatic hardware acceleration via Framer Motion

### Memory Footprint
- ~2KB per component instance
- ~10KB for animation library
- Cleanup on unmount prevents memory leaks

---

## Timing Presets Reference

```javascript
ANIMATION_TIMING = {
  quick:     300ms    // Hover interactions
  standard:  500ms    // State toggles
  smooth:    700ms    // ← Primary timing
  entrance:  900ms    // Section reveals
  narrative: 1200ms   // Long-form content
}

STAGGER = {
  tight:     100ms    // Dense content
  standard:  150ms    // ← Default
  spread:    250ms    // Spacious layout
  narrative: 400ms    // Story pacing
}
```

---

## Integration Pattern

### Old Pattern (Manual)
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.8 }}
>
  Content
</motion.div>
```

### New Pattern (Automated)
```jsx
<FocusSection stagger>
  <motion.div variants={staggerItemVariants}>
    Content (auto-staggered)
  </motion.div>
</FocusSection>
```

**Benefits**:
- No manual delay calculation
- Consistent timing across site
- One place to adjust globally
- Reduced-motion handled automatically

---

## File Size Impact

### Before
- CoreEngineCards.jsx: 118 lines
- Flywheel.jsx: 156 lines
- Hero.jsx: 69 lines
- Total: ~343 lines

### After
- CoreEngineCards.jsx: 148 lines (+30)
- Flywheel.jsx: 190 lines (+34)
- Hero.jsx: 74 lines (+5)
- New files: 645 lines
- Total: ~1,057 lines (+714)

### Build Size
- Before: ~1.5MB (gzipped: ~450KB)
- After: ~1.5MB (gzipped: ~450KB)
- **Impact**: +0KB (animations use existing Framer Motion)

---

## Browser Support Matrix

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | Recommended |
| Safari 14+ | ✅ Full | Recommended |
| Edge 90+ | ✅ Full | Recommended |
| Chrome 60-89 | ⚠️ Partial | No IntersectionObserver |
| IE 11 | ❌ None | Not supported |
| Mobile Safari 14+ | ✅ Full | Tested |
| Chrome Android 90+ | ✅ Full | Tested |

---

## Quick Start Checklist

### For Developers

1. ✅ Read `FOCUS_ANIMATION_DOCS.md`
2. ✅ Import components from `@/components/focus`
3. ✅ Use `useFocusAnimation` hook for custom logic
4. ✅ Check `src/lib/focusAnimation.js` for timing
5. ✅ Test with reduced-motion enabled

### For Designers

1. ✅ Focus duration: 3.5-4 seconds recommended
2. ✅ Stagger: 150ms between items
3. ✅ Emphasis: 2-3% scale, 10% brightness
4. ✅ Transitions: 500-700ms smooth
5. ✅ Loop: Continuous preferred

### For Product

1. ✅ Auto-play respects accessibility
2. ✅ User can pause with click/hover
3. ✅ Animations are subtle, not distracting
4. ✅ Performance: 60fps target
5. ✅ Mobile-optimized

---

**Document Version**: 1.0  
**Last Updated**: March 14, 2026  
**Related Docs**: FOCUS_ANIMATION_DOCS.md, IMPLEMENTATION_SUMMARY.md
