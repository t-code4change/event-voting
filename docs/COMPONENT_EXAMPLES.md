# BRIGHT4EVENT Component Examples

This document provides ready-to-use React/TypeScript component examples for the BRIGHT4EVENT platform.

---

## 🏆 RankBadge Component

**File:** `components/RankBadge.tsx`

```tsx
'use client';

import React, { lazy, Suspense } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load Lottie for better performance
const Lottie = lazy(() => import('react-lottie'));

// Import JSON animations (create these files based on DESIGN_SYSTEM.md)
import goldMedalAnimation from '@/public/assets/animations/gold-medal.json';
import silverMedalAnimation from '@/public/assets/animations/silver-medal.json';
import bronzeMedalAnimation from '@/public/assets/animations/bronze-medal.json';

interface RankBadgeProps {
  rank: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  animated = true,
  size = 'md',
  className = '',
}) => {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldAnimate = animated && !prefersReducedMotion;

  // Size configurations
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  // Rank 1: Gold Medal
  if (rank === 1) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {shouldAnimate ? (
          <Suspense fallback={<GoldBadgeStatic size={size} />}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: goldMedalAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              height={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
              width={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
            />
          </Suspense>
        ) : (
          <GoldBadgeStatic size={size} />
        )}
      </div>
    );
  }

  // Rank 2: Silver Medal
  if (rank === 2) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {shouldAnimate ? (
          <Suspense fallback={<SilverBadgeStatic size={size} />}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: silverMedalAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              height={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
              width={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
            />
          </Suspense>
        ) : (
          <SilverBadgeStatic size={size} />
        )}
      </div>
    );
  }

  // Rank 3: Bronze Medal
  if (rank === 3) {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {shouldAnimate ? (
          <Suspense fallback={<BronzeBadgeStatic size={size} />}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: bronzeMedalAnimation,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              height={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
              width={size === 'sm' ? 40 : size === 'md' ? 56 : 80}
            />
          </Suspense>
        ) : (
          <BronzeBadgeStatic size={size} />
        )}
      </div>
    );
  }

  // Rank 4+: Default numbered badge
  return (
    <div
      className={`
        ${sizeClasses[size]} ${className}
        rounded-full bg-[#1a1a1a] border-2 border-[#FFD700]/30
        flex items-center justify-center
        text-[#FFD700] font-bold
        ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-2xl'}
      `}
    >
      {rank}
    </div>
  );
};

// Static Fallback Components
const GoldBadgeStatic: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-[#FFE54A] to-[#E5B800]
        flex items-center justify-center
        shadow-lg shadow-[#FFD700]/50
        border-2 border-[#FFD700]
      `}
    >
      <Trophy className={`${iconSizes[size]} text-black`} />
    </div>
  );
};

const SilverBadgeStatic: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-[#F0F0F0] to-[#A8A8A8]
        flex items-center justify-center
        shadow-lg shadow-[#C0C0C0]/30
        border-2 border-[#C0C0C0]
      `}
    >
      <Trophy className={`${iconSizes[size]} text-white`} />
    </div>
  );
};

const BronzeBadgeStatic: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-[#E09C5E] to-[#A0522D]
        flex items-center justify-center
        shadow-lg shadow-[#CD7F32]/30
        border-2 border-[#CD7F32]
      `}
    >
      <Trophy className={`${iconSizes[size]} text-white`} />
    </div>
  );
};

export default RankBadge;
```

---

## 🎉 Celebration Utilities

**File:** `lib/celebration.ts`

```typescript
import confetti from 'canvas-confetti';

export type CelebrationType = 'newVote' | 'rankChange' | 'winner';

interface ConfettiConfig {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
  gravity: number;
  scalar: number;
  drift?: number;
  ticks: number;
  shapes?: ('circle' | 'square')[];
  startVelocity?: number;
}

export const CONFETTI_CONFIG = {
  desktop: {
    particleCount: 120,
    spread: 75,
    origin: { x: 0.5, y: 0.3 },
    colors: [
      '#FFD700', // Gold
      '#FFE54A', // Light Gold
      '#FDB931', // Dark Gold
      '#FFFFFF', // White
      '#C0C0C0', // Silver
      '#1976D2', // Blue
      '#8E24AA', // Purple
    ],
    gravity: 0.8,
    scalar: 1.2,
    drift: 0,
    ticks: 200,
    shapes: ['circle', 'square'] as ('circle' | 'square')[],
    startVelocity: 45,
  } as ConfettiConfig,

  mobile: {
    particleCount: 60,
    spread: 60,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#FFD700', '#FDB931', '#FFFFFF', '#C0C0C0'],
    gravity: 0.7,
    scalar: 1.0,
    ticks: 150,
  } as ConfettiConfig,

  reducedMotion: {
    particleCount: 20,
    spread: 40,
    origin: { x: 0.5, y: 0.3 },
    colors: ['#FFD700', '#FFFFFF'],
    gravity: 0.6,
    scalar: 0.6,
    ticks: 80,
  } as ConfettiConfig,
};

