import { createLazyFileRoute } from '@tanstack/react-router'
import NotFoundError from '@/modules/errors/not-found-error'

export const Route = createLazyFileRoute('/(errors)/404')({
  component: NotFoundError,
})
