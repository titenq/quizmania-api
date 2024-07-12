import 'dotenv/config';

const { NODE_ENV } = process.env;
let frontendBaseUrl: string;

if (NODE_ENV === 'DEV') {
  frontendBaseUrl = 'http://localhost:5173';
} else {
  frontendBaseUrl = 'https://frontend.com';
}

export default frontendBaseUrl;
