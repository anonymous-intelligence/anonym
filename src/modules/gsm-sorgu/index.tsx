import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as SearchIcon, Phone, User, MapPin, AlertCircle, CheckCircle, Database, Signal, Loader2 } from "lucide-react"
import { useState } from 'react'

export default function GsmSorgu() {
  const [searchResult, setSearchResult] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gsmNo, setGsmNo] = useState('')
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // GSM No validasyonu
    const cleanGsm = gsmNo.replace(/\s/g, '')
    if (!/^5[0-9]{9}$/.test(cleanGsm)) {
      setError('Geçerli bir GSM numarası giriniz (5XXX XXX XXX)')
      return
    }

    setIsLoading(true)
    
    try {
      // Önce GSM ile TC bilgisini al
      const gsmResponse = await fetch(`http://localhost:5000/api/gsm/number/${cleanGsm}`)
      
      if (!gsmResponse.ok) {
        if (gsmResponse.status === 404) {
          setError('Bu GSM numarasına ait TC bilgisi bulunamadı')
        } else {
          setError('Sunucu hatası oluştu')
        }
        setSearchResult(null)
        setIsLoading(false)
        return
      }

      const gsmData = await gsmResponse.json()
      
      // TC ile detaylı bilgileri al
      const detailedResponse = await fetch(`http://localhost:5000/api/person/detailed/${gsmData.TC}`)
      
      if (detailedResponse.ok) {
        const detailedData = await detailedResponse.json()
        setSearchResult(detailedData)
      } else {
        // Detaylı bilgi alınamazsa sadece GSM bilgisini göster
        setSearchResult(gsmData)
      }
    } catch (_error) {
      setError('Bağlantı hatası oluştu')
      setSearchResult(null)
    } finally {
      setIsLoading(false)
    }
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
          <div className="flex items-center gap-3">
            <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>GSM Sorgu</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
              <Phone className="h-3 w-3 mr-1" />
              Telefon
            </Badge>
          </div>
          <p className='text-muted-foreground mt-2'>
            GSM numarası ile TC kimlik bilgilerini sorgulama
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Sol Taraf - Sorgu Formu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  GSM Sorgu Formu
                </CardTitle>
                <CardDescription>
                  GSM numarası ile TC bilgilerini sorgulayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GSM Numarası *</label>
                    <input
                      type="text"
                      value={gsmNo.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setGsmNo(cleanValue);
                      }}
                      placeholder="5XX XXX XXX"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background font-mono"
                      required
                      maxLength={12}
                    />
                    <p className="text-xs text-muted-foreground">
                      10 haneli GSM numarasını girin (5XX XXX XXX formatında)
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading || gsmNo.length !== 10}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {isLoading ? 'Sorgulanıyor...' : 'GSM Sorgula'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* İstatistikler */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>GSM İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toplam GSM Sorgu</span>
                  <span className="text-sm font-medium">8,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Başarılı</span>
                  <span className="text-sm font-medium text-green-600">8,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Başarı Oranı</span>
                  <span className="text-sm font-medium text-blue-600">97.4%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ortalama Süre</span>
                  <span className="text-sm font-medium text-purple-600">1.2s</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Sonuçlar */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 w-full">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Sorgulanıyor...</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>TC Bilgileri</CardTitle>
                  <CardDescription>
                    {searchResult 
                      ? 'GSM numarasına ait TC bilgileri bulundu' 
                      : 'GSM numarası ile sorgu yapın'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {searchResult ? (
                    <div className="space-y-6">
                      {/* GSM Numarası Özel Kart */}
                      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-600" />
                            GSM Numarası
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="text-2xl font-mono font-bold text-blue-600 mb-2">
                              {searchResult.gsm?.GSM || searchResult.GSM}
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Doğrulandı
                              </Badge>
                              <Badge variant="outline">
                                <Signal className="h-3 w-3 mr-1" />
                                Aktif
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Ana Bilgiler */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Kişi Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">TC:</span>
                              <span className="font-mono">{searchResult.tc || searchResult.TC}</span>
                              <span className="font-medium">GSM:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-blue-600 font-semibold">{searchResult.gsm?.GSM || searchResult.GSM}</span>
                                <Badge variant="outline" className="text-xs">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Aktif
                                </Badge>
                              </div>
                              <span className="font-medium">Ad:</span>
                              <span>{searchResult.basicInfo?.ADI || searchResult.addressInfo?.ADI || searchResult.Ad || 'Bilinmiyor'}</span>
                              <span className="font-medium">Soyad:</span>
                              <span>{searchResult.basicInfo?.SOYADI || searchResult.addressInfo?.SOYADI || searchResult.Soyad || 'Bilinmiyor'}</span>
                              <span className="font-medium">Doğum Tarihi:</span>
                              <span>{searchResult.basicInfo?.DOGUMTARIHI || searchResult.addressInfo?.DOGUMTARIHI || searchResult.DogumTarihi || 'Bilinmiyor'}</span>
                              <span className="font-medium">Cinsiyet:</span>
                              <span>{searchResult.addressInfo?.CINSIYETI || searchResult.Cinsiyet || 'Bilinmiyor'}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Adres Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">İl:</span>
                              <span>{searchResult.addressInfo?.ADRESIL || searchResult.basicInfo?.NUFUSIL || searchResult.Il || 'Bilinmiyor'}</span>
                              <span className="font-medium">İlçe:</span>
                              <span>{searchResult.addressInfo?.ADRESILCE || searchResult.basicInfo?.NUFUSILCE || searchResult.Ilce || 'Bilinmiyor'}</span>
                              <span className="font-medium">Mahalle:</span>
                              <span>{searchResult.addressInfo?.MAHALLE || searchResult.Mahalle || 'Bilinmiyor'}</span>
                              <span className="font-medium">Cadde:</span>
                              <span>{searchResult.addressInfo?.CADDE || searchResult.Cadde || 'Bilinmiyor'}</span>
                              <span className="font-medium">Kapı No:</span>
                              <span>{searchResult.addressInfo?.KAPINO || 'Bilinmiyor'}</span>
                              <span className="font-medium">Daire No:</span>
                              <span>{searchResult.addressInfo?.DAIRENO || 'Bilinmiyor'}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detaylı Bilgiler */}
                      <Card className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Detaylı Bilgiler
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Anne Adı:</span>
                              <div>{searchResult.basicInfo?.ANNEADI || searchResult.addressInfo?.ANAADI || searchResult.AnneAdi || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Baba Adı:</span>
                              <div>{searchResult.basicInfo?.BABAADI || searchResult.addressInfo?.BABAADI || searchResult.BabaAdi || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Doğum Yeri:</span>
                              <div>{searchResult.addressInfo?.DOGUMYERI || searchResult.dataInfo?.DogumYeri || searchResult.veriInfo?.DogumYeri || searchResult.DogumYeri || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Uyruk:</span>
                              <div>{searchResult.basicInfo?.UYRUK || searchResult.Uyruk || 'T.C.'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Anne TC:</span>
                              <div>{searchResult.basicInfo?.ANNETC || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Baba TC:</span>
                              <div>{searchResult.basicInfo?.BABATC || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">Vergi No:</span>
                              <div>{searchResult.dataInfo?.VergiNumarasi || searchResult.veriInfo?.VergiNumarasi || 'Bilinmiyor'}</div>
                            </div>
                            <div>
                              <span className="font-medium">İkametgah:</span>
                              <div>{searchResult.dataInfo?.Ikametgah || searchResult.veriInfo?.Ikametgah || 'Bilinmiyor'}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>


                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {isLoading ? 'Sorgulanıyor...' : 'GSM numarası ile sorgu yapın'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "GSM Sorgu",
    href: "/gsm-sorgu",
    isActive: true,
  }
] 