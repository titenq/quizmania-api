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
    quizAnswerSchema: function() {
        return quizAnswerSchema;
    },
    quizCreateSchema: function() {
        return quizCreateSchema;
    },
    quizGetAllByUserIdSchema: function() {
        return quizGetAllByUserIdSchema;
    },
    quizGetAllSchema: function() {
        return quizGetAllSchema;
    },
    quizGetLatestSchema: function() {
        return quizGetLatestSchema;
    },
    quizGetSchema: function() {
        return quizGetSchema;
    },
    quizGetTopSchema: function() {
        return quizGetTopSchema;
    }
});
const _mongoose = /*#__PURE__*/ _interop_require_default(require("mongoose"));
const _zod = require("zod");
const _genMsgError = require("../helpers/genMsgError");
const _sharedSchema = require("./sharedSchema");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const questionSchema = _zod.z.object({
    question: _zod.z.string((0, _genMsgError.genMsgError)('question', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(256, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256')),
    rightAnswer: _zod.z.string((0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(1, (0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '1')).max(256, (0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256')),
    wrongAnswers: _zod.z.array(_zod.z.string((0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(1, (0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '1')).max(256, (0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256'))).length(4, (0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.LENGTH, _genMsgError.Required.NULL, '4'))
});
const questionModifiedSchema = _zod.z.object({
    question: _zod.z.string((0, _genMsgError.genMsgError)('question', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(256, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256')),
    answers: _zod.z.array(_zod.z.string((0, _genMsgError.genMsgError)('answers', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(1, (0, _genMsgError.genMsgError)('answers', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '1')).max(256, (0, _genMsgError.genMsgError)('answers', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256'))).length(5, (0, _genMsgError.genMsgError)('answers', _genMsgError.Type.LENGTH, _genMsgError.Required.NULL, '5'))
});
const quizCreateBodySchema = _zod.z.object({
    userId: _zod.z.string((0, _genMsgError.genMsgError)('userId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(24, (0, _genMsgError.genMsgError)('userId', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '24')).max(24, (0, _genMsgError.genMsgError)('userId', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '24')),
    quizTitle: _zod.z.string((0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(64, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '64')),
    questions: _zod.z.array(questionSchema)
}).describe(`<pre><code><b>*userId:</b> string
<b>*quizTitle:</b> string (min: 5, max: 64)
<b>*questions:</b> [
  <b>*question:</b> string (min: 5, max: 256)
  <b>*rightAnswer:</b> string (min: 1, max: 256)
  <b>*wrongAnswers:</b> [
    string (min: 1, max: 256),
    string (min: 1, max: 256),
    string (min: 1, max: 256),
    string (min: 1, max: 256)
  ]
]
</code></pre>`);
const quizCreateResponseSchema = _zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    userId: _zod.z.string((0, _genMsgError.genMsgError)('userId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    quizTitle: _zod.z.string((0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(64, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '64')),
    questions: _zod.z.array(questionSchema),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
}).describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>*quizTitle:</b> string
<b>*questions:</b> [
  {
    <b>*question:</b> string
    <b>*answers:</b> [
      string,
      string,
      string,
      string,
      string
    ]
  }
]
<b>*createdAt:</b> Date
</code></pre>`);
const quizResponseModifiedSchema = _zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    userId: _zod.z.string((0, _genMsgError.genMsgError)('userId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    quizTitle: _zod.z.string((0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(64, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '64')),
    questions: _zod.z.array(questionModifiedSchema),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
}).describe(`<pre><code><b>*_id:</b> string
<b>*userId:</b> string
<b>*quizTitle:</b> string
<b>*questions:</b> [
  {
    <b>*question:</b> string
    <b>*answers:</b> [
      string,
      string,
      string,
      string,
      string
    ]
  }
]
<b>*createdAt:</b> Date
</code></pre>`);
const quizResponseAdminSchema = _zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    quizTitle: _zod.z.string((0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(64, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '64')),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
}).describe(`<pre><code><b>*_id:</b> string
<b>*quizTitle:</b> string
<b>*createdAt:</b> Date
</code></pre>`);
const quizGetAllResponseSchema = _zod.z.object({
    quizzes: _zod.z.array(quizResponseAdminSchema),
    totalPages: _zod.z.number((0, _genMsgError.genMsgError)('totalPages', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)).int((0, _genMsgError.genMsgError)('totalPages', _genMsgError.Type.INT, _genMsgError.Required.NULL)).positive((0, _genMsgError.genMsgError)('totalPages', _genMsgError.Type.POSITIVE, _genMsgError.Required.NULL)),
    currentPage: _zod.z.number((0, _genMsgError.genMsgError)('currentPage', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)).int((0, _genMsgError.genMsgError)('currentPage', _genMsgError.Type.INT, _genMsgError.Required.NULL)).positive((0, _genMsgError.genMsgError)('currentPage', _genMsgError.Type.POSITIVE, _genMsgError.Required.NULL))
}).describe(`<pre><code><b>*quizzes:</b> [
  <b>*_id:</b> string
  <b>*userId:</b> string
  <b>*quizTitle:</b> string
  <b>*questions:</b> [
    {
      <b>*question:</b> string
      <b>*rightAnswer:</b> string
      <b>*wrongAnswers:</b> [
        string,
        string,
        string,
        string
      ]
    }
  ]
  <b>*createdAt:</b> Date
]
<b>*totalPages:</b> number
<b>*currentPage:</b> number
</code></pre>`);
const quizResponseAnswerSchema = _zod.z.object({
    isRight: _zod.z.boolean((0, _genMsgError.genMsgError)('isRight', _genMsgError.Type.BOOLEAN, _genMsgError.Required.TRUE)),
    rightAnswer: _zod.z.string((0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(1, (0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '1')).max(256, (0, _genMsgError.genMsgError)('rightAnswer', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256'))
}).describe(`<pre><code><b>*isRight:</b> boolean
<b>*rightAnswer:</b> string
</code></pre>`);
const quizResponseLatestSchema = _zod.z.array(_zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    userId: _zod.z.string((0, _genMsgError.genMsgError)('userId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    quizTitle: _zod.z.string((0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(64, (0, _genMsgError.genMsgError)('quizTitle', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '64')),
    percentages: _zod.z.object({
        answersLength: _zod.z.number((0, _genMsgError.genMsgError)('answersLength', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
        percentRight: _zod.z.number((0, _genMsgError.genMsgError)('percentRight', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
        percentWrong: _zod.z.number((0, _genMsgError.genMsgError)('percentWrong', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE))
    }),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
})).describe(`<pre><code><b>[
  <b>*_id:</b> string
  <b>*userId:</b> string
  <b>*quizTitle:</b> string
  <b>*percentage:</b>{
    <b>*answersLength:</b> number
    <b>*percentRight:</b> number
    <b>*percentWrong:</b> number
  }
  <b>*createdAt:</b> Date
]
</code></pre>`);
const quizCreateSchema = {
    summary: 'Criar quiz',
    tags: [
        'Quizzes'
    ],
    body: quizCreateBodySchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        201: quizCreateResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
const quizGetAllByUserIdSchema = {
    summary: 'Buscar todos os quizzes de um usuário',
    tags: [
        'Quizzes'
    ],
    querystring: _sharedSchema.queryPageSchma,
    params: _sharedSchema.userIdSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizGetAllResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
const quizGetAllSchema = {
    summary: 'Buscar todos os quizzes',
    tags: [
        'Quizzes'
    ],
    querystring: _sharedSchema.queryPageSchma,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizGetAllResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
const quizGetSchema = {
    summary: 'Buscar quiz por id',
    tags: [
        'Quizzes'
    ],
    params: _sharedSchema.quizIdSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizResponseModifiedSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema,
        404: _sharedSchema.errorSchema
    }
};
const quizAnswerSchema = {
    summary: 'Verificar se a resposta enviada está correta',
    tags: [
        'Quizzes'
    ],
    params: _sharedSchema.quizIdSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizResponseAnswerSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema,
        404: _sharedSchema.errorSchema
    }
};
const quizGetLatestSchema = {
    summary: 'Buscar últimos quizzes',
    tags: [
        'Quizzes'
    ],
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizResponseLatestSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
const quizGetTopSchema = {
    summary: 'Buscar top quizzes',
    tags: [
        'Quizzes'
    ],
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: quizResponseLatestSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
