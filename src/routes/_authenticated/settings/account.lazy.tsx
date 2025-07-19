import { createLazyFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/modules/settings/account'

export const Route = createLazyFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
})
