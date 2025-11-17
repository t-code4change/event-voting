# Toast System Usage Guide

## Overview
The project uses **Sonner** - a modern, smooth toast notification library with confetti integration.

## Features
- ✅ Smooth animations (powered by Sonner)
- ✅ Multiple toast types (success, error, info, warning, loading)
- ✅ Optional confetti effects
- ✅ Custom golden theme matching brand colors
- ✅ Simple API - no Redux needed
- ✅ Auto-dismiss with configurable duration
- ✅ Accessible and keyboard-friendly

## Usage

### Import
```typescript
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showLoadingToast,
  dismissToast,
  triggerConfetti
} from "@/lib/toast-utils"
```

### Basic Examples

#### Success Toast
```typescript
showSuccessToast("Đã lưu thành công!")
```

#### Success Toast with Confetti
```typescript
showSuccessToast("🎉 Chúc mừng! Bạn đã hoàn thành", { confetti: true })
```

#### Success Toast with Description
```typescript
showSuccessToast("Đã gửi email", {
  description: "Chúng tôi sẽ phản hồi trong vòng 24h"
})
```

#### Error Toast
```typescript
showErrorToast("Có lỗi xảy ra", {
  description: "Vui lòng thử lại sau"
})
```

#### Info Toast
```typescript
showInfoToast("Tài khoản của bạn đã được cập nhật")
```

#### Warning Toast
```typescript
showWarningToast("Bạn có 3 lần thử còn lại")
```

#### Loading Toast
```typescript
const loadingToast = showLoadingToast("Đang xử lý...")

// After async operation completes
dismissToast(loadingToast)
showSuccessToast("Hoàn thành!")
```

### Advanced Usage

#### Promise-based Toast (Auto-update)
```typescript
import { toast } from "sonner"

toast.promise(
  fetchData(),
  {
    loading: "Đang tải...",
    success: "Tải thành công!",
    error: "Lỗi khi tải dữ liệu"
  }
)
```

#### Custom Actions
```typescript
import { toast } from "sonner"

toast.success("Email đã được gửi", {
  action: {
    label: "Xem lại",
    onClick: () => console.log("Viewing email")
  }
})
```

#### Confetti Only
```typescript
import { triggerConfetti } from "@/lib/toast-utils"

// Trigger confetti without toast
triggerConfetti()
```

## Configuration

### Toast Styling
Toast styles are configured in `components/ui/toaster.tsx`:
- Background: `#1a1a1a` (dark)
- Border: Golden `#FFD700/20` with glow on success
- Icons: Custom golden checkmark for success
- Duration: 4-5 seconds (configurable per toast)

### Confetti Settings
Confetti parameters in `lib/toast-utils.ts`:
- Colors: `#FFD369` (gold), `#B580FF` (purple), `#FFF7D1` (cream)
- Pattern: 4-burst sequence over 450ms
- Origin: Top-center of screen

## Migration from Old Toast System

### Before (shadcn/ui toast)
```typescript
import { useToast } from "@/hooks/use-toast"

const { toast } = useToast()
toast({
  title: "Success",
  description: "Your changes have been saved",
  variant: "success"
})
```

### After (Sonner)
```typescript
import { showSuccessToast } from "@/lib/toast-utils"

showSuccessToast("Your changes have been saved")
```

## Best Practices

1. **Use appropriate toast types**
   - Success: Confirmations, completions
   - Error: Failures, validation errors
   - Info: General information, tips
   - Warning: Cautions, deprecations
   - Loading: Async operations

2. **Keep messages concise**
   - Title: 3-5 words
   - Description: 1 sentence max

3. **Use confetti sparingly**
   - Only for major achievements
   - Don't overuse (reduces impact)

4. **Handle loading states**
   ```typescript
   const toastId = showLoadingToast("Saving...")
   try {
     await saveData()
     dismissToast(toastId)
     showSuccessToast("Saved!", { confetti: true })
   } catch (error) {
     dismissToast(toastId)
     showErrorToast("Failed to save")
   }
   ```

## Examples in Codebase

See these files for real examples:
- `components/Header.tsx` - Logout success/error toasts
- `lib/toast-utils.ts` - Toast utility functions
- `components/ui/toaster.tsx` - Toast configuration

## API Reference

### showSuccessToast(message, options?)
- `message`: string (required)
- `options.confetti`: boolean (optional, default: false)
- `options.description`: string (optional)

### showErrorToast(message, options?)
- `message`: string (required)
- `options.description`: string (optional)

### showInfoToast(message, options?)
- `message`: string (required)
- `options.description`: string (optional)

### showWarningToast(message, options?)
- `message`: string (required)
- `options.description`: string (optional)

### showLoadingToast(message)
- `message`: string (required)
- Returns: toast ID (use to dismiss later)

### dismissToast(toastId?)
- `toastId`: string | number (optional)
- If no ID provided, dismisses all toasts

### triggerConfetti()
- No parameters
- Triggers standalone confetti effect
