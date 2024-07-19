import UserModel from '../models/UserModel';
import { IUser } from '../interfaces/userInterface';

const userService = {
  createUser: async (user: IUser) => {
    try {
      const userCreated: IUser = await UserModel.create(user);

      return userCreated;
    } catch (error) {
      return { error: 'Erro ao criar usuário' };
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const user = await UserModel.findOne({ email });

      return user;
    } catch (error) {
      return { error: 'Erro ao buscar usuário por e-mail' };
    }
  },
};

export default userService;
