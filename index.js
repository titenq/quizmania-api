require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');

const secret = process.env.SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}));
  
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: 'http://localhost:4000/auth/github/callback',
  scope: ['user:email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    /* const user = {
      name: profile._json.name,
      email: profile._json.email,
      picture: profile._json.avatar_url
    }; */

    return done(null, profile);
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

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
