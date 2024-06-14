const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');

const secret = process.env.SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads/facebook', express.static(path.join(__dirname, '..', 'uploads', 'facebook')));

passport.use(new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: 'http://localhost:4000/auth/github/callback',
  scope: ['user:email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    return done(null, profile);
  }));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET_KEY,
  callbackURL: "http://localhost:4000/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;

    if (token) {
      res.redirect(`http://localhost:5173/auth/github/callback?token=${token}`);
    } else {
      res.redirect('http://localhost:5173/login?error=token_missing');
    }
  });

app.get('/auth/github/user', (req, res) => {
  try {
    const obj = req.sessionStore.sessions;
    const key = Object.keys(obj)[0];
    const object = JSON.parse(obj[key]);
    
    const userInfo = {
      name: object.passport.user._json.name,
      email: object.passport.user._json.email,
      picture: object.passport.user._json.avatar_url
    };

    res.json(userInfo);
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`http://localhost:5173/auth/facebook/callback?token=${req.user.token}`);
  });

app.get('/auth/facebook/user', async (req, res) => {
  try {
    const token = req.headers.facebook_token;

    const response = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${token}`);

    const id = response.data.id;
    const name = response.data.name;
    const email = response.data.email;
    const photo = response.data.picture.data.url;

    const photoResponse = await axios({
      url: photo,
      method: 'GET',
      responseType: 'stream'
    });

    const photoPath = path.join(__dirname, '..', 'uploads', 'facebook', `${id}.jpg`);
    const writer = fs.createWriteStream(photoPath);

    photoResponse.data.pipe(writer);

    writer.on('finish', () => {
      const photoUrl = `http://localhost:4000/uploads/facebook/${id}.jpg`;

      res.json({
        name,
        email,
        picture: photoUrl
      });
    });

    writer.on('error', (err) => {
      console.error('Error writing file:', err);
      res.status(500).json({ message: 'Error saving photo' });
    });
  } catch (error) {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/auth/facebook/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
