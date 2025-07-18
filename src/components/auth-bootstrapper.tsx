import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

function AuthBootstrapper({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.auth.setUser)
  const setAccessToken = useAuthStore((s) => s.auth.setAccessToken)
  const setAuthLoaded = useAuthStore((s) => s.auth.setAuthLoaded)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAccessToken(token)
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser({
            accountNo: data.user._id || '',
            email: data.user.eposta || data.user.email || '',
            role: [data.user.role || 'user'],
            exp: 0,
            username: data.user.username || '',
            profilFoto: data.user.profilFoto || '',
          })
          setAuthLoaded(true)
        })
        .catch((_err) => {
          setUser(null)
          setAuthLoaded(true)
        })
    } else {
      setUser(null)
      setAuthLoaded(true)
    }
  }, [setUser, setAccessToken, setAuthLoaded])
  return <>{children}</>
}

export default AuthBootstrapper; 