import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useNavigate } from '@tanstack/react-router'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Kullanıcı adı en az 3 karakter olmalı' }),
    eposta: z
      .string()
      .min(1, { message: 'Lütfen e-posta adresinizi giriniz' })
      .email({ message: 'Geçersiz e-posta adresi' }),
    password: z
      .string()
      .min(1, {
        message: 'Lütfen şifrenizi giriniz',
      })
      .min(7, {
        message: 'Şifre en az 7 karakter olmalıdır',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ['confirmPassword'],
  })

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      eposta: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          eposta: data.eposta,
          password: data.password,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast({
          title: 'Kayıt Hatası',
          description: result.error || 'Kayıt başarısız',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }
      toast({
        title: 'Kayıt Başarılı',
        description: 'Hesabınız oluşturuldu. Giriş yapabilirsiniz.',
      })
      setIsLoading(false)
      form.reset()
      navigate({ to: '/sign-in' })
    } catch (_err) {
      toast({
        title: 'Sunucu Hatası',
        description: 'Sunucuya bağlanılamadı',
        variant: 'destructive',
      })
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
              name='eposta'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input placeholder='ornek@email.com' {...field} />
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
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Şifre Doğrula</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Hesap Oluştur
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Veya bunlar ile devam edin
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
                onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
              >
                <IconBrandGoogle className='h-4 w-4' /> Google
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
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
