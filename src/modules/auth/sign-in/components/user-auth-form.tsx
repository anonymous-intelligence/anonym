import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from '@tanstack/react-router'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Kullanıcı adı en az 3 karakter olmalı' }),
  password: z
    .string()
    .min(1, {
      message: 'Lütfen şifrenizi giriniz',
    })
    .min(7, {
      message: 'Şifre en az 7 karakter olmalıdır',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const setAccessToken = useAuthStore((s) => s.auth.setAccessToken)
  const setUser = useAuthStore((s) => s.auth.setUser)
  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch('http://78.185.19.222:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username, password: data.password }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({ title: 'Giriş Hatası', description: result.error || 'Giriş başarısız', variant: 'destructive' })
        setIsLoading(false)
        return
      }
      // Token'ı kaydet
      localStorage.setItem('token', result.token)
      setAccessToken(result.token)
      setUser(result.user)
      toast({ title: 'Giriş Başarılı', description: `Hoşgeldin, ${result.user.username}` })
      setIsLoading(false)
      form.reset()
      navigate({ to: '/' })
    } catch (_err) {
      toast({ title: 'Sunucu Hatası', description: 'Sunucuya bağlanılamadı', variant: 'destructive' })
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder='kullaniciadi' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Şifre</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Şifrenizi mi unuttunuz?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Giriş Yap
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Veya bunlar ile giriş yapın
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
                onClick={() => window.location.href = 'http://78.185.19.222:5000/api/auth/google'}
              >
                <IconBrandGoogle className='h-4 w-4' /> Google
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
                onClick={() => window.location.href = 'http://78.185.19.222:5000/api/auth/facebook'}
              >
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
