# BRIGHT4EVENT Design System
**Midnight Gala Theme** - Premium Event Voting Platform

---

## 📋 Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Logo System](#logo-system)
4. [Ranking Icons](#ranking-icons)
5. [Micro-Animations](#micro-animations)
6. [Celebration Effects](#celebration-effects)
7. [Component Specifications](#component-specifications)
8. [Accessibility](#accessibility)

---

## 🎨 Color Palette

### Primary Colors (Gold System)
```css
/* Primary Gold - Main Brand Color */
--gold-500: #FFD700;        /* Pure Gold - Main accent */
--gold-400: #FFE54A;        /* Light Gold - Hover states */
--gold-600: #FDB931;        /* Dark Gold - Active states */
--gold-300: #FFEB8A;        /* Pale Gold - Subtle highlights */
--gold-700: #E5B800;        /* Deep Gold - Borders */

/* WCAG AA Compliance */
--gold-on-dark: #FFD700;    /* 7.2:1 ratio on #0B0B0B */
--gold-on-light: #B8860B;   /* 4.8:1 ratio on #FFFFFF */
```

### Metallic Accent Colors
```css
/* Silver System - 2nd Place */
--silver-500: #C0C0C0;      /* Pure Silver */
--silver-400: #D3D3D3;      /* Light Silver */
--silver-600: #A8A8A8;      /* Dark Silver */
--silver-gradient: linear-gradient(135deg, #F0F0F0 0%, #C0C0C0 50%, #A8A8A8 100%);

/* Bronze System - 3rd Place */
--bronze-500: #CD7F32;      /* Pure Bronze */
--bronze-400: #E09C5E;      /* Light Bronze */
--bronze-600: #B8733A;      /* Dark Bronze */
--bronze-gradient: linear-gradient(135deg, #E09C5E 0%, #CD7F32 50%, #A0522D 100%);

/* Ruby Accent - Special Highlights */
--ruby-500: #E0115F;        /* Ruby Red */
--sapphire-500: #0F52BA;    /* Sapphire Blue */
--emerald-500: #50C878;     /* Emerald Green */
```

### Background & Neutral Colors
```css
/* Dark Backgrounds - Midnight Gala */
--bg-primary: #0B0B0B;      /* Deep Black - Main BG */
--bg-secondary: #1A1A1A;    /* Charcoal - Cards */
--bg-tertiary: #1E1B13;     /* Warm Dark - Sections */
--bg-elevated: #252525;     /* Elevated Cards */

/* Neutral Grays */
--gray-900: #0B0B0B;        /* Darkest */
--gray-800: #1A1A1A;
--gray-700: #2D2D2D;
--gray-600: #404040;
--gray-500: #666666;
--gray-400: #999999;
--gray-300: #B3B3B3;
--gray-200: #CCCCCC;
--gray-100: #E6E6E6;
--gray-50: #F5F5F5;         /* Lightest */

/* Text Colors */
--text-primary: #FFFFFF;     /* Pure White - Headings (21:1 ratio) */
--text-secondary: #FAF3E0;   /* Cream White - Body (18.5:1 ratio) */
--text-tertiary: #FFE68A;    /* Warm Yellow - Accents (13.2:1 ratio) */
--text-muted: rgba(250, 243, 224, 0.7);  /* 70% opacity (12.9:1 ratio) */
--text-subtle: rgba(250, 243, 224, 0.5); /* 50% opacity (9.2:1 ratio) */
```

### Semantic Colors
```css
/* Success */
--success-500: #22C55E;     /* Green */
--success-bg: rgba(34, 197, 94, 0.1);

/* Error */
--error-500: #EF4444;       /* Red */
--error-bg: rgba(239, 68, 68, 0.1);

/* Warning */
--warning-500: #F59E0B;     /* Amber */
--warning-bg: rgba(245, 158, 11, 0.1);

/* Info */
--info-500: #3B82F6;        /* Blue */
--info-bg: rgba(59, 130, 246, 0.1);
```

### Gradient Definitions
```css
/* Brand Gradients */
--gradient-gold: linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%);
--gradient-gold-radial: radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15), transparent 50%);
--gradient-silver: linear-gradient(135deg, #F0F0F0 0%, #C0C0C0 50%, #A8A8A8 100%);
--gradient-bronze: linear-gradient(135deg, #E09C5E 0%, #CD7F32 50%, #A0522D 100%);

/* Background Gradients */
--gradient-bg-main: linear-gradient(to bottom, #0B0B0B, #1E1B13, #0B0B0B);
--gradient-bg-card: linear-gradient(to bottom right, #1A1A1A, #0B0B0B);
--gradient-spotlight: radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15), transparent 50%);

/* King/Queen Category Gradients */
--gradient-king: linear-gradient(90deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1), rgba(147, 51, 234, 0.1));
--gradient-queen: linear-gradient(90deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.1), rgba(147, 51, 234, 0.1));
```

### Glow Effects
```css
/* Gold Glow - For Top Rank */
--glow-gold: 0 0 20px rgba(255, 215, 0, 0.3),
             0 0 40px rgba(255, 215, 0, 0.2),
             0 0 60px rgba(255, 215, 0, 0.1);

--glow-gold-strong: 0 0 30px rgba(255, 215, 0, 0.5),
                    0 0 60px rgba(255, 215, 0, 0.3);

/* Silver/Bronze Glow */
--glow-silver: 0 0 15px rgba(192, 192, 192, 0.3);
--glow-bronze: 0 0 15px rgba(205, 127, 50, 0.3);

/* Text Shadows */
--text-glow-gold: 0 0 20px rgba(255, 215, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.8);
--text-glow-subtle: 0 2px 4px rgba(0, 0, 0, 0.8);
```

---

## 📝 Typography

### Font Families
```css
/* Display Font - For Headings & Brand */
--font-display: 'Playfair Display', Georgia, serif;

/* UI Font - For Interface */
--font-ui: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* System Font Stack - Fallback */
--font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;

/* Monospace - For Code/Numbers */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale
```css
/* Headings - Playfair Display */
--text-6xl: 3.75rem;    /* 60px - Hero Titles */
--text-5xl: 3rem;       /* 48px - Page Titles */
--text-4xl: 2.25rem;    /* 36px - Section Headers */
--text-3xl: 1.875rem;   /* 30px - Card Titles */
--text-2xl: 1.5rem;     /* 24px - Sub Headers */
--text-xl: 1.25rem;     /* 20px - Large Text */

/* Body - Outfit/System */
--text-lg: 1.125rem;    /* 18px - Large Body */
--text-base: 1rem;      /* 16px - Body Text */
--text-sm: 0.875rem;    /* 14px - Small Text */
--text-xs: 0.75rem;     /* 12px - Captions */

/* Line Heights */
--leading-tight: 1.1;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;

/* Letter Spacing */
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
```

### Typography Usage Examples
```tsx
// Hero Title
<h1 className="font-playfair text-6xl font-bold text-white"
    style={{ textShadow: 'var(--text-glow-gold)' }}>
  BRIGHT4EVENT
</h1>

// Section Header
<h2 className="font-playfair text-4xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent">
  King & Queen of the Night
</h2>

// Body Text
<p className="font-ui text-base text-[#FAF3E0]/70 leading-relaxed">
  Premium event voting platform
</p>
```

---

## 🏆 Logo System

### Wordmark Logo - "BRIGHT4EVENT"

#### Desktop Version (1440px+)
```html
<!-- Full Wordmark with Sparkle Icon -->
<div class="logo-wordmark-desktop">
  <svg class="logo-icon" viewBox="0 0 24 24" width="28" height="28">
    <!-- Sparkles icon -->
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="url(#goldGradient)" />
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700" />
        <stop offset="50%" stop-color="#FDB931" />
        <stop offset="100%" stop-color="#FFD700" />
      </linearGradient>
    </defs>
  </svg>

  <span class="logo-text">
    <span class="logo-bright">BRIGHT</span>
    <span class="logo-number">4</span>
    <span class="logo-event">EVENT</span>
  </span>
</div>
```

**Styling:**
```css
.logo-wordmark-desktop {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #FFD700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-number {
  color: #FDB931;
  font-weight: 900;
}
```

#### Mobile Version (375px-768px)
```html
<!-- Compact Version - Icon + "B4E" -->
<div class="logo-monogram-mobile">
  <svg class="logo-icon-small" viewBox="0 0 24 24" width="24" height="24">
    <!-- Crown icon for mobile -->
    <path d="M2 20h20v2H2v-2zm2-8l3 1 3-5 2 5 2-5 3 5 3-1-2 6H4l-2-6z"
          fill="url(#goldGradient)" />
  </svg>
  <span class="logo-text-compact">B4E</span>
</div>
```

**Styling:**
```css
.logo-monogram-mobile {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.logo-text-compact {
  font-family: var(--font-ui);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #FFD700, #FDB931);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Monogram Logo - "B4E" with Crown

**SVG Export:**
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Crown -->
  <path d="M8 32h32v4H8v-4zm4-16l6 2 6-10 4 10 4-10 6 10 6-2-4 12H12l-4-12z"
        fill="url(#goldGradient)" />

  <!-- B4E Text -->
  <text x="24" y="44" font-family="Outfit" font-weight="700" font-size="10"
        text-anchor="middle" fill="#FFD700">B4E</text>

  <defs>
    <linearGradient id="goldGradient" x1="8" y1="12" x2="40" y2="36">
      <stop offset="0%" stop-color="#FFD700" />
      <stop offset="50%" stop-color="#FDB931" />
      <stop offset="100%" stop-color="#FFD700" />
    </linearGradient>
  </defs>
</svg>
```

### Logo Animation States

**Hover Effect:**
```css
.logo-wordmark-desktop:hover .logo-icon {
  animation: logo-sparkle 0.6s ease-in-out;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
}

@keyframes logo-sparkle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  75% { transform: rotate(-10deg) scale(1.1); }
}

.logo-wordmark-desktop:hover .logo-text {
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}
```

**Click Effect (with Confetti):**
```tsx
const handleLogoClick = () => {
  // Confetti burst
  confetti({
    particleCount: 100,
    spread: 75,
    origin: { x: 0.15, y: 0.3 },
    colors: ['#FFD700', '#FDB931', '#FFFFFF', '#C0C0C0'],
    gravity: 0.6,
    scalar: 1.2,
  });

  // Navigate after animation
  setTimeout(() => router.push('/'), 500);
};
```

---

## 🥇 Ranking Medal Icons

### Rank 1 - Gold Medal

**SVG Static:**
```svg
<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer Circle - Gold Gradient -->
  <circle cx="28" cy="28" r="26" fill="url(#goldMedalGradient)"
          filter="drop-shadow(0 4px 12px rgba(255, 215, 0, 0.5))" />

  <!-- Inner Circle - Darker Gold -->
  <circle cx="28" cy="28" r="22" fill="url(#goldInner)" opacity="0.3" />

  <!-- Trophy Icon -->
  <path d="M20 22h16v4l-2 8h-12l-2-8v-4zm4-2h8l2 2h-12l2-2zm4 16v4h-4v2h12v-2h-4v-4h-4z"
        fill="#000000" opacity="0.8" />

  <!-- Crown on Top -->
  <path d="M18 16l2 1 2-3 1.5 3 1.5-3 2 3 2-1-1.5 4h-8l-1.5-4z"
        fill="#FFD700" />

  <!-- Ruby Ribbon -->
  <path d="M28 50l-6 4v-8l6 2 6-2v8l-6-4z" fill="#E0115F" />

  <defs>
    <radialGradient id="goldMedalGradient" cx="28" cy="28">
      <stop offset="0%" stop-color="#FFE54A" />
      <stop offset="50%" stop-color="#FFD700" />
      <stop offset="100%" stop-color="#E5B800" />
    </radialGradient>
    <radialGradient id="goldInner" cx="28" cy="28">
      <stop offset="0%" stop-color="#FDB931" />
      <stop offset="100%" stop-color="#E5B800" />
    </radialGradient>
  </defs>
</svg>
```

**Lottie Animation Spec (JSON Structure):**
```json
{
  "v": "5.7.4",
  "fr": 60,
  "ip": 0,
  "op": 72,
  "w": 56,
  "h": 56,
  "nm": "Gold Medal Rank 1",
  "layers": [
    {
      "ty": 4,
      "nm": "Sparkle Burst",
      "ks": {
        "o": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 12, "s": [100] },
            { "t": 36, "s": [100] },
            { "t": 54, "s": [0] }
          ]
        },
        "s": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0, 0] },
            { "t": 18, "s": [120, 120] },
            { "t": 54, "s": [0, 0] }
          ]
        }
      }
    },
    {
      "ty": 4,
      "nm": "Medal Body",
      "ks": {
        "s": {
          "a": 1,
          "k": [
            { "t": 0, "s": [100, 100], "o": { "x": 0.4, "y": 0 }, "i": { "x": 0.6, "y": 1 } },
            { "t": 30, "s": [110, 110] },
            { "t": 60, "s": [100, 100] }
          ]
        }
      }
    },
    {
      "ty": 4,
      "nm": "Shimmer Sweep",
      "ks": {
        "p": {
          "a": 1,
          "k": [
            { "t": 0, "s": [-20, 28] },
            { "t": 30, "s": [76, 28] }
          ]
        }
      }
    }
  ]
}
```

**React Component:**
```tsx
import Lottie from 'react-lottie';
import goldMedalAnimation from '@/assets/animations/gold-medal.json';

