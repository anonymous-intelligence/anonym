import { createLazyFileRoute } from '@tanstack/react-router'
import Users from '@/modules/users'

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: Users,
})
