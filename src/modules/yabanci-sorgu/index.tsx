import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopNav } from '@/components/layout/top-nav'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Main } from '@/components/layout/main'

export default function YabanciSorgu() {
  const topNav = [
    { title: 'Ana Sayfa', href: '/', isActive: false },
    { title: 'Yabancı Sorgu', href: '/yabanci-sorgu', isActive: true },
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
      <Main>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Yabancı Sorgu</h1>
          <p className="text-muted-foreground mt-2">Yabancı uyruklu kişiler için sorgu hizmeti</p>
          <Badge variant="secondary" className="mt-2">Yakında</Badge>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Yakında Hizmetinizde</CardTitle>
              <CardDescription>
                Yabancı uyruklu kişiler için gelişmiş sorgu sistemi yakında hizmetinizde olacak.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Pasaport numarası ile sorgu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Yabancı kimlik numarası sorgu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>İkamet izni sorgulama</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Çoklu ülke desteği</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
} 