import { createFileRoute } from '@tanstack/react-router'
import DnsDomainSorgu from '@/modules/dns-domain-sorgu'

export const Route = createFileRoute('/_authenticated/dns-domain-sorgu/')({
  component: DnsDomainSorgu,
}) 