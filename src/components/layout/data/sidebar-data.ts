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
        },
        {
          title: 'Kişi Sorgu',
          url: '/kisi-sorgu',
          icon: IconUser,
          badge: 'Yeni',
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
        },
        {
          title: 'Sülale Sorgu',
          url: '/sulale-sorgu',
          icon: UsersIcon,
        },
        {
          title: 'Yabancı Sorgu',
          url: '/yabanci-sorgu',
          icon: Database,
          badge: 'Yakında',
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
        },
        {
          title: 'Operatör Sorgu',
          url: '/operator-sorgu',
          icon: Phone,
        },
        {
          title: 'Sms Bomber VIP',
          url: '/sms-bomber',
          icon: Wrench,
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
        },
        {
          title: 'Kimlik Oluşturucu',
          url: '/kimlik-olusturucu',
          icon: Wrench,
        },
        {
          title: 'Kimlik Arşivi',
          url: '/kimlik-arsivi',
          icon: Wrench,
        },
        {
          title: 'Azeri Kimlik Arşivi',
          url: '/azerbeycan-kimlik',
          icon: Wrench,
        },
        {
          title: 'Altyapı Sorgu',
          url: '/altyapi-sorgu',
          icon: Wrench,
        },
        {
          title: 'Bin Sorgu',
          url: '/bin-sorgu',
          icon: Wrench,
        },
        {
          title: 'Dns + Domain Sorgu',
          url: '/dns-domain-sorgu',
          icon: Wrench,
        },
        {
          title: 'IPTV Kanalları',
          url: '/iptv',
          icon: Tv,
          badge: 'Yeni',
        }
      ],
    }
  ],
}
