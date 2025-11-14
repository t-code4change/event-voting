# Premium GLOW UP 2025 Toast System 🎉

## Overview
A premium toast notification system with neon glow effects, elegant confetti, and smooth animations designed for the GLOW UP 2025 event theme.

## Features
- ✨ Neon gold (#FFD369) glow effects
- 🎊 Elegant confetti burst (80 particles)
- 🎯 Animated check-circle icon with pulse
- 🌈 Gradient background (black → gray → gold)
- ⚡ Smooth slide-in/fade-out animations
- 🎨 Premium champagne gold aesthetic

## Usage

### Basic Success Toast (with confetti)
```typescript
import { voteSuccessToast } from "@/hooks/use-toast"

// Show success toast with confetti on new vote
const handleVoteSubmit = async () => {
  try {
    await submitVote(candidateId)

    // This triggers confetti automatically
    voteSuccessToast()

  } catch (error) {
    // Handle error
  }
}
```

### Update Vote (no confetti)
```typescript
import { voteSuccessToast } from "@/hooks/use-toast"

// Show success toast WITHOUT confetti for vote updates
const handleVoteUpdate = async () => {
  try {
    await updateVote(newCandidateId)

    // Pass isUpdate: true to disable confetti
    voteSuccessToast({ isUpdate: true })

  } catch (error) {
    // Handle error
  }
}
```

### Custom Toast
```typescript
import { toast } from "@/hooks/use-toast"

toast({
  variant: "success",
  title: "Custom Success! ✨",
  description: "Your custom description here",
  duration: 3000,
  meta: {
    triggerConfetti: true, // Enable confetti
    isVoteUpdate: false,
  },
})
```

### Error Toast (no confetti)
```typescript
import { toast } from "@/hooks/use-toast"

toast({
  variant: "destructive",
  title: "Vote Failed",
  description: "Please try again later",
  duration: 3000,
})
```

## Design Specifications

### Colors
- **Neon Gold**: `#FFD369` (primary accent)
- **Neon Purple**: `#B580FF` (confetti accent)
- **White Gold**: `#FFF7D1` (text color)
- **Background Gradient**:
  ```css
  linear-gradient(135deg, #0A0A0A 0%, #1B1B1B 50%, #FFD36920 100%)
  ```

### Glow Effects
- **Outer Glow**: `0 0 12px #FFD36980`
- **Inner Glow**: `0 0 24px #FFD36940`

### Animations
1. **Entry**: Fade-in + slide-up 12px (250ms)
2. **Neon Flicker**: Quick flicker effect on appear
3. **Icon Pulse**: Glowing pulse for 1 second (3 repeats)
4. **Exit**: Fade-out with glow dimming (300ms)

### Confetti
- **Particle Count**: ~80
- **Colors**: `['#FFD369', '#B580FF', '#FFF7D1']`
- **Duration**: 1.2 seconds
- **Pattern**: 5-burst elegant spread
- **Gravity**: 0.8
- **Decay**: 0.94

## Position
- **Desktop/Mobile**: Top center of screen
- **Z-index**: `9999` (above all overlays)
- **Max Width**: `28rem` (responsive)

## Duration
- Default: **3 seconds** auto-dismiss
- User can manually close anytime

## Accessibility
- Respects `prefers-reduced-motion`
- Keyboard accessible (close with Esc)
- ARIA announcements for screen readers

## Examples

### Vote Page Integration
```typescript
"use client"

import { useState } from "react"
import { voteSuccessToast } from "@/hooks/use-toast"

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleSubmitVote = async () => {
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        body: JSON.stringify({ candidateId: selectedCandidate }),
      })

      if (response.ok) {
        // New vote - show confetti
        if (!hasVoted) {
          voteSuccessToast()
          setHasVoted(true)
        } else {
          // Update vote - no confetti
          voteSuccessToast({ isUpdate: true })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    // Your vote UI here
    <button onClick={handleSubmitVote}>
      Submit Vote
    </button>
  )
}
```

## Technical Implementation

### Toast Component Structure
```
<Toast> (with neon glow border & gradient bg)
  └─ <motion.div> (icon container)
      └─ <CheckCircle2> (with pulse animation)
  └─ <div> (content)
      └─ <ToastTitle> (gold tinted text)
      └─ <ToastDescription> (subtle text)
  └─ <ToastClose> (X button)
```

### Confetti Logic
- Only triggers when `meta.triggerConfetti === true`
- Multi-burst pattern for elegant effect
- Colors match event theme
- Respects user motion preferences

## Best Practices

✅ **DO**:
- Use `voteSuccessToast()` for new votes (with confetti)
- Use `voteSuccessToast({ isUpdate: true })` for vote updates (no confetti)
- Keep toast duration at 3 seconds
- Use descriptive titles and descriptions

❌ **DON'T**:
- Don't trigger confetti on every toast
- Don't spam multiple toasts at once (limit: 1)
- Don't use confetti for error states
- Don't override the premium styling

## Troubleshooting

### Confetti not showing?
- Check `meta.triggerConfetti` is `true`
- Verify `variant="success"` is set
- Ensure user hasn't disabled motion in OS settings

### Toast not appearing?
- Check that `<Toaster />` is rendered in your layout
- Verify toast hook is imported correctly
- Check z-index conflicts

### Styling issues?
- Ensure Tailwind CSS is configured
- Check that globals.css includes neon animations
- Verify color values are not being overridden

## Credits
Design inspired by premium event gala aesthetics with neon champagne gold accents.
