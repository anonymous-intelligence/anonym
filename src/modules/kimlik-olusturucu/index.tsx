import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useRef } from 'react'
import domtoimage from 'dom-to-image';

export default function KimlikOlusturucu() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    birth_date: '',
    gender: '',
    tckn: '',
    document_number: '',
    valid_until: '',
    mother_name: '',
    father_name: '',
    image: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kimlikRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null
      setForm(f => ({ ...f, image: file }))
      if (file) {
        const reader = new FileReader()
        reader.onload = ev => setPreview(ev.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSelect = (name: string, value: string) => {
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleDownload = async () => {
    if (!kimlikRef.current) return;
    const dataUrl = await domtoimage.toPng(kimlikRef.current);
    const link = document.createElement('a');
    link.download = 'kimlik.png';
    link.href = dataUrl;
    link.click();
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Kimlik Oluşturucu</h1>
        <p className="text-muted-foreground">Gerçekçi kimlik bilgileri oluşturma</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kimlik Bilgileri</CardTitle>
            <CardDescription>Oluşturulacak kimlik bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">İsim</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="surname">Soyisim</Label>
                  <Input id="surname" name="surname" value={form.surname} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="birth_date">Doğum Tarihi</Label>
                  <Input id="birth_date" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="gender">Cinsiyet</Label>
                  <Select value={form.gender} onValueChange={v => handleSelect('gender', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cinsiyet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Erkek">Erkek</SelectItem>
                      <SelectItem value="Kadın">Kadın</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tckn">T.C. Kimlik No</Label>
                  <Input id="tckn" name="tckn" value={form.tckn} onChange={handleChange} required maxLength={11} />
                </div>
                <div>
                  <Label htmlFor="document_number">Seri No</Label>
                  <Input id="document_number" name="document_number" value={form.document_number} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="valid_until">Son Geçerlilik Tarihi</Label>
                  <Input id="valid_until" name="valid_until" type="date" value={form.valid_until} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="mother_name">Anne Adı</Label>
                  <Input id="mother_name" name="mother_name" value={form.mother_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="father_name">Baba Adı</Label>
                  <Input id="father_name" name="father_name" value={form.father_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="image">Kimlik Fotoğrafı</Label>
                  <Input id="image" name="image" type="file" accept="image/*" onChange={handleChange} ref={fileInputRef} required />
                  {preview && (
                    <img src={preview} alt="Kimlik fotoğrafı önizleme" className="mt-2 rounded w-24 h-32 object-cover border" />
                  )}
                </div>
              </div>
              <Button className="w-full mt-4" type="submit">Kimlik Oluştur</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Oluşturulan Kimlik</CardTitle>
            <CardDescription>Formu doldurup oluşturduğunuzda burada gözükecek</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="w-full flex flex-col items-center gap-4">
                {/* Kimlik Mockup (Ön Yüz) */}
                <div
                  ref={kimlikRef}
                  className="relative w-[430px] h-[270px] rounded-xl overflow-hidden shadow-lg border bg-white"
                  style={{ backgroundImage: 'url(/images/front-empty.png)', backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  {/* TCKN */}
                  <div className="absolute left-[32px] top-[48px] text-[22px] font-bold tracking-widest text-gray-900" style={{letterSpacing:'2px'}}>{form.tckn}</div>
                  {/* Fotoğraf */}
                  {preview && (
                    <img
                      src={preview}
                      alt="Kimlik fotoğrafı"
                      className="absolute left-[32px] top-[78px] w-[98px] h-[120px] object-cover rounded-sm border border-gray-300 grayscale"
                      style={{filter:'grayscale(1)'}}
                    />
                  )}
                  {/* Soyadı */}
                  <div className="absolute left-[150px] top-[80px] text-[11px] text-gray-700 font-normal">Soyadı / Surname</div>
                  <div className="absolute left-[150px] top-[95px] text-[18px] font-bold text-gray-900">{form.surname}</div>
                  {/* Adı */}
                  <div className="absolute left-[150px] top-[120px] text-[11px] text-gray-700 font-normal">Adı / Given Name(s)</div>
                  <div className="absolute left-[150px] top-[135px] text-[18px] font-bold text-gray-900">{form.name}</div>
                  {/* Doğum Tarihi */}
                  <div className="absolute left-[150px] top-[160px] text-[11px] text-gray-700 font-normal">Doğum Tarihi / Date of Birth</div>
                  <div className="absolute left-[150px] top-[175px] text-[16px] font-bold text-gray-900">{form.birth_date}</div>
                  {/* Cinsiyet */}
                  <div className="absolute left-[290px] top-[160px] text-[11px] text-gray-700 font-normal">Cinsiyeti / Gender</div>
                  <div className="absolute left-[290px] top-[175px] text-[16px] font-bold text-gray-900">{form.gender}</div>
                  {/* Seri No */}
                  <div className="absolute left-[150px] top-[200px] text-[11px] text-gray-700 font-normal">Seri No / Document No</div>
                  <div className="absolute left-[150px] top-[215px] text-[16px] font-bold text-gray-900">{form.document_number}</div>
                  {/* Uyruk */}
                  <div className="absolute left-[290px] top-[200px] text-[11px] text-gray-700 font-normal">Uyruğu / Nationality</div>
                  <div className="absolute left-[290px] top-[215px] text-[16px] font-bold text-gray-900">T.C./TUR</div>
                  {/* Son Geçerlilik */}
                  <div className="absolute left-[150px] top-[240px] text-[11px] text-gray-700 font-normal">Son Geçerlilik / Valid Until</div>
                  <div className="absolute left-[150px] top-[255px] text-[16px] font-bold text-gray-900">{form.valid_until}</div>
                  {/* İmza (placeholder) */}
                  <div className="absolute right-[32px] bottom-[18px] text-[24px] text-gray-700 select-none">✍️</div>
                  {/* Küçük vesikalık (placeholder) */}
                  {preview && (
                    <img
                      src={preview}
                      alt="Küçük vesikalık"
                      className="absolute right-[38px] bottom-[38px] w-[38px] h-[38px] object-cover rounded-full border border-gray-300 grayscale opacity-70"
                      style={{filter:'grayscale(1)'}}
                    />
                  )}
                </div>
                <Button variant="outline" onClick={handleDownload}>Kimliği PNG Olarak İndir</Button>
              </div>
            ) : (
              <div className="text-muted-foreground text-center">Henüz kimlik oluşturulmadı.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 