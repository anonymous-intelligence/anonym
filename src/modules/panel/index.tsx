import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as SearchIcon, TrendingUp, UserCheck, Eye, Fingerprint, CheckCircle, XCircle, Phone, Star, Bell, AlertCircle } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts'

import React, { useState } from 'react';
import { Loader2 } from "lucide-react"
import { useToast } from '@/hooks/use-toast';

// Grafik verileri
const activityData = [
  { name: 'Pzt', sorgular: 1200, vip: 300 },
  { name: 'Sal', sorgular: 1500, vip: 400 },
  { name: 'Çar', sorgular: 1800, vip: 500 },
  { name: 'Per', sorgular: 2000, vip: 600 },
  { name: 'Cum', sorgular: 1800, vip: 450 },
  { name: 'Cmt', sorgular: 1500, vip: 350 },
  { name: 'Paz', sorgular: 1200, vip: 250 },
];

const categoryData = [
  { name: 'Kişi Sorguları', value: 45, color: '#3b82f6' },
  { name: 'VIP Sorgular', value: 25, color: '#f59e0b' },
  { name: 'Araç Sorguları', value: 15, color: '#10b981' },
  { name: 'Telefon Sorguları', value: 10, color: '#8b5cf6' },
  { name: 'Diğer', value: 5, color: '#f97316' },
];

const popularQueriesData = [
  { name: 'TC Sorgu', count: 2847, growth: 12, icon: Fingerprint, color: 'blue' },
  { name: 'Ad Soyad Sorgu', count: 1923, growth: 8, icon: UserCheck, color: 'green' },
  { name: 'GSM Sorgu', count: 1456, growth: 15, icon: Phone, color: 'purple' },
];

