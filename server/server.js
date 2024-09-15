const express = require('express');
const session = require('express-session');
const passport = require('passport');
const auth = require('./auth');
const api = require('./api');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', auth);
app.use('/api', api);

// Protected route
app.use(express.static(path.join(rootDir, 'public')));

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(rootDir, 'public', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
