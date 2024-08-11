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
const _AnswersModel = /*#__PURE__*/ _interop_require_default(require("../models/AnswersModel"));
const _calculatePercentage = require("../helpers/calculatePercentage");
const _quizService = /*#__PURE__*/ _interop_require_default(require("./quizService"));
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const answerService = {
    createAnswers: function() {
        var _ref = _async_to_generator(function*(answers) {
            try {
                const answersCreated = yield _AnswersModel.default.create(answers);
                return answersCreated;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao criar quiz',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(answers) {
            return _ref.apply(this, arguments);
        };
    }(),
    getAnswers: function() {
        var _ref = _async_to_generator(function*(quiz_id) {
            try {
                const { quizId } = quiz_id;
                if (!_mongoose.default.isValidObjectId(quizId)) {
                    const errorMessage = {
                        error: true,
                        message: 'Quiz ID com formato inválido',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                const response = yield _AnswersModel.default.find({
                    quizId
                });
                if (!response) {
                    const errorMessage = {
                        error: true,
                        message: 'Não existe resposta para esse quizId',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                return response;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao buscar resposta',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(quiz_id) {
            return _ref.apply(this, arguments);
        };
    }(),
    getAnswersPercentage: function() {
        var _ref = _async_to_generator(function*(data) {
            try {
                const response = yield _quizService.default.getAllQuiz(data);
                if ('error' in response) {
                    const errorMessage = {
                        error: true,
                        message: response.message,
                        statusCode: response.statusCode
                    };
                    return errorMessage;
                }
                if (!response) {
                    const errorMessage = {
                        error: true,
                        message: 'Não existe resposta para esse quiz',
                        statusCode: 404
                    };
                    return errorMessage;
                }
                const fetchTotalAnswers = [];
                if ('quizzes' in response) {
                    const quizzesId = response.quizzes.map((item)=>item._id.toString());
                    {
                        var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                        try {
                            for(var _iterator = _async_iterator(quizzesId), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                                let _value = _step.value;
                                const id = _value;
                                const fetchAnswers = yield answerService.getAnswers({
                                    quizId: id
                                });
                                if ('error' in fetchAnswers) {
                                    const errorMessage = {
                                        error: true,
                                        message: fetchAnswers.message,
                                        statusCode: fetchAnswers.statusCode
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
                }
                const percentages = (0, _calculatePercentage.calculateAnswersPercentages)(fetchTotalAnswers);
                return percentages;
            } catch (error) {
                const errorMessage = {
                    error: true,
                    message: 'Erro ao calcular percentuais',
                    statusCode: 400
                };
                return errorMessage;
            }
        });
        return function(data) {
            return _ref.apply(this, arguments);
        };
    }()
};
const _default = answerService;
