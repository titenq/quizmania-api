import express, { Request, Response } from 'express';

import { IPingResponse } from '../interfaces/IPingResponse';

const router = express.Router();

router.get('/', (req: Request, res: Response): Response<IPingResponse> => {
  const response: IPingResponse = { ping: 'pong' };

  return res.status(200).json(response);
});

export default router;
