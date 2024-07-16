import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const pingRoute = async (fastify: FastifyInstance, options: any) => {
  fastify.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({ ping: 'pong' });
  });
}

export default pingRoute;
