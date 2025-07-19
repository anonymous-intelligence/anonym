import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import { jwtDecode } from 'jwt-decode'
import { useToast } from '@/hooks/use-toast'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((s) => s.auth.setAccessToken)
  const setUser = useAuthStore((s) => s.auth.setUser)
  const { toast } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setAccessToken(token)
      localStorage.setItem('token', token)
      // JWT'den kullanıcıyı decode et ve store'a yaz
      try {
        const decoded = jwtDecode(token) as Record<string, unknown>;
        setUser({
          accountNo: typeof decoded.userId === 'string' ? decoded.userId : '',
          email: typeof decoded.eposta === 'string' ? decoded.eposta : (typeof decoded.email === 'string' ? decoded.email : ''),
          role: Array.isArray(decoded.role) ? decoded.role as string[] : (decoded.role ? [decoded.role as string] : ['user']),
          exp: typeof decoded.exp === 'number' ? decoded.exp : 0,
          username: typeof decoded.username === 'string' ? decoded.username : '',
        })
        toast({
          title: `Hoşgeldin ${typeof decoded.username === 'string' ? decoded.username : (typeof decoded.eposta === 'string' ? decoded.eposta : 'kullanıcı')}!`,
          description: 'Başarıyla giriş yaptınız.',
        })
        setTimeout(() => {
          navigate({ to: '/' })
        }, 2500)
      } catch (_e: unknown) {
        // decode hatası olursa kullanıcıyı set etme
      }
    }
  }, [setAccessToken, setUser, navigate, toast])

  return (
    <div className='flex justify-center items-center min-h-screen text-lg'>
      Google ile giriş yapılıyor...
    </div>
  )
} 