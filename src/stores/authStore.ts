import { create } from 'zustand'

const ACCESS_TOKEN = 'token'

export interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  username: string
  profilFoto?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    authLoaded: boolean
    setAuthLoaded: (loaded: boolean) => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = localStorage.getItem(ACCESS_TOKEN) || ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) => {
        localStorage.setItem(ACCESS_TOKEN, accessToken)
        set((state) => ({ ...state, auth: { ...state.auth, accessToken } }))
      },
      resetAccessToken: () => {
        localStorage.removeItem(ACCESS_TOKEN)
        set((state) => ({ ...state, auth: { ...state.auth, accessToken: '' } }))
      },
      reset: () => {
        localStorage.removeItem(ACCESS_TOKEN)
        set((state) => ({ ...state, auth: { ...state.auth, user: null, accessToken: '' } }))
      },
      authLoaded: false,
      setAuthLoaded: (loaded) => set((state) => ({ ...state, auth: { ...state.auth, authLoaded: loaded } })),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
