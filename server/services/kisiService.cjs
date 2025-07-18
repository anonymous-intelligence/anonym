const { getConnection } = require('../config/database.cjs');
const axios = require('axios');

class KisiService {
  // Operatör belirleme fonksiyonu
  getOperator(gsmNumber) {
    const prefix = gsmNumber.substring(0, 3);
    
    const operators = {
      '532': 'Turkcell',
      '533': 'Turkcell',
      '534': 'Turkcell',
      '535': 'Turkcell',
      '536': 'Turkcell',
      '537': 'Turkcell',
      '538': 'Turkcell',
      '539': 'Turkcell',
      '540': 'Turkcell',
      '541': 'Turkcell',
      '542': 'Turkcell',
      '543': 'Turkcell',
      '544': 'Turkcell',
      '545': 'Turkcell',
      '546': 'Turkcell',
      '547': 'Turkcell',
      '548': 'Turkcell',
      '549': 'Turkcell',
      '550': 'Turkcell',
      '551': 'Turkcell',
      '552': 'Turkcell',
      '553': 'Turkcell',
      '554': 'Turkcell',
      '555': 'Turkcell',
      '556': 'Turkcell',
      '557': 'Turkcell',
      '558': 'Turkcell',
      '559': 'Turkcell',
      '561': 'Vodafone',
      '562': 'Vodafone',
      '563': 'Vodafone',
      '564': 'Vodafone',
      '565': 'Vodafone',
      '566': 'Vodafone',
      '567': 'Vodafone',
      '568': 'Vodafone',
      '569': 'Vodafone',
      '501': 'Vodafone',
      '502': 'Vodafone',
      '503': 'Vodafone',
      '504': 'Vodafone',
      '505': 'Vodafone',
      '506': 'Vodafone',
      '507': 'Vodafone',
      '508': 'Vodafone',
      '509': 'Vodafone',
      '510': 'Vodafone',
      '511': 'Vodafone',
      '512': 'Vodafone',
      '513': 'Vodafone',
      '514': 'Vodafone',
      '515': 'Vodafone',
      '516': 'Vodafone',
      '517': 'Vodafone',
      '518': 'Vodafone',
      '519': 'Vodafone',
      '520': 'Vodafone',
      '521': 'Vodafone',
      '522': 'Vodafone',
      '523': 'Vodafone',
      '524': 'Vodafone',
      '525': 'Vodafone',
      '526': 'Vodafone',
      '527': 'Vodafone',
      '528': 'Vodafone',
      '529': 'Vodafone',
      '530': 'Vodafone',
      '531': 'Vodafone',
      '460': 'Türk Telekom',
      '461': 'Türk Telekom',
      '462': 'Türk Telekom',
      '463': 'Türk Telekom',
      '464': 'Türk Telekom',
      '465': 'Türk Telekom',
      '466': 'Türk Telekom',
      '467': 'Türk Telekom',
      '468': 'Türk Telekom',
      '469': 'Türk Telekom',
      '470': 'Türk Telekom',
      '471': 'Türk Telekom',
      '472': 'Türk Telekom',
      '473': 'Türk Telekom',
      '474': 'Türk Telekom',
      '475': 'Türk Telekom',
      '476': 'Türk Telekom',
      '477': 'Türk Telekom',
      '478': 'Türk Telekom',
      '479': 'Türk Telekom',
      '480': 'Türk Telekom',
      '481': 'Türk Telekom',
      '482': 'Türk Telekom',
      '483': 'Türk Telekom',
      '484': 'Türk Telekom',
      '485': 'Türk Telekom',
      '486': 'Türk Telekom',
      '487': 'Türk Telekom',
      '488': 'Türk Telekom',
      '489': 'Türk Telekom',
      '490': 'Türk Telekom',
      '491': 'Türk Telekom',
      '492': 'Türk Telekom',
      '493': 'Türk Telekom',
      '494': 'Türk Telekom',
      '495': 'Türk Telekom',
      '496': 'Türk Telekom',
      '497': 'Türk Telekom',
      '498': 'Türk Telekom',
      '499': 'Türk Telekom'
    };
    
    return operators[prefix] || 'Bilinmiyor';
  }

