import 'dotenv/config';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import GitHubStrategy from 'passport-github2';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookSecretKey = process.env.FACEBOOK_SECRET_KEY;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

passport.use(new GoogleStrategy({
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: 'http://localhost:4000/google/callback',
  scope: ['profile', 'email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    return done(null, profile);
  }
));

passport.use(new FacebookStrategy({
  clientID: facebookAppId,
  clientSecret: facebookSecretKey,
  callbackURL: 'http://localhost:4000/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    done(null, profile);
  }
));

passport.use(new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: 'http://localhost:4000/github/callback',
  scope: ['user:email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
