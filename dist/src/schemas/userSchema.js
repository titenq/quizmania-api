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
const userCreateSchema = {
    summary: 'Criar usuário',
    tags: [
        'Usuários'
    ],
    body: _zod.z.object({
        name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
        email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
        picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.FALSE)).nullish()
    }).describe(`
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string`),
    headers: _zod.z.object({
        api_key: _zod.z.string((0, _genMsgError.genMsgError)('api_key', _genMsgError.Type.STRING, _genMsgError.Required.TRUE))
    }).describe('<b>&#42;api_key:</b> string'),
    response: {
        201: _zod.z.object({
            _id: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.FALSE)).nullish(),
            createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
        }).describe(`
<b>&#42;_id:</b> string
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string
<b>&#42;createdAt:</b> Date`),
        401: _zod.z.object({
            error: _zod.z.string((0, _genMsgError.genMsgError)('error', _genMsgError.Type.STRING, _genMsgError.Required.TRUE))
        }).describe('<b>&#42;error:</b> string')
    }
};
const userGetByEmailSchema = {
    summary: 'Buscar usuário por e-mail',
    tags: [
        'Usuários'
    ],
    params: _zod.z.object({
        email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE))
    }).describe('<b>&#42;email:</b> string'),
    response: {
        201: _zod.z.object({
            _id: _zod.z.string((0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            name: _zod.z.string((0, _genMsgError.genMsgError)('name', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            email: _zod.z.string((0, _genMsgError.genMsgError)('email', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
            picture: _zod.z.string((0, _genMsgError.genMsgError)('picture', _genMsgError.Type.STRING, _genMsgError.Required.NULL)).nullish(),
            createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
        }).describe(`
<b>&#42;_id:</b> string
<b>&#42;name:</b> string
<b>&#42;email:</b> string
<b>picture:</b> string
<b>&#42;createdAt:</b> Date`)
    }
};
