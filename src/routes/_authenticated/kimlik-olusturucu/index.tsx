import { createFileRoute } from '@tanstack/react-router'
import KimlikOlusturucu from '@/modules/kimlik-olusturucu'

export const Route = createFileRoute('/_authenticated/kimlik-olusturucu/')({
  component: KimlikOlusturucu,
}) 