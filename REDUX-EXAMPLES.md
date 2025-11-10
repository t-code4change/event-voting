# Redux Usage Examples

## Common Use Cases

### 1. Creating a Protected Page

```typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"

export default function ProtectedPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // User is not authenticated, open login modal
      dispatch(openLoginModal({
        postLoginAction: 'dashboard',
        redirectPath: '/protected-page'
      }))
      router.push('/')
    }
  }, [isAuthenticated, loading, router, dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <div>Protected Content</div>
}
```

### 2. Creating a Login Button

```typescript
"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { logout } from "@/store/slices/authSlice"
import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span>Hello, {user?.email}</span>
        <Button onClick={() => dispatch(logout())}>
          Logout
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => dispatch(openLoginModal({
      postLoginAction: 'dashboard',
      redirectPath: '/dashboard'
    }))}>
      Login
    </Button>
  )
}
```

### 3. Creating a Purchase Flow

```typescript
"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal, openPaymentModal } from "@/store/slices/modalSlice"
import { Button } from "@/components/ui/button"

export default function PurchaseButton({ plan }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const handlePurchase = () => {
    if (isAuthenticated) {
      // User is logged in, show payment modal
      dispatch(openPaymentModal({
        name: plan.name,
        price: plan.price,
        description: plan.description
      }))
    } else {
      // User is not logged in, show login modal with payment intent
      dispatch(openLoginModal({
        postLoginAction: 'payment',
        redirectPath: window.location.pathname
      }))
    }
  }

  return (
    <Button onClick={handlePurchase}>
      Purchase {plan.name}
    </Button>
  )
}
```

### 4. Displaying User Profile

```typescript
"use client"

import { useAppSelector } from "@/store/hooks"

export default function UserProfile() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return <div>Please log in to view your profile</div>
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      {user.name && <p>Name: {user.name}</p>}
      {user.phone && <p>Phone: {user.phone}</p>}
    </div>
  )
}
```

### 5. Custom Hook for Protected Routes

```typescript
// hooks/useRequireAuth.ts
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"

export function useRequireAuth(redirectPath: string = '/') {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      dispatch(openLoginModal({
        postLoginAction: 'dashboard',
        redirectPath: window.location.pathname
      }))
      router.push(redirectPath)
    }
  }, [isAuthenticated, loading, router, dispatch, redirectPath])

  return { isAuthenticated, loading }
}

// Usage in a page:
export default function AdminPage() {
  const { isAuthenticated, loading } = useRequireAuth('/')

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return null

  return <div>Admin Content</div>
}
```

### 6. Conditional Rendering Based on Auth

```typescript
"use client"

import { useAppSelector } from "@/store/hooks"

export default function ConditionalContent() {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome back, {user?.email}!</h1>
          <p>You have access to premium features</p>
        </div>
      ) : (
        <div>
          <h1>Welcome, Guest!</h1>
          <p>Please log in to access premium features</p>
        </div>
      )}
    </div>
  )
}
```

### 7. Opening Register Modal

```typescript
"use client"

import { useAppDispatch } from "@/store/hooks"
import { openRegisterModal } from "@/store/slices/modalSlice"
import { Button } from "@/components/ui/button"

export default function RegisterButton() {
  const dispatch = useAppDispatch()

  return (
    <Button onClick={() => dispatch(openRegisterModal())}>
      Create Account
    </Button>
  )
}
```

### 8. Switching Between Login and Register

```typescript
"use client"

import { useAppDispatch } from "@/store/hooks"
import { switchToLogin, switchToRegister } from "@/store/slices/modalSlice"

// Inside LoginModal component:
<button onClick={() => dispatch(switchToRegister())}>
  Don't have an account? Register
</button>

// Inside RegisterModal component:
<button onClick={() => dispatch(switchToLogin())}>
  Already have an account? Login
</button>
```

### 9. Accessing Token for API Calls

```typescript
"use client"

import { useAppSelector } from "@/store/hooks"

export default function DataFetcher() {
  const { token, isAuthenticated } = useAppSelector((state) => state.auth)

  const fetchData = async () => {
    if (!isAuthenticated || !token) {
      console.error('Not authenticated')
      return
    }

    const response = await fetch('/api/protected-endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return data
  }

  return (
    <button onClick={fetchData}>
      Fetch Protected Data
    </button>
  )
}
```

### 10. Complete Example: Event Creation Flow

```typescript
"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { openLoginModal } from "@/store/slices/modalSlice"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function CreateEventButton() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const handleCreateEvent = () => {
    if (isAuthenticated) {
      // User is logged in, go to dashboard
      router.push('/admin/dashboard')
    } else {
      // User is not logged in, open login modal
      // After login, user will be redirected to dashboard
      dispatch(openLoginModal({
        postLoginAction: 'create-event',
        redirectPath: '/admin/dashboard'
      }))
    }
  }

  return (
    <Button onClick={handleCreateEvent}>
      {isAuthenticated ? 'Go to Dashboard' : 'Login to Create Event'}
    </Button>
  )
}
```

## Modal State Management

### Check if a Modal is Open

```typescript
const { activeModal } = useAppSelector((state) => state.modal)

if (activeModal === 'login') {
  console.log('Login modal is open')
}
```

### Close All Modals

```typescript
import { closeModal } from "@/store/slices/modalSlice"

dispatch(closeModal())
```

### Get Post-Login Action

```typescript
const { postLoginAction, redirectPath } = useAppSelector((state) => state.modal)

console.log('After login:', postLoginAction, 'redirect to:', redirectPath)
```

## Best Practices

1. **Always check loading state** before checking isAuthenticated
2. **Use typed hooks** (useAppDispatch, useAppSelector) instead of plain Redux hooks
3. **Dispatch actions** instead of directly manipulating state
4. **Clear sensitive data** on logout using the logout action
5. **Use post-login actions** to guide users after authentication
6. **Store minimal data** in Redux (only what needs to be global)
7. **Let Redux Persist** handle localStorage automatically
8. **Check token validity** before making API calls

## Debugging

### View Redux State in Console

```typescript
import { store } from "@/store/store"

console.log('Current Redux State:', store.getState())
console.log('Auth State:', store.getState().auth)
console.log('Modal State:', store.getState().modal)
```

### Check if Session is Valid

```typescript
import { supabase } from "@/lib/supabase"

const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  console.log('Supabase Session:', session)
  console.log('Error:', error)
}
```

### Clear Redux Persist Storage (for testing)

```typescript
// Open browser console and run:
localStorage.removeItem('persist:root')
// Then reload the page
```
