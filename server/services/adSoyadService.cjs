const { getConnection } = require('../config/database.cjs');

class AdSoyadService {
  // Ad soyad ile gelişmiş arama
  async gelismisAdSoyadAra(searchParams) {
    try {
      console.log('🔍 Gelişmiş ad soyad arama başlatılıyor...');
      console.log('📋 Arama parametreleri:', searchParams);

      const {
        ad,
        soyad,
        il,
        ilce,
        dogumTarihi,
        babaAdi,
        anneAdi,
        limit = 100
      } = searchParams;

      const results = {
        success: true,
        message: 'Arama tamamlandı',
        data: [],
        totalCount: 0,
        searchParams: searchParams,
        executionTime: 0
      };

      const startTime = Date.now();

      // En az iki kriter kontrolü
      const filledFields = [ad, soyad, il, ilce, dogumTarihi, babaAdi, anneAdi].filter(field => field && field.trim());
      if (filledFields.length < 2) {
        return {
          success: false,
          message: 'En az iki kriter doldurulmalıdır (Ad, Soyad, İl, İlçe, Doğum Tarihi, Baba Adı, Anne Adı)',
          data: [],
          totalCount: 0
        };
      }

      console.log(`✅ ${filledFields.length} kriter dolduruldu, arama başlatılıyor...`);

      // 101m veritabanından arama
      try {
        console.log('📊 101m veritabanından arama yapılıyor...');
        const connection = await this.getConnection();
        
        let query = 'SELECT * FROM 101m WHERE 1=1';
        let params = [];

        // Ad araması
        if (ad && ad.trim()) {
          query += ' AND ADI = ?';
          params.push(ad.trim());
          console.log(`🔍 Ad araması: ${ad.trim()}`);
        }

        // Soyad araması
        if (soyad && soyad.trim()) {
          query += ' AND SOYADI = ?';
          params.push(soyad.trim());
          console.log(`🔍 Soyad araması: ${soyad.trim()}`);
        }

        // İl araması
        if (il && il.trim()) {
          query += ' AND NUFUSIL = ?';
          params.push(il.trim());
          console.log(`🔍 İl araması: ${il.trim()}`);
        }

        // İlçe araması
        if (ilce && ilce.trim()) {
          query += ' AND NUFUSILCE = ?';
          params.push(ilce.trim());
          console.log(`🔍 İlçe araması: ${ilce.trim()}`);
        }

        // Doğum tarihi araması
        if (dogumTarihi && dogumTarihi.trim()) {
          query += ' AND DOGUMTARIHI = ?';
          params.push(dogumTarihi.trim());
          console.log(`🔍 Doğum tarihi araması: ${dogumTarihi.trim()}`);
        }

        // Baba adı araması
        if (babaAdi && babaAdi.trim()) {
          query += ' AND BABAADI = ?';
          params.push(babaAdi.trim());
          console.log(`🔍 Baba adı araması: ${babaAdi.trim()}`);
        }

        // Anne adı araması
        if (anneAdi && anneAdi.trim()) {
          query += ' AND ANNEADI = ?';
          params.push(anneAdi.trim());
          console.log(`🔍 Anne adı araması: ${anneAdi.trim()}`);
        }

        // Limit ekle
        query += ' LIMIT ?';
        params.push(limit);

        console.log('🔍 SQL Sorgusu:', query);
        console.log('📋 Parametreler:', params);

        let rows = [];
        try {
          [rows] = await connection.execute(query, params);
          console.log(`✅ 101m'den ${rows.length} sonuç bulundu`);
        } catch (sqlError) {
          console.error('❌ SQL sorgu hatası:', sqlError.message);
          rows = [];
        }

        // Sonuçları işle
        for (const row of rows) {
          try {
            const kisi = {
              tc: row.TC || '',
              ad: row.ADI || '',
              soyad: row.SOYADI || '',
              dogumTarihi: row.DOGUMTARIHI || '',
              il: row.NUFUSIL || '',
              ilce: row.NUFUSILCE || '',
              babaAdi: row.BABAADI || '',
              anaAdi: row.ANNEADI || '',
              uyruk: row.UYRUK || '',
              source: '101m',
              additionalInfo: {}
            };

            // Ek bilgileri getir
            await this.getAdditionalInfo(kisi);
            
            results.data.push(kisi);
          } catch (rowError) {
            console.error('❌ Satır işleme hatası:', rowError.message);
            continue;
          }
        }

      } catch (error) {
        console.error('❌ 101m arama hatası:', error.message);
        results.success = false;
        results.message = '101m veritabanı arama hatası';
        return results;
      }

      // Sonuçları sırala ve tekrarları kaldır
      results.data = results.data
        .sort((a, b) => {
          // Önce ad eşleşmesine göre sırala
          const aAdMatch = a.ad.toLowerCase().includes((ad || '').toLowerCase()) ? 1 : 0;
          const bAdMatch = b.ad.toLowerCase().includes((ad || '').toLowerCase()) ? 1 : 0;
          
          if (aAdMatch !== bAdMatch) {
            return bAdMatch - aAdMatch;
          }
          
          // Sonra soyad eşleşmesine göre sırala
          const aSoyadMatch = a.soyad.toLowerCase().includes((soyad || '').toLowerCase()) ? 1 : 0;
          const bSoyadMatch = b.soyad.toLowerCase().includes((soyad || '').toLowerCase()) ? 1 : 0;
          
          if (aSoyadMatch !== bSoyadMatch) {
            return bSoyadMatch - aSoyadMatch;
          }
          
          // Son olarak TC'ye göre sırala
          return a.tc.localeCompare(b.tc);
        })
        .slice(0, limit);

      // Duplicate TC'leri kaldır
      const uniqueResults = [];
      const seenTCs = new Set();
      
      for (const kisi of results.data) {
        if (kisi.tc && !seenTCs.has(kisi.tc)) {
          seenTCs.add(kisi.tc);
          uniqueResults.push(kisi);
        }
      }

      results.data = uniqueResults;
      results.totalCount = results.data.length;
      results.executionTime = Date.now() - startTime;

      console.log(`✅ Arama tamamlandı: ${results.totalCount} sonuç bulundu`);
      console.log(`⏱️  Yürütme süresi: ${results.executionTime}ms`);

      return results;

    } catch (error) {
      console.error('❌ Gelişmiş ad soyad arama hatası:', error);
      return {
        success: false,
        message: 'Arama sırasında bir hata oluştu',
        error: error.message,
        data: [],
        totalCount: 0
      };
    }
  }

