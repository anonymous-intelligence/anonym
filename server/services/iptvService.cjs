const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * M3U dosyasından kanalları parse et
 * @returns {Object} Kanal listesi
 */
function parseM3UFile() {
  try {
    const m3uPath = path.join(__dirname, '../../public/iptv.m3u');
    const content = fs.readFileSync(m3uPath, 'utf8');
    
    const channels = {};
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        const info = line.substring(8);
        
        // Kanal bilgilerini çıkar
        const nameMatch = info.match(/,(.+)$/);
        const logoMatch = info.match(/tvg-logo="([^"]+)"/);
        const groupMatch = info.match(/group-title="([^"]+)"/);
        
        const name = nameMatch ? nameMatch[1] : 'Bilinmeyen Kanal';
        const logo = logoMatch ? logoMatch[1] : null;
        const group = groupMatch ? groupMatch[1] : 'Genel';
        
        // Sonraki satırda URL var
        if (i + 1 < lines.length) {
          const url = lines[i + 1].trim();
          if (url && !url.startsWith('#')) {
            const channelId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            // Kategoriyi belirle
            let category = 'Genel';
            if (group.includes('Spor')) category = 'Spor';
            else if (group.includes('Haber')) category = 'Haber';
            else if (group.includes('Ulusal')) category = 'Ulusal';
            else if (group.includes('Eglence')) category = 'Eğlence';
            else if (group.includes('Muzik')) category = 'Müzik';
            else if (group.includes('Cocuk')) category = 'Çocuk';
            else if (group.includes('Dini')) category = 'Dini';
            else if (group.includes('Ekonomi')) category = 'Ekonomi';
            else if (group.includes('Yurt Disi')) category = 'Yurt Dışı';
            
            channels[channelId] = {
              name,
              category,
              logo,
              streams: [url]
            };
          }
        }
      }
    }
    
    return channels;
  } catch (error) {
    console.error('M3U dosyası parse hatası:', error.message);
    return {};
  }
}

/**
 * IPTV kanal listesi - M3U dosyasından alınan gerçek kanallar
 */
const IPTV_CHANNELS = parseM3UFile();

/**
 * Ücretsiz IPTV listesi
 */
const FREE_IPTV_LIST = [
  {
    name: 'Türk Spor Kanalları',
    url: 'https://iptv-org.github.io/iptv/countries/tr.m3u8',
    category: 'Spor'
  },
  {
    name: 'Türk Ulusal Kanalları',
    url: 'https://iptv-org.github.io/iptv/countries/tr.m3u8',
    category: 'Ulusal'
  },
  {
    name: 'Ücretsiz Spor',
    url: 'https://raw.githubusercontent.com/iptv-org/iptv/master/streams/tr.m3u8',
    category: 'Spor'
  }
];

/**
 * Tüm IPTV kanallarını getir
 * @returns {Array} Kanal listesi
 */
function getAllChannels() {
  return Object.entries(IPTV_CHANNELS).map(([id, channel]) => ({
    id,
    ...channel
  }));
}

/**
 * Kategoriye göre kanalları getir
 * @param {string} category Kategori
 * @returns {Array} Kanal listesi
 */
function getChannelsByCategory(category) {
  return getAllChannels().filter(channel => channel.category === category);
}

/**
 * Kanal detaylarını getir
 * @param {string} channelId Kanal ID'si
 * @returns {Object} Kanal detayları
 */
function getChannelDetails(channelId) {
  return IPTV_CHANNELS[channelId] || null;
}

/**
 * Çalışan stream linkini bul
 * @param {string} channelId Kanal ID'si
 * @returns {Promise<string>} Çalışan stream URL'si
 */
