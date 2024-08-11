import 'dotenv/config';

const { NODE_ENV } = process.env;
let webBaseUrl: string;

if (NODE_ENV === 'DEV') {
  webBaseUrl = 'http://localhost:5173';
} else {
  webBaseUrl = 'https://quizmania-one.vercel.app';
}

export default webBaseUrl;
