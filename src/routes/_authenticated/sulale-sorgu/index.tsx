import { createFileRoute } from '@tanstack/react-router'
import SulaleSorgu from '@/modules/sulale-sorgu'

export const Route = createFileRoute('/_authenticated/sulale-sorgu/')({
  component: SulaleSorgu,
}) 