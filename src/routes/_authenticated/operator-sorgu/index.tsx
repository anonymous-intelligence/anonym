import { createFileRoute } from '@tanstack/react-router'
import OperatorSorgu from '@/modules/operator-sorgu'

export const Route = createFileRoute('/_authenticated/operator-sorgu/')({
  component: OperatorSorgu,
}) 