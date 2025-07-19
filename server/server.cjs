const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database.cjs');
const kisiService = require('./services/kisiService.cjs');
const gsmService = require('./services/gsmService.cjs');
const sulaleService = require('./services/sulaleService.cjs');
const KisiBulService = require('./services/kisiBulService.cjs');
const AdSoyadService = require('./services/adSoyadService.cjs');
const operatorService = require('./services/operatorService.cjs');
const path = require('path');
const { askAI } = require('./ai/ai.cjs');
const aiServices = require('./aiServices.cjs');
const SmsBomberService = require('./services/smsBomberService.cjs');
const ipService = require('./services/ipService.cjs');
const altyapiService = require('./services/altyapiService.cjs');
const binService = require('./services/binService.cjs');
const dnsService = require('./services/dnsService.cjs');

const iptvService = require('./services/iptvService.cjs');
const StreamProxyService = require('./services/streamProxyService.cjs');
const authRoutes = require('./auth/index.cjs');

const app = express();

// Stream proxy servisi
const streamProxy = new StreamProxyService();
const PORT = process.env.PORT || 5000;

// Servis instance'ları
const kisiBulService = new KisiBulService();
const adSoyadService = new AdSoyadService();

// CORS middleware'i en başa ekle
app.use(cors({
  origin: [
    'http://78.185.19.222:5173',
    'https://anonymwhoami.vercel.app',
    'https://wexbie.com',
    'https://wexbie.com/anonym'
  ],
  credentials: true
}));
app.use(express.json());
app.use('/api', operatorService);
app.use('/api/auth', authRoutes);

// MySQL bağlantısını test et 
testConnection();

