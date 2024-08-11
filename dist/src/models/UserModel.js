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
const UserSchema = new _db.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    picture: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users'
});
const UserModel = _db.default.model('User', UserSchema);
const _default = UserModel;