/**
 * Triggers celebration confetti effect
 * Automatically adapts to device and user preferences
 */
export function triggerCelebration(type: CelebrationType = 'newVote') {
  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Select config
  let config = CONFETTI_CONFIG.desktop;
  if (prefersReducedMotion) {
    config = CONFETTI_CONFIG.reducedMotion;
  } else if (isMobile) {
    config = CONFETTI_CONFIG.mobile;
  }

  switch (type) {
    case 'newVote':
      // Single burst from center
      confetti({
        ...config,
        origin: { x: 0.5, y: 0.5 },
      });
      break;

    case 'rankChange':
      // Double burst with slight delay
      confetti(config);
      setTimeout(() => {
        confetti({
          ...config,
          particleCount: Math.floor(config.particleCount / 2),
          spread: config.spread * 0.8,
        });
      }, 150);
      break;

    case 'winner':
      // Grand celebration - continuous bursts
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        // Left side burst
        confetti({
          ...config,
          particleCount: 50,
          angle: 60,
          origin: { x: 0, y: 0.5 },
        });

        // Right side burst
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
}

/**
 * Confetti burst from specific element position
 */
export function triggerCelebrationFromElement(
  element: HTMLElement,
  type: CelebrationType = 'newVote'
) {
  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile = window.innerWidth < 768;

  let config = CONFETTI_CONFIG.desktop;
  if (prefersReducedMotion) {
    config = CONFETTI_CONFIG.reducedMotion;
  } else if (isMobile) {
    config = CONFETTI_CONFIG.mobile;
  }

  confetti({
    ...config,
    origin: { x, y },
  });
}
```

---

## ✨ Animation Components

**File:** `components/animations/RevealMask.tsx`

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealMaskProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const RevealMask: React.FC<RevealMaskProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
      animate={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
      transition={{
        duration,
        delay,
        ease: [0, 0, 0.2, 1], // easeOut
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

**File:** `components/animations/ShimmerEffect.tsx`

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ShimmerEffectProps {
  className?: string;
  color?: string;
  duration?: number;
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  className = '',
  color = 'rgba(255, 215, 0, 0.3)',
  duration = 2,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
};
```

**File:** `components/animations/RankChangeAnimation.tsx`

```tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface RankChangeAnimationProps {
  show: boolean;
  oldRank: number;
  newRank: number;
}

export const RankChangeAnimation: React.FC<RankChangeAnimationProps> = ({
  show,
  oldRank,
  newRank,
}) => {
  const isPromotion = newRank < oldRank;
  const Icon = isPromotion ? TrendingUp : TrendingDown;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className={`
              px-6 py-3 rounded-full
              ${isPromotion ? 'bg-green-500' : 'bg-orange-500'}
              text-white font-bold text-lg
              flex items-center gap-2
              shadow-2xl
            `}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1],
              ease: 'easeInOut',
            }}
          >
            <Icon className="w-6 h-6" />
            {isPromotion ? `Lên hạng ${newRank}!` : `Xuống hạng ${newRank}`}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

## 📊 Vote Bar Component

**File:** `components/VoteBar.tsx`

```tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/home/ui/progress';

interface VoteBarProps {
  voteCount: number;
  maxVotes: number;
  index: number;
  rank: number;
  animated?: boolean;
}

export const VoteBar: React.FC<VoteBarProps> = ({
  voteCount,
  maxVotes,
  index,
  rank,
  animated = true,
}) => {
  const percentage = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;

  // Color based on rank
  const getBarColor = () => {
    if (rank === 1) return 'from-[#FFD700] to-[#FDB931]';
    if (rank === 2) return 'from-[#C0C0C0] to-[#A8A8A8]';
    if (rank === 3) return 'from-[#CD7F32] to-[#B8733A]';
    return 'from-[#FFD700]/50 to-[#FDB931]/50';
  };

  if (!animated) {
    return (
      <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getBarColor()} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }

  return (
    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r ${getBarColor()} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94], // easeOutCubic
        }}
      />
    </div>
  );
};
```

---

## 🎯 New Top 1 Animation

**File:** `components/NewTop1Animation.tsx`

```tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { triggerCelebration } from '@/lib/celebration';

