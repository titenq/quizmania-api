import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import axios from 'axios';

import passport from '../config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`http://localhost:5173/auth/facebook/callback?token=${req.user.token}`);
  }
);

router.get('/user', async (req, res) => {
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

    const photoPath = path.join(__dirname, '..', '..', 'uploads', 'facebook', `${id}.jpg`);
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

export default router;
