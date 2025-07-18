import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { Link } from '@tanstack/react-router'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='p-8 max-w-md mx-auto shadow-lg rounded-xl'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-bold tracking-tight'>Giriş Yap</h1>
          <p className='text-sm text-muted-foreground mt-2'>Hesabınıza erişmek için kullanıcı adı ve şifrenizi girin.</p>
        </div>
        <UserAuthForm />
        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Hesabınız yok mu?{' '}
          <Link to='/sign-up' className='underline underline-offset-4 hover:text-primary font-medium'>
            Kayıt Ol
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
