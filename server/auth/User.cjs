const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  eposta: { type: String, required: true, unique: true },
  profilFoto: { type: String, default: 'https://ui-avatars.com/api/?name=Anonymous' },
  passwordHash: { type: String },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema); 