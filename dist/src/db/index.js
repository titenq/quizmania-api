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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { DB_USER, DB_PASSWORD, DB_HOST, DB_APP } = process.env;
const connectionString = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/quizmania?retryWrites=true&w=majority&appName=${DB_APP}`;
_mongoose.default.set('strictQuery', true);
_mongoose.default.connect(connectionString, {
    autoIndex: true
});
_mongoose.default.Promise = global.Promise;
const _default = _mongoose.default;
