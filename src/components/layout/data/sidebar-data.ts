import {
  IconLayoutDashboard,
  IconRobot,
  IconSearch,
  IconUser
} from '@tabler/icons-react'
import { Target, DollarSign, Users as UsersIcon, Database, Phone, Wrench, Tv } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Anonymous',
    email: 'user@anonymous.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Anonymous Intelligence',
      logo: Target,
      plan: 'Anonymous',
    }
  ],
  navGroups: [
    {
      title: 'Genel',
      items: [
        {
          title: 'Anasayfa',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'WexAI',
          url: '/wexai',
          icon: IconRobot,
          badge: 'Yeni',
          allowedRoles: ['admin', 'premium'],
        },
        {
          title: 'Fiyat Listesi',
          url: '/fiyat-listesi',
          icon: DollarSign,
          badge: 'İndirim'
        },
      ],
    },
    {
      title: 'Kişi Sorgu',
      items: [
        {
          title: 'Kişi Bul',
          url: '/kisi-bul',
          icon: IconSearch,
          badge: 'Yeni',
          allowedRoles: ['admin', 'premium'],
        },
        {
          title: 'Kişi Sorgu',
          url: '/kisi-sorgu',
          icon: IconUser,
          badge: 'Yeni',
          allowedRoles: ['admin', 'premium'],
        }
      ],
    },
    {
      title: 'Genel Sorgu',
      items: [
        {
          title: 'Ad Soyad Sorgu',
          url: '/adsoyad-sorgu',
          icon: IconUser,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Sülale Sorgu',
          url: '/sulale-sorgu',
          icon: UsersIcon,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Yabancı Sorgu',
          url: '/yabanci-sorgu',
          icon: Database,
          badge: 'Yakında',
          allowedRoles: ['admin', 'premium'],
        },
      ],
    },
    {
      title: 'Telefon',
      items: [
        {
          title: 'Telefon Sorgu',
          url: '/gsm-sorgu',
          icon: Phone,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Operatör Sorgu',
          url: '/operator-sorgu',
          icon: Phone,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Sms Bomber VIP',
          url: '/sms-bomber',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
      ]
    },
    {
      title: 'Araçlar',
      items: [
        {
          title: 'İp Sorgu',
          url: '/bin-sorgu',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Kimlik Oluşturucu',
          url: '/kimlik-olusturucu',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Kimlik Arşivi',
          url: '/kimlik-arsivi',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Azeri Kimlik Arşivi',
          url: '/azerbeycan-kimlik',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Altyapı Sorgu',
          url: '/altyapi-sorgu',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'Bin Sorgu',
          url: '/bin-sorgu',
          icon: Wrench,
          allowedRoles: ['admin', 'premium'],
        },
        {
          title: 'Dns + Domain Sorgu',
          url: '/dns-domain-sorgu',
          icon: Wrench,
          allowedRoles: ['admin', 'premium', 'user'],
        },
        {
          title: 'IPTV Kanalları',
          url: '/iptv',
          icon: Tv,
          badge: 'Yeni',
          allowedRoles: ['admin', 'premium'],
        }
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          title: 'Kullanıcılar',
          url: '/users',
          icon: UsersIcon,
          allowedRoles: ['admin'],
        }
      ],
    }
  ],
}
