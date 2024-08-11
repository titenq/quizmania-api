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
    userCreateSchema: function() {
        return userCreateSchema;
    },
    userGetByEmailSchema: function() {
        return userGetByEmailSchema;
    }
});
const _zod = require("zod");
const _genMsgError = require("../helpers/genMsgError");
const _sharedSchema = require("./sharedSchema");
const userSchema = _zod.z.object({
    name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.FALSE)).nullish()
});
const userResponseSchema = _zod.z.object({
    _id: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    userSchema,
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
});
const userCreateSchema = {
    summary: 'Criar usuário',
    tags: [
        'Usuários'
    ],
    body: userSchema.describe(`<pre><code><b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
</code></pre>`),
    headers: _sharedSchema.apiKeySchema,
    response: {
        201: userResponseSchema.describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
        400: _sharedSchema.errorSchema
    }
};
const userGetByEmailSchema = {
    summary: 'Buscar usuário por e-mail',
    tags: [
        'Usuários'
    ],
    params: _zod.z.object({
        email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).describe('<pre><code><b>*email:</b> string</code></pre>')
    }),
    response: {
        201: _zod.z.object({
            _id: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.NULL)).nullish(),
            createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
        }).describe(`<pre><code><b>*_id:</b> string
<b>*name:</b> string
<b>*email:</b> string
<b>picture:</b> string
<b>*createdAt:</b> Date
</code></pre>`),
        400: _sharedSchema.errorSchema
    }
};
