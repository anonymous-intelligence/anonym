import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export const Route = createFileRoute()({
  component: SmsBomber,
})

function SmsBomber() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  interface SmsBomberDetail {
    success: boolean;
    service: string;
  }

  const [result, setResult] = useState<null | {success: boolean, sent: number, details: SmsBomberDetail[] }>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast();

  // Telefon numarasını normalize et
  const normalizePhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('90')) digits = digits.slice(2);
    if (digits.startsWith('0')) digits = digits.slice(1);
    return digits.slice(0, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('http://78.185.19.222:5000/api/sms-bomber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, mail: message, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Bilinmeyen hata')
      setResult(data)
      // Her SMS sonucu için toast göster
      if (data.details && Array.isArray(data.details)) {
        (data.details as SmsBomberDetail[]).forEach((d) => {
          toast({
            title: d.success ? 'SMS Gönderildi' : 'SMS Gönderilemedi',
            description: `${d.service}: ${d.success ? 'Başarılı' : 'Başarısız'}`,
            variant: d.success ? 'default' : 'destructive',
          })
        })
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Bir hata oluştu')
      toast({ title: 'Hata', description: error.message || 'Bir hata oluştu', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">SMS Bomber VIP</h1>
        <p className="text-muted-foreground">Gelişmiş SMS gönderme hizmeti</p>
        <Badge variant="destructive" className="mt-2">VIP</Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SMS Gönder</CardTitle>
            <CardDescription>Telefon numarasına SMS gönder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input id="phone" placeholder="5XXXXXXXXX" value={phone} onChange={e => setPhone(normalizePhone(e.target.value))} required maxLength={10} />
                <small className="text-xs text-muted-foreground">
                  Lütfen başında 0 veya +90 olmadan, sadece 10 haneli numara girin. (Örn: 5551234567)
                </small>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mail (isteğe bağlı)</Label>
                <Input id="message" placeholder="Mail adresi veya boş bırakın" value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="count">Gönderim Sayısı</Label>
                <Input id="count" type="number" placeholder="1-100" min="1" max="100" value={count} onChange={e => setCount(Number(e.target.value))} required />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Gönderiliyor...' : 'SMS Gönder'}</Button>
            </form>
            {error && <div className="text-red-500">Hata: {error}</div>}
            {result && (
              <div className="mt-4">
                <div className="text-green-600 font-bold">Başarıyla gönderildi! Toplam: {result.sent}</div>
                <ul className="text-xs mt-2 max-h-40 overflow-auto">
                  {result.details.map((d, i) => (
                    <li key={i} className={d.success ? 'text-green-700' : 'text-red-700'}>
                      {d.service}: {d.success ? 'Başarılı' : 'Başarısız'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hizmet Özellikleri</CardTitle>
            <CardDescription>VIP üyelik avantajları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sınırsız SMS gönderimi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Özel mesaj şablonları</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Gelişmiş raporlama</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>7/24 destek</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>API erişimi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SmsBomber 