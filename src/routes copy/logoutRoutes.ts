import { promisify } from 'node:util';

import express, { Request, Response } from 'express';
import { ILogoutResponse } from '../interfaces/ILogoutResponse';

const nameSession = process.env.NAME_SESSION;

const router = express.Router();

const destroySession = (req: Request) => promisify(req.session.destroy.bind(req.session));

router.get('/', async (req: Request, res: Response): Promise<Response<ILogoutResponse>> => {
  try {
    destroySession(req);

    res.clearCookie(nameSession!);

    const messageSuccess: ILogoutResponse = { message: 'Sucesso ao fazer logout' };

    return res.status(200).json(messageSuccess);
  } catch (error) {
    const messageError: ILogoutResponse = { message: 'Erro ao fazer logout' };

    return res.status(500).json(messageError);
  }
});

export default router;
