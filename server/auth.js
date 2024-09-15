const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config()

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Store the access token for later use
  console.log('Google Strategy Callback');
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', JSON.stringify(profile, null, 2));
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Store the access token for later use
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube.force-ssl'] }));

router.get('/google/callback', (req, res, next) => {
  console.log('Google Callback Route Hit');
  next();
}, passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Google Authentication Successful');res.redirect('/dashboard')
});

router.get('/github', passport.authenticate('github', { scope: ['user:follow'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard.html')
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
