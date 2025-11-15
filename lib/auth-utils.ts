import { createClient } from "@/lib/supabase/client"

/**
 * Logout user from Supabase and clear all auth data
 *
 * This function:
 * - Signs out from Supabase
 * - Clears admin_token cookie
 * - Clears any localStorage auth data
 * - Returns success/error status
 */
export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Supabase logout error:", error)
      return { success: false, error: error.message }
    }

    // Clear admin token cookie
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    // Clear any auth-related data from localStorage
    const authKeys = ['admin_token', 'user_session', 'auth_token']
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        // Ignore localStorage errors
      }
    })

    // Clear Supabase session from localStorage (Supabase uses this key)
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      // Ignore localStorage errors
    }

    return { success: true }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { success: false, error: error?.message || "Unknown error" }
  }
}

/**
 * Check if user is authenticated (has valid Supabase session)
 */
export async function checkAuthStatus(): Promise<boolean> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

/**
 * Get current user from Supabase
 */
export async function getCurrentUser() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}
