import { createLazyFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/modules/errors/forbidden'

export const Route = createLazyFileRoute('/(errors)/403')({
  component: ForbiddenError,
})
