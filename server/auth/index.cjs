const express = require('express');
const connectMongo = require('./mongo.cjs');
const authRoutes = require('./authRoutes.cjs');
const googleAuth = require('./googleAuth.cjs');
const facebookAuth = require('./facebookAuth.cjs');

// MongoDB bağlantısını başlat
connectMongo()
  .then(() => console.log('✅ MongoDB bağlantısı başarılı (auth)'))
  .catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

const router = express.Router();
router.use(authRoutes);
router.use(googleAuth);
router.use(facebookAuth);

module.exports = router; 