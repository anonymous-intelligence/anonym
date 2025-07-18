const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./User.cjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ eposta: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        eposta: profile.emails[0].value,
        profilFoto: profile.photos[0]?.value || '',
        passwordHash: '',
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, username: req.user.username, eposta: req.user.eposta, profilFoto: req.user.profilFoto },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.redirect(`http://localhost:5173/google-callback?token=${token}`);
});

module.exports = router; 