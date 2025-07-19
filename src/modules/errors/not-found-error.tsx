import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Oops! Sayfa Bulunamadı!</span>
        <p className='text-center text-muted-foreground'>
          Aradığınız sayfa bulunamadı veya silinmiş olabilir. <br />
          Lütfen daha sonra tekrar deneyiniz.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Geri Dön
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Ana Sayfaya Dön</Button>
        </div>
      </div>
    </div>
  )
}
