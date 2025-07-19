import { createFileRoute } from '@tanstack/react-router'
import SmsBomber from '@/modules/sms-bomber'

export const Route = createFileRoute('/_authenticated/sms-bomber/')({
  component: SmsBomber,
}) 