// Kişi Sorgu API endpoint'leri
app.get('/api/kisi/:tc', async (req, res) => {
    try {
        const { tc } = req.params;
        
        if (!tc || tc.length !== 11) {
            return res.status(400).json({ error: 'Geçersiz TC kimlik numarası' });
        }

        const kisi = await kisiService.getKisiByTC(tc);
        
        if (!kisi) {
            return res.status(404).json({ error: 'Kişi bulunamadı' });
        }

        res.json(kisi);
    } catch (error) {
        console.error('Kişi sorgu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/kisi/search', async (req, res) => {
    try {
        const { ad, soyad, dogumTarihi, il } = req.body;
        
        if (!ad || !soyad) {
            return res.status(400).json({ error: 'Ad ve soyad gereklidir' });
        }

        const kisiler = await kisiService.searchKisiByAdSoyad(ad, soyad, dogumTarihi, il);
        res.json(kisiler);
    } catch (error) {
        console.error('Kişi arama hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/kisi/stats', async (req, res) => {
    try {
        const stats = await kisiService.getStats();
        res.json(stats);
    } catch (error) {
        console.error('İstatistik hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// GSM TC Sorgu API endpoint'leri
app.get('/api/gsm/tc/:tc', async (req, res) => {
    try {
        const { tc } = req.params;
        
        if (!tc || tc.length !== 11) {
            return res.status(400).json({ error: 'Geçersiz TC kimlik numarası' });
        }

        const gsmData = await gsmService.getGsmByTC(tc);
        
        if (!gsmData) {
            return res.status(404).json({ error: 'GSM bilgisi bulunamadı' });
        }

        res.json(gsmData);
    } catch (error) {
        console.error('GSM sorgu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/gsm/number/:gsm', async (req, res) => {
    try {
        const { gsm } = req.params;
        
        if (!gsm || gsm.length < 10) {
            return res.status(400).json({ error: 'Geçersiz GSM numarası' });
        }

        const tcData = await gsmService.getTCByGsm(gsm);
        
        if (!tcData) {
            return res.status(404).json({ error: 'TC bilgisi bulunamadı' });
        }

        res.json(tcData);
    } catch (error) {
        console.error('TC sorgu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/gsm/data', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        
        const data = await gsmService.getAllGsmData(page, limit);
        res.json(data);
    } catch (error) {
        console.error('GSM veri getirme hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/gsm/stats', async (req, res) => {
    try {
        const stats = await gsmService.getStats();
        res.json(stats);
    } catch (error) {
        console.error('GSM istatistik hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Detaylı kişi bilgileri endpoint'i
app.get('/api/person/detailed/:tc', async (req, res) => {
    try {
        const { tc } = req.params;
        
        if (!tc || tc.length !== 11) {
            return res.status(400).json({ error: 'Geçersiz TC kimlik numarası' });
        }

        const detailedInfo = await gsmService.getDetailedPersonInfo(tc);
        
        if (!detailedInfo) {
            return res.status(404).json({ error: 'Kişi bilgisi bulunamadı' });
        }

        res.json(detailedInfo);
    } catch (error) {
        console.error('Detaylı kişi bilgisi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kardeş bilgileri endpoint'i
app.get('/api/person/siblings/:tc', async (req, res) => {
    try {
        const { tc } = req.params;
        
        if (!tc || tc.length !== 11) {
            return res.status(400).json({ error: 'Geçersiz TC kimlik numarası' });
        }

        const kardesBilgileri = await kisiService.getKardesBilgileri(tc);
        
        if (!kardesBilgileri.success) {
            return res.status(404).json({ error: kardesBilgileri.message });
        }

        res.json(kardesBilgileri);
    } catch (error) {
        console.error('Kardeş bilgileri hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Sülale sorgu endpoint'leri
app.get('/api/sulale/tc/:tc', async (req, res) => {
    try {
        const { tc } = req.params;
        
        if (!tc || tc.length !== 11) {
            return res.status(400).json({ error: 'Geçersiz TC kimlik numarası' });
        }

        const sulale = await sulaleService.getSulaleByTC(tc);
        
        if (!sulale.success) {
            return res.status(404).json({ error: sulale.message });
        }

        res.json(sulale);
    } catch (error) {
        console.error('Sülale sorgu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/sulale/soyad/:soyad', async (req, res) => {
    try {
        const { soyad } = req.params;
        
        if (!soyad || soyad.length < 2) {
            return res.status(400).json({ error: 'Geçersiz soyad' });
        }

        const sulale = await sulaleService.getSulaleBySoyad(soyad);
        
        if (!sulale.success) {
            return res.status(404).json({ error: sulale.message });
        }

        res.json(sulale);
    } catch (error) {
        console.error('Soyad sülale sorgu hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kişi Bul API endpoint'leri
app.post('/api/kisi-bul/search', async (req, res) => {
    try {
        console.log('🔍 Kişi Bul arama isteği alındı:', req.body);
        console.log('🔍 Request headers:', req.headers);
        console.log('🔍 Request method:', req.method);
        console.log('🔍 Request URL:', req.url);
        
        const searchParams = {
            ad: req.body.ad || '',
            soyad: req.body.soyad || '',
            dogumTarihiBaslangic: req.body.dogumTarihiBaslangic || '',
            dogumTarihiBitis: req.body.dogumTarihiBitis || '',
            il: req.body.il || '',
            ilce: req.body.ilce || '',
            acikAdres: req.body.acikAdres || '',
            hataPayi: req.body.hataPayi || 0.2,
            benzerlikOrani: req.body.benzerlikOrani || 0.7,
            limit: req.body.limit || 2000
        };
        
        console.log('🔍 SearchParams oluşturuldu:', searchParams);

        const results = await kisiBulService.gelismisKisiAra(searchParams);
        
        if (!results.success) {
            return res.status(400).json(results);
        }

        // Frontend formatına uygun hale getir
        const formattedResults = results.data.map(kisi => ({
            TC: kisi.tc,
            ADI: kisi.ad,
            SOYADI: kisi.soyad,
            DOGUMTARIHI: kisi.dogumTarihi,
            ANNEADI: kisi.anaAdi || '',
            BABAADI: kisi.babaAdi || '',
            NUFUSIL: kisi.il || '',
            NUFUSILCE: kisi.ilce || '',
            UYRUK: kisi.uyruk || '',
            CINSIYET: kisi.cinsiyet || '',
            MEDENIHAL: '',
            Ikametgah: kisi.adres || '',
            DogumYeri: kisi.dogumYeri || '',
            VergiNumarasi: '',
            AdresIl: kisi.il || '',
            AdresIlce: kisi.ilce || '',
            Mahalle: '',
            Cadde: '',
            Sokak: '',
            BinaNo: '',
            IcKapiNo: '',
            eslesmeSkoru: Math.round((kisi.benzerlikSkoru || 0) * 100),
            eslesenKriterler: getMatchingCriteria(searchParams, kisi)
        }));

        res.json({
            success: true,
            data: formattedResults,
            totalCount: results.totalCount,
            executionTime: results.executionTime
        });

    } catch (error) {
        console.error('❌ Kişi Bul arama hatası:', error);
        res.status(500).json({ 
            success: false,
            error: 'Arama sırasında bir hata oluştu',
            message: error.message 
        });
    }
});

// Eşleşen kriterleri belirle
function getMatchingCriteria(searchParams, kisi) {
    const criteria = [];
    if (searchParams.ad && kisi.ad && kisi.ad.toLowerCase().includes(searchParams.ad.toLowerCase())) {
        criteria.push('Ad');
    }
    if (searchParams.soyad && kisi.soyad && kisi.soyad.toLowerCase().includes(searchParams.soyad.toLowerCase())) {
        criteria.push('Soyad');
    }
    // İl karşılaştırması
    if (searchParams.il && kisi.il) {
        if (Array.isArray(searchParams.il)) {
            if (searchParams.il.some(il => kisi.il.toLowerCase().includes(il.toLowerCase()))) {
                criteria.push('İl');
            }
        } else if (typeof searchParams.il === 'string' && searchParams.il) {
            if (kisi.il.toLowerCase().includes(searchParams.il.toLowerCase())) {
                criteria.push('İl');
            }
        }
    }
    // İlçe karşılaştırması
    if (searchParams.ilce && kisi.ilce) {
        if (Array.isArray(searchParams.ilce)) {
            if (searchParams.ilce.some(ilce => kisi.ilce.toLowerCase().includes(ilce.toLowerCase()))) {
                criteria.push('İlçe');
            }
        } else if (typeof searchParams.ilce === 'string' && searchParams.ilce) {
            if (kisi.ilce.toLowerCase().includes(searchParams.ilce.toLowerCase())) {
                criteria.push('İlçe');
            }
        }
    }
    return criteria;
}

app.get('/api/kisi-bul/stats', async (req, res) => {
    try {
        const stats = await kisiBulService.getSearchStats();
        res.json(stats);
    } catch (error) {
        console.error('Kişi Bul istatistik hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/kisi-bul/cities', async (req, res) => {
    try {
        const cities = await kisiBulService.getCities();
        res.json(cities);
    } catch (error) {
        console.error('İl listesi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/kisi-bul/districts/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const districts = await kisiBulService.getDistricts(city);
        res.json(districts);
    } catch (error) {
        console.error('İlçe listesi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Ad Soyad Sorgu API endpoint'leri
app.post('/api/adsoyad/search', async (req, res) => {
    try {
        console.log('🔍 Ad Soyad arama isteği alındı:', req.body);
        
        const searchParams = {
            ad: req.body.ad || '',
            soyad: req.body.soyad || '',
            il: req.body.il || '',
            ilce: req.body.ilce || '',
            dogumTarihi: req.body.dogumTarihi || '',
            babaAdi: req.body.babaAdi || '',
            anneAdi: req.body.anneAdi || '',
            limit: req.body.limit || 100
        };
        
        console.log('🔍 SearchParams oluşturuldu:', searchParams);

        const results = await adSoyadService.gelismisAdSoyadAra(searchParams);
        
        if (!results.success) {
            return res.status(400).json(results);
        }

        // Frontend formatına uygun hale getir
        const formattedResults = results.data.map(kisi => ({
            TC: kisi.tc,
            ADI: kisi.ad,
            SOYADI: kisi.soyad,
            DOGUMTARIHI: kisi.dogumTarihi,
            ANNEADI: kisi.anaAdi || '',
            BABAADI: kisi.babaAdi || '',
            NUFUSIL: kisi.il || '',
            NUFUSILCE: kisi.ilce || '',
            UYRUK: kisi.uyruk || '',
            GSM: kisi.gsm || '',
            Ikametgah: kisi.ikametgah || '',
            source: kisi.source,
            additionalInfo: kisi.additionalInfo
        }));

        res.json({
            success: true,
            data: formattedResults,
            totalCount: results.totalCount,
            executionTime: results.executionTime
        });

    } catch (error) {
        console.error('❌ Ad Soyad arama hatası:', error);
        res.status(500).json({ 
            success: false,
            error: 'Arama sırasında bir hata oluştu',
            message: error.message 
        });
    }
});

app.get('/api/adsoyad/stats', async (req, res) => {
    try {
        const stats = await adSoyadService.getSearchStats();
        res.json(stats);
    } catch (error) {
        console.error('Ad Soyad istatistik hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/adsoyad/cities', async (req, res) => {
    try {
        const cities = await adSoyadService.getCities();
        res.json(cities);
    } catch (error) {
        console.error('İl listesi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.get('/api/adsoyad/districts/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const districts = await adSoyadService.getDistricts(city);
        res.json(districts);
    } catch (error) {
        console.error('İlçe listesi hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.post('/api/ai/ask', aiServices.handleAIAsk);

app.post('/api/sms-bomber', async (req, res) => {
  try {
    const { phone, mail, count } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Telefon numarası gerekli' });
    }
    const smsService = new SmsBomberService(phone, mail || '');
    let results = [];
    const sendCount = Math.max(1, Math.min(Number(count) || 1, 100));
    for (let i = 0; i < sendCount; i++) {
      // Her seferinde tüm servisleri çağırıyoruz (örnek: 3 servis)
      // Gerçek uygulamada burada random veya sırayla servis seçilebilir
      const r = await smsService.sendAll();
      results.push(...r);
    }
    res.json({ success: true, sent: results.length, details: results });
  } catch (e) {
    res.status(500).json({ error: 'SMS gönderim hatası', detail: e.message });
  }
});

// IP Sorgu API endpoint'i
app.post('/api/ip-info', async (req, res) => {
    try {
        const { ip } = req.body;
        if (!ip) {
            return res.status(400).json({ error: 'IP adresi gerekli.' });
        }
        const ipInfo = await ipService.getIpInfo(ip);
        res.json(ipInfo);
    } catch (error) {
        console.error('IP sorgu hatası:', error);
        res.status(500).json({ error: 'IP bilgisi alınamadı.' });
    }
});

// Altyapı Sorgu API endpoint'i
app.post('/api/altyapi-info', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Adres veya telefon numarası gerekli.' });
        }
        const altyapiInfo = await altyapiService.sorgulaAltyapi(query);
        res.json(altyapiInfo);
    } catch (error) {
        console.error('Altyapı sorgu hatası:', error);
        res.status(500).json({ error: error.message || 'Altyapı bilgisi alınamadı.' });
    }
});

// BIN Sorgu API endpoint'i
app.post('/api/bin-info', async (req, res) => {
    try {
        const { bin } = req.body;
        if (!bin) {
            return res.status(400).json({ error: 'BIN numarası gerekli.' });
        }
        
        if (!binService.binGecerliMi(bin)) {
            return res.status(400).json({ error: 'Geçersiz BIN numarası. 6 haneli sayı olmalıdır.' });
        }
        
        const binInfo = await binService.sorgulaBin(bin);
        res.json(binInfo);
    } catch (error) {
        console.error('BIN sorgu hatası:', error);
        res.status(500).json({ error: error.message || 'BIN bilgisi alınamadı.' });
    }
});

// DNS Sorgu API endpoint'i
app.post('/api/dns-info', async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) {
            return res.status(400).json({ error: 'Domain adı gerekli.' });
        }
        
        if (!dnsService.domainGecerliMi(domain)) {
            return res.status(400).json({ error: 'Geçersiz domain adı.' });
        }
        
        const dnsInfo = await dnsService.sorgulaDns(domain);
        res.json(dnsInfo);
    } catch (error) {
        console.error('DNS sorgu hatası:', error);
        res.status(500).json({ error: error.message || 'DNS bilgisi alınamadı.' });
    }
});



// IPTV Kanal Listesi endpoint'i
app.get('/api/iptv/channels', async (req, res) => {
    try {
        const channels = iptvService.getAllChannels();
        res.json(channels);
    } catch (error) {
        console.error('IPTV kanal listesi hatası:', error);
        res.status(500).json({ error: 'Kanal listesi alınamadı' });
    }
});

// IPTV Kanal Detayı endpoint'i
app.get('/api/iptv/channels/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;
        const channel = iptvService.getChannelDetails(channelId);
        
        if (!channel) {
            return res.status(404).json({ error: 'Kanal bulunamadı' });
        }
        
        res.json(channel);
    } catch (error) {
        console.error('IPTV kanal detay hatası:', error);
        res.status(500).json({ error: 'Kanal detayı alınamadı' });
    }
});

// IPTV Stream Linki endpoint'i
app.get('/api/iptv/stream/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;
        const streamUrl = await iptvService.getWorkingStream(channelId);
        res.json({ url: streamUrl, channelId });
    } catch (error) {
        console.error('IPTV stream hatası:', error);
        res.status(500).json({ error: 'Stream linki alınamadı' });
    }
});

// IPTV Kategori endpoint'i
app.get('/api/iptv/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const channels = iptvService.getChannelsByCategory(category);
        res.json(channels);
    } catch (error) {
        console.error('IPTV kategori hatası:', error);
        res.status(500).json({ error: 'Kategori kanalları alınamadı' });
    }
});

// Ücretsiz IPTV Listeleri endpoint'i
app.get('/api/iptv/free-lists', async (req, res) => {
    try {
        const lists = await iptvService.getFreeIPTVLists();
        res.json(lists);
    } catch (error) {
        console.error('Ücretsiz IPTV listeleri hatası:', error);
        res.status(500).json({ error: 'IPTV listeleri alınamadı' });
    }
});

// Stream Proxy endpoint'i
app.get('/api/stream-proxy/:encodedUrl(*)', streamProxy.createMiddleware());

// Stream Proxy cache temizleme endpoint'i
app.post('/api/stream-proxy/clear-cache', (req, res) => {
    try {
        streamProxy.clearCache();
        res.json({ message: 'Cache temizlendi' });
    } catch (error) {
        console.error('Cache temizleme hatası:', error);
        res.status(500).json({ error: 'Cache temizlenemedi' });
    }
});

// Stream Proxy cache istatistikleri endpoint'i
app.get('/api/stream-proxy/stats', (req, res) => {
    try {
        const stats = streamProxy.getCacheStats();
        res.json(stats);
    } catch (error) {
        console.error('Cache istatistik hatası:', error);
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// HTTPS server konfigürasyonu
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// HTTPS server'ı başlat
https.createServer(options, app).listen(5000, () => {
  console.log('HTTPS server running on port 5000');
});
