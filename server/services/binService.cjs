const axios = require('axios');

/**
 * BIN numarası ile banka bilgisi sorgulama
 * @param {string} bin BIN numarası (6 haneli)
 * @returns {Promise<Object>} Banka bilgileri
 */
async function sorgulaBin(bin) {
  if (!bin || bin.length !== 6) {
    throw new Error('BIN numarası 6 haneli olmalıdır.');
  }

  try {
    console.log('🔍 BIN sorgulama başlatılıyor:', bin);
    
    // Binlist.net API'si (ücretsiz)
    const response = await axios.get(`https://lookup.binlist.net/${bin}`, {
      headers: {
        'Accept-Version': '3',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const data = response.data;
    console.log('✅ BIN bilgileri alındı:', data);

    // Eğer banka bilgisi varsa aktif say
    const isAktif = !!(data.bank?.name || data.scheme || data.brand);

    return {
      bin: bin,
      banka: data.bank?.name || 'Bilinmiyor',
      kartTipi: data.scheme || 'Bilinmiyor',
      seviye: data.brand || 'Bilinmiyor',
      ulke: data.country?.name || 'Bilinmiyor',
      paraBirimi: data.country?.currency || 'Bilinmiyor',
      bankaKodu: data.bank?.url || 'Bilinmiyor',
      ulkeKodu: data.country?.alpha2 || 'Bilinmiyor',
      aktif: isAktif,
      tip: data.type || 'Bilinmiyor'
    };

  } catch (error) {
    console.error('❌ BIN sorgu hatası:', error.message);
    
    // Alternatif API dene
    try {
      console.log('🔄 Alternatif API deneniyor...');
      const altResponse = await axios.get(`https://api.bincodes.com/bin/?format=json&api_key=free&bin=${bin}`, {
        timeout: 10000
      });

      const altData = altResponse.data;
      console.log('✅ Alternatif API sonucu:', altData);

      // Eğer banka bilgisi varsa aktif say
      const isAktif = !!(altData.bank || altData.card_type || altData.level);

      return {
        bin: bin,
        banka: altData.bank || 'Bilinmiyor',
        kartTipi: altData.card_type || 'Bilinmiyor',
        seviye: altData.level || 'Bilinmiyor',
        ulke: altData.country || 'Bilinmiyor',
        paraBirimi: altData.currency || 'Bilinmiyor',
        bankaKodu: altData.bank_code || 'Bilinmiyor',
        ulkeKodu: altData.country_code || 'Bilinmiyor',
        aktif: isAktif,
        tip: altData.type || 'Bilinmiyor'
      };

    } catch (altError) {
      console.error('❌ Alternatif API hatası:', altError.message);
      
      // Hata durumunda mock veri döndür
      return {
        bin: bin,
        banka: 'Bilinmiyor',
        kartTipi: 'Bilinmiyor',
        seviye: 'Bilinmiyor',
        ulke: 'Bilinmiyor',
        paraBirimi: 'Bilinmiyor',
        bankaKodu: 'Bilinmiyor',
        ulkeKodu: 'Bilinmiyor',
        aktif: false,
        tip: 'Bilinmiyor'
      };
    }
  }
}

/**
 * BIN numarasının geçerliliğini kontrol et
 * @param {string} bin BIN numarası
 * @returns {boolean} Geçerli mi
 */
function binGecerliMi(bin) {
  if (!bin || typeof bin !== 'string') return false;
  if (bin.length !== 6) return false;
  if (!/^\d{6}$/.test(bin)) return false;
  return true;
}

module.exports = {
  sorgulaBin,
  binGecerliMi
}; 