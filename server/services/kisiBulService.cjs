const { getConnection } = require('../config/database.cjs');

class KisiBulService {
  constructor() {
    this.connection = null;
  }

  async getConnection() {
    if (!this.connection) {
      this.connection = await getConnection('101m');
    }
    return this.connection;
  }

  // Gelişmiş kişi arama fonksiyonu
  async gelismisKisiAra(searchParams) {
    try {
      console.log('🔍 Gelişmiş kişi arama başlatılıyor...');
      console.log('📋 Arama parametreleri:', searchParams);

      const {
        ad,
        soyad,
        dogumTarihiBaslangic,
        dogumTarihiBitis,
        il,
        ilce,
        acikAdres,
        hataPayi = 0,
        benzerlikOrani = 0.8,
        limit = 100
      } = searchParams;

      console.log('📋 dogumTarihiBaslangic:', dogumTarihiBaslangic);
      console.log('📋 dogumTarihiBitis:', dogumTarihiBitis);

      const results = {
        success: true,
        message: 'Arama tamamlandı',
        data: [],
        totalCount: 0,
        searchParams: searchParams,
        executionTime: 0
      };

      const startTime = Date.now();

      // Minimum arama kriteri kontrolü - şimdilik kaldırıldı
      /*
      if (!ad && !soyad && !il) {
        return {
          success: false,
          message: 'En az ad, soyad veya il bilgisi gereklidir',
          data: [],
          totalCount: 0
        };
      }
      */

      // 101m veritabanından arama
      try {
        console.log('📊 101m veritabanından arama yapılıyor...');
        const connection = await this.getConnection();
        
        // Test için önce toplam kayıt sayısını kontrol et
        try {
          const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM 101m');
          console.log(`📊 101m veritabanında toplam ${countResult[0].total} kayıt var`);
          
          // Örnek kayıtları göster (doğum tarihi formatını kontrol et)
          const [sampleRows] = await connection.execute('SELECT ADI, SOYADI, DOGUMTARIHI FROM 101m WHERE DOGUMTARIHI IS NOT NULL LIMIT 5');
          console.log('📋 Örnek kayıtlar (doğum tarihi ile):', sampleRows);
        } catch (error) {
          console.error('❌ Kayıt sayısı alınamadı:', error.message);
        }

        let query = 'SELECT * FROM 101m WHERE 1=1';
        let params = [];

        // Ad araması (daha esnek)
        if (ad && ad.trim()) {
          query += ' AND (ADI LIKE ? OR ADI LIKE ?)';
          params.push(`%${ad.trim()}%`, `${ad.trim()}%`);
          console.log(`🔍 Ad araması: ${ad.trim()}`);
        }

        // Soyad araması (daha esnek)
        if (soyad && soyad.trim()) {
          query += ' AND (SOYADI LIKE ? OR SOYADI LIKE ?)';
          params.push(`%${soyad.trim()}%`, `${soyad.trim()}%`);
          console.log(`🔍 Soyad araması: ${soyad.trim()}`);
        }

        // Eğer hiçbir kriter yoksa, ilk 20 kaydı getir
        if (!ad && !soyad && !il) {
          query = 'SELECT * FROM 101m LIMIT 20';
          params = [];
          console.log('🔍 Hiçbir kriter yok, ilk 20 kayıt getiriliyor');
        }

        // Doğum tarihi aralığı (DD.MM.YYYY formatı için)
        if (dogumTarihiBaslangic && dogumTarihiBitis && dogumTarihiBaslangic.trim() && dogumTarihiBitis.trim()) {
          // YYYY-MM-DD formatını DD.MM.YYYY formatına çevir
          const baslangicDate = new Date(dogumTarihiBaslangic);
          const bitisDate = new Date(dogumTarihiBitis);
          
          const baslangicFormatted = `${baslangicDate.getDate()}.${baslangicDate.getMonth() + 1}.${baslangicDate.getFullYear()}`;
          const bitisFormatted = `${bitisDate.getDate()}.${bitisDate.getMonth() + 1}.${bitisDate.getFullYear()}`;
          
          // Yıl bazlı arama yap (sadece yıl kısmını al)
          const baslangicYil = baslangicDate.getFullYear();
          const bitisYil = bitisDate.getFullYear();
          
          // DD.MM.YYYY formatından yıl kısmını çıkar
          query += ' AND (SUBSTRING_INDEX(DOGUMTARIHI, ".", -1) BETWEEN ? AND ?)';
          params.push(baslangicYil.toString(), bitisYil.toString());
          console.log(`🔍 Doğum yılı aralığı: ${baslangicYil} - ${bitisYil}`);
        } else if (dogumTarihiBaslangic && dogumTarihiBaslangic.trim()) {
          // Tek tarih için
          const date = new Date(dogumTarihiBaslangic);
          const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
          
          query += ' AND DOGUMTARIHI = ?';
          params.push(formattedDate);
          console.log(`🔍 Doğum tarihi: ${formattedDate}`);
        }

        // İl araması
        if (il && Array.isArray(il) && il.length > 0) {
          query += ' AND (' + il.map(() => 'NUFUSIL LIKE ?').join(' OR ') + ')';
          params.push(...il.map(i => `%${i}%`));
          console.log(`🔍 Çoklu il araması: ${il.join(', ')}`);
        } else if (il && typeof il === 'string' && il.trim()) {
          query += ' AND NUFUSIL LIKE ?';
          params.push(`%${il.trim()}%`);
          console.log(`🔍 İl araması: ${il.trim()}`);
        }

        // İlçe araması
        if (ilce && Array.isArray(ilce) && ilce.length > 0) {
          query += ' AND (' + ilce.map(() => 'NUFUSILCE LIKE ?').join(' OR ') + ')';
          params.push(...ilce.map(i => `%${i}%`));
          console.log(`🔍 Çoklu ilçe araması: ${ilce.join(', ')}`);
        } else if (ilce && typeof ilce === 'string' && ilce.trim()) {
          query += ' AND (NUFUSILCE LIKE ?)';
          params.push(`%${ilce.trim()}%`);
          console.log(`🔍 İlçe araması: ${ilce.trim()}`);
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
          console.error('❌ SQL sorgusu:', query);
          console.error('❌ Parametreler:', params);
          // Hata durumunda boş sonuç döndür
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
              dogumYeri: '', // 101m'de DOGUMYERI kolonu yok
              il: row.NUFUSIL || '',
              ilce: row.NUFUSILCE || '',
              adres: '', // 101m'de adres bilgisi yok
              babaAdi: row.BABAADI || '',
              anaAdi: row.ANNEADI || '', // ANNEADI olarak düzeltildi
              cinsiyet: '', // 101m'de CINSIYET kolonu yok
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

      // Sadece 101m veritabanı kullanılıyor
      console.log('📊 Sadece 101m veritabanından arama yapılıyor');

      // Sonuçları sırala (benzerlik skoru olmadan)
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

      // Duplicate TC'leri kaldır (en yüksek benzerlik skoruna sahip olanı tut)
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
      console.error('❌ Gelişmiş kişi arama hatası:', error);
      return {
        success: false,
        message: 'Arama sırasında bir hata oluştu',
        error: error.message,
        data: [],
        totalCount: 0
      };
    }
  }

  // Ek bilgileri getir (GSM, adres, vb.) - şimdilik devre dışı
  async getAdditionalInfo(kisi) {
    try {
      // Şimdilik ek bilgiler devre dışı
      kisi.additionalInfo = {};
    } catch (error) {
      console.log('Ek bilgiler alınamadı:', error.message);
      kisi.additionalInfo = {};
    }
  }





  // İstatistik bilgileri getir
  async getSearchStats() {
    try {
      const connection = await this.getConnection();
      
      const stats = {
        totalRecords: 0,
        totalCities: 0,
        totalDistricts: 0,
        lastUpdated: null
      };

      // Toplam kayıt sayısı
      try {
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM 101m');
        stats.totalRecords = countResult[0].total;
      } catch (error) {
        console.log('Toplam kayıt sayısı alınamadı:', error.message);
      }

      // İl sayısı
      try {
        const [cityResult] = await connection.execute('SELECT COUNT(DISTINCT NUFUSIL) as total FROM 101m WHERE NUFUSIL IS NOT NULL');
        stats.totalCities = cityResult[0].total;
      } catch (error) {
        console.log('İl sayısı alınamadı:', error.message);
      }

      // İlçe sayısı
      try {
        const [districtResult] = await connection.execute('SELECT COUNT(DISTINCT NUFUSILCE) as total FROM 101m WHERE NUFUSILCE IS NOT NULL');
        stats.totalDistricts = districtResult[0].total;
      } catch (error) {
        console.log('İlçe sayısı alınamadı:', error.message);
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

module.exports = KisiBulService; 