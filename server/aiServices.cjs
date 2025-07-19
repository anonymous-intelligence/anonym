const path = require('path');
const { askAI } = require('./ai/ai.cjs');
const kisiService = require('./services/kisiService.cjs');
const gsmService = require('./services/gsmService.cjs');

// GSM numarasını normalize et (başındaki 0, 90, +90, boşluk, tire vs. kaldır)
function normalizeGsm(gsm) {
    let num = (gsm || '').replace(/\D/g, '');
    if (num.startsWith('90')) num = num.slice(2);
    if (num.startsWith('0')) num = num.slice(1);
    return num.length === 10 ? num : '';
}

async function handleAIAsk(req, res) {
    try {
        const { prompt } = req.body;
        console.log('AI endpoint çağrıldı:', prompt);
        const { sohbet, ad, soyad, tc, gsm, dogumTarihi, il, ilce, anneAdi, babaAdi, uyruk, istek: aiIstek } = await askAI(prompt);
        let kisiSonuclari = [];
        let gsmSonucu = null;
        let istek = aiIstek;
        // Fallback: Eğer istek alanı boşsa ve promptta anahtar kelime varsa, istek='gsm' yap
        if (!istek || istek === '') {
            const anahtarlar = ['telefon', 'numara', 'gsm', 'cep telefonu', 'iletişim bilgisi', 'telefon numarası'];
            const lowerPrompt = (prompt || '').toLowerCase();
            if (anahtarlar.some(kelime => lowerPrompt.includes(kelime))) {
                istek = 'gsm';
            }
        }
        // GSM ile kişi arama desteği
        let aramaTC = tc;
        let gsmAramaYapildi = false;
        let normalizedGsm = normalizeGsm(gsm);
        if (!aramaTC && normalizedGsm) {
            // GSM ile TC bul
            gsmAramaYapildi = true;
            const tcData = await gsmService.getTCByGsm(normalizedGsm);
            if (tcData && tcData.TC) {
                aramaTC = tcData.TC;
            } else {
                // GSM bulunamadıysa özel mesaj dön
                return res.json({
                    sohbet: 'Maalesef veritabanımda böyle bir telefon numarası kayıtlı değil.',
                    kisiSonuclari: [],
                    gsmSonucu: null
                });
            }
        }
        // Eğer istek gsm ve aramaTC varsa, gsmtc tablosunda arama yap
        if (istek === 'gsm' && aramaTC) {
            gsmAramaYapildi = true;
            gsmSonucu = await gsmService.getGsmByTC(aramaTC);
            if (!gsmSonucu) {
                // GSM bulunamadıysa özel mesaj dön
                return res.json({
                    sohbet: 'Maalesef veritabanımda böyle bir telefon numarası kayıtlı değil.',
                    kisiSonuclari: [],
                    gsmSonucu: null
                });
            }
        }
        // Eğer tüm parametreler boşsa kişi araması yapma
        const tumuBos = [ad, soyad, aramaTC, dogumTarihi, il, ilce, anneAdi, babaAdi, uyruk].every(x => !x || x === '');
        if (!tumuBos) {
            kisiSonuclari = await kisiService.searchKisiByAdSoyad({
                ad,
                soyad,
                tc: aramaTC,
                dogumTarihi,
                il,
                ilce,
                anneAdi,
                babaAdi,
                uyruk
            });
        }
        res.json({ sohbet, ad, soyad, tc: aramaTC, gsm: normalizedGsm, dogumTarihi, il, ilce, anneAdi, babaAdi, uyruk, istek, kisiSonuclari, gsmSonucu });
    } catch (error) {
        console.error('AI endpoint hatası:', error);
        res.status(500).json({ error: 'AI servisi hatası', detail: error.message });
    }
}

module.exports = { handleAIAsk }; 