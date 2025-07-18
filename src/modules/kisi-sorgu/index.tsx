import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Search as SearchIcon, User, MapPin, Phone, AlertCircle, CreditCard, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface GsmNumber {
  GSM: string;
  operator?: string;
}
interface BasicInfo {
  ADI?: string;
  SOYADI?: string;
  DOGUMTARIHI?: string;
  UYRUK?: string;
  ANNEADI?: string;
  ANNETC?: string;
  BABAADI?: string;
  BABATC?: string;
  NUFUSIL?: string;
  NUFUSILCE?: string;
}
interface AddressInfo {
  Ikametgah?: string;
  DogumYeri?: string;
  VergiNumarasi?: string;
  ADRESIL?: string;
  ADRESILCE?: string;
  MAHALLE?: string;
  CADDE?: string;
  year?: number;
  ANAADI?: string;
  BABAADI?: string;
}
interface KisiResult {
  tc?: string;
  basicInfo?: BasicInfo;
  addressInfo?: AddressInfo;
  addressInfoVeri?: AddressInfo;
  addressInfo2015?: AddressInfo;
  gsmNumbers?: GsmNumber[];
  cinsiyet?: string;
  kizlikSoyadi?: string;
}
interface Kardes {
  ad: string;
  soyad: string;
  tc: string;
  dogumTarihi?: string;
  dogumYeri?: string;
}
interface KardesBilgileri {
  data?: Kardes[];
  message?: string;
  success?: boolean;
}

