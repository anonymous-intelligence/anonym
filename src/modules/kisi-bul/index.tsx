import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, X } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { TopNav } from '@/components/layout/top-nav';
import { ThemeSwitch } from '@/components/theme-switch';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import ilIlceData from '@/lib/il-ilce.json';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useState } from 'react';

// Basit iller örneği
const iller = ilIlceData.map(item => item.il);

const realSearch = async (filters: Record<string, unknown>) => {
  try {
    
    const response = await fetch('http://localhost:5000/api/kisi-bul/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ad: filters.ad || '',
        soyad: filters.soyad || '',
        dogumTarihiBaslangic: filters.dogumTarihiBaslangic || '',
        dogumTarihiBitis: filters.dogumTarihiBitis || '',
        il: filters.il || '',
        ilce: filters.ilce || '',
        acikAdres: filters.adres || '',
        hataPayi: 0.2,
        benzerlikOrani: 0.7,
        limit: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

        if (data.success && data.data && Array.isArray(data.data)) {
      return data.data.map((item: Record<string, unknown>, index: number) => {
        const mappedItem = {
          id: index + 1,
          tc: item.TC || item.tc,
          ad: item.ADI || item.ad,
          soyad: item.SOYADI || item.soyad,
          il: item.NUFUSIL || item.il,
          ilce: item.NUFUSILCE || item.ilce,
          adres: item.Ikametgah || item.ikametgah || item.adres,
          dogumTarihi: item.DOGUMTARIHI || item.dogumTarihi,
          dogumYeri: item.DogumYeri || item.dogumYeri,
          babaAdi: item.BABAADI || item.babaAdi,
          anaAdi: item.ANNEADI || item.anaAdi,
          cinsiyet: item.CINSIYET || item.cinsiyet,
          uyruk: item.UYRUK || item.uyruk,
          source: item.source || '101m',
          additionalInfo: item.additionalInfo || {}
        };
        return mappedItem;
      });
    } else {
      return [];
    }
  } catch (_error) {
    return [];
  }
};

const topNav = [
  { title: 'Kişi Bul', href: '/kisi-bul', isActive: true },
];

// Chip MultiSelect component
function ChipMultiSelect({ options, selected, setSelected, placeholder }: { options: string[], selected: string[], setSelected: (v: string[]) => void, placeholder?: string }) {
  const [input, setInput] = useState('');
  const filteredOptions = options.filter(opt => !selected.includes(opt) && (!input || opt.toLowerCase().includes(input.toLowerCase())));
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map(val => (
          <span key={val} className="inline-flex items-center bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs">
            {val}
            <button type="button" className="ml-1" onClick={() => setSelected(selected.filter(s => s !== val))}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder || 'Seçiniz'}
        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
        onKeyDown={e => {
          if (e.key === 'Enter' && filteredOptions.length > 0) {
            setSelected([...selected, filteredOptions[0]]);
            setInput('');
            e.preventDefault();
          }
        }}
      />
      {filteredOptions.length > 0 && input && (
        <div className="border border-input rounded bg-background mt-1 max-h-40 overflow-auto z-10 relative">
          {filteredOptions.map(opt => (
            <div key={opt} className="px-3 py-1 cursor-pointer hover:bg-muted" onClick={() => { setSelected([...selected, opt]); setInput(''); }}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KisiBul() {
  // Wizard state
  const [step, setStep] = useState(1);
  const [wizardAnswers, setWizardAnswers] = useState({
    knowsName: undefined as undefined | boolean,
    ad: '',
    soyad: '',
    knowsSurname: undefined as undefined | boolean,
    knowsBirth: undefined as undefined | boolean,
    dogum: '',
    yas: '',
    // Çoklu seçim için diziye çeviriyoruz
    il: [] as string[],
    ilce: [] as string[],
    knowsAdres: undefined as undefined | boolean,
    adres: '',
  });
  // Form ve sonuç state
  const [form, _setForm] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // İlçe listesini seçilen ile göre bul
  const selectedIl = form.il ?? wizardAnswers.il;
  const _ilceler = ilIlceData.find(item => item.il === selectedIl)?.ilceler || [];

  // Wizard adımları
  function renderWizardStep() {
    // 1. Adım: Ad bilgisi
    if (step === 1) {
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>Ad Bilgisi</CardTitle>
            <CardDescription>Aradığınız kişinin adını biliyor musunuz?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {wizardAnswers.knowsName === undefined && (
              <div className="flex gap-4">
                <Button onClick={() => setWizardAnswers(a => ({ ...a, knowsName: true }))}>Evet</Button>
                <Button variant="secondary" onClick={() => { setWizardAnswers(a => ({ ...a, knowsName: false, ad: '' })); setStep(2); }}>Hayır</Button>
              </div>
            )}
            {wizardAnswers.knowsName === true && (
              <>
                <Input placeholder="Ad" value={wizardAnswers.ad} onChange={e => setWizardAnswers(a => ({ ...a, ad: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                <div className="flex gap-4 mt-4">
                  <Button onClick={() => setWizardAnswers(a => ({ ...a, knowsName: undefined }))} variant="secondary">Geri</Button>
                  <Button onClick={() => setStep(2)} disabled={!wizardAnswers.ad}>Devam</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      );
    }
    // 2. Adım: Soyad bilgisi
    if (step === 2) {
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>Soyad Bilgisi</CardTitle>
            <CardDescription>Soyadını biliyor musunuz?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {wizardAnswers.knowsSurname === undefined && (
              <div className="flex gap-4">
                <Button onClick={() => setWizardAnswers(a => ({ ...a, knowsSurname: true }))}>Evet</Button>
                <Button variant="secondary" onClick={() => { setWizardAnswers(a => ({ ...a, knowsSurname: false, soyad: '' })); setStep(3); }}>Hayır</Button>
              </div>
            )}
            {wizardAnswers.knowsSurname === true && (
              <>
                <Input placeholder="Soyad" value={wizardAnswers.soyad} onChange={e => setWizardAnswers(a => ({ ...a, soyad: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
                <div className="flex gap-4 mt-4">
                  <Button onClick={() => setWizardAnswers(a => ({ ...a, knowsSurname: undefined }))} variant="secondary">Geri</Button>
                  <Button onClick={() => setStep(3)} disabled={!wizardAnswers.soyad}>Devam</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      );
    }
    // 3. Adım: Doğum tarihi veya yaş
    if (step === 3) {
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>Doğum Tarihi veya Yaş</CardTitle>
            <CardDescription>Doğum tarihi veya tahmini yaşını biliyor musunuz?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input type="date" placeholder="Doğum Tarihi" value={wizardAnswers.dogum} onChange={e => setWizardAnswers(a => ({ ...a, dogum: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
            <span className="text-center text-muted-foreground">veya</span>
            <Input type="number" placeholder="Tahmini Yaş" min="1" max="120" value={wizardAnswers.yas} onChange={e => setWizardAnswers(a => ({ ...a, yas: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(2)} variant="secondary">Geri</Button>
              <Button onClick={() => setStep(4)} disabled={!wizardAnswers.dogum && !wizardAnswers.yas}>Devam</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    // 4. Adım: İl bilgisi
    if (step === 4) {
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>İl Bilgisi</CardTitle>
            <CardDescription>Hangi il(ler)de yaşadığını biliyor musunuz? Birden fazla il seçebilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ChipMultiSelect
              options={iller}
              selected={wizardAnswers.il}
              setSelected={vals => setWizardAnswers(a => ({ ...a, il: vals, ilce: [] }))}
              placeholder="İl seçin"
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(3)} variant="secondary">Geri</Button>
              <Button onClick={() => setStep(5)} disabled={wizardAnswers.il.length === 0}>Devam</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    // 5. Adım: İlçe bilgisi
    if (step === 5) {
      // Seçilen illere göre ilçeleri birleştir
      const allIlceler = wizardAnswers.il.flatMap(il => ilIlceData.find(item => item.il === il)?.ilceler || []);
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>İlçe Bilgisi</CardTitle>
            <CardDescription>İlçe(ler) arasında kaldıysanız birden fazla ilçe seçebilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ChipMultiSelect
              options={allIlceler}
              selected={wizardAnswers.ilce}
              setSelected={vals => setWizardAnswers(a => ({ ...a, ilce: vals }))}
              placeholder="İlçe seçin"
            />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(4)} variant="secondary">Geri</Button>
              <Button onClick={() => setStep(6)} disabled={wizardAnswers.ilce.length === 0}>Devam</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    // 6. Adım: Adres veya mahalle
    if (step === 6) {
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>Adres/Mahalle Bilgisi</CardTitle>
            <CardDescription>Adres veya mahalle bilgisi var mı?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea placeholder="Adres veya mahalle" value={wizardAnswers.adres} onChange={e => setWizardAnswers(a => ({ ...a, adres: e.target.value }))} className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground" />
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(5)} variant="secondary">Geri</Button>
              <Button onClick={() => setStep(7)}>Devam</Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    // 7. Adım: Özet ve arama
    if (step === 7) {
      if (loading) {
        return (
          <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center justify-center w-full h-[40vh]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <span className="text-lg font-semibold text-primary">Kişi aranıyor...</span>
            </div>
          </div>
        );
      }
      return (
        <Card className="max-w-lg mx-auto mt-8">
          <CardHeader>
            <CardTitle>Bilgileri Gözden Geçir</CardTitle>
            <CardDescription>Girdiğiniz bilgilerle arama yapabilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md text-sm">
              <div><b>Ad:</b> {wizardAnswers.ad || '-'}</div>
              <div><b>Soyad:</b> {wizardAnswers.soyad || '-'}</div>
              <div><b>Doğum Tarihi:</b> {wizardAnswers.dogum || '-'}</div>
              <div><b>Yaş:</b> {wizardAnswers.yas || '-'}</div>
              <div><b>İl(ler):</b> {wizardAnswers.il.length > 0 ? wizardAnswers.il.map(i => <span key={i} className="inline-block bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs mr-1">{i}</span>) : '-'}</div>
              <div><b>İlçe(ler):</b> {wizardAnswers.ilce.length > 0 ? wizardAnswers.ilce.map(i => <span key={i} className="inline-block bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs mr-1">{i}</span>) : '-'}</div>
              <div><b>Adres:</b> {wizardAnswers.adres || '-'}</div>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setStep(6)} variant="secondary">Geri</Button>
              <Button onClick={async () => {
                setLoading(true);
                setError(null);
                setHasSearched(false);
                toast({ title: 'Aranıyor...', description: 'Kriterlere uygun kişiler sorgulanıyor.' });
                let dogumTarihiBaslangic = '';
                let dogumTarihiBitis = '';
                if (wizardAnswers.dogum) {
                  dogumTarihiBaslangic = wizardAnswers.dogum;
                  dogumTarihiBitis = wizardAnswers.dogum;
                } else if (wizardAnswers.yas) {
                  const yas = parseInt(wizardAnswers.yas);
                  const currentYear = new Date().getFullYear();
                  const tahminiDogumYili = currentYear - yas;
                  const baslangicYili = tahminiDogumYili - 5;
                  const bitisYili = tahminiDogumYili + 5;
                  dogumTarihiBaslangic = `${baslangicYili}-01-01`;
                  dogumTarihiBitis = `${bitisYili}-12-31`;
                }
                const filters = {
                  ad: wizardAnswers.ad,
                  soyad: wizardAnswers.soyad,
                  dogumTarihiBaslangic,
                  dogumTarihiBitis,
                  il: wizardAnswers.il,
                  ilce: wizardAnswers.ilce,
                  adres: wizardAnswers.adres,
                };
                try {
                  const res = await realSearch(filters);
                  setResults(res);
                  setHasSearched(true);
                  setLoading(false);
                  setStep(10);
                  if (res.length === 0) {
                    toast({
                      title: "Sonuç Bulunamadı",
                      description: "Aradığınız kişiye ait bilgiler bulunamadı.",
                      variant: "destructive",
                    });
                  } else {
                    toast({
                      title: "Sonuç Bulundu",
                      description: `${res.length} sonuç bulundu.`,
                    });
                  }
                } catch (_err) {
                  setError('Arama sırasında bir hata oluştu.');
                  setLoading(false);
                  setStep(10);
                  toast({ title: 'Hata', description: 'Arama sırasında bir hata oluştu.', variant: 'destructive' });
                }
              }}>Arama Yap</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // 10. Adım: Sonuçlar tablo/spinner/toast
    if (step === 10) {
      if (loading) {
        return (
          <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center justify-center w-full h-[40vh]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <span className="text-lg font-semibold text-primary">Kişi aranıyor...</span>
            </div>
          </div>
        );
      } else if (error) {
        return (
          <div className="flex flex-col items-center justify-center w-full h-[40vh] text-red-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        );
      } else if (Array.isArray(results) && results.length > 0) {
        return (
          <div className="w-full">
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>TC</TableHead>
                    <TableHead>Ad</TableHead>
                    <TableHead>Soyad</TableHead>
                    <TableHead>Doğum Tarihi</TableHead>
                    <TableHead>İl</TableHead>
                    <TableHead>İlçe</TableHead>
                    <TableHead>Ana Adı</TableHead>
                    <TableHead>Baba Adı</TableHead>
                    <TableHead>Uyruk</TableHead>
                    <TableHead>Kaynak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{typeof r.tc === 'string' ? r.tc : ''}</TableCell>
                      <TableCell>{typeof r.ad === 'string' ? r.ad : ''}</TableCell>
                      <TableCell>{typeof r.soyad === 'string' ? r.soyad : ''}</TableCell>
                      <TableCell>{typeof r.dogumTarihi === 'string' ? r.dogumTarihi : ''}</TableCell>
                      <TableCell>{typeof r.il === 'string' ? r.il : ''}</TableCell>
                      <TableCell>{typeof r.ilce === 'string' ? r.ilce : ''}</TableCell>
                      <TableCell>{typeof r.anaAdi === 'string' ? r.anaAdi : ''}</TableCell>
                      <TableCell>{typeof r.babaAdi === 'string' ? r.babaAdi : ''}</TableCell>
                      <TableCell>{typeof r.uyruk === 'string' ? r.uyruk : ''}</TableCell>
                      <TableCell><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{typeof r.source === 'string' ? r.source : ''}</span></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-6 w-full">
              <Button onClick={() => {
                setStep(1);
                setWizardAnswers({
                  knowsName: undefined,
                  ad: '',
                  knowsSurname: undefined,
                  soyad: '',
                  knowsBirth: undefined,
                  dogum: '',
                  yas: '',
                  il: [],
                  ilce: [],
                  knowsAdres: undefined,
                  adres: ''
                });
                setResults([]);
                setHasSearched(false);
                setError(null);
              }} className="w-full max-w-xs">Yeni Arama</Button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center justify-center w-full h-[40vh]">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">Sonuç bulunamadı</p>
          </div>
        );
      }
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
      <main className="p-6">
        <div className='mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Kişi Bul</h1>
          <p className='text-muted-foreground mt-2'>Adım adım wizard ile kişi bulma sistemi</p>
        </div>
        {/* Wizard adımları sadece arama yapılmamışken */}
        {(!hasSearched && !loading) ? renderWizardStep() : null}

        {/* Arama sonrası sonuçlar */}
        {(hasSearched && !loading) && (
          error ? (
            <div className="flex flex-col items-center justify-center w-full h-[40vh] text-red-500">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-semibold">{error}</p>
            </div>
          ) : (
            Array.isArray(results) && results.length > 0 ? (
              <div className="w-full">
                <div className="overflow-x-auto w-full">
                  <Table className="w-full min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>TC</TableHead>
                        <TableHead>Ad</TableHead>
                        <TableHead>Soyad</TableHead>
                        <TableHead>Doğum Tarihi</TableHead>
                        <TableHead>İl</TableHead>
                        <TableHead>İlçe</TableHead>
                        <TableHead>Ana Adı</TableHead>
                        <TableHead>Baba Adı</TableHead>
                        <TableHead>Uyruk</TableHead>
                        <TableHead>Kaynak</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{typeof r.tc === 'string' ? r.tc : ''}</TableCell>
                          <TableCell>{typeof r.ad === 'string' ? r.ad : ''}</TableCell>
                          <TableCell>{typeof r.soyad === 'string' ? r.soyad : ''}</TableCell>
                          <TableCell>{typeof r.dogumTarihi === 'string' ? r.dogumTarihi : ''}</TableCell>
                          <TableCell>{typeof r.il === 'string' ? r.il : ''}</TableCell>
                          <TableCell>{typeof r.ilce === 'string' ? r.ilce : ''}</TableCell>
                          <TableCell>{typeof r.anaAdi === 'string' ? r.anaAdi : ''}</TableCell>
                          <TableCell>{typeof r.babaAdi === 'string' ? r.babaAdi : ''}</TableCell>
                          <TableCell>{typeof r.uyruk === 'string' ? r.uyruk : ''}</TableCell>
                          <TableCell><span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{typeof r.source === 'string' ? r.source : ''}</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-center mt-6 w-full">
                  <Button onClick={() => {
                    setStep(1);
                    setWizardAnswers({
                      knowsName: undefined,
                      ad: '',
                      knowsSurname: undefined,
                      soyad: '',
                      knowsBirth: undefined,
                      dogum: '',
                      yas: '',
                      il: [],
                      ilce: [],
                      knowsAdres: undefined,
                      adres: ''
                    });
                    setResults([]);
                    setHasSearched(false);
                    setError(null);
                  }} className="w-full max-w-xs">Yeni Arama</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[40vh]">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Sonuç bulunamadı</p>
                <div className="flex justify-center mt-6 w-full">
                  <Button onClick={() => {
                    setStep(1);
                    setWizardAnswers({
                      knowsName: undefined,
                      ad: '',
                      knowsSurname: undefined,
                      soyad: '',
                      knowsBirth: undefined,
                      dogum: '',
                      yas: '',
                      il: [],
                      ilce: [],
                      knowsAdres: undefined,
                      adres: ''
                    });
                    setResults([]);
                    setHasSearched(false);
                    setError(null);
                  }} className="w-full max-w-xs">Yeni Arama</Button>
                </div>
              </div>
            )
          )
        )}

        {/* Yükleniyor animasyonu */}
        {loading && (
          <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center justify-center w-full h-[40vh]">
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <span className="text-lg font-semibold text-primary">Kişi aranıyor...</span>
            </div>
          </div>
        )}
      </main>
    </>
  );
} 