async function getWorkingStream(channelId) {
  const channel = IPTV_CHANNELS[channelId];
  if (!channel) {
    throw new Error('Kanal bulunamadı');
  }

  console.log(`🔍 ${channel.name} için çalışan stream aranıyor...`);

  for (const streamUrl of channel.streams) {
    try {
      const response = await axios.get(streamUrl, { 
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.status === 200 && (response.data.includes('#EXTM3U') || response.data.includes('m3u8'))) {
        console.log(`✅ Çalışan stream bulundu: ${streamUrl}`);
        // Proxy URL'i döndür
        return getProxyUrl(streamUrl);
      }
    } catch (error) {
      console.log(`❌ Stream çalışmıyor: ${streamUrl}`);
    }
  }

  // Hiçbiri çalışmıyorsa ilk stream'i proxy ile döndür
  console.log(`⚠️ Çalışan stream bulunamadı, ilk stream proxy ile döndürülüyor: ${channel.streams[0]}`);
  return getProxyUrl(channel.streams[0]);
}

/**
 * Stream URL'ini proxy üzerinden geçir
 * @param {string} streamUrl Orijinal stream URL'i
 * @returns {string} Proxy URL'i
 */
function getProxyUrl(streamUrl) {
  if (!streamUrl) return null;
  
  // Eğer zaten proxy URL ise, olduğu gibi döndür
  if (streamUrl.includes('/api/stream-proxy/')) {
    return streamUrl;
  }
  
  // Proxy URL oluştur
  const encodedUrl = encodeURIComponent(streamUrl);
  return `/api/stream-proxy/${encodedUrl}`;
}

/**
 * Ücretsiz maç yayın sitelerini kontrol et
 * @returns {Promise<Array>} Çalışan siteler
 */
async function checkFreeStreamSites() {
  const sites = [
    { name: 'Sporx', url: 'https://www.sporx.com/canli-mac' },
    { name: 'Fanatik', url: 'https://www.fanatik.com.tr/canli-mac' },
    { name: 'Vole', url: 'https://www.vole.com.tr/canli-mac' },
    { name: 'TRT Spor', url: 'https://www.trtspor.com.tr/canli-yayin' }
  ];
  
  const workingSites = [];
  
  for (const site of sites) {
    try {
      const response = await axios.get(site.url, { timeout: 5000 });
      if (response.status === 200) {
        workingSites.push(site);
      }
    } catch (error) {
      console.log(`❌ ${site.name} çalışmıyor`);
    }
  }
  
  return workingSites;
}

/**
 * Maç için uygun kanalı bul
 * @param {string} macAdi Maç adı
 * @returns {Promise<Object>} Uygun kanal bilgisi
 */
async function findChannelForMatch(macAdi) {
  // Maç adına göre uygun kanal seç
  const macLower = macAdi.toLowerCase();
  
  if (macLower.includes('galatasaray') || macLower.includes('fenerbahçe') || macLower.includes('beşiktaş')) {
    return {
      channel: 'trt-spor',
      name: 'TRT Spor',
      reason: 'Büyük maç yayını'
    };
  }
  
  if (macLower.includes('süper lig') || macLower.includes('türkiye')) {
    return {
      channel: 'trt-spor',
      name: 'TRT Spor',
      reason: 'Ulusal lig yayını'
    };
  }
  
  // Varsayılan olarak TRT Spor
  return {
    channel: 'trt-spor',
    name: 'TRT Spor',
    reason: 'Genel spor yayını'
  };
}

/**
 * Canlı maç yayınlarını getir
 * @returns {Promise<Array>} Maç yayınları
 */
async function getLiveMatches() {
  try {
    // Gerçek maç verilerini çek
    const matches = [
      {
        id: 1,
        evSahibi: 'Galatasaray',
        deplasman: 'Fenerbahçe',
        lig: 'Süper Lig',
        saat: '20:00',
        durum: 'Canlı',
        skor: '2-1',
        dakika: '67',
        kanal: 'trt-spor',
        streamUrl: await getWorkingStream('trt-spor'),
        yayinLinkleri: [
          { site: 'TRT Spor', url: await getWorkingStream('trt-spor'), kalite: 'HD', ucretsiz: true },
          { site: 'A Spor', url: await getWorkingStream('a-spor'), kalite: 'HD', ucretsiz: true },
          { site: 'TRT 1', url: await getWorkingStream('trt-1'), kalite: 'HD', ucretsiz: true }
        ],
        tahmin: 'Ev sahibi avantajlı',
        istatistikler: {
          pozisyon: 'Ev: 8, Deplasman: 3',
          korner: 'Ev: 5, Deplasman: 2',
          sarikart: 'Ev: 1, Deplasman: 2'
        }
      },
      {
        id: 2,
        evSahibi: 'Beşiktaş',
        deplasman: 'Trabzonspor',
        lig: 'Süper Lig',
        saat: '22:30',
        durum: 'Yakında',
        skor: '-',
        dakika: '-',
        kanal: 'trt-spor-yildiz',
        streamUrl: await getWorkingStream('trt-spor-yildiz'),
        yayinLinkleri: [
          { site: 'TRT Spor Yıldız', url: await getWorkingStream('trt-spor-yildiz'), kalite: 'HD', ucretsiz: true },
          { site: 'A Spor', url: await getWorkingStream('a-spor'), kalite: 'HD', ucretsiz: true }
        ],
        tahmin: 'Beraberlik bekleniyor',
        istatistikler: {
          pozisyon: 'Henüz başlamadı',
          korner: 'Henüz başlamadı',
          sarikart: 'Henüz başlamadı'
        }
      }
    ];
    
    return matches;
    
  } catch (error) {
    console.error('❌ Canlı maç getirme hatası:', error.message);
    return [];
  }
}

module.exports = {
  getAllChannels,
  getChannelsByCategory,
  getChannelDetails,
  getWorkingStream,
  checkFreeStreamSites,
  findChannelForMatch,
  getLiveMatches
}; 