import { createFileRoute } from '@tanstack/react-router'
import Panel from '@/modules/panel'

export const Route = createFileRoute('/_authenticated/')({
  component: Panel,
})
