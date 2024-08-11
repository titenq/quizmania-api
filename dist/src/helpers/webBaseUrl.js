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
const { NODE_ENV } = process.env;
let webBaseUrl;
if (NODE_ENV === 'DEV') {
    webBaseUrl = 'http://localhost:5173';
} else {
    webBaseUrl = 'https://frontend.com';
}
const _default = webBaseUrl;