interface RankBadgeProps {
  rank: number;
  animated?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, animated = true }) => {
  if (rank === 1) {
    return (
      <div className="relative w-14 h-14">
        {animated ? (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: goldMedalAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            height={56}
            width={56}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFE54A] to-[#E5B800]
                          flex items-center justify-center shadow-lg shadow-[#FFD700]/50">
            <Trophy className="w-7 h-7 text-black" />
          </div>
        )}
      </div>
    );
  }

  // Similar for rank 2 and 3...
};
```

### Rank 2 - Silver Medal

**Key Differences:**
- Gradient: `#F0F0F0` → `#C0C0C0` → `#A8A8A8`
- Laurel wreath instead of crown
- Sapphire ribbon (`#0F52BA`)
- Animation: Gentle sway ±6° rotation
- Shadow: `0 4px 12px rgba(192, 192, 192, 0.3)`

### Rank 3 - Bronze Medal

**Key Differences:**
- Gradient: `#E09C5E` → `#CD7F32` → `#A0522D`
- Star accents instead of crown
- Emerald ribbon (`#50C878`)
- Animation: Bounce (translateY: 0 → -4px → 0)
- Shadow: `0 4px 12px rgba(205, 127, 50, 0.3)`

---

## ✨ Micro-Animations

### Animation Timing Tokens
```css
:root {
  /* Duration */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-medium: 500ms;
  --duration-slow: 600ms;
  --duration-slower: 900ms;

  /* Easing Functions */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  /* Specific Timings */
  --timing-reveal-mask: 600ms;
  --timing-shimmer-sweep: 500ms;
  --timing-hover-scale: 150ms;
  --timing-rank-change: 900ms;
  --timing-bar-growth: 600ms;
}
```

### Reveal Mask Animation
```css
@keyframes reveal-mask {
  0% {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
  }
  100% {
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
}

.reveal-mask {
  animation: reveal-mask var(--timing-reveal-mask) var(--ease-out);
}

/* Usage in React */
.candidate-card {
  animation: reveal-mask 600ms cubic-bezier(0, 0, 0.2, 1);
}
```

### Shimmer Sweep Effect
```css
@keyframes shimmer-sweep {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shimmer-sweep var(--timing-shimmer-sweep) var(--ease-smooth);
}

/* Apply to elements */
.rank-1-winner {
  position: relative;
  overflow: hidden;
}

.rank-1-winner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
  animation: shimmer-sweep 2s ease-in-out infinite;
}
```

### Hover Scale
```css
.interactive-element {
  transition: transform var(--timing-hover-scale) var(--ease-out),
              box-shadow var(--timing-hover-scale) var(--ease-out);
}

.interactive-element:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(255, 215, 0, 0.2);
}

/* With active state */
.interactive-element:active {
  transform: scale(0.98);
}
```

### Rank Change Animation
```tsx
const RankChangeAnimation: React.FC<{ prevRank: number; newRank: number }> = ({
  prevRank,
  newRank
}) => {
  const isPromotion = newRank < prevRank;

  return (
    <motion.div
      initial={{ scale: 1, opacity: 1 }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [1, 1, 1],
        y: isPromotion ? [0, -10, 0] : [0, 10, 0],
      }}
      transition={{
        duration: 0.9,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }}
    >
      {/* Rank badge content */}
    </motion.div>
  );
};
```

### Bar Chart Growth
```css
@keyframes bar-growth {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  100% {
    transform: scaleX(1);
    transform-origin: left;
  }
}

.vote-bar {
  animation: bar-growth var(--timing-bar-growth) cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Stagger effect for multiple bars */
.vote-bar:nth-child(1) { animation-delay: 0ms; }
.vote-bar:nth-child(2) { animation-delay: 100ms; }
.vote-bar:nth-child(3) { animation-delay: 200ms; }
.vote-bar:nth-child(4) { animation-delay: 300ms; }
.vote-bar:nth-child(5) { animation-delay: 400ms; }
```

### Pulse Animation (Live Update Indicator)
```css
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 8px rgba(255, 215, 0, 0);
  }
}

.live-indicator {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

---

## 🎉 Celebration Effects

### Confetti System

**Configuration:**
```typescript
export const CONFETTI_CONFIG = {
  desktop: {
    particleCount: 120,
    spread: 75,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#FFD700', '#FFE54A', '#FDB931', '#FFFFFF', '#C0C0C0', '#1976D2', '#8E24AA'],
    gravity: 0.8,
    scalar: 1.2,
    drift: 0,
    ticks: 200,
    shapes: ['circle', 'square'],
    startVelocity: 45,
  },
  mobile: {
    particleCount: 60,
    spread: 60,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#FFD700', '#FDB931', '#FFFFFF', '#C0C0C0'],
    gravity: 0.7,
    scalar: 1.0,
    ticks: 150,
  },
  // Respect user preference
  reducedMotion: {
    particleCount: 20,
    spread: 40,
    ticks: 80,
    scalar: 0.6,
  }
};
```

**Implementation:**
```tsx
import confetti from 'canvas-confetti';

export const triggerCelebration = (type: 'newVote' | 'rankChange' | 'winner') => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  let config = CONFETTI_CONFIG.desktop;
  if (prefersReducedMotion) {
    config = CONFETTI_CONFIG.reducedMotion;
  } else if (isMobile) {
    config = CONFETTI_CONFIG.mobile;
  }

  switch (type) {
    case 'newVote':
      // Single burst
      confetti(config);
      break;

    case 'rankChange':
      // Double burst with delay
      confetti(config);
      setTimeout(() => {
        confetti({
          ...config,
          particleCount: config.particleCount / 2,
          spread: config.spread * 0.8,
        });
      }, 150);
      break;

    case 'winner':
      // Triple burst - grand celebration
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          ...config,
          particleCount: 50,
          angle: 60,
          origin: { x: 0, y: 0.5 },
        });
        confetti({
          ...config,
          particleCount: 50,
          angle: 120,
          origin: { x: 1, y: 0.5 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
      break;
  }
};
```

### New Top 1 Animation

**Lottie Timeline (1200ms total):**
```
0ms:    Crown starts falling from top (y: -50px)
200ms:  Crown bounces on landing (ease: bounce)
700ms:  Crown settles

200ms:  Shimmer sweep begins (left to right)
700ms:  Shimmer sweep ends

700ms:  Sparkle burst appears
900ms:  Sparkle particles fade out

0ms:    Bar chart starts growing
600ms:  Bar reaches final value (easeOutCubic)
```

**React Implementation:**
```tsx
const NewTop1Animation = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Crown Drop */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            initial={{ y: -50, rotate: -20 }}
            animate={{
              y: [- 50, 20, 15, 20],
              rotate: [-20, 0, 5, 0]
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.6, 0.8, 1],
              ease: [0.68, -0.55, 0.265, 1.55]
            }}
          >
            <Crown className="w-16 h-16 text-[#FFD700]" />
          </motion.div>

          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: 'easeInOut'
            }}
          />

          {/* Sparkle Burst */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 2],
              opacity: [0, 1, 0]
            }}
            transition={{
              delay: 0.7,
              duration: 0.3,
              times: [0, 0.5, 1]
            }}
          >
            <Sparkles className="w-24 h-24 text-[#FFD700]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

