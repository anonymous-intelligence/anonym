const dns = require('dns').promises;
const axios = require('axios');

/**
 * Domain DNS bilgilerini sorgulama
 * @param {string} domain Domain adı
 * @returns {Promise<Object>} DNS bilgileri
 */
async function sorgulaDns(domain) {
  if (!domain) {
    throw new Error('Domain adı gerekli.');
  }

  // Domain formatını temizle
  const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  console.log('🔍 DNS sorgulama başlatılıyor:', cleanDomain);

  try {
    const results = {};

    // A Kaydı (IPv4)
    try {
      const aRecords = await dns.resolve4(cleanDomain);
      results.aRecords = aRecords;
    } catch (error) {
      results.aRecords = [];
      console.log('⚠️ A kaydı bulunamadı');
    }

    // AAAA Kaydı (IPv6)
    try {
      const aaaaRecords = await dns.resolve6(cleanDomain);
      results.aaaaRecords = aaaaRecords;
    } catch (error) {
      results.aaaaRecords = [];
      console.log('⚠️ AAAA kaydı bulunamadı');
    }

    // NS Kayıtları
    try {
      const nsRecords = await dns.resolveNs(cleanDomain);
      results.nsRecords = nsRecords;
    } catch (error) {
      results.nsRecords = [];
      console.log('⚠️ NS kaydı bulunamadı');
    }

    // MX Kayıtları
    try {
      const mxRecords = await dns.resolveMx(cleanDomain);
      results.mxRecords = mxRecords;
    } catch (error) {
      results.mxRecords = [];
      console.log('⚠️ MX kaydı bulunamadı');
    }

    // TXT Kayıtları
    try {
      const txtRecords = await dns.resolveTxt(cleanDomain);
      results.txtRecords = txtRecords;
    } catch (error) {
      results.txtRecords = [];
      console.log('⚠️ TXT kaydı bulunamadı');
    }

    // CNAME Kaydı
    try {
      const cnameRecords = await dns.resolveCname(cleanDomain);
      results.cnameRecords = cnameRecords;
    } catch (error) {
      results.cnameRecords = [];
      console.log('⚠️ CNAME kaydı bulunamadı');
    }

    // SOA Kaydı
    try {
      const soaRecords = await dns.resolveSoa(cleanDomain);
      results.soaRecords = soaRecords;
    } catch (error) {
      results.soaRecords = null;
      console.log('⚠️ SOA kaydı bulunamadı');
    }

    // WHOIS bilgileri (basit)
    try {
      const whoisInfo = await getWhoisInfo(cleanDomain);
      results.whoisInfo = whoisInfo;
    } catch (error) {
      results.whoisInfo = null;
      console.log('⚠️ WHOIS bilgisi alınamadı');
    }

    console.log('✅ DNS bilgileri alındı:', results);

    return {
      domain: cleanDomain,
      aRecords: results.aRecords,
      aaaaRecords: results.aaaaRecords,
      nsRecords: results.nsRecords,
      mxRecords: results.mxRecords,
      txtRecords: results.txtRecords,
      cnameRecords: results.cnameRecords,
      soaRecords: results.soaRecords,
      whoisInfo: results.whoisInfo,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ DNS sorgu hatası:', error.message);
    throw new Error(`DNS bilgisi alınamadı: ${error.message}`);
  }
}

/**
 * Basit WHOIS bilgisi alma
 * @param {string} domain Domain adı
 * @returns {Promise<Object>} WHOIS bilgileri
 */
async function getWhoisInfo(domain) {
  try {
    // WHOIS API'si (ücretsiz)
    const response = await axios.get(`https://whois.whoisxmlapi.com/api/v1?apiKey=at_demo&domainName=${domain}`, {
      timeout: 10000
    });

    const data = response.data;
    return {
      registrar: data.registrar?.name || 'Bilinmiyor',
      creationDate: data.creationDate || 'Bilinmiyor',
      expirationDate: data.expirationDate || 'Bilinmiyor',
      updatedDate: data.updatedDate || 'Bilinmiyor',
      status: data.status || 'Bilinmiyor'
    };

  } catch (error) {
    console.log('WHOIS API hatası:', error.message);
    
    // Alternatif basit bilgi
    return {
      registrar: 'Bilinmiyor',
      creationDate: 'Bilinmiyor',
      expirationDate: 'Bilinmiyor',
      updatedDate: 'Bilinmiyor',
      status: 'Aktif'
    };
  }
}

/**
 * Domain adının geçerliliğini kontrol et
 * @param {string} domain Domain adı
 * @returns {boolean} Geçerli mi
 */
function domainGecerliMi(domain) {
  if (!domain || typeof domain !== 'string') return false;
  
  // Basit domain format kontrolü
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
}

module.exports = {
  sorgulaDns,
  domainGecerliMi
}; 