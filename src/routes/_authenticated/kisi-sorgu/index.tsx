import { createFileRoute } from '@tanstack/react-router'
import KisiSorgu from '@/modules/kisi-sorgu'

export const Route = createFileRoute('/_authenticated/kisi-sorgu/')({
  component: KisiSorgu,
}) 