  // Cinsiyet API fonksiyonu
  async getCinsiyetFromAPI(ad) {
    try {
      // Türkçe isimler için daha iyi sonuç almak için country_id parametresi ekle
      const response = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(ad)}&country_id=TR`);
      if (response.data && response.data.gender) {
        return response.data.gender === 'male' ? 'Erkek' : 'Kadın';
      }
      return 'Bilinmiyor';
    } catch (error) {
      console.log('❌ Cinsiyet API hatası:', error.message);
      return 'Bilinmiyor';
    }
  }

  // TC ile detaylı kişi bilgilerini getir
  async getKisiByTC(tc) {
    try {
      console.log(`🔍 TC ile kişi bilgisi aranıyor: ${tc}`);
      
      const result = {
        tc: tc,
        gsmNumbers: [], // Birden fazla GSM numarası olabilir
        basicInfo: null,
        addressInfo: null, // Data 2024 adres bilgileri
        addressInfoVeri: null, // Veri 2024 adres bilgileri
        addressInfo2015: null, // 2015 adres bilgileri
        dataInfo: null,
        veriInfo: null,
        aracBilgileri: null, // Araç bilgileri
        cinsiyet: 'Bilinmiyor', // Başlangıçta bilinmiyor
        kizlikSoyadi: 'Bilinmiyor' // Kızlık soyadı
      };

      // GSM numaralarını getir (birden fazla olabilir)
      try {
        console.log('📱 GSM numaraları aranıyor...');
        const gsmConnection = await getConnection('gsmtc');
        const [gsmRows] = await gsmConnection.execute(
          'SELECT * FROM gsmtc WHERE TC = ?',
          [tc]
        );
        gsmConnection.release();
        
        console.log(`📱 ${gsmRows.length} adet GSM numarası bulundu`);
        result.gsmNumbers = gsmRows.map(row => {
          // GSM numarasını formatla ve operatör bilgisini ekle
          if (row.GSM) {
            const cleanGsm = row.GSM.toString().replace(/\D/g, '');
            if (cleanGsm.length === 10) {
              // Başına 0 ekle ve formatla
              const formattedGsm = `0${cleanGsm.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;
              
              // Operatör bilgisini belirle
              const operator = this.getOperator(cleanGsm);
              
              return {
                ...row,
                GSM: formattedGsm,
                operator: operator
              };
            }
          }
          return row;
        });
      } catch (error) {
        console.error('❌ GSM bilgileri alınamadı:', error.message);
      }

      // 101m veritabanından temel bilgiler
      try {
        console.log('📊 101m veritabanından bilgiler alınıyor...');
        const basicConnection = await getConnection('101m');
        const [basicRows] = await basicConnection.execute(
          'SELECT * FROM 101m WHERE TC = ?',
          [tc]
        );
        basicConnection.release();
        
        if (basicRows.length > 0) {
          result.basicInfo = basicRows[0];
          console.log('✅ 101m bilgileri alındı:', result.basicInfo.ADI, result.basicInfo.SOYADI);
          
          // Cinsiyet API'sini çağır
          if (result.basicInfo.ADI) {
            result.cinsiyet = await this.getCinsiyetFromAPI(result.basicInfo.ADI);
            console.log('✅ Cinsiyet API sonucu:', result.cinsiyet);
          }
          
          // Kızlık soyadını hesapla
          if (result.basicInfo.ANNETC) {
            result.kizlikSoyadi = await this.getKizlikSoyadi(result.basicInfo.ANNETC);
            console.log('✅ Kızlık soyadı:', result.kizlikSoyadi);
          }
        }
      } catch (error) {
        console.error('❌ 101m bilgileri alınamadı:', error.message);
      }

      // Secmen veritabanından adres bilgileri (2015)
      try {
        console.log('🏠 Secmen veritabanından adres bilgileri alınıyor (2015)...');
        const voterConnection = await getConnection('secmen');
        const [voterRows] = await voterConnection.execute(
          'SELECT * FROM secmen2015 WHERE TC = ?',
          [tc]
        );
        voterConnection.release();
        
        if (voterRows.length > 0) {
          result.addressInfo2015 = voterRows[0];
          result.addressInfo2015.year = '2015'; // Yıl bilgisi ekle
          console.log('✅ Secmen 2015 bilgileri alındı:', result.addressInfo2015.ADI, result.addressInfo2015.SOYADI);
        }
      } catch (error) {
        console.error('❌ Secmen 2015 bilgileri alınamadı:', error.message);
      }

              // 2024 Adres Bilgileri (Data ve Veri veritabanlarından)
        try {
          console.log('🏠 2024 adres bilgileri alınıyor...');
          let address2024 = null;
          let address2024Veri = null;
          
          // Data veritabanından kontrol et
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
            
            // Önce birkaç örnek kayıt göster
            const [sampleRows] = await dataConnection.execute('SELECT KimlikNo, AdSoyad FROM datam LIMIT 5');
            console.log('📋 Data örnek kayıtlar:', sampleRows);
            
            const [dataRows] = await dataConnection.execute(
              'SELECT * FROM datam WHERE KimlikNo = ?',
              [tc]
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
          
          // Veri veritabanından da kontrol et (her zaman)
          try {
            const veriConnection = await getConnection('veri');
            console.log('🔗 Veri veritabanına bağlantı başarılı');
            
            // Önce tablo yapısını kontrol et
            try {
              const [columns] = await veriConnection.execute('DESCRIBE datam');
              console.log('📋 Veri datam tablosu yapısı:', columns.map(col => col.Field));
            } catch (error) {
              console.log('❌ datam tablosu bulunamadı, diğer tablolar kontrol ediliyor...');
              const [tables] = await veriConnection.execute('SHOW TABLES');
              console.log('📋 Veri veritabanındaki tablolar:', tables.map(t => Object.values(t)[0]));
            }
            
            // Önce birkaç örnek kayıt göster
            const [sampleRows] = await veriConnection.execute('SELECT KimlikNo, AdSoyad FROM datam LIMIT 5');
            console.log('📋 Veri örnek kayıtlar:', sampleRows);
            
            // Aradığımız TC'yi kontrol et
            console.log(`🔍 Veri veritabanında aranan TC: ${tc}`);
            
            // Önce LIKE ile arama yapalım (text kolonlar için daha güvenli)
            const [veriRows] = await veriConnection.execute(
              'SELECT * FROM datam WHERE KimlikNo LIKE ?',
              [tc]
            );
            veriConnection.release();
            
            console.log(`📊 Veri sorgu sonucu: ${veriRows.length} kayıt bulundu`);
            
            if (veriRows.length > 0) {
              address2024Veri = veriRows[0];
              address2024Veri.source = 'veri';
              console.log('✅ Veri 2024 adres bilgileri alındı:', address2024Veri);
              console.log('🏠 İkametgah:', address2024Veri.Ikametgah);
            } else {
              console.log('❌ Veri veritabanında TC bulunamadı:', tc);
              
              // Farklı sorgular deneyelim
              console.log('🔍 Alternatif sorgular deneniyor...');
              
              // 1. Tam eşleşme
              const [exactRows] = await veriConnection.execute(
                'SELECT * FROM datam WHERE KimlikNo = ?',
                [tc]
              );
              console.log(`📊 Tam eşleşme sonucu: ${exactRows.length} kayıt`);
              
              // 2. Trim ile arama
              const [trimRows] = await veriConnection.execute(
                'SELECT * FROM datam WHERE TRIM(KimlikNo) = ?',
                [tc]
              );
              console.log(`📊 Trim ile arama sonucu: ${trimRows.length} kayıt`);
              
              // 3. İlk 5 karakter ile arama
              const [prefixRows] = await veriConnection.execute(
                'SELECT * FROM datam WHERE LEFT(KimlikNo, 5) = ?',
                [tc.substring(0, 5)]
              );
              console.log(`📊 İlk 5 karakter ile arama sonucu: ${prefixRows.length} kayıt`);
              
              // 4. Örnek bir kayıt göster
              const [sampleRow] = await veriConnection.execute('SELECT KimlikNo, AdSoyad FROM datam LIMIT 1');
              if (sampleRow.length > 0) {
                console.log('📋 Örnek kayıt:', sampleRow[0]);
                console.log('📋 KimlikNo uzunluğu:', sampleRow[0].KimlikNo.length);
                console.log('📋 KimlikNo karakterleri:', Array.from(sampleRow[0].KimlikNo).map(c => c.charCodeAt(0)));
              }
              
              // TC'nin var olup olmadığını kontrol et
              const checkConnection = await getConnection('veri');
              const [checkRows] = await checkConnection.execute('SELECT COUNT(*) as count FROM datam');
              console.log(`📊 Veri datam tablosunda toplam kayıt sayısı: ${checkRows[0].count}`);
              checkConnection.release();
            }
          } catch (error) {
            console.log('❌ Veri 2024 adres bilgileri alınamadı:', error.message);
          }
        
        // Data'dan gelen bilgileri kaydet
        if (address2024) {
          address2024.year = '2024';
          result.addressInfo = address2024;
          console.log('🏠 Data 2024 adres bilgileri kaydedildi:', address2024.Ikametgah);
        }
        
        // Veri'den gelen bilgileri de kaydet
        if (address2024Veri) {
          address2024Veri.year = '2024';
          result.addressInfoVeri = address2024Veri;
          console.log('🏠 Veri 2024 adres bilgileri kaydedildi:', address2024Veri.Ikametgah);
        }
        
        if (!address2024 && !address2024Veri) {
          console.log('❌ 2024 adres bilgileri bulunamadı');
        }
      } catch (error) {
        console.error('❌ 2024 adres bilgileri alınamadı:', error.message);
      }

      // Ek bilgileri adres bilgilerinden al (zaten yukarıda alındı)
      if (result.addressInfo) {
        result.dataInfo = result.addressInfo;
      } else if (result.addressInfoVeri) {
        result.veriInfo = result.addressInfoVeri;
      }

      // Araç bilgilerini getir
      try {
        console.log('🚗 Araç bilgileri aranıyor...');
        const aracConnection = await getConnection('arac');
        const [aracRows] = await aracConnection.execute(
          'SELECT * FROM arac WHERE TC = ?',
          [tc]
        );
        aracConnection.release();
        
        if (aracRows.length > 0) {
          result.aracBilgileri = aracRows[0];
          console.log('✅ Araç bilgileri alındı:', result.aracBilgileri.plaka);
        } else {
          console.log('❌ Araç bilgisi bulunamadı');
        }
      } catch (error) {
        console.log('❌ Araç bilgileri alınamadı:', error.message);
      }

      return result;
    } catch (error) {
      console.error('Kişi sorgu hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // Ad soyad ile kişi arama
  async searchKisiByAdSoyad(params) {
    // Geriye dönük uyumluluk: eski imza ile çağrılırsa
    if (typeof params === 'string' || typeof params === 'undefined') {
      params = {
        ad: params || '',
        soyad: arguments[1] || '',
        dogumTarihi: arguments[2] || '',
        il: arguments[3] || ''
      };
    }
    const {
      ad = '',
      soyad = '',
      tc = '',
      gsm = '',
      adres = '',
      dogumTarihi = '',
      il = '',
      ilce = '',
      anneAdi = '',
      anneTc = '',
      babaAdi = '',
      babaTc = '',
      uyruk = '',
      vergiNumarasi = '',
      mahalle = '',
      cadde = '',
      kapino = '',
      daireNo = '',
      engel = '',
      cinsiyet = ''
    } = params;
    try {
      console.log(`🔍 Parametreli arama:`, params);
      const results = [];

      // 101m veritabanından arama
      try {
        console.log('📊 101m veritabanında arama yapılıyor...');
        const basicConnection = await getConnection('101m');
        let query = 'SELECT * FROM 101m WHERE 1=1';
        let queryParams = [];
        if (tc) { query += ' AND TC = ?'; queryParams.push(tc); }
        if (ad) { query += ' AND ADI LIKE ?'; queryParams.push(`%${ad}%`); }
        if (soyad) { query += ' AND SOYADI LIKE ?'; queryParams.push(`%${soyad}%`); }
        if (dogumTarihi) { query += ' AND DOGUMTARIHI = ?'; queryParams.push(dogumTarihi); }
        if (il) { query += ' AND NUFUSIL = ?'; queryParams.push(il); }
        if (ilce) { query += ' AND NUFUSILCE = ?'; queryParams.push(ilce); }
        if (anneAdi) { query += ' AND ANNEADI LIKE ?'; queryParams.push(`%${anneAdi}%`); }
        if (anneTc) { query += ' AND ANNETC = ?'; queryParams.push(anneTc); }
        if (babaAdi) { query += ' AND BABAADI LIKE ?'; queryParams.push(`%${babaAdi}%`); }
        if (babaTc) { query += ' AND BABATC = ?'; queryParams.push(babaTc); }
        if (uyruk) { query += ' AND UYRUK LIKE ?'; queryParams.push(`%${uyruk}%`); }
        if (cinsiyet) { query += ' AND CINSIYETI = ?'; queryParams.push(cinsiyet); }
        query += ' LIMIT 25';
        const [basicRows] = await basicConnection.execute(query, queryParams);
        basicConnection.release();
        console.log(`📊 101m'den ${basicRows.length} sonuç bulundu`);
        results.push(...basicRows.map(row => ({ ...row, source: '101m' })));
      } catch (error) {
        console.error('❌ 101m arama hatası:', error.message);
      }

      // Secmen veritabanından arama (2015)
      try {
        console.log('🏠 Secmen veritabanında arama yapılıyor (2015)...');
        const voterConnection = await getConnection('secmen');
        let query = 'SELECT * FROM secmen2015 WHERE 1=1';
        let queryParams = [];
        if (tc) { query += ' AND TC = ?'; queryParams.push(tc); }
        if (ad) { query += ' AND ADI LIKE ?'; queryParams.push(`%${ad}%`); }
        if (soyad) { query += ' AND SOYADI LIKE ?'; queryParams.push(`%${soyad}%`); }
        if (dogumTarihi) { query += ' AND DOGUMTARIHI = ?'; queryParams.push(dogumTarihi); }
        if (il) { query += ' AND ADRESIL = ?'; queryParams.push(il); }
        if (ilce) { query += ' AND ADRESILCE = ?'; queryParams.push(ilce); }
        if (anneAdi) { query += ' AND ANAADI LIKE ?'; queryParams.push(`%${anneAdi}%`); }
        if (babaAdi) { query += ' AND BABAADI LIKE ?'; queryParams.push(`%${babaAdi}%`); }
        if (uyruk) { query += ' AND UYRUK LIKE ?'; queryParams.push(`%${uyruk}%`); }
        if (mahalle) { query += ' AND MAHALLE LIKE ?'; queryParams.push(`%${mahalle}%`); }
        if (cadde) { query += ' AND CADDE LIKE ?'; queryParams.push(`%${cadde}%`); }
        if (kapino) { query += ' AND KAPINO = ?'; queryParams.push(kapino); }
        if (daireNo) { query += ' AND DAIRENO = ?'; queryParams.push(daireNo); }
        if (engel) { query += ' AND ENGEL LIKE ?'; queryParams.push(`%${engel}%`); }
        if (cinsiyet) { query += ' AND CINSIYETI = ?'; queryParams.push(cinsiyet); }
        query += ' LIMIT 25';
        const [voterRows] = await voterConnection.execute(query, queryParams);
        voterConnection.release();
        console.log(`🏠 Secmen 2015'den ${voterRows.length} sonuç bulundu`);
        results.push(...voterRows.map(row => ({ ...row, source: 'secmen2015' })));
      } catch (error) {
        console.error('❌ Secmen 2015 arama hatası:', error.message);
      }

      // Data veritabanından arama (2024)
      try {
        console.log('📋 Data veritabanında arama yapılıyor (2024)...');
        const dataConnection = await getConnection('data');
        let query = 'SELECT * FROM datam WHERE 1=1';
        let queryParams = [];
        if (tc) { query += ' AND (TC = ? OR KimlikNo = ?)'; queryParams.push(tc, tc); }
        if (ad || soyad) { query += ' AND AdSoyad LIKE ?'; queryParams.push(`%${ad}%${soyad ? ' ' + soyad : ''}%`); }
        if (dogumTarihi) { query += ' AND DogumYeri = ?'; queryParams.push(dogumTarihi); }
        if (anneAdi) { query += ' AND AnaAdi LIKE ?'; queryParams.push(`%${anneAdi}%`); }
        if (babaAdi) { query += ' AND BabaAdi LIKE ?'; queryParams.push(`%${babaAdi}%`); }
        if (uyruk) { query += ' AND Uyruk LIKE ?'; queryParams.push(`%${uyruk}%`); }
        if (vergiNumarasi) { query += ' AND VergiNumarasi = ?'; queryParams.push(vergiNumarasi); }
        if (mahalle) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${mahalle}%`); }
        if (cadde) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${cadde}%`); }
        if (kapino) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${kapino}%`); }
        if (daireNo) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${daireNo}%`); }
        if (cinsiyet) { query += ' AND Cinsiyet = ?'; queryParams.push(cinsiyet); }
        // il ve ilce için Ikametgah LIKE ile arama
        if (il) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${il}%`); }
        if (ilce) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${ilce}%`); }
        // adres parametresi ile çoklu LIKE
        if (adres) {
          const parcalar = adres.split(/\s+/).filter(Boolean);
          parcalar.forEach(parca => {
            query += ' AND Ikametgah LIKE ?';
            queryParams.push(`%${parca}%`);
          });
        }
        query += ' LIMIT 25';
        const [dataRows] = await dataConnection.execute(query, queryParams);
        dataConnection.release();
        console.log(`📋 Data 2024'ten ${dataRows.length} sonuç bulundu`);
        results.push(...dataRows.map(row => ({ ...row, source: 'data2024' })));
      } catch (error) {
        console.error('❌ Data 2024 arama hatası:', error.message);
      }

      // Veri veritabanından arama (2024)
      try {
        console.log('📋 Veri veritabanında arama yapılıyor (2024)...');
        const veriConnection = await getConnection('veri');
        let query = 'SELECT * FROM datam WHERE 1=1';
        let queryParams = [];
        if (tc) { query += ' AND (TC = ? OR KimlikNo = ?)'; queryParams.push(tc, tc); }
        if (ad || soyad) { query += ' AND AdSoyad LIKE ?'; queryParams.push(`%${ad}%${soyad ? ' ' + soyad : ''}%`); }
        if (dogumTarihi) { query += ' AND DogumYeri = ?'; queryParams.push(dogumTarihi); }
        if (anneAdi) { query += ' AND AnaAdi LIKE ?'; queryParams.push(`%${anneAdi}%`); }
        if (babaAdi) { query += ' AND BabaAdi LIKE ?'; queryParams.push(`%${babaAdi}%`); }
        if (uyruk) { query += ' AND Uyruk LIKE ?'; queryParams.push(`%${uyruk}%`); }
        if (vergiNumarasi) { query += ' AND VergiNumarasi = ?'; queryParams.push(vergiNumarasi); }
        if (mahalle) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${mahalle}%`); }
        if (cadde) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${cadde}%`); }
        if (kapino) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${kapino}%`); }
        if (daireNo) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${daireNo}%`); }
        if (cinsiyet) { query += ' AND Cinsiyet = ?'; queryParams.push(cinsiyet); }
        // il ve ilce için Ikametgah LIKE ile arama
        if (il) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${il}%`); }
        if (ilce) { query += ' AND Ikametgah LIKE ?'; queryParams.push(`%${ilce}%`); }
        // adres parametresi ile çoklu LIKE
        if (adres) {
          const parcalar = adres.split(/\s+/).filter(Boolean);
          parcalar.forEach(parca => {
            query += ' AND Ikametgah LIKE ?';
            queryParams.push(`%${parca}%`);
          });
        }
        query += ' LIMIT 25';
        const [veriRows] = await veriConnection.execute(query, queryParams);
        veriConnection.release();
        console.log(`📋 Veri 2024'ten ${veriRows.length} sonuç bulundu`);
        results.push(...veriRows.map(row => ({ ...row, source: 'veri2024' })));
      } catch (error) {
        console.error('❌ Veri 2024 arama hatası:', error.message);
      }

      // Sonuçları TC'ye göre grupla ve tekrarları kaldır
      const uniqueResults = [];
      const seenTCs = new Set();
      results.forEach(result => {
        if (!seenTCs.has(result.TC)) {
          seenTCs.add(result.TC);
          uniqueResults.push(result);
        }
      });
      console.log(`🎯 Toplam ${uniqueResults.length} benzersiz sonuç bulundu`);
      return uniqueResults.slice(0, 50); // Maksimum 50 sonuç
    } catch (error) {
      console.error('Ad soyad arama hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // İstatistikleri getir
  async getStats() {
    try {
      console.log('📊 İstatistikler hesaplanıyor...');
      
      const stats = {
        toplam_kisi: 0,
        aktif_kisi: 0,
        erkek_sayisi: 0,
        kadin_sayisi: 0,
        toplam_gsm: 0,
        veritabanlari: {}
      };

      // Her veritabanından istatistikleri topla
      const databases = ['gsmtc', '101m', 'secmen', 'data', 'veri'];
      
      for (const dbName of databases) {
        try {
          const connection = await getConnection(dbName);
          let tableName = 'gsmtc';
          
          // Her veritabanı için doğru tablo ismini belirle
          if (dbName === '101m') tableName = '101m';
          else if (dbName === 'secmen') tableName = 'secmen2015';
          else if (dbName === 'data' || dbName === 'veri') tableName = 'datam';
          
          const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
          connection.release();
          
          stats.veritabanlari[dbName] = rows[0].count;
          stats.toplam_kisi += rows[0].count;
          
          console.log(`📊 ${dbName}: ${rows[0].count} kayıt`);
        } catch (error) {
          console.error(`❌ ${dbName} istatistik hatası:`, error.message);
          stats.veritabanlari[dbName] = 0;
        }
      }

      // GSM sayısını ayrı hesapla
      try {
        const gsmConnection = await getConnection('gsmtc');
        const [gsmRows] = await gsmConnection.execute('SELECT COUNT(DISTINCT GSM) as count FROM gsmtc WHERE GSM IS NOT NULL');
        gsmConnection.release();
        stats.toplam_gsm = gsmRows[0].count;
        console.log(`📱 Toplam benzersiz GSM: ${stats.toplam_gsm}`);
      } catch (error) {
        console.error('❌ GSM istatistik hatası:', error.message);
      }

      console.log(`🎯 Toplam istatistik: ${stats.toplam_kisi} kişi, ${stats.toplam_gsm} GSM`);
      return stats;
    } catch (error) {
      console.error('İstatistik hatası:', error);
      throw new Error('Veritabanı sorgu hatası');
    }
  }

  // Kızlık soyadını hesapla (Annenin babasının soyadı)
  async getKizlikSoyadi(anneTC) {
    try {
      console.log(`👩 Kızlık soyadı aranıyor (Anne TC: ${anneTC})`);
      
      if (!anneTC) {
        return 'Bilinmiyor';
      }
      
      const connection = await getConnection('101m');
      
      // Önce annenin bilgilerini al (baba TC'si için)
      const [anneResult] = await connection.execute(
        'SELECT SOYADI, BABATC FROM 101m WHERE TC = ?',
        [anneTC]
      );
      
      if (anneResult.length === 0) {
        connection.release();
        console.log('❌ Anne bilgisi bulunamadı');
        return 'Bilinmiyor';
      }
      
      const anne = anneResult[0];
      
      // Eğer annenin baba TC'si yoksa, annenin kendi soyadını kullan
      if (!anne.BABATC) {
        connection.release();
        console.log(`✅ Anne'nin baba TC'si yok, kendi soyadi kullaniliyor: ${anne.SOYADI}`);
        return anne.SOYADI;
      }
      
      // Annenin babasının soyadını al
      const [babaResult] = await connection.execute(
        'SELECT SOYADI FROM 101m WHERE TC = ?',
        [anne.BABATC]
      );
      connection.release();
      
      if (babaResult.length > 0) {
        const kizlikSoyadi = babaResult[0].SOYADI;
        console.log(`✅ Kizlik soyadi bulundu (Annenin babasinin soyadi): ${kizlikSoyadi}`);
        return kizlikSoyadi;
      } else {
        console.log('❌ Anne\'nin babasi bulunamadi, anne\'nin kendi soyadi kullaniliyor');
        return anne.SOYADI;
      }
    } catch (error) {
      console.error('❌ Kızlık soyadı sorgu hatası:', error);
      return 'Bilinmiyor';
    }
  }

  // Kardeş bilgileri sorgusu
  async getKardesBilgileri(tc) {
    try {
      console.log(`👥 Kardeş bilgileri aranıyor: ${tc}`);
      
      // Önce kişinin anne ve baba TC'sini al
      const basicConnection = await getConnection('101m');
      const [kisiResult] = await basicConnection.execute(
        'SELECT ANNETC, BABATC FROM 101m WHERE TC = ?',
        [tc]
      );
      
      if (kisiResult.length === 0) {
        basicConnection.release();
        console.log('❌ Kişi bulunamadı');
        return { success: false, message: 'Kişi bulunamadı' };
      }
      
      const { ANNETC, BABATC } = kisiResult[0];
      
      if (!ANNETC && !BABATC) {
        basicConnection.release();
        console.log('❌ Anne veya baba bilgisi bulunamadı');
        return { success: true, data: [], message: 'Anne veya baba bilgisi bulunamadı' };
      }
      
      console.log(`👥 Anne TC: ${ANNETC}, Baba TC: ${BABATC}`);
      
      // Aynı anne ve baba TC'sine sahip kişileri bul (kendisi hariç)
      let kardesQuery = `
        SELECT TC, ADI, SOYADI, DOGUMTARIHI, NUFUSIL, ANNEADI, BABAADI
        FROM 101m 
        WHERE TC != ? AND (
      `;
      
      const params = [tc];
      
      if (ANNETC) {
        kardesQuery += `ANNETC = ?`;
        params.push(ANNETC);
      }
      
      if (BABATC) {
        if (ANNETC) {
          kardesQuery += ` AND `;
        }
        kardesQuery += `BABATC = ?`;
        params.push(BABATC);
      }
      
      kardesQuery += `) ORDER BY DOGUMTARIHI ASC`;
      
      console.log(`🔍 Kardeş sorgusu: ${kardesQuery}`);
      console.log(`🔍 Parametreler:`, params);
      
      const [kardesResult] = await basicConnection.execute(kardesQuery, params);
      basicConnection.release();
      
      console.log(`✅ ${kardesResult.length} kardeş bulundu`);
      
      if (kardesResult.length > 0) {
        console.log('👥 Kardeşler:', kardesResult.map(k => `${k.ADI} ${k.SOYADI} (${k.TC})`));
      }
      
      return {
        success: true,
        data: kardesResult.map(kardes => ({
          tc: kardes.TC,
          ad: kardes.ADI,
          soyad: kardes.SOYADI,
          dogumTarihi: kardes.DOGUMTARIHI,
          dogumYeri: kardes.NUFUSIL,
          anneAdi: kardes.ANNEADI,
          babaAdi: kardes.BABAADI
        }))
      };
      
    } catch (error) {
      console.error('❌ Kardeş bilgileri sorgu hatası:', error);
      return { success: false, message: 'Kardeş bilgileri sorgulanırken hata oluştu' };
    }
  }
}

module.exports = new KisiService(); 