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
import { Search as SearchIcon, Phone, AlertCircle, Loader2 } from "lucide-react"
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast';

export default function OperatorSorgu() {
  const [phone, setPhone] = useState('')
  interface OperatorSorguResult {
    phone: string;
    valid: boolean;
    format?: {
      international?: string;
      local?: string;
    };
    country?: {
      code?: string;
      name?: string;
      prefix?: string;
    };
    location?: string;
    type?: string;
    carrier?: string;
  }
  const [result, setResult] = useState<OperatorSorguResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toast } = useToast();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setIsLoading(true)
    setHasSearched(false)
    toast({ title: 'Sorgulanıyor...', description: 'Telefon numarası sorgulanıyor.' })

    // Numara doğrulama (en az 10 hane, rakam)
    if (!/^\d{10,15}$/.test(phone)) {
      setError('Geçerli bir telefon numarası girin (ülke kodu ile, örn: 905xxxxxxxxx)')
      toast({ title: 'Hatalı Giriş', description: 'Geçerli bir telefon numarası girin (ülke kodu ile, örn: 905xxxxxxxxx)', variant: 'destructive' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`http://78.185.19.222:5000/api/operator/${phone}`)
      const data = await response.json()
      if (data.valid) {
        setResult(data)
        toast({ title: 'Sorgu Başarılı', description: 'Numara bulundu.' })
      } else {
        setResult(null)
        setError('Numara geçersiz veya bulunamadı.')
        toast({ title: 'Sonuç bulunamadı', description: 'Numara geçersiz veya bulunamadı.', variant: 'destructive' })
      }
    } catch (_err) {
      setResult(null)
      setError('Sunucuya bağlanılamadı veya API limiti doldu.')
      toast({ title: 'Sunucu Hatası', description: 'Sunucuya bağlanılamadı veya API limiti doldu.', variant: 'destructive' })
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
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Operatör Sorgu</h1>
          <p className='text-muted-foreground mt-2'>
            Telefon numarasının hangi operatöre ait olduğunu öğrenin
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full mx-auto">
          {/* Sorgu Formu */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Operatör Sorgu
              </CardTitle>
              <CardDescription>
                Sorgulamak istediğiniz telefon numarasını girin (ülke kodu ile, örn: 905xxxxxxxxx)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefon Numarası</label>
                  <input
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="905xxxxxxxxx"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    maxLength={15}
                  />
                </div>
                <div className="flex flex-col gap-2">
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
                  {result ? 'Numara bulundu' : 'Sonuç bulunamadı'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Numara</TableHead>
                          <TableHead>Ülke</TableHead>
                          <TableHead>Operatör</TableHead>
                          <TableHead>Tip</TableHead>
                          <TableHead>Geçerli mi?</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{result.format?.international || '-'}</TableCell>
                          <TableCell>{result.country?.name || '-'}</TableCell>
                          <TableCell>{result.carrier || '-'}</TableCell>
                          <TableCell>{result.type || '-'}</TableCell>
                          <TableCell>{result.valid ? 'Evet' : 'Hayır'}</TableCell>
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
    title: "Operatör Sorgu",
    href: "/operator-sorgu",
    isActive: true,
  }
] 