import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

router.get('/', passport.authenticate('github'));

router.get('/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;

    if (token) {
      res.redirect(`http://localhost:5173/auth/github/callback?token=${token}`);
    } else {
      res.redirect('http://localhost:5173/login?error=token_missing');
    }
  });

router.get('/user', (req, res) => {
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
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
