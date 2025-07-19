import { createFileRoute } from '@tanstack/react-router'
import AdSoyadSorgu from '@/modules/adsoyad-sorgu'

export const Route = createFileRoute('/_authenticated/adsoyad-sorgu/')({
  component: AdSoyadSorgu,
}) 