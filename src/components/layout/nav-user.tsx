import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/authStore'
import { AuthUser } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '@/hooks/use-toast'

export function NavUser({ user }: { user: AuthUser | null }) {
  const { isMobile: _ } = useSidebar()
  const reset = useAuthStore((s) => s.auth.reset)
  const navigate = useNavigate()
  const handleLogout = () => {
    reset()
    toast({ title: 'Çıkış Yapıldı', description: 'Başarıyla çıkış yaptınız.' })
    navigate({ to: '/sign-in' })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-3'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.profilFoto} />
                <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-sm">{user?.username || 'Kullanıcı'}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
              <div>{user?.username || 'Kullanıcı'}</div>
              <div className='text-xs text-muted-foreground'>{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
              <LogOut />
              Çıkış Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
