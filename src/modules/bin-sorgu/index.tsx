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
import { Search as SearchIcon, CreditCard, Building2, Globe, AlertCircle, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface BinInfo {
  bin: string
  banka: string
  kartTipi: string
  seviye: string
  ulke: string
  paraBirimi: string
  bankaKodu: string
  ulkeKodu: string
  aktif: boolean
  tip: string
}

export default function BinSorgu() {
  const [bin, setBin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [binInfo, setBinInfo] = useState<BinInfo | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBinInfo(null)
    setHasSearched(false)
    
    if (!bin || bin.length !== 6) {
      setError('BIN numarası 6 haneli olmalıdır.')
      toast({
        title: "Hata",
        description: "BIN numarası 6 haneli olmalıdır.",
        variant: "destructive",
      })
      return
    }

    if (!/^\d{6}$/.test(bin)) {
      setError('BIN numarası sadece rakam içermelidir.')
      toast({
        title: "Hata",
        description: "BIN numarası sadece rakam içermelidir.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    toast({ title: 'Sorgulanıyor...', description: 'BIN bilgileri alınıyor.' })

    try {
      const response = await fetch('http://78.185.19.222:5000/api/bin-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bin }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'BIN bilgisi alınamadı')
      }

      setBinInfo(data)
      toast({
        title: "Başarılı",
        description: "BIN bilgileri başarıyla alındı.",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'BIN bilgisi alınamadı')
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : 'BIN bilgisi alınamadı',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }

  const handleBinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setBin(value)
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>BIN Sorgu</h1>
          <p className='text-muted-foreground mt-2'>
            Kart numarası BIN bilgilerini sorgulama
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Sol Taraf - Sorgu Formu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  BIN Sorgu Formu
                </CardTitle>
                <CardDescription>
                  Kart numarasının ilk 6 hanesi ile banka bilgisi al
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">BIN Numarası *</label>
                    <input
                      type="text"
                      value={bin}
                      onChange={handleBinChange}
                      placeholder="123456"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                      maxLength={6}
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      6 haneli BIN numarasını girin
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading || bin.length !== 6}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {loading ? 'Sorgulanıyor...' : 'Sorgula'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Sonuçlar */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 w-full">
                <Loader2 className="h-12 w-12 text-muted-foreground animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Sorgulanıyor...</p>
              </div>
            ) : hasSearched ? (
              <Card>
                <CardHeader>
                  <CardTitle>BIN Bilgileri</CardTitle>
                  <CardDescription>
                    {binInfo 
                      ? 'BIN bilgileri başarıyla getirildi' 
                      : 'Sonuç bulunamadı'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {binInfo ? (
                    <div className="space-y-6">
                      {/* Temel Bilgiler */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building2 className="h-5 w-5" />
                              Banka Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">BIN:</span>
                              <span className="font-mono">{binInfo.bin}</span>
                              <span className="font-medium">Banka:</span>
                              <span>{binInfo.banka}</span>
                              <span className="font-medium">Kart Tipi:</span>
                              <span>{binInfo.kartTipi}</span>
                              <span className="font-medium">Seviye:</span>
                              <span>{binInfo.seviye}</span>
                              <span className="font-medium">Tip:</span>
                              <span>{binInfo.tip}</span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5" />
                              Ülke Bilgileri
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <span className="font-medium">Ülke:</span>
                              <span>{binInfo.ulke}</span>
                              <span className="font-medium">Ülke Kodu:</span>
                              <span className="font-mono">{binInfo.ulkeKodu}</span>
                              <span className="font-medium">Para Birimi:</span>
                              <span>{binInfo.paraBirimi}</span>
                              <span className="font-medium">Banka Kodu:</span>
                              <span className="font-mono">{binInfo.bankaKodu}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Durum Bilgisi */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Durum Bilgisi
                            <Badge variant={binInfo.aktif ? "default" : "secondary"} className="text-xs">
                              {binInfo.aktif ? 'Bilgi Mevcut' : 'Bilgi Yok'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3">
                            {binInfo.aktif ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600" />
                            )}
                            <div>
                              <p className="text-sm">
                                {binInfo.aktif 
                                  ? 'Bu BIN numarası için detaylı bilgiler mevcuttur.'
                                  : 'Bu BIN numarası için bilgi bulunamadı.'
                                }
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {binInfo.aktif 
                                  ? 'Kart bilgileri güncel ve doğrudur.'
                                  : 'BIN numarası geçersiz olabilir veya bilgi veritabanında bulunmamaktadır.'
                                }
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">BIN bilgisi bulunamadı</p>
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
    title: "BIN Sorgu",
    href: "/bin-sorgu",
    isActive: true,
  }
] 