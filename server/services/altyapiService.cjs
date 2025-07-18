const altyapiScraper = require('./altyapiScraper.cjs');

/**
 * Adres veya telefon numarası ile altyapı sorgulama
 * @param {string} query Adres veya telefon numarası
 * @returns {Promise<Object>} Altyapı bilgileri
 */
async function sorgulaAltyapi(query) {
  if (!query) throw new Error('Adres veya telefon numarası gerekli.');

  try {
    // Web scraper ile tüm servislerden sorgula
    const result = await altyapiScraper.tumServislerdenSorgula(query);
    return result;
  } catch (error) {
    console.error('Altyapı sorgu hatası:', error);
    throw new Error(`Altyapı bilgisi alınamadı: ${error.message}`);
  }
}

module.exports = {
  sorgulaAltyapi,
}; 