export default function Panel() {
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
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Anonymous Intelligence</h1>
          <p className='text-muted-foreground mt-2'>
            Kişi bilgilerini sorgulayın ve istatistikleri görüntüleyin
          </p>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Sorgu</CardTitle>
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+18%</span> geçen aya göre
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarılı Sorgu</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,987</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> geçen aya göre
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Sorgular</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,247</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+25%</span> geçen aya göre
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3%</span> geçen aya göre
              </p>
            </CardContent>
          </Card>
        </div>
        


        {/* Ana İçerik */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          {/* Sol Taraf - Detaylı İçerik */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            {/* Günlük Aktivite */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Günlük Aktivite</CardTitle>
                <CardDescription className="text-sm">
                  Son 7 günün sorgu aktivitesi
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <defs>
                        <linearGradient id="colorSorgular" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorVip" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="sorgular" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        fill="url(#colorSorgular)"
                        name="Toplam Sorgular"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="vip" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        fill="url(#colorVip)"
                        name="VIP Sorgular"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Duyurular Tablosu (Modern, Profesyonel) */}
            <Card>
              <CardHeader>
                <CardTitle>Duyurular</CardTitle>
                <CardDescription>En son sistem duyuruları ve güncellemeler</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"> </TableHead>
                      <TableHead>Başlık</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>Tarih</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell><Bell className="h-5 w-5 text-blue-600" /></TableCell>
                      <TableCell className="font-semibold">Yeni Özellik: Hızlı Sorgu</TableCell>
                      <TableCell>Artık ana sayfadan hızlıca sorgu yapabilirsiniz.</TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">2 saat önce</span></TableCell>
                      <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Bilgilendirme</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><CheckCircle className="h-5 w-5 text-green-600" /></TableCell>
                      <TableCell className="font-semibold">Sistem Güncellemesi</TableCell>
                      <TableCell>Veritabanı performansı iyileştirildi.</TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">Dün</span></TableCell>
                      <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Başarılı</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><AlertCircle className="h-5 w-5 text-yellow-600" /></TableCell>
                      <TableCell className="font-semibold">Planlı Bakım</TableCell>
                      <TableCell>15 Haziran 2024 tarihinde kısa süreli bakım yapılacaktır.</TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">3 gün önce</span></TableCell>
                      <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Uyarı</span></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><XCircle className="h-5 w-5 text-red-600" /></TableCell>
                      <TableCell className="font-semibold">Geçici Erişim Sorunu</TableCell>
                      <TableCell>Bazı sorgu türlerinde geçici kesinti yaşanabilir.</TableCell>
                      <TableCell><span className="text-xs text-muted-foreground">5 gün önce</span></TableCell>
                      <TableCell><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Kritik</span></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Son Sorgular Tablosu */}
            <Card>
              <CardHeader>
                <CardTitle>Son Sorgular</CardTitle>
                <CardDescription>
                  Son yapılan sorguların detaylı listesi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Sorgu Türü</TableHead>
                        <TableHead className="hidden md:table-cell">Kullanıcı</TableHead>
                        <TableHead>Sonuç</TableHead>
                        <TableHead className="hidden sm:table-cell">Durum</TableHead>
                        <TableHead>İşlem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-xs">2024-01-15 14:30</TableCell>
                        <TableCell>TC Sorgu</TableCell>
                        <TableCell className="hidden md:table-cell">user123</TableCell>
                        <TableCell>Bulundu</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Başarılı
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs">2024-01-15 14:25</TableCell>
                        <TableCell>Ad Soyad Pro</TableCell>
                        <TableCell className="hidden md:table-cell">vip_user</TableCell>
                        <TableCell>Bulundu</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            VIP
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs">2024-01-15 14:20</TableCell>
                        <TableCell>GSM Sorgu</TableCell>
                        <TableCell className="hidden md:table-cell">user456</TableCell>
                        <TableCell>Bulunamadı</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Başarısız
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-xs">2024-01-15 14:15</TableCell>
                        <TableCell>Plaka Sorgu</TableCell>
                        <TableCell className="hidden md:table-cell">admin_user</TableCell>
                        <TableCell>Bulundu</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            VIP
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>

            {/* Popüler Sorgular */}
            <Card>
              <CardHeader>
                <CardTitle>Popüler Sorgular</CardTitle>
                <CardDescription>
                  En çok kullanılan sorgu türleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularQueriesData.map((query, index) => {
                    const IconComponent = query.icon;
                    const colorClasses = {
                      blue: 'bg-blue-100 text-blue-600',
                      green: 'bg-green-100 text-green-600',
                      purple: 'bg-purple-100 text-purple-600'
                    };
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${colorClasses[query.color as keyof typeof colorClasses]}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{query.name}</p>
                            <p className="text-sm text-muted-foreground">Kimlik numarası ile arama</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{query.count.toLocaleString()}</p>
                          <p className="text-sm text-green-600">+{query.growth}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performans Metrikleri */}
            <Card>
              <CardHeader>
                <CardTitle>Sistem Performansı</CardTitle>
                <CardDescription>
                  Anlık sistem performans metrikleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CPU Kullanımı</span>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">RAM Kullanımı</span>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Disk Kullanımı</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Network</span>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - İstatistikler ve Sistem Durumu */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* Hızlı Sorgu */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Hızlı Sorgu</CardTitle>
                <CardDescription className="text-sm">
                  TC Kimlik ile 101M veritabanından anında sorgu yapın
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <QuickQuery />
              </CardContent>
            </Card>

            {/* Sorgu Kategorileri */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Sorgu Kategorileri</CardTitle>
                <CardDescription className="text-sm">
                  Kategori bazında sorgu dağılımı
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1 mt-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: category.color}}></div>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sistem Durumu */}
            <Card>
              <CardHeader>
                <CardTitle>Sistem Durumu</CardTitle>
                <CardDescription>
                  Anlık sistem performansı
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Yanıt Süresi</span>
                  <span className="text-sm font-medium text-green-600">125ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sistem Yükü</span>
                  <span className="text-sm font-medium text-yellow-600">%65</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Veritabanı</span>
                  <span className="text-sm font-medium text-green-600">Aktif</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Aktif Kullanıcı</span>
                  <span className="text-sm font-medium text-blue-600">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Son Güncelleme</span>
                  <span className="text-sm font-medium">2 dk önce</span>
                </div>
              </CardContent>
            </Card>

            {/* Son Kullanıcı Aktiviteleri */}
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
                <CardDescription>
                  Kullanıcı aktiviteleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">user123</p>
                    <p className="text-xs text-muted-foreground">TC Sorgu gerçekleştirdi</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 dk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">vip_user</p>
                    <p className="text-xs text-muted-foreground">VIP sorgu yaptı</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5 dk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">admin_user</p>
                    <p className="text-xs text-muted-foreground">Sistem ayarlarını güncelledi</p>
                  </div>
                  <span className="text-xs text-muted-foreground">10 dk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">user456</p>
                    <p className="text-xs text-muted-foreground">Yeni hesap oluşturdu</p>
                  </div>
                  <span className="text-xs text-muted-foreground">15 dk</span>
                </div>
              </CardContent>
            </Card>

            {/* Sistem Uyarıları */}
            <Card>
              <CardHeader>
                <CardTitle>Sistem Uyarıları</CardTitle>
                <CardDescription>
                  Önemli sistem bildirimleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Yüksek Sistem Yükü</p>
                    <p className="text-xs text-muted-foreground">CPU kullanımı %85'e ulaştı</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Veritabanı Güncellendi</p>
                    <p className="text-xs text-muted-foreground">Yeni kayıtlar eklendi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Yeni Kullanıcı</p>
                    <p className="text-xs text-muted-foreground">5 yeni kayıt oluşturuldu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  );
}

