import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV;
let frontendBaseUrl;

if (nodeEnv === 'DEV') {
  frontendBaseUrl = 'http://localhost:5173';
} else {
  frontendBaseUrl = 'https://frontend.com';
}

export default frontendBaseUrl;
