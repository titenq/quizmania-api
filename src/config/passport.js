require('dotenv').config();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET_KEY,
  callbackURL: 'http://localhost:4000/auth/facebook/callback',
  profileFields: ['displayName', 'email', 'picture.type(large)']
},
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
