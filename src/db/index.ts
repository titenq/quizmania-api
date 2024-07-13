import mongoose from 'mongoose';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_APP } = process.env;

const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/quizmania?retryWrites=true&w=majority&appName=${DB_APP}`;

mongoose.set('strictQuery', true);

mongoose.connect(connectionString, { autoIndex: true });

mongoose.Promise = global.Promise;

export default mongoose;
