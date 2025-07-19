import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Loader2, Search, Users, User, Baby, Heart, Users2, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { TopNav } from '@/components/layout/top-nav';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search as SearchComponent } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

interface SulaleKisi {
    iliski: string;
    TC: string;
    ADI: string;
    SOYADI: string;
    DOGUMTARIHI: string;
    ANNEADI: string;
    ANNETC: string;
    BABAADI: string;
    BABATC: string;
    NUFUSIL: string;
    NUFUSILCE: string;
    UYRUK: string;
}

interface SulaleData {
    kendisi: SulaleKisi;
    kardesler: SulaleKisi[];
    yegenler: SulaleKisi[];
    cocuklar: SulaleKisi[];
    amcaHala: SulaleKisi[];
    dayiTeyze: SulaleKisi[];
    kuzenler: SulaleKisi[];
    dedeler: SulaleKisi[];
    nineler: SulaleKisi[];
    buyukler: SulaleKisi[];
}

interface SulaleResponse {
    success: boolean;
    data: SulaleData;
    totalCount: number;
    message?: string;
}

const topNav = [
  {
    title: 'Sülale Sorgu',
    href: '/sulale-sorgu',
    isActive: true,
  },
]

const SulaleSorgu = () => {
    const [tc, setTc] = useState('');
    const [sulaleData, setSulaleData] = useState<SulaleData | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tc');
    const [_error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const formatTC = (tc: string) => {
        if (!tc) return '-';
        return tc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4');
    };

    const searchByTC = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSulaleData(null);
        setHasSearched(false);
        if (!tc || tc.length !== 11) {
            setError('Geçerli bir TC kimlik numarası giriniz (11 haneli)');
            toast({ title: 'Eksik Bilgi', description: 'Geçerli bir TC kimlik numarası giriniz (11 haneli)', variant: 'destructive' });
            return;
        }
        setLoading(true);
        toast({ title: 'Aranıyor...', description: 'TC ile sülale sorgusu yapılıyor.' });
        try {
            const response = await fetch(`http://78.185.19.222:5000/api/sulale/tc/${tc}`);
            const data: SulaleResponse = await response.json();
            if (data.success) {
                setSulaleData(data.data);
                toast({ title: 'Sorgu tamamlandı', description: `${data.totalCount} kişi bulundu.` });
            } else {
                setError(data.message || "Sorguladığınız TC ile kayıtlı bir kişi bulunamadı.");
                toast({ title: 'Sonuç bulunamadı', description: data.message || 'Kriterlere uygun kayıt bulunamadı.' });
            }
        } catch (_error) {
            setError("Sunucu bağlantı hatası");
            toast({ title: 'Hata', description: 'Sunucu bağlantı hatası' });
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    const _searchBySoyad = async (_e: React.FormEvent) => {
        _e.preventDefault();
        setError('');
        setSulaleData(null);
        setHasSearched(false);
        if (!tc || tc.length < 2) {
            setError('En az 2 karakter giriniz');
            toast({ title: 'Eksik Bilgi', description: 'En az 2 karakter giriniz', variant: 'destructive' });
            return;
        }
        setLoading(true);
        toast({ title: 'Aranıyor...', description: 'Soyad ile sülale sorgusu yapılıyor.' });
        try {
            const response = await fetch(`http://78.185.19.222:5000/api/sulale/soyad/${encodeURIComponent(tc)}`);
            const data = await response.json();
            if (data.success) {
                if (data.data.length > 0) {
                    setSulaleData(data.data[0].sulale);
                    toast({ title: 'Sorgu tamamlandı', description: `${data.totalResults} farklı soyad bulundu, ilki gösteriliyor.` });
                } else {
                    setError("Bu soyada sahip kişi bulunamadı");
                    toast({ title: 'Sonuç bulunamadı', description: 'Bu soyada sahip kişi bulunamadı.' });
                }
            } else {
                setError(data.message || "Sorguladığınız soyada sahip kişi bulunamadı.");
                toast({ title: 'Sonuç bulunamadı', description: data.message || 'Kriterlere uygun kayıt bulunamadı.' });
            }
        } catch (_error) {
            setError("Sunucu bağlantı hatası");
            toast({ title: 'Hata', description: 'Sunucu bağlantı hatası' });
        } finally {
            setLoading(false);
            setHasSearched(true);
        }
    };

    const _renderKisiCard = (_kisi: SulaleKisi, _icon: React.ReactNode, _title: string) => (
        <></>
    );

    return (
        <>
            <Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <SearchComponent />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='mb-6'>
                    <h1 className='text-2xl md:text-3xl font-bold tracking-tight'>Sülale Sorgu</h1>
                    <p className='text-muted-foreground mt-2'>
                        TC kimlik numarası veya soyad ile sülale bilgilerini sorgulayın
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Arama Formu - Tam Genişlik */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users2 className="h-5 w-5" />
                                Sülale Sorgu Formu
                            </CardTitle>
                            <CardDescription>
                                TC kimlik numarası veya soyad ile sülale bilgilerini sorgulayın
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                                {/* Sol Taraf - Form */}
                                <div className="lg:col-span-2">
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <TabsContent value="tc" className="space-y-4 mt-6">
                                            <form onSubmit={searchByTC} className="space-y-4">
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
                                                    {_error && (
                                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                                            <AlertCircle className="h-4 w-4" />
                                                            {_error}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <Button type="submit" className="w-full" disabled={loading || tc.length !== 11}>
                                                    <Search className="mr-2 h-4 w-4" />
                                                    {loading ? 'Sorgulanıyor...' : 'Sorgula'}
                                                </Button>
                                            </form>
                                        </TabsContent>
                                    </Tabs>
                                </div>

                                {/* Sağ Taraf - İstatistikler */}
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>İstatistikler</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Toplam Sorgu</span>
                                                <span className="text-sm font-medium">1,234</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Başarılı</span>
                                                <span className="text-sm font-medium text-green-600">1,189</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Başarı Oranı</span>
                                                <span className="text-sm font-medium text-blue-600">96.4%</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sülale Bilgileri - Tam Genişlik */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 w-full bg-background border border-border rounded-lg">
                            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-2" />
                            <span className="text-muted-foreground">Sorgulanıyor...</span>
                        </div>
                    ) : hasSearched ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Sülale Bilgileri</CardTitle>
                                <CardDescription>
                                    {sulaleData 
                                        ? 'Sülale bilgileri başarıyla getirildi' 
                                        : 'Sonuç bulunamadı'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sulaleData ? (
                                    <div className="space-y-6">
                                    {/* Ana Kişi */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Ana Kişi
                                                <Badge variant="secondary" className="text-xs">
                                                    {sulaleData.kendisi.iliski}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                                                    {sulaleData.kendisi.ADI.charAt(0)}{sulaleData.kendisi.SOYADI.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-lg">{sulaleData.kendisi.ADI} {sulaleData.kendisi.SOYADI}</div>
                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(sulaleData.kendisi.TC)}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Kardeşler */}
                                    {sulaleData.kardesler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="h-5 w-5" />
                                                    Kardeşler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.kardesler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.kardesler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Yeğenler */}
                                    {sulaleData.yegenler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <UserCheck className="h-5 w-5" />
                                                    Yeğenler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.yegenler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.yegenler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Çocuklar, Torunlar, Torunun Çocukları */}
                                    {sulaleData.cocuklar?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Baby className="h-5 w-5" />
                                                    Çocuklar ve Alt Nesil
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.cocuklar.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.cocuklar.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Amca/Hala */}
                                    {sulaleData.amcaHala?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users2 className="h-5 w-5" />
                                                    Amca / Hala
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.amcaHala.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.amcaHala.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Dayı/Teyze */}
                                    {sulaleData.dayiTeyze?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users2 className="h-5 w-5" />
                                                    Dayı / Teyze
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.dayiTeyze.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.dayiTeyze.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Kuzenler */}
                                    {sulaleData.kuzenler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="h-5 w-5" />
                                                    Kuzenler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.kuzenler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.kuzenler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Dedeler */}
                                    {sulaleData.dedeler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5" />
                                                    Dedeler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.dedeler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.dedeler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Nineler */}
                                    {sulaleData.nineler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Heart className="h-5 w-5" />
                                                    Nineler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.nineler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.nineler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Büyük Dedeler/Nineler */}
                                    {sulaleData.buyukler?.length > 0 && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <User className="h-5 w-5" />
                                                    Büyük Dedeler / Nineler
                                                    <Badge variant="secondary" className="text-xs">{sulaleData.buyukler.length} kişi</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {sulaleData.buyukler.map((kisi) => (
                                                        <div key={kisi.TC} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                                                    {kisi.ADI.charAt(0)}{kisi.SOYADI.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">{kisi.ADI} {kisi.SOYADI}</div>
                                                                    <div className="text-sm text-muted-foreground">TC: {formatTC(kisi.TC)}</div>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline">{kisi.iliski}</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">Sonuç bulunamadı</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : null}
                </div>
            </Main>
        </>
    );
};

export default SulaleSorgu; 