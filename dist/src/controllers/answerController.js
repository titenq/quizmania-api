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
    createAnswerController: function() {
        return createAnswerController;
    },
    getAnswersController: function() {
        return getAnswersController;
    },
    getAnswersPercentageController: function() {
        return getAnswersPercentageController;
    }
});
const _errorHandler = /*#__PURE__*/ _interop_require_default(require("../helpers/errorHandler"));
const _answerService = /*#__PURE__*/ _interop_require_default(require("../services/answerService"));
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
const createAnswerController = function() {
    var _ref = _async_to_generator(function*(request, reply) {
        try {
            var _answers_filter;
            const { answers } = request.body;
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
            const totalAnswers = answers === null || answers === void 0 ? void 0 : answers.length;
            const rightAnswers = (_answers_filter = answers.filter((answer)=>answer.isRight)) === null || _answers_filter === void 0 ? void 0 : _answers_filter.length;
            const wrongAnswers = totalAnswers - rightAnswers;
            const answerCreate = {
                quizId,
                answers,
                totalAnswers: totalAnswers,
                rightAnswers: rightAnswers,
                wrongAnswers: wrongAnswers
            };
            const quizAnswers = yield _answerService.default.createAnswers(answerCreate);
            reply.status(201).send(quizAnswers);
        } catch (error) {
            (0, _errorHandler.default)(error, request, reply);
        }
    });
    return function createAnswerController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getAnswersController = function() {
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
            const response = yield _answerService.default.getAnswers({
                quizId
            });
            if ('error' in response) {
                return (0, _errorHandler.default)(response, request, reply);
            }
            reply.status(200).send(response);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'erro ao buscar respostas',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getAnswersController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
const getAnswersPercentageController = function() {
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
            const percentages = yield _answerService.default.getAnswersPercentage({
                userId,
                page
            });
            reply.status(200).send(percentages);
        } catch (error) {
            const errorMessage = {
                error: true,
                message: 'Erro ao calcular percentual',
                statusCode: 400
            };
            (0, _errorHandler.default)(errorMessage, request, reply);
        }
    });
    return function getAnswersPercentageController(request, reply) {
        return _ref.apply(this, arguments);
    };
}();
