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
    apiKeySchema: function() {
        return apiKeySchema;
    },
    errorSchema: function() {
        return errorSchema;
    },
    queryPageSchma: function() {
        return queryPageSchma;
    },
    quizIdSchema: function() {
        return quizIdSchema;
    },
    userIdSchema: function() {
        return userIdSchema;
    }
});
const _zod = require("zod");
const _genMsgError = require("../helpers/genMsgError");
const errorSchema = _zod.z.object({
    error: _zod.z.boolean((0, _genMsgError.genMsgError)('error', _genMsgError.Type.BOOLEAN, _genMsgError.Required.TRUE)),
    message: _zod.z.string((0, _genMsgError.genMsgError)('message', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    statusCode: _zod.z.number((0, _genMsgError.genMsgError)('statusCode', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE))
}).describe(`<pre><code><b>*error:</b> boolean
<b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`);
const apiKeySchema = _zod.z.object({
    api_key: _zod.z.string((0, _genMsgError.genMsgError)('api_key', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).describe('<pre><code><b>*api_key:</b> string</code></pre>')
});
const userIdSchema = _zod.z.object({
    userId: _zod.z.string((0, _genMsgError.genMsgError)('userId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).describe('<pre><code><b>*userId:</b> string</code></pre>')
});
const quizIdSchema = _zod.z.object({
    quizId: _zod.z.string((0, _genMsgError.genMsgError)('quizId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).describe('<pre><code><b>*quizId:</b> string</code></pre>')
});
const queryPageSchma = _zod.z.object({
    page: _zod.z.string((0, _genMsgError.genMsgError)('page', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).describe('<pre><code><b>*page:</b> string</code></pre>')
});
