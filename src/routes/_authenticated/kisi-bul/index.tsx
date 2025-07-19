import { createFileRoute } from '@tanstack/react-router'
import KisiBul from '@/modules/kisi-bul'

export const Route = createFileRoute('/_authenticated/kisi-bul/')({
  component: KisiBul,
}) 