const topNav = [
  {
    title: "Ana Sayfa",
    href: "/",
    isActive: true,
  }
];

// Hızlı Sorgu Bileşeni
function QuickQuery() {
  const [tc, setTc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!/^\d{11}$/.test(tc)) {
      setError("Geçerli bir 11 haneli TC kimlik numarası girin.");
      toast({ title: 'Hatalı Giriş', description: 'Geçerli bir 11 haneli TC kimlik numarası girin.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    toast({ title: 'Sorgulanıyor...', description: 'Kişi bilgileri sorgulanıyor.' });
    try {
      const res = await fetch(`https://78.185.19.222:5000/api/kisi/${tc}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Kişi bulunamadı.");
        toast({ title: 'Hata', description: data.error || 'Kişi bulunamadı.', variant: 'destructive' });
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
      toast({ title: 'Sorgu Başarılı', description: 'Kişi bilgileri bulundu.' });
    } catch (_err) {
      setError("Sunucuya bağlanılamadı.");
      toast({ title: 'Sunucu Hatası', description: 'Sunucuya bağlanılamadı.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          maxLength={11}
          minLength={11}
          pattern="\d{11}"
          placeholder="TC Kimlik No"
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          value={tc}
          onChange={e => setTc(e.target.value.replace(/\D/g, ""))}
          disabled={loading}
        />
        <Button type="submit" className="w-full mt-1" disabled={loading || !tc}>
          <SearchIcon className="mr-2 h-4 w-4" />
          {loading ? "Sorgulanıyor..." : "Sorgula"}
        </Button>
      </form>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      {loading && (
        <div className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
          <span className="text-muted-foreground">Sorgulanıyor...</span>
        </div>
      )}
      {!loading && result && result.basicInfo && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TC</TableHead>
                <TableHead>Ad</TableHead>
                <TableHead>Soyad</TableHead>
                <TableHead>Doğum Tarihi</TableHead>
                <TableHead>GSM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{result.basicInfo.TC || result.basicInfo.tc || "-"}</TableCell>
                <TableCell>{result.basicInfo.ADI || "-"}</TableCell>
                <TableCell>{result.basicInfo.SOYADI || "-"}</TableCell>
                <TableCell>{result.basicInfo.DOGUMTARIHI || "-"}</TableCell>
                <TableCell>{Array.isArray(result.gsmNumbers) && result.gsmNumbers.length > 0 ? result.gsmNumbers[0].GSM : "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
