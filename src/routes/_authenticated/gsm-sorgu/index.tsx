import { createFileRoute } from '@tanstack/react-router'
import GsmSorgu from '@/modules/gsm-sorgu'

export const Route = createFileRoute('/_authenticated/gsm-sorgu/')({
  component: GsmSorgu,
}) 