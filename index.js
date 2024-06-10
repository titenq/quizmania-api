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
app.use(cors());
app.use(express.json());

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
}));
  
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: 'http://localhost:4000/auth/github/callback'
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    return done(null, profile);
  }));

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;
    console.log(token);
    if (token) {
      res.redirect(`http://localhost:5173/auth/github/callback?token=${token}`);
    } else {
      res.redirect('http://localhost:5173/login?error=token_missing');
    }
  });

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
