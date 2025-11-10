"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/store/store"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setUser, setToken, setLoading, clearAuth } from "@/store/slices/authSlice"
import { supabase } from "@/lib/supabase"

// Session verification component
function SessionVerifier({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Verify session on mount
    const verifySession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          dispatch(clearAuth())
          return
        }

        if (session?.user) {
          // Valid session found
          dispatch(setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            phone: session.user.user_metadata?.phone,
          }))
          dispatch(setToken(session.access_token))

          // Update admin token cookie
          document.cookie = `admin_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`
        } else {
          // No valid session
          dispatch(clearAuth())
        }
      } catch (error) {
        console.error('Error verifying session:', error)
        dispatch(clearAuth())
      } finally {
        dispatch(setLoading(false))
      }
    }

    verifySession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          phone: session.user.user_metadata?.phone,
        }))
        dispatch(setToken(session.access_token))

        // Update admin token cookie
        document.cookie = `admin_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearAuth())
      } else if (event === 'TOKEN_REFRESHED' && session) {
        dispatch(setToken(session.access_token))

        // Update admin token cookie
        document.cookie = `admin_token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  return <>{children}</>
}

// Wrapper component that uses hooks
function ReduxProviderContent({ children }: { children: React.ReactNode }) {
  return (
    <SessionVerifier>
      {children}
    </SessionVerifier>
  )
}

// Main Redux Provider component
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReduxProviderContent>
          {children}
        </ReduxProviderContent>
      </PersistGate>
    </Provider>
  )
}
