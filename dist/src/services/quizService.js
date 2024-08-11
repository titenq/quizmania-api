Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _mongoose = /*#__PURE__*/ _interop_require_default(require("mongoose"));
const _QuizModel = /*#__PURE__*/ _interop_require_default(require("../models/QuizModel"));
const _shuffleAnswers = /*#__PURE__*/ _interop_require_default(require("../helpers/shuffleAnswers"));
const _answerService = /*#__PURE__*/ _interop_require_default(require("./answerService"));
const _calculatePercentage = require("../helpers/calculatePercentage");
function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
const quizService = {
    createQuiz: function() {
        var _ref = _async_to_generator(function*(quiz) {
            try {
                const quizCreated = yield _QuizModel.default.create(quiz);
                return quizCreated;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao criar quiz',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(quiz) {
            return _ref.apply(this, arguments);
        };
    }(),
    getAllByUserIdQuiz: function() {
        var _ref = _async_to_generator(function*(query) {
            try {
                const { userId, page } = query;
                const count = yield _QuizModel.default.countDocuments({
                    userId
                });
                if (count === 0) {
                    const quizzesPaged = {
                        quizzes: [],
                        totalPages: 1,
                        currentPage: 1
                    };
                    return quizzesPaged;
                }
                const quizzes = yield _QuizModel.default.find({
                    userId
                }, '_id quizTitle createdAt').limit(10).skip((Number(page) - 1) * 10).sort({
                    createdAt: 'desc'
                });
                const quizzesPaged = {
                    quizzes,
                    totalPages: Math.ceil(count / 10),
                    currentPage: Number(page)
                };
                return quizzesPaged;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao listar quizzes pelo ID do usuário',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(query) {
            return _ref.apply(this, arguments);
        };
    }(),
    getAllQuiz: function() {
        var _ref = _async_to_generator(function*(query) {
            try {
                const { page } = query;
                const count = yield _QuizModel.default.countDocuments();
                if (count === 0) {
                    const quizzesPaged = {
                        quizzes: [],
                        totalPages: 1,
                        currentPage: 1
                    };
                    return quizzesPaged;
                }
                const quizzes = yield _QuizModel.default.find({}, '_id quizTitle createdAt').limit(10).skip((Number(page) - 1) * 10).sort({
                    createdAt: 'desc'
                });
                const quizzesPaged = {
                    quizzes,
                    totalPages: Math.ceil(count / 10),
                    currentPage: Number(page)
                };
                return quizzesPaged;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao listar quizzes',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(query) {
            return _ref.apply(this, arguments);
        };
    }(),
    getQuiz: function() {
        var _ref = _async_to_generator(function*(query) {
            try {
                const { quizId } = query;
                if (!_mongoose.default.isValidObjectId(quizId)) {
                    const errorMessage = {
                        error: true,
                        message: 'Quiz ID com formato inválido',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                const quiz = yield _QuizModel.default.findById({
                    _id: quizId
                });
                if (!quiz) {
                    const errorMessage = {
                        error: true,
                        message: 'Não existe quiz com esse ID',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                const modifiedQuiz = {
                    _id: quiz._id,
                    userId: quiz.userId.toString(),
                    quizTitle: quiz.quizTitle,
                    questions: quiz.questions.map((question)=>({
                            question: question.question,
                            answers: (0, _shuffleAnswers.default)([
                                question.rightAnswer,
                                ...question.wrongAnswers
                            ])
                        })),
                    createdAt: quiz.createdAt
                };
                return modifiedQuiz;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao buscar quiz',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(query) {
            return _ref.apply(this, arguments);
        };
    }(),
    answerQuiz: function() {
        var _ref = _async_to_generator(function*(answerResponse) {
            try {
                const { quizId, question, answer } = answerResponse;
                const quiz = yield _QuizModel.default.findOne({
                    _id: quizId,
                    'questions.question': question
                }, {
                    'questions.$': 1
                });
                if (!quiz) {
                    const errorMessage = {
                        error: true,
                        message: 'Quiz ou questão não encontrados',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                const correctAnswer = quiz.questions[0].rightAnswer;
                return {
                    isRight: correctAnswer === answer,
                    rightAnswer: correctAnswer
                };
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao verificar a resposta',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(answerResponse) {
            return _ref.apply(this, arguments);
        };
    }(),
    getLatestQuizzes: function() {
        var _ref = _async_to_generator(function*(query) {
            try {
                const { limit } = query;
                const quizzes = yield _QuizModel.default.find({}, '_id userId quizTitle createdAt').sort({
                    createdAt: -1
                }).limit(limit).lean();
                const fetchTotalAnswers = [];
                const quizzesId = quizzes.map((item)=>item._id.toString());
                {
                    var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                    try {
                        for(var _iterator = _async_iterator(quizzesId), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                            let _value = _step.value;
                            const id = _value;
                            const fetchAnswers = yield _answerService.default.getAnswers({
                                quizId: id
                            });
                            if ('error' in fetchAnswers) {
                                const errorMessage = {
                                    error: true,
                                    message: 'Erro ao verificar a resposta',
                                    statusCode: 400
                                };
                                return errorMessage;
                            }
                            fetchTotalAnswers.push(fetchAnswers);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (_iteratorAbruptCompletion && _iterator.return != null) {
                                yield _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                }
                const percentages = (0, _calculatePercentage.calculateAnswersPercentages)(fetchTotalAnswers);
                const quizzesWithPercentages = quizzes.map((quiz, index)=>_object_spread_props(_object_spread({}, quiz), {
                        percentages: percentages[index]
                    }));
                return quizzesWithPercentages;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao buscar últimos quizzes',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(query) {
            return _ref.apply(this, arguments);
        };
    }(),
    getTopQuizzes: /*#__PURE__*/ _async_to_generator(function*() {
        try {
            const quizzes = yield _QuizModel.default.aggregate([
                {
                    $lookup: {
                        from: 'answers',
                        localField: '_id',
                        foreignField: 'quizId',
                        as: 'answers'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        quizTitle: 1,
                        createdAt: 1
                    }
                }
            ]);
            const formattedQuizzes = [];
            {
                var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                try {
                    for(var _iterator = _async_iterator(quizzes), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                        let _value = _step.value;
                        const quiz = _value;
                        const fetchAnswers = yield _answerService.default.getAnswers({
                            quizId: quiz._id.toString()
                        });
                        if ('error' in fetchAnswers) {
                            const errorMessage = {
                                error: true,
                                message: 'Erro ao verificar a resposta',
                                statusCode: 400
                            };
                            return errorMessage;
                        }
                        const [percentages] = (0, _calculatePercentage.calculateAnswersPercentages)([
                            fetchAnswers
                        ]);
                        formattedQuizzes.push({
                            _id: quiz._id,
                            userId: quiz.userId,
                            quizTitle: quiz.quizTitle,
                            createdAt: quiz.createdAt,
                            percentages
                        });
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (_iteratorAbruptCompletion && _iterator.return != null) {
                            yield _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            formattedQuizzes.sort((a, b)=>b.percentages.answersLength - a.percentages.answersLength).slice(0, 10);
            return formattedQuizzes;
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao buscar os quizzes mais respondidos',
                statusCode: 400
            };
            return errorMessage;
        }
    })
};
const _default = quizService;