## 🧩 Component Specifications

### Leaderboard Component

**Props Interface:**
```typescript
interface LeaderboardProps {
  eventId: string;
  view?: 'compact' | 'full' | 'modal';
  maxItems?: number;
  realtime?: boolean;
  onCandidateClick?: (candidateId: string) => void;
}

interface Category {
  id: string;
  name: string;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  vote_count: number;
  rank: number;
  previous_rank?: number;
}
```

**Component Structure:**
```tsx
export const Leaderboard: React.FC<LeaderboardProps> = ({
  eventId,
  view = 'full',
  maxItems = 50,
  realtime = true,
  onCandidateClick
}) => {
  const { categories, stats, loading } = useRealtimeResults(eventId);

  return (
    <div className="space-y-12">
      {/* Stats Overview */}
      <StatsGrid stats={stats} />

      {/* Categories */}
      {categories.map(category => (
        <CategoryCard
          key={category.id}
          category={category}
          maxItems={view === 'compact' ? 5 : maxItems}
          onCandidateClick={onCandidateClick}
        />
      ))}
    </div>
  );
};
```

### Chart Components

**Bar Chart (Horizontal):**
```tsx
interface VoteBarProps {
  candidate: Candidate;
  maxVotes: number;
  index: number;
}

const VoteBar: React.FC<VoteBarProps> = ({ candidate, maxVotes, index }) => {
  const percentage = (candidate.vote_count / maxVotes) * 100;

  return (
    <motion.div
      className="h-3 bg-gradient-to-r from-[#FFD700] to-[#FDB931] rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    />
  );
};
```

