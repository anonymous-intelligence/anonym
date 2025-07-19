import { createFileRoute } from '@tanstack/react-router'
import AltyapiSorgu from '@/modules/altyapi-sorgu'

export const Route = createFileRoute('/_authenticated/altyapi-sorgu/')({
  component: AltyapiSorgu,
}) 