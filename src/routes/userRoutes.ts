import express, { Request, Response } from 'express';

import { IUser } from '../interfaces/IUser';
import { IUserResponse } from '../interfaces/IUserResponse';
import User from '../models/User';
import { IGenericError } from '../interfaces/IGenericError';

const router = express.Router();

router.post('/', async (req: Request<{}, {}, IUser>, res: Response<IUser | IGenericError>): Promise<Response<IUserResponse>> => {
  const { name, email, picture } = req.body;

  try {
    const user: IUserResponse = await User.create({ name, email, picture });
  
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.get('/:email', async (req: Request, res: Response): Promise<Response<IUserResponse>> => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar usuário por e-mail' });
  }
});

export default router;
