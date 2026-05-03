export interface AuthSession {
  access_token: string
  token_type: 'bearer'
  email: string
  name?: string
}

export function persistAuthSession(session: AuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem('intelliinvest_token', session.access_token)
  window.localStorage.setItem('intelliinvest_email', session.email)
  if (session.name) {
    window.localStorage.setItem('intelliinvest_name', session.name)
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem('intelliinvest_token')
  window.localStorage.removeItem('intelliinvest_email')
  window.localStorage.removeItem('intelliinvest_name')
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const accessToken = window.localStorage.getItem('intelliinvest_token')
  const email = window.localStorage.getItem('intelliinvest_email')
  if (!accessToken || !email) {
    return null
  }

  return {
    access_token: accessToken,
    token_type: 'bearer',
    email,
    name: window.localStorage.getItem('intelliinvest_name') ?? undefined,
  }
}
