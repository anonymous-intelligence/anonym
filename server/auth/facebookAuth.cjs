const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./User.cjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
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

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, username: req.user.username, eposta: req.user.eposta, profilFoto: req.user.profilFoto },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.redirect(`http://localhost:5173/facebook-callback?token=${token}`);
});

module.exports = router; 