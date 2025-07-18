import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'
import { Link } from '@tanstack/react-router'

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className='p-8 max-w-md mx-auto shadow-lg rounded-xl'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-bold tracking-tight'>Hesap Oluştur</h1>
          <p className='text-sm text-muted-foreground mt-2'>Yeni bir hesap oluşturmak için bilgilerinizi girin.</p>
        </div>
        <SignUpForm />
        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Zaten hesabınız var mı?{' '}
          <Link to='/sign-in' className='underline underline-offset-4 hover:text-primary font-medium'>
            Giriş Yap
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
