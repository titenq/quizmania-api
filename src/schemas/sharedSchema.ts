import { z } from 'zod';

import { genMsgError, Required, Type } from '../helpers/genMsgError';

const errorSchema = z.object({
  error: z.boolean(genMsgError('error', Type.BOOLEAN, Required.TRUE)),
  message: z.string(genMsgError('message', Type.STRING, Required.TRUE)),
  statusCode: z.number(genMsgError('statusCode', Type.NUMBER, Required.TRUE))
})
  .describe(`<pre><code><b>*error:</b> boolean
<b>*message:</b> string
<b>*statusCode:</b> number
</code></pre>`);

const apiKeySchema = z.object({
  api_key: z.string(genMsgError('api_key', Type.STRING, Required.TRUE))
    .describe('<pre><code><b>*api_key:</b> string</code></pre>')
});

export {
  errorSchema,
  apiKeySchema
};
