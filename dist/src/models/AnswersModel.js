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
const AnswerSchema = new _db.default.Schema({
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
}, {
    _id: false
});
const AnswersSchema = new _db.default.Schema({
    quizId: {
        type: String,
        required: true
    },
    answers: [
        AnswerSchema
    ],
    totalAnswers: {
        type: Number,
        required: true
    },
    rightAnswers: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'answers'
});
const AnswersModel = _db.default.model('Answers', AnswersSchema);
const _default = AnswersModel;