export default function KisiSorgu() {
  const [searchResult, setSearchResult] = useState<KisiResult | null>(null)
  const [kardesBilgileri, setKardesBilgileri] = useState<KardesBilgileri | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tc, setTc] = useState('')

  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSearchResult(null)
    setKardesBilgileri(null)
    setHasSearched(false)
    
    if (tc.length !== 11) {
      setError('TC kimlik numarası 11 haneli olmalıdır!')
      toast({
        title: 'Eksik Bilgi',
        description: 'TC kimlik numarası 11 haneli olmalıdır!',
        variant: 'destructive',
      })
      return
    }
    
    setIsLoading(true)
    toast({ title: 'Aranıyor...', description: 'TC ile kişi sorgusu yapılıyor.' })
    
    try {
      const response = await fetch(`http://localhost:5000/api/kisi/${tc}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Bu TC kimlik numarasına ait bilgi bulunamadı')
          toast({
            title: 'Sonuç bulunamadı',
            description: 'Bu TC kimlik numarasına ait bilgi bulunamadı.',
            variant: 'destructive',
          })
        } else {
          setError('Sunucu hatası oluştu')
          toast({
            title: 'Sunucu Hatası',
            description: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
            variant: 'destructive',
          })
        }
        setSearchResult(null)
        setIsLoading(false)
        setHasSearched(true)
        return
      }
    
      const data: KisiResult = await response.json()
      setSearchResult(data)
      setHasSearched(true)
      toast({ title: 'Sorgu tamamlandı', description: 'Kişi bilgileri başarıyla getirildi.' })
    
      // Kardeş bilgileri sorgusu
      try {
        const kardesResponse = await fetch(`http://localhost:5000/api/person/siblings/${tc}`)
        const kardesData: KardesBilgileri = await kardesResponse.json()
        if (kardesResponse.ok && kardesData.success) {
          setKardesBilgileri(kardesData)
        }
      } catch {
        // Kardeş bilgileri alınamadı ama işlem devam ediyor
      }
    
    } catch (_error) {
      setError('Bağlantı hatası oluştu')
      setSearchResult(null)
      setIsLoading(false)
      setHasSearched(true)
      toast({
        title: 'Bağlantı Hatası',
        description: 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edin.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setHasSearched(true)
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Kişi Sorgu</h1>
          <p className='text-muted-foreground mt-2'>
            TC kimlik numarası ile detaylı kişi bilgileri sorgulama
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Sol Taraf - Sorgu Formu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  TC Sorgu Formu
                </CardTitle>
                <CardDescription>
                  TC kimlik numarası ile kişi bilgilerini sorgulayın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TC Kimlik Numarası *</label>
                    <input
                      type="text"
                      value={tc}
                      onChange={(e) => setTc(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="12345678901"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                      maxLength={11}
                    />
                    <p className="text-xs text-muted-foreground">
                      11 haneli TC kimlik numarasını girin
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading || tc.length !== 11}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {isLoading ? 'Sorgulanıyor...' : 'Sorgula'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Sonuçlar */}
          <div className="lg:col-span-2">
            {/* Sorgu Sonuçları */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 w-full">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Sorgulanıyor...</p>
              </div>
            ) : hasSearched ? (
              <Card>
                <CardHeader>
                  <CardTitle>Kişi Bilgileri</CardTitle>
                  <CardDescription>
                    {searchResult 
                      ? 'Kişi bilgileri başarıyla getirildi' 
                      : 'Sonuç bulunamadı'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {searchResult ? (
                    <div className="space-y-6">
                      {/* Temel Bilgiler */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Temel Bilgiler
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">TC:</span>
                              <span className="font-mono">{searchResult?.tc || ''}</span>
                              <span className="font-medium">Ad:</span>
                              <span>{searchResult?.basicInfo?.ADI || ''}</span>
                              <span className="font-medium">Soyad:</span>
                              <span>{searchResult?.basicInfo?.SOYADI || ''}</span>
                              <span className="font-medium">Doğum Tarihi:</span>
                              <span>{searchResult?.basicInfo?.DOGUMTARIHI || 'Bilinmiyor'}</span>
                              <span className="font-medium">Cinsiyet:</span>
                              <span>{searchResult?.cinsiyet || 'Bilinmiyor'}</span>
                              <span className="font-medium">Uyruk:</span>
                              <span>{searchResult?.basicInfo?.UYRUK || 'T.C.'}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Aile Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">Anne Adı:</span>
                              <span>{searchResult?.basicInfo?.ANNEADI || searchResult?.addressInfo?.ANAADI || 'Bilinmiyor'}</span>
                              <span className="font-medium">Anne TC:</span>
                              <span className="font-mono">{searchResult?.basicInfo?.ANNETC || 'Bilinmiyor'}</span>
                              <span className="font-medium">Baba Adı:</span>
                              <span>{searchResult?.basicInfo?.BABAADI || searchResult?.addressInfo?.BABAADI || 'Bilinmiyor'}</span>
                              <span className="font-medium">Baba TC:</span>
                              <span className="font-mono">{searchResult?.basicInfo?.BABATC || 'Bilinmiyor'}</span>
                            </div>
                            
                            <hr className="border-t border-border/50 my-3" />
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">Kızlık Soyadı:</span>
                              <span className="text-primary font-medium">{searchResult?.kizlikSoyadi || 'Bilinmiyor'}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* İletişim ve Adres */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Phone className="h-5 w-5" />
                              İletişim Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">GSM Sayısı:</span>
                              <span>{(() => {
                                const gsmNumbers = searchResult?.gsmNumbers;
                                if (!Array.isArray(gsmNumbers)) return 0;
                                const numbers = gsmNumbers.map((gsm: GsmNumber) => gsm.GSM);
                                const uniqueNumbers = numbers.filter((num: string, index: number) => numbers.indexOf(num) === index);
                                return uniqueNumbers.length;
                              })()} adet</span>
                            </div>
                            
                            {/* GSM Numaraları Listesi */}
                            {searchResult && Array.isArray(searchResult.gsmNumbers) && searchResult.gsmNumbers.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">GSM Numaraları:</h4>
                                <div className="space-y-2">
                                  {searchResult.gsmNumbers.map((gsm: GsmNumber, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                      <div className="font-mono text-base font-medium">
                                        {gsm.GSM}
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        {gsm.operator}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <MapPin className="h-5 w-5" />
                              Adres Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* 2024 Adres Bilgileri - Tek Kutu */}
                              {searchResult?.addressInfo?.Ikametgah && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">2024 Adres Bilgileri</h4>
                                    <Badge variant="secondary" className="text-xs">2024</Badge>
                                    {searchResult?.addressInfo?.Ikametgah && (
                                      <Badge variant="outline" className="text-xs">data</Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-medium">İkametgah:</span>
                                    <span>{searchResult?.addressInfo?.Ikametgah || (searchResult?.addressInfoVeri?.Ikametgah || 'Bilinmiyor')}</span>
                                    <span className="font-medium">Doğum Yeri:</span>
                                    <span>{searchResult?.addressInfo?.DogumYeri || (searchResult?.addressInfoVeri?.DogumYeri || 'Bilinmiyor')}</span>
                                    <span className="font-medium">Vergi No:</span>
                                    <span>{searchResult?.addressInfo?.VergiNumarasi || (searchResult?.addressInfoVeri?.VergiNumarasi || 'Bilinmiyor')}</span>
                                  </div>
                                </div>
                              )}

                              {/* 2015 Adres Bilgileri */}
                              {searchResult?.addressInfo2015?.year && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">2015 Adres Bilgileri</h4>
                                    {searchResult?.addressInfo2015?.year && (
                                      <Badge variant="secondary" className="text-xs">
                                        {searchResult?.addressInfo2015?.year}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-medium">Nüfus İl:</span>
                                    <span>{searchResult?.basicInfo?.NUFUSIL || 'Bilinmiyor'}</span>
                                    <span className="font-medium">Nüfus İlçe:</span>
                                    <span>{searchResult?.basicInfo?.NUFUSILCE || 'Bilinmiyor'}</span>
                                    <span className="font-medium">Adres İl:</span>
                                    <span>{searchResult?.addressInfo2015?.ADRESIL || 'Bilinmiyor'}</span>
                                    <span className="font-medium">Adres İlçe:</span>
                                    <span>{searchResult?.addressInfo2015?.ADRESILCE || 'Bilinmiyor'}</span>
                                    <span className="font-medium">Mahalle:</span>
                                    <span>{searchResult?.addressInfo2015?.MAHALLE || 'Bilinmiyor'}</span>
                                    <span className="font-medium">Cadde:</span>
                                    <span>{searchResult?.addressInfo2015?.CADDE || 'Bilinmiyor'}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Kardeş Bilgileri */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Kardeş Bilgileri
                            {kardesBilgileri && kardesBilgileri.data && kardesBilgileri.data.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {kardesBilgileri.data.length} kardeş
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {kardesBilgileri && kardesBilgileri.data && kardesBilgileri.data.length > 0 ? (
                            <div className="space-y-3">
                              {kardesBilgileri.data.map((kardes: Kardes, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                      {kardes.ad.charAt(0)}{kardes.soyad.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{kardes.ad} {kardes.soyad}</div>
                                      <div className="text-sm text-muted-foreground">TC: {kardes.tc}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{(() => {
                                      const dateStr = kardes.dogumTarihi || '';
                                      if (!dateStr) return 'Bilinmiyor';
                                      
                                      // Tarih formatını düzenle
                                      const parts = dateStr.split('.');
                                      if (parts.length === 3) {
                                        const day = parts[0].padStart(2, '0');
                                        const month = parts[1].padStart(2, '0');
                                        const year = parts[2];
                                        return `${day}.${month}.${year}`;
                                      }
                                      return dateStr;
                                    })()}</div>
                                    <div className="text-xs text-muted-foreground">{kardes.dogumYeri}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {kardesBilgileri?.message || 'Kardeş bilgisi bulunamadı'}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Sonuç bulunamadı.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: "Kişi Sorgu",
    href: "/kisi-sorgu",
    isActive: true,
  }
] 