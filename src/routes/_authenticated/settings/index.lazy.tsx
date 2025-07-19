import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsProfile from '@/modules/settings/profile'

export const Route = createLazyFileRoute('/_authenticated/settings/')({
  component: SettingsProfile,
})
