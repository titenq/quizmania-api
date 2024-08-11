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
    answerCreateSchema: function() {
        return answerCreateSchema;
    },
    answersGetPercentageSchema: function() {
        return answersGetPercentageSchema;
    },
    answersGetSchema: function() {
        return answersGetSchema;
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
const answersSchema = _zod.z.object({
    question: _zod.z.string((0, _genMsgError.genMsgError)('question', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(5, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '5')).max(256, (0, _genMsgError.genMsgError)('question', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256')),
    answer: _zod.z.string((0, _genMsgError.genMsgError)('answer', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)).min(1, (0, _genMsgError.genMsgError)('answer', _genMsgError.Type.MIN, _genMsgError.Required.NULL, '1')).max(256, (0, _genMsgError.genMsgError)('answer', _genMsgError.Type.MAX, _genMsgError.Required.NULL, '256')),
    isRight: _zod.z.boolean((0, _genMsgError.genMsgError)('isRight', _genMsgError.Type.BOOLEAN, _genMsgError.Required.TRUE))
});
const answerSchema = _zod.z.object({
    answers: _zod.z.array(answersSchema)
}).describe(`<pre><code><b>*answers:</b>[
  <b>*question:</b> string (min: 5, max: 256)
  <b>*answer:</b> string (min: 1, max: 256)
  <b>*isRight:</b> boolean
]
</code></pre>`);
const answerResponseSchema = _zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    quizId: _zod.z.string((0, _genMsgError.genMsgError)('quizId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    answers: _zod.z.array(answersSchema),
    totalAnswers: _zod.z.number((0, _genMsgError.genMsgError)('totalAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    rightAnswers: _zod.z.number((0, _genMsgError.genMsgError)('rightAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    wrongAnswers: _zod.z.number((0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
}).describe(`<pre><code><b>*_id:</b> string
<b>*quizId:</b> string
<b>*answers:</b> [
  {
    <b>*userId:</b> string
    <b>*answers:</b> [
      {
        <b>*question:</b> string (min: 5, max: 256)
        <b>*answer:</b> string (min: 1, max: 256)
        <b>*isRight:</b> boolean
      }
    ]
  }
]
<b>*createdAt:</b> Date
</code></pre>`);
const answersGetResponseSchema = _zod.z.array(_zod.z.object({
    _id: _zod.z.instanceof(_mongoose.default.Types.ObjectId, (0, _genMsgError.genMsgError)('_id', _genMsgError.Type.STRING, _genMsgError.Required.NULL)),
    quizId: _zod.z.string((0, _genMsgError.genMsgError)('quizId', _genMsgError.Type.STRING, _genMsgError.Required.TRUE)),
    answers: _zod.z.array(answersSchema),
    totalAnswers: _zod.z.number((0, _genMsgError.genMsgError)('totalAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    rightAnswers: _zod.z.number((0, _genMsgError.genMsgError)('rightAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    wrongAnswers: _zod.z.number((0, _genMsgError.genMsgError)('wrongAnswers', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    createdAt: _zod.z.date((0, _genMsgError.genMsgError)('createdAt', _genMsgError.Type.DATE, _genMsgError.Required.TRUE))
})).describe(`<pre><code>[
  <b>*_id:</b> string
  <b>*quizId:</b> string
  <b>*answers:</b> [
    {
      <b>*userId:</b> string
      <b>*answers:</b> [
        {
          <b>*question:</b> string (min: 5, max: 256)
          <b>*answer:</b> string (min: 1, max: 256)
          <b>*isRight:</b> boolean
        }
      ]
    }
  ],
  <b>*totalAnswers:</b> number
  <b>*rightAnswers:</b> number
  <b>*wrongAnswers:</b> number
  <b>*createdAt:</b> Date
]
</code></pre>`);
const answersGetPercentageResponseSchema = _zod.z.array(_zod.z.object({
    answersLength: _zod.z.number((0, _genMsgError.genMsgError)('answersLength', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    percentRight: _zod.z.number((0, _genMsgError.genMsgError)('percentRight', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE)),
    percentWrong: _zod.z.number((0, _genMsgError.genMsgError)('percentWrong', _genMsgError.Type.NUMBER, _genMsgError.Required.TRUE))
})).describe(`<pre><code>[
  {
    <b>*answersLength:</b> number
    <b>*percentRight:</b> number
    <b>*percentWrong:</b> number
  }
]
</code></pre>`);
const answerCreateSchema = {
    summary: 'Salvar respostas',
    tags: [
        'Answers'
    ],
    params: _sharedSchema.quizIdSchema,
    body: answerSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        201: answerResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema
    }
};
const answersGetSchema = {
    summary: 'Listar respostas por quizId',
    tags: [
        'Answers'
    ],
    params: _sharedSchema.quizIdSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: answersGetResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema,
        404: _sharedSchema.errorSchema
    }
};
const answersGetPercentageSchema = {
    summary: 'Listar percentuais por userId',
    tags: [
        'Answers'
    ],
    params: _sharedSchema.userIdSchema,
    headers: _sharedSchema.apiKeySchema,
    response: {
        200: answersGetPercentageResponseSchema,
        400: _sharedSchema.errorSchema,
        401: _sharedSchema.errorSchema,
        404: _sharedSchema.errorSchema
    }
};
