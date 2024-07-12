import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV as string;
let frontendBaseUrl: string;

if (nodeEnv === 'DEV') {
  frontendBaseUrl = 'http://localhost:5173';
} else {
  frontendBaseUrl = 'https://frontend.com';
}

export default frontendBaseUrl;
