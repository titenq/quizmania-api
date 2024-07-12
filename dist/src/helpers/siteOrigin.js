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
const { NODE_ENV, ORIGIN } = process.env;
let siteOrigin;
if (NODE_ENV === 'DEV') {
    siteOrigin = 'http://localhost:5173';
} else {
    siteOrigin = ORIGIN || '';
}
const _default = siteOrigin;
