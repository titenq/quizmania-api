import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IPingResponse } from '../interfaces/IPingResponse';

const pingRoute = async (fastify: FastifyInstance) => {
  fastify.get('/ping',
    {
      schema: { hide: true }
    },
    (request: FastifyRequest, reply: FastifyReply): FastifyReply => {
      const response: IPingResponse = { ping: 'pong' };

      return reply.status(200).send(response);
    }
  );
};

export default pingRoute;
