import { 
  IconShieldCog,
  IconUserCog,
  IconChalkboard,
  IconUser
} from '@tabler/icons-react'
import { UserStatus } from './schema'

export const callTypes = new Map<UserStatus, string>([
  ['aktif', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['pasif', 'bg-neutral-300/40 border-neutral-300'],
  ['davetli', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'askıda',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
])

export const userTypes = [
  {
    label: 'Admin',
    value: 'admin',
    icon: IconShieldCog,
  },
  {
    label: 'Yönetici',
    value: 'yonetici',
    icon: IconUserCog,
  },
  {
    label: 'Eğitmen',
    value: 'egitmen',
    icon: IconChalkboard,
  },
  {
    label: 'Öğrenci',
    value: 'ogrenci',
    icon: IconUser,
  },
] as const