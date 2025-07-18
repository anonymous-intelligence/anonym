import { createFileRoute } from '@tanstack/react-router'
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
import { AlertCircle, Loader2, Search as SearchIcon, Globe } from 'lucide-react'
import React, { useState } from 'react'

export const Route = createFileRoute('/_authenticated/ip-sorgu')({
  component: IpSorgu,
})

export default function IpSorgu() {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    setHasSearched(false)
    if (!ip.trim()) {
      setError('IP adresi giriniz')
      toast({ title: 'Eksik Bilgi', description: 'IP adresi giriniz', variant: 'destructive' })
      return
    }
    setLoading(true)
    toast({ title: 'Sorgulanıyor...', description: 'IP adresi sorgulanıyor.' })
    try {
      const res = await fetch('http://localhost:5000/api/ip-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Bilinmeyen hata')
      }
      const data = await res.json()
      setResult(data)
      toast({ title: 'Sorgu tamamlandı', description: `${data.query || ip} için bilgi bulundu.` })
    } catch (err: unknown) {
      setError((err as Error).message)
      toast({ title: 'Hata', description: (err as Error).message, variant: 'destructive' })
    } finally {
      setLoading(false)
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>IP Sorgu</h1>
          <p className='text-muted-foreground mt-2'>IP adresi ile detaylı bilgi sorgulama</p>
        </div>
        <div className="flex flex-col gap-6 w-full mx-auto">
          {/* Sorgu Formu */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IP Sorgu Formu
              </CardTitle>
              <CardDescription>Arama yapmak için IP adresi girin</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">IP Adresi</label>
                  <input
                    type="text"
                    name="ip"
                    value={ip}
                    onChange={e => setIp(e.target.value)}
                    placeholder="8.8.8.8"
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
                    {loading ? 'Sorgulanıyor...' : 'Sorgula'}
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
                  {result ? `${result.query} için bilgiler` : 'Sonuç bulunamadı'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP</TableHead>
                          <TableHead>Ülke</TableHead>
                          <TableHead>Şehir</TableHead>
                          <TableHead>ISP</TableHead>
                          <TableHead>Organizasyon</TableHead>
                          <TableHead>Zaman Dilimi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{result.query || '-'}</TableCell>
                          <TableCell>{result.country || '-'}</TableCell>
                          <TableCell>{result.city || '-'}</TableCell>
                          <TableCell>{result.isp || '-'}</TableCell>
                          <TableCell>{result.org || '-'}</TableCell>
                          <TableCell>{result.timezone || '-'}</TableCell>
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
    title: 'IP Sorgu',
    href: '/ip-sorgu',
    isActive: true,
  },
] 