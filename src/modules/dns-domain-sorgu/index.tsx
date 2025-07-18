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
import { Search as SearchIcon, Globe, Server, Mail, FileText, AlertCircle, Loader2, Clock, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface DnsInfo {
  domain: string
  aRecords: string[]
  aaaaRecords: string[]
  nsRecords: string[]
  mxRecords: Array<{priority: number, exchange: string}>
  txtRecords: string[][]
  cnameRecords: string[]
  soaRecords: unknown
  whoisInfo: {
    registrar: string
    creationDate: string
    expirationDate: string
    updatedDate: string
    status: string
  } | null
  timestamp: string
}

export default function DnsDomainSorgu() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dnsInfo, setDnsInfo] = useState<DnsInfo | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setDnsInfo(null)
    setHasSearched(false)
    
    if (!domain || domain.trim() === '') {
      setError('Domain adı gerekli.')
      toast({
        title: "Hata",
        description: "Domain adı gerekli.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    toast({ title: 'Sorgulanıyor...', description: 'DNS bilgileri alınıyor.' })

    try {
      const response = await fetch('http://localhost:5000/api/dns-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'DNS bilgisi alınamadı')
      }

      setDnsInfo(data)
      toast({
        title: "Başarılı",
        description: "DNS bilgileri başarıyla alındı.",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : 'DNS bilgisi alınamadı')
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : 'DNS bilgisi alınamadı',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setHasSearched(true)
    }
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomain(e.target.value)
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>DNS + Domain Sorgu</h1>
          <p className='text-muted-foreground mt-2'>
            Domain ve DNS bilgilerini sorgulama
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Sol Taraf - Sorgu Formu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  DNS Sorgu Formu
                </CardTitle>
                <CardDescription>
                  Domain adı ile DNS bilgilerini al
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Domain Adı *</label>
                    <input
                      type="text"
                      value={domain}
                      onChange={handleDomainChange}
                      placeholder="example.com"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Sorgulamak istediğiniz domain adını girin
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading || !domain.trim()}>
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
                  <CardTitle>DNS Bilgileri</CardTitle>
                  <CardDescription>
                    {dnsInfo 
                      ? `${dnsInfo.domain} için DNS bilgileri` 
                      : 'Sonuç bulunamadı'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {dnsInfo ? (
                    <div className="space-y-6">
                      {/* IP Kayıtları */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Server className="h-5 w-5" />
                              IP Kayıtları
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">A Kayıtları (IPv4):</span>
                                <Badge variant="secondary" className="text-xs">
                                  {dnsInfo.aRecords.length} adet
                                </Badge>
                              </div>
                              {dnsInfo.aRecords.length > 0 ? (
                                <div className="space-y-1">
                                  {dnsInfo.aRecords.map((ip, index) => (
                                    <div key={index} className="font-mono text-sm bg-muted p-2 rounded">
                                      {ip}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">AAAA Kayıtları (IPv6):</span>
                                <Badge variant="secondary" className="text-xs">
                                  {dnsInfo.aaaaRecords.length} adet
                                </Badge>
                              </div>
                              {dnsInfo.aaaaRecords.length > 0 ? (
                                <div className="space-y-1">
                                  {dnsInfo.aaaaRecords.map((ip, index) => (
                                    <div key={index} className="font-mono text-sm bg-muted p-2 rounded">
                                      {ip}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Mail className="h-5 w-5" />
                              Mail ve NS Kayıtları
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">MX Kayıtları:</span>
                                <Badge variant="secondary" className="text-xs">
                                  {dnsInfo.mxRecords.length} adet
                                </Badge>
                              </div>
                              {dnsInfo.mxRecords.length > 0 ? (
                                <div className="space-y-1">
                                  {dnsInfo.mxRecords.map((mx, index) => (
                                    <div key={index} className="text-sm bg-muted p-2 rounded">
                                      <span className="font-medium">{mx.priority}</span> - {mx.exchange}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">NS Kayıtları:</span>
                                <Badge variant="secondary" className="text-xs">
                                  {dnsInfo.nsRecords.length} adet
                                </Badge>
                              </div>
                              {dnsInfo.nsRecords.length > 0 ? (
                                <div className="space-y-1">
                                  {dnsInfo.nsRecords.map((ns, index) => (
                                    <div key={index} className="text-sm bg-muted p-2 rounded">
                                      {ns}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* TXT ve CNAME Kayıtları */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              TXT Kayıtları
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">TXT Kayıtları:</span>
                              <Badge variant="secondary" className="text-xs">
                                {dnsInfo.txtRecords.length} adet
                              </Badge>
                            </div>
                            {dnsInfo.txtRecords.length > 0 ? (
                              <div className="space-y-2">
                                {dnsInfo.txtRecords.map((txt, index) => (
                                  <div key={index} className="text-sm bg-muted p-2 rounded break-all">
                                    {txt.join('')}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5" />
                              CNAME Kayıtları
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">CNAME Kayıtları:</span>
                              <Badge variant="secondary" className="text-xs">
                                {dnsInfo.cnameRecords.length} adet
                              </Badge>
                            </div>
                            {dnsInfo.cnameRecords.length > 0 ? (
                              <div className="space-y-2">
                                {dnsInfo.cnameRecords.map((cname, index) => (
                                  <div key={index} className="text-sm bg-muted p-2 rounded">
                                    {cname}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Kayıt bulunamadı</span>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      {/* WHOIS Bilgileri */}
                      {dnsInfo.whoisInfo && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              WHOIS Bilgileri
                              <Badge variant="default" className="text-xs">
                                {dnsInfo.whoisInfo.status}
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Registrar:</span>
                                  <span className="text-sm">{dnsInfo.whoisInfo.registrar}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Oluşturma Tarihi:</span>
                                  <span className="text-sm">{dnsInfo.whoisInfo.creationDate}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Bitiş Tarihi:</span>
                                  <span className="text-sm">{dnsInfo.whoisInfo.expirationDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">Güncelleme Tarihi:</span>
                                  <span className="text-sm">{dnsInfo.whoisInfo.updatedDate}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Sorgu Zamanı */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Sorgu Bilgileri
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Sorgu Zamanı:</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(dnsInfo.timestamp).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">DNS bilgisi bulunamadı</p>
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
    title: "DNS + Domain Sorgu",
    href: "/dns-domain-sorgu",
    isActive: true,
  }
] 