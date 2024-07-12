import 'dotenv/config';

const nodeEnv = process.env.NODE_ENV as string;
let baseUrl: string;

if (nodeEnv === 'DEV') {
  baseUrl = 'http://localhost:4000';
} else {
  baseUrl = 'https://backend.com';
}

export default baseUrl;
