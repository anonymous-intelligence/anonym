import { createFileRoute } from '@tanstack/react-router'
import WexAIPage from '@/modules/wexai'

export const Route = createFileRoute('/_authenticated/wexai/')({
  component: WexAIPage,
}) 