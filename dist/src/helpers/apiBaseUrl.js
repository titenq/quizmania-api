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
let apiBaseUrl;
if (NODE_ENV === 'DEV') {
    apiBaseUrl = 'http://localhost:4000';
} else {
    apiBaseUrl = 'https://quizmania-api.onrender.com';
}
const _default = apiBaseUrl;
