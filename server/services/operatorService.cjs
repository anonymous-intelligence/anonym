const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// /api/operator/:phone
router.get('/operator/:phone', async (req, res) => {
  const phone = req.params.phone;
  const API_KEY = '2aca7b834ee44dd6b41f8f0aa676404b'; // <--- Kendi Abstract API anahtarını buraya ekle
  const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${API_KEY}&phone=${phone}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Operator API hatası:', err);
    res.status(500).json({ error: 'API hatası', detail: err.message });
  }
});

module.exports = router;
