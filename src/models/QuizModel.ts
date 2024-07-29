import mongoose from '../db';

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  rightAnswer: {
    type: String,
    required: true
  },
  wrongAnswers: {
    type: [String],
    required: true
  }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  quizTitle: {
    type: String,
    required: true
  },
  questions: [QuestionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'quizzes' });

const QuizModel = mongoose.model('Quiz', QuizSchema);

export default QuizModel;