  // Veritabanı bağlantısı
  async getConnection() {
    return await getConnection('101m');
  }

  // Ek bilgileri getir (GSM, adres, vb.)
  async getAdditionalInfo(kisi) {
    try {
      // GSM bilgilerini getir
      if (kisi.tc) {
        try {
          const gsmConnection = await getConnection('gsmtc');
          const [gsmRows] = await gsmConnection.execute(
            'SELECT GSM FROM gsmtc WHERE TC = ? LIMIT 1',
            [kisi.tc]
          );
          gsmConnection.release();
          
          if (gsmRows.length > 0) {
            kisi.gsm = gsmRows[0].GSM;
          }
        } catch (error) {
          console.log('GSM bilgisi alınamadı:', error.message);
        }
      }

      kisi.additionalInfo = {};
    } catch (error) {
      console.log('Ek bilgiler alınamadı:', error.message);
      kisi.additionalInfo = {};
    }
  }

  // İstatistik bilgileri getir
  async getSearchStats() {
    try {
      const stats = {
        totalRecords: 0,
        totalCities: 0,
        totalDistricts: 0,
        lastUpdated: null
      };

      // 101m veritabanından istatistikler
      try {
        const connection = await this.getConnection();
        
        // Toplam kayıt sayısı
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM 101m');
        stats.totalRecords = countResult[0].total;

        // İl sayısı
        const [cityResult] = await connection.execute('SELECT COUNT(DISTINCT NUFUSIL) as total FROM 101m WHERE NUFUSIL IS NOT NULL');
        stats.totalCities = cityResult[0].total;

        // İlçe sayısı
        const [districtResult] = await connection.execute('SELECT COUNT(DISTINCT NUFUSILCE) as total FROM 101m WHERE NUFUSILCE IS NOT NULL');
        stats.totalDistricts = districtResult[0].total;

        connection.release();
      } catch (error) {
        console.log('İstatistik hatası:', error.message);
      }

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('İstatistik hatası:', error);
      return {
        success: false,
        message: 'İstatistik bilgileri alınamadı',
        error: error.message
      };
    }
  }

  // İl listesi getir
  async getCities() {
    try {
      const connection = await this.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT DISTINCT NUFUSIL FROM 101m WHERE NUFUSIL IS NOT NULL AND NUFUSIL != "" ORDER BY NUFUSIL'
      );

      connection.release();

      return {
        success: true,
        data: rows.map(row => row.NUFUSIL)
      };

    } catch (error) {
      console.error('İl listesi hatası:', error);
      return {
        success: false,
        message: 'İl listesi alınamadı',
        error: error.message
      };
    }
  }

  // İlçe listesi getir
  async getDistricts(city) {
    try {
      const connection = await this.getConnection();
      
      const [rows] = await connection.execute(
        'SELECT DISTINCT NUFUSILCE FROM 101m WHERE NUFUSIL = ? AND NUFUSILCE IS NOT NULL AND NUFUSILCE != "" ORDER BY NUFUSILCE',
        [city]
      );

      connection.release();

      return {
        success: true,
        data: rows.map(row => row.NUFUSILCE)
      };

    } catch (error) {
      console.error('İlçe listesi hatası:', error);
      return {
        success: false,
        message: 'İlçe listesi alınamadı',
        error: error.message
      };
    }
  }
}

module.exports = AdSoyadService; 