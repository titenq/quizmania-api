import mongoose from '../db';

const AnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isRight: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const AnswersSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true
  },
  answers: [AnswerSchema],
  totalAnswers: Number,
  rightAnswers: Number,
  wrongAnswers: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'answers' });

const AnswersModel = mongoose.model('Answers', AnswersSchema);

export default AnswersModel;
