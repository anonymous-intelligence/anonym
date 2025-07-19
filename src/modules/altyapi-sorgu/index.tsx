import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, Loader2, Search as SearchIcon, Server, CheckCircle2 } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import ilIlceDataRaw from '@/lib/il-ilce.json'

const ilIlceData: {il: string, ilceler: string[]}[] = ilIlceDataRaw as unknown as {il: string, ilceler: string[]}[]

export default function AltyapiSorgu() {
  const [formData, setFormData] = useState({
    il: '',
    ilce: '',
    mahalle: '',
    sokak: '',
    apartmanNo: '',
    daireNo: ''
  })
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()
  const [iller, setIller] = useState<string[]>([])
  const [ilceler, setIlceler] = useState<string[]>([])

  useEffect(() => {
    setIller(ilIlceData.map(item => item.il))
  }, [])

  useEffect(() => {
    const seciliIl = ilIlceData.find(item => item.il === formData.il)
    setIlceler(seciliIl ? seciliIl.ilceler : [])
    if (!seciliIl) {
      setFormData(prev => ({ ...prev, ilce: '' }))
    }
  }, [formData.il])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setHasSearched(false)
    
    // En az il ve ilçe kontrolü
    if (!formData.il || !formData.ilce) {
      setError('İl ve ilçe seçimi zorunludur')
      toast({ title: 'Eksik Bilgi', description: 'İl ve ilçe seçimi zorunludur', variant: 'destructive' })
      return
    }
    
    // Adres string'ini oluştur
    const addressString = `${formData.il} ${formData.ilce} ${formData.mahalle} ${formData.sokak} ${formData.apartmanNo} ${formData.daireNo}`.trim()
    
    setLoading(true)
    toast({ title: 'Sorgulanıyor...', description: 'Altyapı bilgisi sorgulanıyor.' })
    try {
      const res = await fetch('http://78.185.19.222:5000/api/altyapi-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: addressString })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Bilinmeyen hata')
      }
      const data = await res.json()
      setResult(data)
      toast({ title: 'Sorgu tamamlandı', description: `${addressString} için altyapı bilgisi bulundu.` })
    } catch (err: unknown) {
      setError((err as Error).message)
      toast({ title: 'Hata', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Altyapı Sorgu</h1>
          <p className='text-muted-foreground mt-2'>Adres bilgileri ile altyapı sorgulama</p>
        </div>
        <div className="flex flex-col gap-6 w-full mx-auto">
          {/* Sorgu Formu */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Altyapı Sorgu Formu
              </CardTitle>
              <CardDescription>Adres bilgilerini girerek altyapı sorgulayın</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">İl *</label>
                  <select
                    name="il"
                    value={formData.il}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">İl Seçiniz</option>
                    {iller.map((il) => (
                      <option key={il} value={il}>{il}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">İlçe *</label>
                  <select
                    name="ilce"
                    value={formData.ilce}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    disabled={!formData.il}
                    required
                  >
                    <option value="">İlçe Seçiniz</option>
                    {ilceler.map((ilce) => (
                      <option key={ilce} value={ilce}>{ilce}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mahalle</label>
                  <input
                    type="text"
                    name="mahalle"
                    value={formData.mahalle}
                    onChange={handleInputChange}
                    placeholder="Mahalle adı"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sokak / Cadde</label>
                  <input
                    type="text"
                    name="sokak"
                    value={formData.sokak}
                    onChange={handleInputChange}
                    placeholder="Sokak veya cadde adı"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Apartman No</label>
                  <input
                    type="text"
                    name="apartmanNo"
                    value={formData.apartmanNo}
                    onChange={handleInputChange}
                    placeholder="Apartman numarası"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Daire No</label>
                  <input
                    type="text"
                    name="daireNo"
                    value={formData.daireNo}
                    onChange={handleInputChange}
                    placeholder="Daire numarası"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    {loading ? 'Sorgulanıyor...' : 'Altyapı Sorgula'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Sonuçlar veya Spinner */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 w-full bg-background border border-border rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
              <span className="text-muted-foreground">Sorgulanıyor...</span>
            </div>
          ) : hasSearched ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Sonuçlar</CardTitle>
                <CardDescription>
                  {result ? `${formData.il} ${formData.ilce} için altyapı bilgileri` : 'Sonuç bulunamadı'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Operatör</TableHead>
                          <TableHead>Altyapı Tipi</TableHead>
                          <TableHead>Hız</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead>Kurulum</TableHead>
                          <TableHead>VDSL</TableHead>
                          <TableHead>Fiber</TableHead>
                          <TableHead>ADSL</TableHead>
                          <TableHead>Docsis</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{result.operator || '-'}</TableCell>
                          <TableCell>{result.altyapiTipi || '-'}</TableCell>
                          <TableCell>{result.hiz || '-'}</TableCell>
                          <TableCell>{result.durum || '-'}</TableCell>
                          <TableCell>{result.kurulum || '-'}</TableCell>
                          <TableCell>{result.vdsl ? <CheckCircle2 className="text-green-600" /> : '-'}</TableCell>
                          <TableCell>{result.fiber ? <CheckCircle2 className="text-green-600" /> : '-'}</TableCell>
                          <TableCell>{result.adsl ? <CheckCircle2 className="text-green-600" /> : '-'}</TableCell>
                          <TableCell>{result.docsis ? <CheckCircle2 className="text-green-600" /> : '-'}</TableCell>
                        </TableRow>
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
    title: 'Altyapı Sorgu',
    href: '/altyapi-sorgu',
    isActive: true,
  },
] 