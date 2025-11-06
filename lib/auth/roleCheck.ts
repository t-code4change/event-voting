import { createClient } from "@/lib/supabase/server"
import { UserRole } from "@/types/subscription"

/**
 * Check if the current user has the required role
 * @param requiredRole - The minimum role required ('user', 'admin', or 'super_admin')
 * @returns { authorized: boolean, user: User | null, userRole: UserRole | null }
 */
export async function checkUserRole(requiredRole: UserRole = "user") {
  try {
    const supabase = createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        authorized: false,
        user: null,
        userRole: null,
        error: "Not authenticated",
      }
    }

    // Get user role from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, is_active")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return {
        authorized: false,
        user,
        userRole: null,
        error: "User data not found",
      }
    }

    if (!userData.is_active) {
      return {
        authorized: false,
        user,
        userRole: userData.role,
        error: "User account is inactive",
      }
    }

    // Define role hierarchy
    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      admin: 2,
      super_admin: 3,
    }

    const userRoleLevel = roleHierarchy[userData.role as UserRole] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0

    const authorized = userRoleLevel >= requiredRoleLevel

    return {
      authorized,
      user,
      userRole: userData.role as UserRole,
      error: authorized ? null : "Insufficient permissions",
    }
  } catch (error) {
    console.error("Error checking user role:", error)
    return {
      authorized: false,
      user: null,
      userRole: null,
      error: "Internal server error",
    }
  }
}

/**
 * Middleware to check if user is admin or super_admin
 */
export async function requireAdmin() {
  return checkUserRole("admin")
}

/**
 * Middleware to check if user is super_admin
 */
export async function requireSuperAdmin() {
  return checkUserRole("super_admin")
}

/**
 * Check if user can perform action based on resource ownership and role
 */
export async function canAccessResource(
  resourceUserId: string,
  requiredRole: UserRole = "user"
) {
  const { authorized, user, userRole } = await checkUserRole(requiredRole)

  if (!authorized || !user) {
    return false
  }

  // Super admin can access everything
  if (userRole === "super_admin") {
    return true
  }

  // Admin can access everything except super admin resources
  if (userRole === "admin") {
    return true
  }

  // Regular user can only access their own resources
  return user.id === resourceUserId
}
