# Popup Components Guide

**Version:** 1.0
**Last Updated:** 2025-01-15

---

## 📚 Components

### 1. BasePopup - Reusable Confirmation Popup

**Location:** `/components/admin/BasePopup.tsx`

Universal popup component với nhiều variants và customization options.

#### Features

✅ **4 Variants** - info, warning, danger, success (với colors và icons khác nhau)
✅ **Animations** - Smooth fade + scale transitions
✅ **Loading State** - Built-in loading state cho confirm button
✅ **Custom Content** - Children prop để custom UI
✅ **Backdrop** - Click outside to close
✅ **Close Icon** - Optional close button
✅ **Responsive** - Mobile-friendly design

#### Props Interface

```tsx
interface BasePopupProps {
  isOpen: boolean              // Control popup visibility
  title: string                // Popup title
  description?: string         // Subtitle/description
  confirmLabel?: string        // Confirm button text (default: "Confirm")
  cancelLabel?: string         // Cancel button text (default: "Cancel")
  onConfirm: () => void       // Confirm handler
  onCancel: () => void        // Cancel/close handler
  variant?: "info" | "warning" | "danger" | "success"  // Default: "info"
  showCloseIcon?: boolean     // Show X button (default: true)
  width?: string              // Popup width (default: "420px")
  children?: ReactNode        // Custom content (overrides description)
  confirmDisabled?: boolean   // Disable confirm button
  confirmLoading?: boolean    // Show loading state
}
```

#### Variants

| Variant | Icon | Icon Color | Confirm Button |
|---------|------|------------|----------------|
| `info` | Info | Blue | Blue background |
| `warning` | AlertTriangle | Yellow | Yellow background |
| `danger` | AlertCircle | Red | Red background |
| `success` | CheckCircle | Green | Green background |

---

## 💡 Usage Examples

### Example 1: Basic Delete Confirmation

```tsx
import { useState } from "react"
import { BasePopup } from "@/home/admin"

function MyComponent() {
  const [showPopup, setShowPopup] = useState(false)

  const handleDelete = () => {
    // Delete logic here
    console.log("Item deleted")
    setShowPopup(false)
  }

  return (
    <>
      <button onClick={() => setShowPopup(true)}>
        Delete Item
      </button>

      <BasePopup
        isOpen={showPopup}
        title="Delete Item?"
        description="This action cannot be undone. Are you sure?"
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowPopup(false)}
      />
    </>
  )
}
```

### Example 2: Success Confirmation

```tsx
<BasePopup
  isOpen={showSuccess}
  title="Success!"
  description="Your changes have been saved successfully."
  variant="success"
  confirmLabel="OK"
  cancelLabel="Close"
  onConfirm={() => setShowSuccess(false)}
  onCancel={() => setShowSuccess(false)}
  showCloseIcon={false}
/>
```

### Example 3: Custom Content with Children

```tsx
<BasePopup
  isOpen={showPopup}
  title="Confirm Subscription"
  variant="info"
  confirmLabel="Subscribe"
  cancelLabel="Cancel"
  onConfirm={handleSubscribe}
  onCancel={() => setShowPopup(false)}
>
  <div className="space-y-3">
    <p className="text-white/80">You are about to subscribe to:</p>
    <div className="p-3 bg-white/5 rounded-lg">
      <p className="text-white font-semibold">Pro Plan</p>
      <p className="text-white/60 text-sm">$29/month</p>
    </div>
    <p className="text-white/60 text-xs">
      Billing starts immediately. Cancel anytime.
    </p>
  </div>
</BasePopup>
```

### Example 4: Async Operation with Loading

```tsx
function MyComponent() {
  const [showPopup, setShowPopup] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)

    try {
      await someAsyncOperation()
      toast.success("Operation completed")
      setShowPopup(false)
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <BasePopup
      isOpen={showPopup}
      title="Process Data"
      description="This may take a few seconds..."
      variant="info"
      confirmLabel="Process"
      cancelLabel="Cancel"
      onConfirm={handleConfirm}
      onCancel={() => setShowPopup(false)}
      confirmLoading={isProcessing}
    />
  )
}
```

---

## 🚪 LogoutConfirmPopup

**Location:** `/components/admin/LogoutConfirmPopup.tsx`

Pre-configured popup for logout confirmation.

### Features

✅ Pre-configured title and description
✅ Warning variant (yellow)
✅ Loading state support
✅ Clean, focused UI

### Props Interface

```tsx
interface LogoutConfirmPopupProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}
```

### Usage in Header Component

