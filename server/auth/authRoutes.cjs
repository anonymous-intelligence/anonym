const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User.cjs');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '';
  do {
    color = '';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color.toLowerCase() === 'ffffff' || color.toLowerCase() === 'fff');
  return color;
}

router.post('/register', async (req, res) => {
  try {
    const { username, password, eposta, profilFoto } = req.body;
    if (!username || !password || !eposta) {
      return res.status(400).json({ error: 'Eksik bilgi' });
    }
    const existingUser = await User.findOne({ $or: [ { username }, { eposta } ] });
    if (existingUser) {
      return res.status(409).json({ error: 'Kullanıcı adı veya e-posta zaten kayıtlı' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    let finalProfilFoto = profilFoto;
    if (!finalProfilFoto) {
      const bgColor = getRandomColor();
      const trimmed = username ? username.trim() : '';
      const firstLetter = trimmed ? trimmed[0].toUpperCase() : 'A';
      finalProfilFoto = `https://ui-avatars.com/api/?background=${bgColor}&color=fff&name=${firstLetter}`;
    }
    const user = await User.create({
      username,
      passwordHash,
      eposta,
      profilFoto: finalProfilFoto,
    });
    res.status(201).json({ message: 'Kayıt başarılı', user: { username: user.username, eposta: user.eposta, profilFoto: user.profilFoto } });
  } catch (err) {
    console.error('[REGISTER] Hata:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Eksik bilgi' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Şifre hatalı' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Me (token ile kullanıcı bilgisi)
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token gerekli' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
});

module.exports = router; 