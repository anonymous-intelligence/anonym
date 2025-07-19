import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as SearchIcon, User, AlertCircle, Loader2 } from "lucide-react"
import { useState } from 'react'
import ilIlceDataRaw from '@/lib/il-ilce.json';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const ilIlceData: { il: string; ilceler: string[] }[] = ilIlceDataRaw as { il: string; ilceler: string[] }[];

export default function AdSoyadSorgu() {
  const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    dogumTarihi: '',
    il: '',
    ilce: '',
    babaAdi: '',
    anneAdi: '',
    uyruk: ''
  })
  const [iller, setIller] = useState<string[]>([]);
  const [ilceler, setIlceler] = useState<string[]>([]);
  const { toast } = useToast();
  const [_, _setShowSearchingAlert] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setIller(ilIlceData.map(item => item.il));
  }, []);

  useEffect(() => {
    const seciliIl = ilIlceData.find(item => item.il === formData.il);
    setIlceler(seciliIl ? seciliIl.ilceler : []);
  }, [formData.il]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setHasSearched(false)
    setSearchResults([])
    toast({ title: 'Aranıyor...', description: 'Kriterlere uygun kişiler sorgulanıyor.' })
    
    // En az iki kriter kontrolü
    const filledFields = [
      formData.ad, 
      formData.soyad, 
      formData.il, 
      formData.ilce, 
      formData.dogumTarihi, 
      formData.babaAdi, 
      formData.anneAdi
    ].filter(field => field && field.trim());
    
    if (filledFields.length < 2) {
      setError('En az iki kriter doldurulmalıdır (Ad, Soyad, İl, İlçe, Doğum Tarihi, Baba Adı, Anne Adı)')
      toast({ title: 'Eksik Bilgi', description: 'En az iki kriter doldurulmalıdır (Ad, Soyad, İl, İlçe, Doğum Tarihi, Baba Adı, Anne Adı)', variant: 'destructive' })
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('http://78.185.19.222:5000/api/adsoyad/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ad: formData.ad,
          soyad: formData.soyad,
          il: formData.il || '',
          ilce: formData.ilce || '',
          dogumTarihi: formData.dogumTarihi || '',
          babaAdi: formData.babaAdi || '',
          anneAdi: formData.anneAdi || '',
          uyruk: formData.uyruk || '',
          limit: 500
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Sorgu başarısız')
      }

      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        toast({ title: 'Sorgu tamamlandı', description: `${data.data.length} sonuç bulundu.` })
      } else {
        setSearchResults([])
        toast({ title: 'Sonuç bulunamadı', description: 'Kriterlere uygun kayıt bulunamadı.' })
      }
    } catch (_error) {
      setSearchResults([])
      toast({ title: 'Hata', description: 'Sorgu sırasında bir hata oluştu.' })
    } finally {
      setIsLoading(false)
      setHasSearched(true)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Ad Soyad Sorgu</h1>
          <p className='text-muted-foreground mt-2'>
            Ad ve soyad bilgileri ile kişi sorgulama
          </p>
        </div>

        {/* Form ve Sonuçlar üst üste, tam genişlikte */}
        <div className="flex flex-col gap-6 w-full mx-auto">
          {/* Sorgu Formu */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Sorgu Formu
              </CardTitle>
              <CardDescription>
                Arama yapmak için gerekli bilgileri girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ad</label>
                  <input
                    type="text"
                    name="ad"
                    value={formData.ad}
                    onChange={handleInputChange}
                    placeholder="Ahmet"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Soyad</label>
                  <input
                    type="text"
                    name="soyad"
                    value={formData.soyad}
                    onChange={handleInputChange}
                    placeholder="Yılmaz"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İl</label>
                  <select
                    name="il"
                    value={formData.il}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Tüm İller</option>
                    {iller.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İlçe</label>
                  <select
                    name="ilce"
                    value={formData.ilce}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    disabled={!formData.il}
                  >
                    <option value="">Tüm İlçeler</option>
                    {ilceler.map((ilce) => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Baba Adı</label>
                  <input
                    type="text"
                    name="babaAdi"
                    value={formData.babaAdi}
                    onChange={handleInputChange}
                    placeholder="Mehmet"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Anne Adı</label>
                  <input
                    type="text"
                    name="anneAdi"
                    value={formData.anneAdi}
                    onChange={handleInputChange}
                    placeholder="Fatma"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Doğum Tarihi</label>
                  <input
                    type="text"
                    name="dogumTarihi"
                    value={formData.dogumTarihi}
                    onChange={handleInputChange}
                    placeholder="15.03.1985"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Uyruk</label>
                  <input
                    type="text"
                    name="uyruk"
                    value={formData.uyruk || ''}
                    onChange={handleInputChange}
                    placeholder="T.C."
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                {/* Hata ve buton tam genişlikte, gridin en altına yayılır */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {isLoading ? 'Sorgulanıyor...' : 'Sorgula'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sonuçlar veya Spinner */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 w-full bg-background border border-border rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
              <span className="text-muted-foreground">Sorgulanıyor...</span>
            </div>
          ) : hasSearched ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Sonuçlar</CardTitle>
                <CardDescription>
                  {searchResults.length > 0
                    ? `${searchResults.length} sonuç bulundu`
                    : 'Sonuç bulunamadı'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>TC</TableHead>
                          <TableHead>Ad</TableHead>
                          <TableHead>Soyad</TableHead>
                          <TableHead>Doğum Tarihi</TableHead>
                          <TableHead>İl</TableHead>
                          <TableHead>İlçe</TableHead>
                          <TableHead>Anne Adı</TableHead>
                          <TableHead>Baba Adı</TableHead>
                          <TableHead>GSM</TableHead>
                          <TableHead>Kodlayan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell>{typeof result.TC === 'string' ? result.TC : typeof result.KimlikNo === 'string' ? result.KimlikNo : '-'}</TableCell>
                            <TableCell>{typeof result.ADI === 'string' ? result.ADI : (typeof result.AdSoyad === 'string' ? result.AdSoyad.split(' ')[0] : '-')}</TableCell>
                            <TableCell>{typeof result.SOYADI === 'string' ? result.SOYADI : (typeof result.AdSoyad === 'string' ? result.AdSoyad.split(' ')[1] : '-')}</TableCell>
                            <TableCell>{typeof result.DOGUMTARIHI === 'string' ? result.DOGUMTARIHI : (typeof result.DogumYeri === 'string' ? result.DogumYeri : '-')}</TableCell>
                            <TableCell>{typeof result.NUFUSIL === 'string' ? result.NUFUSIL : typeof result.ADRESIL === 'string' ? result.ADRESIL : typeof result.Il === 'string' ? result.Il : '-'}</TableCell>
                            <TableCell>{typeof result.ADRESILCE === 'string' ? result.ADRESILCE : typeof result.Ilce === 'string' ? result.Ilce : typeof result.ILCE === 'string' ? result.ILCE : typeof result.NufusIlce === 'string' ? result.NufusIlce : typeof result.NUFUSILCE === 'string' ? result.NUFUSILCE : '-'}</TableCell>
                            <TableCell>{typeof result.ANNEADI === 'string' ? result.ANNEADI : '-'}</TableCell>
                            <TableCell>{typeof result.BABAADI === 'string' ? result.BABAADI : '-'}</TableCell>
                            <TableCell>{typeof result.GSM === 'string' ? result.GSM : '-'}</TableCell>
                            <TableCell>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">justDoIt</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Sonuç bulunamadı</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "Ad Soyad Sorgu",
    href: "/adsoyad-sorgu",
    isActive: true,
  }
] 