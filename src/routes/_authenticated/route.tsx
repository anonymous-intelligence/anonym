import Cookies from 'js-cookie'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ForbiddenError from '@/modules/errors/forbidden'
import { allowedRolesMap } from './role-map'
import { useRouter } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  const auth = useAuthStore((s) => s.auth)
  const navigate = useNavigate()
  const router = useRouter()
  const currentPath = router.state.location.pathname

  const normalizedPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath
  const allowedRoles =
    allowedRolesMap[currentPath] ||
    allowedRolesMap[normalizedPath] ||
    allowedRolesMap[normalizedPath + '/']

  const setUser = useAuthStore((s) => s.auth.setUser)
  const setAuthLoaded = useAuthStore((s) => s.auth.setAuthLoaded)

  // 🌟 Yeni: Yüklenme kontrolü
  const [kontrolEdiliyor, setKontrolEdiliyor] = useState(true)
  const [yetkili, setYetkili] = useState<boolean | null>(null)

  // 🔄 Giriş yapılmış mı kontrolü
  useEffect(() => {
    if (auth.authLoaded) {
      if (!auth.accessToken || !auth.user) {
        navigate({ to: '/sign-in' })
      }
    }
  }, [auth, navigate])

  // Her route değişiminde auth.user'ı sıfırla ve tekrar yükle
  useEffect(() => {
    setUser(null)
    setAuthLoaded(false)
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://78.185.19.222:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser({
              accountNo: data.user._id || '',
              email: data.user.eposta || data.user.email || '',
              role: [data.user.role || 'user'],
              exp: 0,
              username: data.user.username || '',
              profilFoto: data.user.profilFoto || '',
            })
          } else {
            setUser(null)
          }
          setAuthLoaded(true)
        })
        .catch(() => {
          setUser(null)
          setAuthLoaded(true)
        })
    } else {
      setUser(null)
      setAuthLoaded(true)
    }
  }, [currentPath])

  // 🧠 Yetki kontrolü (dinamik olarak)
  useEffect(() => {
    if (!auth.authLoaded || !auth.user || !auth.user.role) {
      setKontrolEdiliyor(true)
      return
    }

    const yetkiliMi =
      !allowedRoles ||
      (auth.user.role && auth.user.role.some((r) => allowedRoles.includes(r)))

    setYetkili(yetkiliMi)
    setKontrolEdiliyor(false)
  }, [auth.authLoaded, auth.user, currentPath])

  // 🕓 Hâlâ yükleniyorsa veya yetkili state'i null ise loading göster
  if (kontrolEdiliyor || yetkili === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // 🚫 Yetkili değilse
  if (yetkili === false) {
    return <ForbiddenError />
  }

  // ✅ Sadece yetkili === true ise içerik render et
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})