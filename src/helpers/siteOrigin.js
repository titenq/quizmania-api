import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV;
const origin = process.env.ORIGIN;

let siteOrigin;

if (nodeEnv === 'DEV') {
  siteOrigin = 'http://localhost:5173';
} else {
  siteOrigin = origin;
}

export default siteOrigin;
