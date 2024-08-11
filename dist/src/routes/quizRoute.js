Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _quizController = require("../controllers/quizController");
const _quizSchema = require("../schemas/quizSchema");
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
const quizRoute = function() {
    var _ref = _async_to_generator(function*(fastify) {
        fastify.withTypeProvider().post('/quizzes', {
            schema: _quizSchema.quizCreateSchema
        }, _quizController.createQuizController);
        fastify.withTypeProvider().get('/quizzes/:userId', {
            schema: _quizSchema.quizGetAllByUserIdSchema
        }, _quizController.getAllQuizByUserIdController);
        fastify.withTypeProvider().get('/quizzes', {
            schema: _quizSchema.quizGetAllSchema
        }, _quizController.getAllQuizController);
        fastify.withTypeProvider().get('/quizzes/quiz/:quizId', {
            schema: _quizSchema.quizGetSchema
        }, _quizController.getQuizController);
        fastify.withTypeProvider().post('/quizzes/quiz/:quizId/answer', {
            schema: _quizSchema.quizAnswerSchema
        }, _quizController.answerQuizController);
        fastify.withTypeProvider().get('/quizzes/latest', {
            schema: _quizSchema.quizGetLatestSchema
        }, _quizController.getLatestQuizController);
        fastify.withTypeProvider().get('/quizzes/top', {
            schema: _quizSchema.quizGetTopSchema
        }, _quizController.getTopQuizController);
    });
    return function quizRoute(fastify) {
        return _ref.apply(this, arguments);
    };
}();
const _default = quizRoute;
