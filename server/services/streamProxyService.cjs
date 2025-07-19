const axios = require('axios');
const express = require('express');

/**
 * Stream proxy servisi
 * CORS sorunlarını çözmek için stream'leri proxy üzerinden geçirir
 */
class StreamProxyService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 saniye
  }

  /**
   * Stream'i proxy üzerinden geçir
   * @param {string} streamUrl Orijinal stream URL'i
   * @returns {string} Proxy URL'i
   */
  getProxyUrl(streamUrl) {
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
   * Stream içeriğini getir
   * @param {string} streamUrl Stream URL'i
   * @returns {Promise<Object>} Stream içeriği
   */
  async getStreamContent(streamUrl) {
    try {
      const response = await axios.get(streamUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
          'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      return {
        data: response.data,
        headers: response.headers,
        status: response.status
      };
    } catch (error) {
      console.error('Stream içerik hatası:', error.message);
      throw error;
    }
  }

  /**
   * M3U8 playlist'i işle
   * @param {string} content M3U8 içeriği
   * @param {string} baseUrl Temel URL
   * @returns {string} İşlenmiş içerik
   */
  processM3U8Content(content, baseUrl) {
    if (!content || !baseUrl) return content;

    // M3U8 içindeki segment URL'lerini proxy üzerinden geçir
    const lines = content.split('\n');
    const processedLines = lines.map(line => {
      line = line.trim();
      
      // Segment URL'lerini bul ve proxy üzerinden geçir
      if (line && !line.startsWith('#') && !line.startsWith('http')) {
        // Göreceli URL'yi mutlak URL'ye çevir
        const absoluteUrl = new URL(line, baseUrl).href;
        return this.getProxyUrl(absoluteUrl);
      }
      
      return line;
    });

    return processedLines.join('\n');
  }

  /**
   * Express middleware'i oluştur
   * @returns {Function} Express middleware
   */
  createMiddleware() {
    return async (req, res) => {
      try {
        const { encodedUrl } = req.params;
        if (!encodedUrl) {
          return res.status(400).json({ error: 'Stream URL gerekli' });
        }

        const streamUrl = decodeURIComponent(encodedUrl);
        console.log(`🔍 Stream proxy isteği: ${streamUrl}`);

        // Cache kontrolü
        const cacheKey = streamUrl;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('✅ Cache\'den stream döndürülüyor');
          res.set(cached.headers);
          return res.send(cached.data);
        }

        // Stream içeriğini getir
        const streamContent = await this.getStreamContent(streamUrl);
        
        // M3U8 içeriğini işle
        let processedContent = streamContent.data;
        if (streamUrl.includes('.m3u8')) {
          processedContent = this.processM3U8Content(streamContent.data, streamUrl);
        }

        // Cache'e kaydet
        this.cache.set(cacheKey, {
          data: processedContent,
          headers: streamContent.headers,
          timestamp: Date.now()
        });

        // CORS header'larını ekle
        res.set({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Content-Type': streamContent.headers['content-type'] || 'application/octet-stream',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });

        console.log('✅ Stream proxy başarılı');
        res.send(processedContent);

      } catch (error) {
        console.error('❌ Stream proxy hatası:', error.message);
        res.status(500).json({ 
          error: 'Stream yüklenirken hata oluştu',
          details: error.message 
        });
      }
    };
  }

  /**
   * Cache'i temizle
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Stream cache temizlendi');
  }

  /**
   * Cache istatistiklerini getir
   * @returns {Object} Cache istatistikleri
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = StreamProxyService; 