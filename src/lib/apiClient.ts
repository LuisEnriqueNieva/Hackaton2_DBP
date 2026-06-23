const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function saveToken(token: string): void {
  localStorage.setItem('token', token)
}

export function clearToken(): void {
  localStorage.removeItem('token')
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Error ${res.status}`)
  }

  return res.json() as Promise<T>
}

// Distingue una request cancelada (AbortController) de un error real,
// para no mostrar estados de error cuando solo cancelamos una request obsoleta.
export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}