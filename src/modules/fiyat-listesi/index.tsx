import { Card, CardHeader, CardFooter, CardTitle, CardContent } from '@/components/ui/card'
import { TopNav } from '@/components/layout/top-nav'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'
import { CheckCircle2, Flame } from 'lucide-react'
import React from 'react'

export default function FiyatListesi() {
  const [activeTab, setActiveTab] = React.useState<'aylik' | 'yillik'>('aylik')

  const topNav = [
    { title: 'Ana Sayfa', href: '/', isActive: false },
    { title: 'Fiyat Listesi', href: '/fiyat-listesi', isActive: true },
  ]

  const plans = [
    {
      title: 'Temel',
      price: 'Ücretsiz',
      period: '',
      featured: false,
      dark: false,
      description: 'Sadece temel sorgular ve kısıtlı kullanım.',
      features: [
        'Günde 3 kişi sorgulama (TC, ad-soyad, adres, GSM, araç)',
        'Sülale ve aile sorgulama',
        'Kızlık soyadı ve ad-soyad sorgulama',
      ],
      button: 'Hemen Başla',
    },
    {
      title: 'Standart',
      price: '39₺',
      period: 'Aylık',
      featured: true,
      dark: false,
      description: 'Daha fazla sorgu ve ek araçlar.',
      features: [
        'Günde 50 kişi sorgulama (tüm standart sorgular)',
        'Gelişmiş aile, sülale, adres ve GSM sorgulama',
        'Araç ve kimlik oluşturucuya erişim',
        'Sorgu geçmişi ve istatistikler',
        'WexAI günlük 20 istek hakkı'
      ],
      button: 'Satın Al',
      badge: 'Popüler',
    },
    {
      title: 'Pro',
      price: '89₺',
      period: 'Aylık',
      featured: false,
      dark: false,
      description: 'VIP/PRO sorgular ve tüm araçlar.',
      features: [
        'Sınırsız kişi sorgulama (tüm standart + VIP/PRO)',
        'TC Pro Sorgu (sosyal medya, kredi kartı, araç, eğitim, iş, sağlık, maliye, online hesaplar)',
        'SMS Bomber VIP',
        'Canlı maç izleme',
        'Kimlik arşivi ve gelişmiş raporlar',
        'WexAI günlük 1000 istek hakkı'
      ],
      button: 'Pro Ol',
    },
    {
      title: 'Kurumsal',
      price: 'Özel',
      period: '',
      featured: false,
      dark: true,
      description: 'Okullar, kurumlar ve toplu kullanım için.',
      features: [
        'Sınırsız tüm sorgular ve araçlar',
        '10+ kullanıcı desteği',
        'Kurumsal destek ve entegrasyon',
        'Gelişmiş raporlama ve API erişimi',
      ],
      button: 'İletişime Geç',
    },
  ]

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      {/* Grid arka plan */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'linear-gradient(to bottom, white 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, white 60%, transparent 100%)',
          }}
        />
        {/* Dark mode için grid */}
        <div
          className="absolute inset-0 w-full h-full hidden dark:block"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%)',
          }}
        />
      </div>
      <Main>
        <div className="max-w-2xl mx-auto text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Fiyatlandırma</h1>
          <p className="text-muted-foreground text-base md:text-lg">Daha kaliteli araçlar ile daha iyi sorgular için abonelik satın alın.</p>
          {/* Segment tab grubu */}
          <div className="flex justify-center mt-6">
            <div className="flex bg-[#f3f4f6] dark:bg-zinc-800 rounded-full p-1 gap-1 shadow-inner">
              <button
                className={`px-5 py-2 font-semibold text-sm transition-colors ${
                  activeTab === 'aylik'
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm rounded-full'
                    : 'bg-transparent text-black dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full'
                }`}
                onClick={() => setActiveTab('aylik')}
              >
                Aylık
              </button>
              <button
                className={`px-5 py-2 font-semibold text-sm transition-colors ${
                  activeTab === 'yillik'
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm rounded-l-full rounded-none'
                    : 'bg-transparent text-black dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full'
                }`}
                style={activeTab === 'yillik' ? { marginRight: '-0.5rem', zIndex: 10 } : {}}
                onClick={() => setActiveTab('yillik')}
              >
                Yıllık
              </button>
              <button
                className={`px-5 py-2 font-semibold text-xs transition-colors ml-1 ${
                  activeTab === 'yillik'
                    ? 'bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm rounded-r-full rounded-none border-l border-gray-200 dark:border-zinc-700 -ml-2'
                    : 'bg-[#e5e7eb] dark:bg-zinc-700 text-black dark:text-zinc-200 rounded-full'
                }`}
                style={activeTab === 'yillik' ? { marginLeft: 0, zIndex: 9 } : {}}
                tabIndex={-1}
                disabled
              >
                35% Tasarruf
              </button>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto items-stretch px-2 md:px-0">
          {plans.map((plan, _i) => (
            <Card
              key={plan.title}
              className={`relative flex flex-col transition-all duration-200 px-6 py-8 sm:px-8 md:px-10 rounded-2xl border shadow-lg h-full w-full bg-card text-card-foreground border-gray-200 dark:border-zinc-700 ${
                plan.featured
                  ? 'border-primary ring-2 ring-primary scale-105 z-10'
                  : plan.dark
                  ? 'bg-black text-white dark:bg-white dark:text-black border-zinc-700'
                  : ''
              }`}
              style={{ minHeight: 370, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}
            >
              {plan.badge && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white dark:border-zinc-800 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 text-white select-none" style={{letterSpacing: '0.5px'}}>
                  <Flame className="w-5 h-5 text-white drop-shadow" /> {plan.badge}
                </span>
              )}
              <CardHeader className="mb-0 items-start p-0">
                <CardTitle className={`text-xl font-bold mb-6 ${plan.dark ? 'text-white dark:text-black' : 'text-foreground dark:text-white'}`}>{plan.title}</CardTitle>
              </CardHeader>
              <div className="flex flex-col gap-2 mb-2">
                <span className={`${plan.price === 'Free' || plan.price === 'Custom' ? 'text-4xl' : 'text-4xl md:text-5xl'} font-semibold ${plan.dark ? 'text-white dark:text-black' : 'text-foreground dark:text-white'}`}>{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.dark ? 'text-white dark:text-black' : 'text-muted-foreground dark:text-zinc-300'}`}>{plan.period}</span>}
                {plan.description && <span className={`text-sm mt-2 mb-1 ${plan.dark ? 'text-white dark:text-black' : 'text-muted-foreground dark:text-zinc-400'}`}>{plan.description}</span>}
              </div>
              <CardContent className="flex-1 flex flex-col justify-between p-0">
                <ul className={`space-y-2 mt-2 mb-6 ${plan.dark ? 'text-white dark:text-black' : 'text-foreground dark:text-zinc-200'}`}> 
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 ${plan.dark ? 'text-white dark:text-black' : 'text-green-500'}`} /> {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-0 mt-auto">
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-colors duration-150 text-base mt-2 cursor-pointer ${
                    plan.dark
                      ? 'bg-white text-black hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-zinc-900'
                      : 'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'
                  }`}
                  disabled
                >
                  {plan.button}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
} 