```tsx
import { useState } from "react"
import { LogoutConfirmPopup } from "@/home/admin"
import { logoutUser } from "@/lib/auth-utils"
import { toast } from "sonner"

function Header() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutPopup(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)

    try {
      const { success, error } = await logoutUser()

      if (!success) {
        toast.error(error || "Đăng xuất thất bại")
        return
      }

      toast.success("Đã đăng xuất thành công")
      setShowLogoutPopup(false)
      router.push('/')
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <button onClick={handleLogoutClick}>
        Logout
      </button>

      <LogoutConfirmPopup
        isOpen={showLogoutPopup}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutPopup(false)}
        isLoading={isLoggingOut}
      />
    </>
  )
}
```

---

## 🔐 Auth Utilities

**Location:** `/lib/auth-utils.ts`

### logoutUser()

Comprehensive logout function that:
- Signs out from Supabase
- Clears admin_token cookie
- Clears localStorage auth data
- Clears Supabase session storage

```tsx
import { logoutUser } from "@/lib/auth-utils"

const { success, error } = await logoutUser()

if (success) {
  // Logout successful
  console.log("User logged out")
} else {
  // Logout failed
  console.error("Logout error:", error)
}
```

### checkAuthStatus()

Check if user has valid Supabase session:

```tsx
import { checkAuthStatus } from "@/lib/auth-utils"

const isAuthenticated = await checkAuthStatus()
console.log("Is authenticated:", isAuthenticated)
```

### getCurrentUser()

Get current user from Supabase:

```tsx
import { getCurrentUser } from "@/lib/auth-utils"

const user = await getCurrentUser()
if (user) {
  console.log("Current user:", user.email)
}
```

---

## 🎨 Design System Alignment

All components follow **THEME_ADMIN.md** design system:

**Colors:**
- Background: `#1a1a1a` (dark neutral)
- Border: `border-white/10` (subtle)
- Text: `text-white` (primary), `text-white/70` (secondary)
- Variants: Blue, Yellow, Red, Green (semantic colors)

**Spacing:**
- Padding: `p-6` (24px)
- Gap: `gap-3` (12px)
- Border radius: `rounded-xl` (12px)

**Shadows:**
- Popup: `0 8px 24px rgba(0, 0, 0, 0.4)`
- Backdrop: `bg-black/60 backdrop-blur-sm`

**Animations:**
- Duration: `0.2s`
- Easing: Spring with damping
- Scale: `0.95 → 1.0`

---

## 📝 Creating Custom Popups

To create your own popup variant:

```tsx
import { BasePopup } from "@/home/admin"

interface MyCustomPopupProps {
  isOpen: boolean
  data: any
  onConfirm: () => void
  onCancel: () => void
}

export function MyCustomPopup({
  isOpen,
  data,
  onConfirm,
  onCancel
}: MyCustomPopupProps) {
  return (
    <BasePopup
      isOpen={isOpen}
      title="Custom Title"
      variant="info"
      confirmLabel="OK"
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {/* Custom content here */}
      <div className="space-y-3">
        <p>Custom content for: {data.name}</p>
        {/* More custom UI */}
      </div>
    </BasePopup>
  )
}
```

---

## ✅ Best Practices

### 1. State Management

```tsx
// ✅ Good - Separate states
const [showPopup, setShowPopup] = useState(false)
const [isLoading, setIsLoading] = useState(false)

// ❌ Bad - Combined state
const [popupState, setPopupState] = useState({ show: false, loading: false })
```

### 2. Error Handling

```tsx
// ✅ Good - Handle errors gracefully
const handleConfirm = async () => {
  setIsLoading(true)
  try {
    await operation()
    setShowPopup(false)
  } catch (error) {
    toast.error("Operation failed")
    // Keep popup open
  } finally {
    setIsLoading(false)
  }
}
```

### 3. Accessibility

```tsx
// ✅ Good - Descriptive labels
<BasePopup
  confirmLabel="Delete permanently"
  cancelLabel="Keep item"
  title="Delete confirmation"
  description="Item will be removed from database"
/>
```

### 4. Variant Selection

- `info` - General confirmations, neutral actions
- `warning` - Potentially reversible actions (logout, unsaved changes)
- `danger` - Irreversible destructive actions (delete, remove)
- `success` - Completion confirmations, success messages

---

## 🚀 Future Enhancements

Planned improvements:

- [ ] Auto-close timer option
- [ ] Multiple action buttons
- [ ] Progress bar for long operations
- [ ] Sound effects option
- [ ] Keyboard shortcuts (Enter = confirm, Esc = cancel)
- [ ] Stack multiple popups
- [ ] Custom animations

---

**Happy Coding! 🎉**
