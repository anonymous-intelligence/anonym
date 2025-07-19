import { createFileRoute } from '@tanstack/react-router'
import AzerbeycanKimlik from '@/modules/azerbeycan-kimlik'

export const Route = createFileRoute('/_authenticated/azerbeycan-kimlik/')({
  component: AzerbeycanKimlik,
}) 