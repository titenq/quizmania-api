import 'dotenv/config';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GitHubStrategy from 'passport-github2';

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_SECRET_KEY,
  callbackURL: "http://localhost:4000/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    done(null, profile);
  }));

passport.use(new GitHubStrategy({
  clientID: githubClientId,
  clientSecret: githubClientSecret,
  callbackURL: 'http://localhost:4000/github/callback',
  scope: ['user:email']
},
  (accessToken, refreshToken, profile, done) => {
    profile.token = accessToken;

    return done(null, profile);
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
