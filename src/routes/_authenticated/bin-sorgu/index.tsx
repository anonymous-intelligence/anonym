import { createFileRoute } from '@tanstack/react-router'
import BinSorgu from '@/modules/bin-sorgu'

export const Route = createFileRoute('/_authenticated/bin-sorgu/')({
  component: BinSorgu,
}) 