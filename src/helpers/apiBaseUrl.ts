import 'dotenv/config';

const { NODE_ENV } = process.env;
let apiBaseUrl: string;

if (NODE_ENV === 'DEV') {
  apiBaseUrl = 'http://localhost:4000';
} else {
  apiBaseUrl = 'https://quizmania-api.onrender.com';
}

export default apiBaseUrl;
