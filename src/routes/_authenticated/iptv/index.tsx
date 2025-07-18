import { createFileRoute } from '@tanstack/react-router'
import IPTV from '@/modules/iptv'

export const Route = createFileRoute('/_authenticated/iptv/')({
  component: IPTV,
}) 