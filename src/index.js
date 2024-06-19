import path from 'node:path';
import { fileURLToPath } from 'node:url';

import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import passport from './config/passport.js';

import facebookRoutes from './routes/facebookRoutes.js';
import githubRoutes from './routes/githubRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT;
const origin = process.env.ORIGIN;
const secret = process.env.SECRET;
const nodeEnv = process.env.NODE_ENV;

const app = express();

let siteOrigin = '*';

if (nodeEnv === 'PROD') {
  siteOrigin = origin;
}

app.use(cors({
  origin: siteOrigin
}));

app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: nodeEnv === 'PROD' }
}));

app.use(helmet());
app.use(express.json());
app.use('/uploads/facebook',
  express.static(path.join(__dirname, '..', 'uploads', 'facebook')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/facebook', facebookRoutes);
app.use('/github', githubRoutes);

app.listen(port , () => {
  console.log(`Server running on http://localhost:${port}`);
});
