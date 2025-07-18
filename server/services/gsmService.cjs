const { getConnection } = require('../config/database.cjs');

class GsmService {
  // TC ile GSM numarası sorgula
  async getGsmByTC(tc) {
    try {
      const connection = await getConnection('gsmtc');
      
      const [rows] = await connection.execute(
        'SELECT * FROM gsmtc WHERE TC = ?',
        [tc]
      );

      connection.release();

      if (rows.length === 0) {
        return null;
      }

      return rows[0];
    } catch (error) {
      console.error('GSM sorgu hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // TC ile detaylı kişi bilgilerini getir
  async getDetailedPersonInfo(tc) {
    try {
      console.log(`🔍 TC ile detaylı bilgi aranıyor: ${tc}`);
      
      const result = {
        tc: tc,
        gsm: null,
        basicInfo: null,
        addressInfo: null,
        voterInfo: null,
        dataInfo: null,
        veriInfo: null,
        address2024: null
      };

      // GSM bilgisi
      try {
        const gsmConnection = await getConnection('gsmtc');
        const [gsmRows] = await gsmConnection.execute(
          'SELECT * FROM gsmtc WHERE TC = ?',
          [tc]
        );
        gsmConnection.release();
        
        if (gsmRows.length > 0) {
          result.gsm = gsmRows[0];
          // GSM numarasını formatla
          if (result.gsm.GSM) {
            const cleanGsm = result.gsm.GSM.toString().replace(/\D/g, '');
            if (cleanGsm.length === 10) {
              result.gsm.GSM = cleanGsm.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
            }
          }
        }
      } catch (error) {
        console.error('GSM bilgisi alınamadı:', error.message);
      }

      // 101m veritabanından temel bilgiler
      try {
        console.log('📊 101m veritabanına bağlanılıyor...');
        const basicConnection = await getConnection('101m');
        console.log('✅ 101m bağlantısı başarılı');
        
        const [basicRows] = await basicConnection.execute(
          'SELECT * FROM 101m WHERE TC = ?',
          [tc]
        );
        basicConnection.release();
        
        console.log(`📋 101m'den ${basicRows.length} kayıt bulundu`);
        if (basicRows.length > 0) {
          result.basicInfo = basicRows[0];
          console.log('✅ 101m bilgileri alındı:', result.basicInfo.ADI, result.basicInfo.SOYADI);
        }
      } catch (error) {
        console.error('❌ Temel bilgiler alınamadı:', error.message);
      }

      // Secmen veritabanından adres bilgileri
      try {
        console.log('🏠 Secmen veritabanına bağlanılıyor...');
        const voterConnection = await getConnection('secmen');
        console.log('✅ Secmen bağlantısı başarılı');
        
        const [voterRows] = await voterConnection.execute(
          'SELECT * FROM secmen2015 WHERE TC = ?',
          [tc]
        );
        voterConnection.release();
        
        console.log(`📋 Secmen'den ${voterRows.length} kayıt bulundu`);
        if (voterRows.length > 0) {
          result.addressInfo = voterRows[0];
          console.log('✅ Secmen bilgileri alındı:', result.addressInfo.ADI, result.addressInfo.SOYADI);
        }
      } catch (error) {
        console.error('❌ Adres bilgileri alınamadı:', error.message);
      }

      // 2024 Adres Bilgileri (Data ve Veri veritabanlarından)
      try {
        console.log('🏠 2024 adres bilgileri alınıyor...');
        let address2024 = null;
        
        // Önce Data veritabanından kontrol et
        try {
          const dataConnection = await getConnection('data');
          
          // Önce tablo yapısını kontrol et
          try {
            const [columns] = await dataConnection.execute('DESCRIBE datam');
            console.log('📋 Data datam tablosu yapısı:', columns.map(col => col.Field));
          } catch (error) {
            console.log('❌ datam tablosu bulunamadı, diğer tablolar kontrol ediliyor...');
            const [tables] = await dataConnection.execute('SHOW TABLES');
            console.log('📋 Data veritabanındaki tablolar:', tables.map(t => Object.values(t)[0]));
          }
          
          const [dataRows] = await dataConnection.execute(
            'SELECT * FROM datam WHERE KimlikNo = ? OR KimlikNo = ?',
            [tc, tc]
          );
          dataConnection.release();
          
          if (dataRows.length > 0) {
            address2024 = dataRows[0];
            address2024.source = 'data';
            console.log('✅ Data 2024 adres bilgileri alındı:', address2024);
            console.log('🏠 İkametgah:', address2024.Ikametgah);
          } else {
            console.log('❌ Data veritabanında TC bulunamadı:', tc);
          }
        } catch (error) {
          console.log('❌ Data 2024 adres bilgileri alınamadı:', error.message);
        }
        
        // Eğer Data'da yoksa Veri veritabanından kontrol et
        if (!address2024) {
          try {
            const veriConnection = await getConnection('veri');
            
            // Önce tablo yapısını kontrol et
            try {
              const [columns] = await veriConnection.execute('DESCRIBE datam');
              console.log('📋 Veri datam tablosu yapısı:', columns.map(col => col.Field));
            } catch (error) {
              console.log('❌ datam tablosu bulunamadı, diğer tablolar kontrol ediliyor...');
              const [tables] = await veriConnection.execute('SHOW TABLES');
              console.log('📋 Veri veritabanındaki tablolar:', tables.map(t => Object.values(t)[0]));
            }
            
            const [veriRows] = await veriConnection.execute(
              'SELECT * FROM datam WHERE KimlikNo = ? OR KimlikNo = ?',
              [tc, tc]
            );
            veriConnection.release();
            
            if (veriRows.length > 0) {
              address2024 = veriRows[0];
              address2024.source = 'veri';
              console.log('✅ Veri 2024 adres bilgileri alındı:', address2024);
              console.log('🏠 İkametgah:', address2024.Ikametgah);
            } else {
              console.log('❌ Veri veritabanında TC bulunamadı:', tc);
            }
          } catch (error) {
            console.log('❌ Veri 2024 adres bilgileri alınamadı:', error.message);
          }
        }
        
        if (address2024) {
          address2024.year = '2024';
          result.address2024 = address2024;
          console.log('🏠 2024 adres bilgileri kaydedildi:', address2024.Ikametgah);
        } else {
          console.log('❌ 2024 adres bilgileri bulunamadı');
        }
      } catch (error) {
        console.error('❌ 2024 adres bilgileri alınamadı:', error.message);
      }

      // Data veritabanından ek bilgiler
      try {
        const dataConnection = await getConnection('data');
        const [dataRows] = await dataConnection.execute(
          'SELECT * FROM datam WHERE KimlikNo = ?',
          [tc]
        );
        dataConnection.release();
        
        if (dataRows.length > 0) {
          result.dataInfo = dataRows[0];
        }
      } catch (error) {
        console.error('Data bilgileri alınamadı:', error.message);
      }

      // Veri veritabanından ek bilgiler
      try {
        const veriConnection = await getConnection('veri');
        const [veriRows] = await veriConnection.execute(
          'SELECT * FROM datam WHERE KimlikNo = ?',
          [tc]
        );
        veriConnection.release();
        
        if (veriRows.length > 0) {
          result.veriInfo = veriRows[0];
        }
      } catch (error) {
        console.error('Veri bilgileri alınamadı:', error.message);
      }

      return result;
    } catch (error) {
      console.error('Detaylı kişi bilgisi alma hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // GSM numarası ile TC sorgula
  async getTCByGsm(gsm) {
    try {
      const connection = await getConnection('gsmtc');
      
      const [rows] = await connection.execute(
        'SELECT * FROM gsmtc WHERE GSM = ?',
        [gsm]
      );

      connection.release();

      if (rows.length === 0) {
        return null;
      }

      // GSM numarasını formatla
      const result = rows[0];
      if (result.GSM) {
        const cleanGsm = result.GSM.toString().replace(/\D/g, '');
        if (cleanGsm.length === 10) {
          result.GSM = cleanGsm.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }
      }

      return result;
    } catch (error) {
      console.error('TC sorgu hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // Tüm GSM verilerini getir (sayfalama ile)
  async getAllGsmData(page = 1, limit = 50) {
    try {
      const connection = await getConnection('gsmtc');
      const offset = (page - 1) * limit;
      
      const [rows] = await connection.execute(
        'SELECT * FROM gsmtc LIMIT ? OFFSET ?',
        [limit, offset]
      );

      const [countResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM gsmtc'
      );

      connection.release();

      return {
        data: rows,
        total: countResult[0].total,
        page,
        limit,
        totalPages: Math.ceil(countResult[0].total / limit)
      };
    } catch (error) {
      console.error('GSM veri getirme hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // İstatistikleri getir
  async getStats() {
    try {
      const connection = await getConnection('gsmtc');
      
      const [rows] = await connection.execute(`
        SELECT 
          COUNT(*) as toplam_kayit,
          COUNT(DISTINCT TC) as benzersiz_tc,
          COUNT(DISTINCT GSM) as benzersiz_gsm
        FROM gsmtc
      `);

      connection.release();

      return rows[0];
    } catch (error) {
      console.error('GSM istatistik hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }
}

module.exports = new GsmService(); 