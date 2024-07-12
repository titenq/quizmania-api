Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
require("dotenv/config");
const nodeEnv = process.env.NODE_ENV;
const origin = process.env.ORIGIN;
let siteOrigin;
if (nodeEnv === 'DEV') {
    siteOrigin = 'http://localhost:5173';
} else {
    siteOrigin = origin;
}
const _default = siteOrigin;
