import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAppearance from '@/modules/settings/appearance'

export const Route = createLazyFileRoute('/_authenticated/settings/appearance')(
  { component: SettingsAppearance }
)
