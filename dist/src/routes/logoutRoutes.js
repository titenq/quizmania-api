Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
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
const nameSession = process.env.NAME_SESSION;
const router = _express.default.Router();
router.get('/', function() {
    var _ref = _async_to_generator(function*(req, res) {
        req.session.destroy((err)=>{
            if (err) {
                console.error('Erro ao destruir a sessão:', err);
                return res.status(500).json({
                    message: 'Erro ao fazer logout'
                });
            }
            res.clearCookie(nameSession);
            return res.status(200).json({
                message: 'Sucesso ao fazer logout'
            });
        });
    });
    return function(req, res) {
        return _ref.apply(this, arguments);
    };
}());
const _default = router;
