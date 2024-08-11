Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    answerQuizController: function() {
        return answerQuizController;
    },
    createQuizController: function() {
        return createQuizController;
    },
    getAllQuizByUserIdController: function() {
        return getAllQuizByUserIdController;
    },
    getAllQuizController: function() {
        return getAllQuizController;
    },
    getLatestQuizController: function() {
        return getLatestQuizController;
    },
    getQuizController: function() {
        return getQuizController;
    },
    getTopQuizController: function() {
        return getTopQuizController;
    }
});
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("../helpers/errorHandler"));
const _quizService = /*#__PURE__*/ _interop_require_default(require("../services/quizService"));
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
const createQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { userId, quizTitle, questions } = request.body;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const quiz = yield _quizService.default.createQuiz({
                userId: userId.toString(),
                quizTitle,
                questions
            });
            reply.status(200).send(quiz);
        } catch (error) {
            (0, _errorHandler.default)(error, request, reply);
        }
    });
    return function createQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getAllQuizByUserIdController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { page } = request.query;
            const { userId } = request.params;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const quizzes = yield _quizService.default.getAllByUserIdQuiz({
                userId,
                page
            });
            reply.status(200).send(quizzes);
        } catch (error) {
            (0, _errorHandler.default)(error, request, reply);
        }
    });
    return function getAllQuizByUserIdController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getAllQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { page } = request.query;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const quizzes = yield _quizService.default.getAllQuiz({
                page
            });
            reply.status(200).send(quizzes);
        } catch (error) {
            (0, _errorHandler.default)(error, request, reply);
        }
    });
    return function getAllQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { quizId } = request.params;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const response = yield _quizService.default.getQuiz({
                quizId
            });
            if ('error' in response) {
                return (0, _errorHandler.default)(response, request, reply);
            }
            reply.status(200).send(response);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'erro ao buscar quiz',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const answerQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { quizId } = request.params;
            const { question, answer } = request.body;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const response = yield _quizService.default.answerQuiz({
                quizId,
                question,
                answer
            });
            if ('error' in response) {
                return (0, _errorHandler.default)(response.message, request, reply);
            }
            reply.status(200).send(response);
        } catch (error) {
            (0, _errorHandler.default)(error, request, reply);
        }
    });
    return function answerQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getLatestQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { limit } = request.query;
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const response = yield _quizService.default.getLatestQuizzes({
                limit
            });
            if ('error' in response) {
                return (0, _errorHandler.default)(response.message, request, reply);
            }
            reply.status(200).send(response);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'erro ao buscar últimos quizzes',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getLatestQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getTopQuizController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            const { api_key } = request.headers;
            const { API_KEY } = process.env;
            if (api_key !== API_KEY) {
                const errorMessage = {
                    error: true,
                    message: 'api_key inválida',
                    statusCode: 401
                };
                return (0, _errorHandler.default)(errorMessage, request, reply);
            }
            const response = yield _quizService.default.getTopQuizzes();
            if ('error' in response) {
                return (0, _errorHandler.default)(response.message, request, reply);
            }
            reply.status(200).send(response);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'erro ao buscar top quizzes',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getTopQuizController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