interface NewTop1AnimationProps {
  candidateName: string;
  onComplete?: () => void;
}

export const NewTop1Animation: React.FC<NewTop1AnimationProps> = ({
  candidateName,
  onComplete,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Trigger confetti
    triggerCelebration('winner');

    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Animation Container */}
          <div className="relative z-10">
            {/* Crown Drop */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2"
              initial={{ y: -100, rotate: -20, opacity: 0 }}
              animate={{
                y: [-100, 20, 15, 20],
                rotate: [-20, 0, 5, 0],
                opacity: [0, 1, 1, 1],
              }}
              transition={{
                duration: 0.7,
                times: [0, 0.6, 0.8, 1],
                ease: [0.68, -0.55, 0.265, 1.55], // Bounce
              }}
            >
              <Crown className="w-24 h-24 text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" />
            </motion.div>

            {/* Shimmer Sweep */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Text Announcement */}
            <motion.div
              className="mt-32 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h2
                className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4"
                style={{ textShadow: '0 0 30px rgba(255,215,0,0.8)' }}
              >
                👑 TOP 1 MỚI! 👑
              </h2>
              <p
                className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] bg-clip-text text-transparent"
              >
                {candidateName}
              </p>
            </motion.div>

            {/* Sparkle Burst */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 2],
                opacity: [0, 1, 0],
              }}
              transition={{
                delay: 0.7,
                duration: 0.9,
                times: [0, 0.5, 1],
              }}
            >
              <Sparkles className="w-32 h-32 text-[#FFD700]" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

## 🪝 Custom Hooks

**File:** `hooks/useReducedMotion.ts`

```typescript
import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);

    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, []);

  return prefersReducedMotion;
}
```

**File:** `hooks/useRankChange.ts`

```typescript
import { useEffect, useRef } from 'react';

interface Candidate {
  id: string;
  rank: number;
}

/**
 * Hook to detect rank changes
 * Calls callback when a candidate's rank changes
 */
export function useRankChange(
  candidates: Candidate[],
  onRankChange: (candidateId: string, oldRank: number, newRank: number) => void
) {
  const previousRanks = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    candidates.forEach((candidate) => {
      const oldRank = previousRanks.current.get(candidate.id);

      if (oldRank !== undefined && oldRank !== candidate.rank) {
        onRankChange(candidate.id, oldRank, candidate.rank);
      }

      previousRanks.current.set(candidate.id, candidate.rank);
    });
  }, [candidates, onRankChange]);
}
```

---

## 📱 Usage Examples

### In Results Page:

```tsx
// app/event/[eventId]/results/page.tsx
import { RankBadge } from '@/home/RankBadge';
import { VoteBar } from '@/home/VoteBar';
import { NewTop1Animation } from '@/home/NewTop1Animation';
import { triggerCelebration } from '@/lib/celebration';
import { useRankChange } from '@/hooks/useRankChange';

export default function ResultsPage() {
  const [showTop1Animation, setShowTop1Animation] = useState(false);
  const [top1Candidate, setTop1Candidate] = useState('');

  const { categories, stats } = useRealtimeResults(eventId);

  // Detect rank changes
  useRankChange(
    categories.flatMap(cat => cat.candidates),
    (candidateId, oldRank, newRank) => {
      if (newRank === 1 && oldRank !== 1) {
        // New top 1!
        const candidate = categories
          .flatMap(cat => cat.candidates)
          .find(c => c.id === candidateId);

        if (candidate) {
          setTop1Candidate(candidate.name);
          setShowTop1Animation(true);
        }
      } else if (newRank !== oldRank) {
        // Other rank change
        triggerCelebration('rankChange');
      }
    }
  );

  return (
    <div>
      {/* New Top 1 Animation */}
      {showTop1Animation && (
        <NewTop1Animation
          candidateName={top1Candidate}
          onComplete={() => setShowTop1Animation(false)}
        />
      )}

      {/* Leaderboard */}
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          {category.candidates.map((candidate, index) => (
            <div key={candidate.id} className="flex items-center gap-4 p-4">
              {/* Rank Badge */}
              <RankBadge rank={candidate.rank} animated size="md" />

              {/* Candidate Info */}
              <div className="flex-1">
                <h3>{candidate.name}</h3>
                <VoteBar
                  voteCount={candidate.vote_count}
                  maxVotes={Math.max(...category.candidates.map(c => c.vote_count))}
                  index={index}
                  rank={candidate.rank}
                  animated
                />
                <p>{candidate.vote_count} votes</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-01-14
