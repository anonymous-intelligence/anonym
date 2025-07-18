import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

export function handleServerError(error: unknown) {
  let errMsg = 'Bir şeyler yanlış gitti!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'İçerik bulunamadı.'
  }

  if (error instanceof AxiosError) {
    errMsg = error.response?.data.title
  }

  toast({ variant: 'destructive', title: errMsg })
}
