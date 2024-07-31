import mongoose from '../db';

const AnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  selectedAnswer: {
    type: String,
    required: true
  },
  isCorrect: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'answers' });

const AnswersModel = mongoose.model('Answers', AnswersSchema);

export default AnswersModel;
