import { createFileRoute } from '@tanstack/react-router'
import FiyatListesi from '@/modules/fiyat-listesi'

export const Route = createFileRoute('/_authenticated/fiyat-listesi/')({
  component: FiyatListesi,
}) 