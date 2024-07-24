import { IUser, IUserResponse } from '../interfaces/userInterface';
import { IGenericError } from '../interfaces/errorInterface';
import userService from '../services/userService';

const createUserIfNotExists = async (user: IUser): Promise<IUserResponse | IGenericError> => {
  try {
    const userExists = await userService.getUserByEmail(user?.email);

    if (!userExists) {
      const createUser: IUserResponse | IGenericError = await userService.createUser(user);

      return createUser;
    }

    return userExists;
  } catch (error) {
    const errorMessage: IGenericError = { error: 'Erro ao criar usuário' };

    return errorMessage;
  }
};

export default createUserIfNotExists;
