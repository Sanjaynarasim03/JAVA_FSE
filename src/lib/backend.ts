export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'

export interface ApiRequestOptions extends RequestInit {
  token?: string | null
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const token = options.token ?? getStoredToken()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
    cache: 'no-store',
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string'
      ? payload
      : payload?.detail || payload?.message || 'Request failed'
    throw new Error(message)
  }

  return payload as T
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('intelliinvest_token')
}

export function getStoredEmail(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('intelliinvest_email')
}

export function getStoredName(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('intelliinvest_name')
}
