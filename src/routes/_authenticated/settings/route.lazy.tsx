import { createLazyFileRoute } from '@tanstack/react-router'
import Settings from '@/modules/settings'

export const Route = createLazyFileRoute('/_authenticated/settings')({
  component: Settings,
})
