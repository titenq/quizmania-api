import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV as string;
const origin = process.env.ORIGIN as string;

let siteOrigin: string;

if (nodeEnv === 'DEV') {
  siteOrigin = 'http://localhost:5173';
} else {
  siteOrigin = origin!;
}

export default siteOrigin;
