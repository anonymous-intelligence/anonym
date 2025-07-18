import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function ForbiddenError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>403</h1>
        <span className='font-medium'>Erişim Engellendi</span>
        <p className='text-center text-muted-foreground'>
          Bu kaynağı görüntülemek için gerekli izni yok. <br />
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