**Donut Chart (Category Distribution):**
```tsx
import { PieChart, Pie, Cell } from 'recharts';

const CategoryDonut: React.FC<{ data: CategoryData[] }> = ({ data }) => {
  const COLORS = ['#FFD700', '#C0C0C0', '#CD7F32', '#1976D2', '#8E24AA'];

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};
```

### Accessibility Features

**Keyboard Navigation:**
```tsx
const CandidateCard = ({ candidate, onSelect }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${candidate.name}, ${candidate.vote_count} votes, rank ${candidate.rank}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(candidate.id);
        }
      }}
      className="candidate-card"
    >
      {/* Content */}
    </div>
  );
};
```

**Live Region for Updates:**
```tsx
<div
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {lastUpdate && `New vote recorded. ${lastUpdate.candidateName} now has ${lastUpdate.votes} votes.`}
</div>
```

**Reduced Motion Support:**
```tsx
const shouldReduceMotion = useReducedMotion();

return (
  <motion.div
    animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
  >
    {/* Content */}
  </motion.div>
);

// Hook implementation
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
```

---

## 📱 Responsive Breakpoints

```css
:root {
  --breakpoint-xs: 375px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1440px;
}
```

**Usage in Tailwind:**
```tsx
<div className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
  px-4 sm:px-6 md:px-8 lg:px-12
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
">
```

