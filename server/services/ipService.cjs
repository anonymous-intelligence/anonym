const fetch = require('node-fetch');

/**
 * Verilen IP adresi için ip-api.com üzerinden bilgi alır.
 * @param {string} ip IP adresi
 * @returns {Promise<Object>} IP bilgileri
 */
async function getIpInfo(ip) {
  if (!ip) throw new Error('IP adresi gerekli.');
  const url = `http://ip-api.com/json/${ip}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('IP bilgisi alınamadı.');
  }
  const data = await response.json();
  return data;
}

module.exports = {
  getIpInfo,
}; 