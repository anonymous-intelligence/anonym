import { createFileRoute } from '@tanstack/react-router'
import KimlikArsivi from '@/modules/kimlik-arsivi'

export const Route = createFileRoute('/_authenticated/kimlik-arsivi/')({
  component: KimlikArsivi,
}) 