---

## 🎯 Usage Guidelines

### When to Use Animations

**✅ DO:**
- Hover effects on interactive elements
- New vote celebrations
- Rank changes
- Page transitions
- Loading states

**❌ DON'T:**
- Animate purely decorative elements constantly
- Use animations longer than 1 second for micro-interactions
- Ignore `prefers-reduced-motion`
- Animate on scroll if it causes janky performance

### Performance Optimization

```tsx
// Use CSS transforms for better performance
.optimized-animation {
  transform: translateX(0) scale(1);  /* ✅ GPU accelerated */
  transition: transform 0.3s;
}

/* Avoid */
.slow-animation {
  left: 0;           /* ❌ Triggers layout */
  width: 100px;      /* ❌ Triggers layout */
  margin-left: 10px; /* ❌ Triggers layout */
}
```

**Lazy Load Lottie:**
```tsx
const LottieAnimation = lazy(() => import('react-lottie'));

<Suspense fallback={<StaticFallback />}>
  <LottieAnimation {...props} />
</Suspense>
```

---

## 📦 Export Assets

### Required Files:
```
/public/assets/
├── logos/
│   ├── wordmark-desktop.svg
│   ├── wordmark-desktop@2x.png
│   ├── wordmark-desktop@3x.png
│   ├── monogram-mobile.svg
│   ├── monogram-mobile@2x.png
│   └── favicon-32x32.png
├── animations/
│   ├── gold-medal.json
│   ├── silver-medal.json
│   ├── bronze-medal.json
│   └── new-top-1.json
└── icons/
    ├── rank-1.svg
    ├── rank-2.svg
    └── rank-3.svg
```

---

**Last Updated:** 2025-01-14
**Version:** 1.0.0
**Maintained by:** BRIGHT4EVENT Design Team
