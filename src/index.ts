import path from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';

import baseUrl from './helpers/baseUrl';
import siteOrigin from './helpers/siteOrigin';
import googleRoutes from './routes/googleRoutes';
import facebookRoutes from './routes/facebookRoutes';
import xRoutes from './routes/xRoutes';
import githubRoutes from './routes/githubRoutes';
import logoutRoutes from './routes/logoutRoutes';
import pingRoutes from './routes/pingRoutes';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const port = process.env.PORT as string;
const secret = process.env.SECRET as string;
const nameSession = process.env.NAME_SESSION as string;
const nodeEnv = process.env.NODE_ENV as string;

const app = express();

app.use(express.json());

app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));

app.use(session({
  name: nameSession,
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: nodeEnv === 'PROD',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia
  }
}));

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'facebook_token',
    'github_token',
    'google_token',
    'x_token'
  ]
}));

app.use('/uploads/facebook',
  express.static(path.join(dirname, '..', '..', 'uploads', 'facebook')));

app.use('/google', googleRoutes);
app.use('/facebook', facebookRoutes);
app.use('/x', xRoutes);
app.use('/github', githubRoutes);
app.use('/logout', logoutRoutes);
app.use('/ping', pingRoutes);

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      const response = await axios.get(`${baseUrl}/ping`);
      
      console.log('Ping response:', response.data);
    } catch (err) {
      console.error('Erro ao fazer ping:', err);
    }
  }, 840000); // 14 minutos
};

app.listen(port , () => {
  console.log(`Server running on ${baseUrl}`);

  pingEndpoint();
});
