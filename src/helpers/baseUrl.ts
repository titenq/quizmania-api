import 'dotenv/config';

const { NODE_ENV } = process.env;
let baseUrl: string;

if (NODE_ENV === 'DEV') {
  baseUrl = 'http://localhost:4000';
} else {
  baseUrl = 'https://backend.com';
}

export default baseUrl;
