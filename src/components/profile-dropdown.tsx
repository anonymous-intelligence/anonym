import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function ProfileDropdown() {
  const user = useAuthStore((s) => s.auth.user)
  const reset = useAuthStore((s) => s.auth.reset)
  const navigate = useNavigate()
  const handleLogout = () => {
    reset()
    toast({ title: 'Çıkış Yapıldı', description: 'Başarıyla çıkış yaptınız.' })
    navigate({ to: '/sign-in' })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.profilFoto} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user?.username || 'Kullanıcı'}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem asChild key={user?.username}>
                <div className='flex items-center space-x-2'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={user?.profilFoto} alt={user?.username} />
                    <AvatarFallback>{user?.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-medium'>{user?.username}</p>
                    <p className='text-xs text-muted-foreground'>{user?.role}</p>
                  </div>
                </div>
            </DropdownMenuItem>
          {/* Diğer menü elemanları eklenebilir */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className='text-red-600'>
          <LogOut className='mr-2 h-4 w-4' /> Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
