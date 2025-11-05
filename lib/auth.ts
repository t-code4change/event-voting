import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE = "admin_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export interface AdminSession {
  isAuthenticated: boolean
  loginTime: number
}

export function setAdminSession() {
  const session: AdminSession = {
    isAuthenticated: true,
    loginTime: Date.now(),
  }

  cookies().set(ADMIN_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export function getAdminSession(): AdminSession | null {
  try {
    const sessionCookie = cookies().get(ADMIN_SESSION_COOKIE)
    if (!sessionCookie) return null

    const session: AdminSession = JSON.parse(sessionCookie.value)

    // Check if session is expired
    const now = Date.now()
    const sessionAge = now - session.loginTime
    if (sessionAge > SESSION_DURATION * 1000) {
      clearAdminSession()
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

export function clearAdminSession() {
  cookies().delete(ADMIN_SESSION_COOKIE)
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession()
  return session?.isAuthenticated === true
}
