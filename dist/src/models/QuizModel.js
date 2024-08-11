Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _db = /*#__PURE__*/ _interop_require_default(require("../db"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const QuestionSchema = new _db.default.Schema({
    question: {
        type: String,
        required: true
    },
    rightAnswer: {
        type: String,
        required: true
    },
    wrongAnswers: {
        type: [
            String
        ],
        required: true
    }
}, {
    _id: false
});
const QuizSchema = new _db.default.Schema({
    userId: {
        type: String,
        required: true
    },
    quizTitle: {
        type: String,
        required: true
    },
    questions: [
        QuestionSchema
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'quizzes'
});
const QuizModel = _db.default.model('Quiz', QuizSchema);
const _default = QuizModel;
