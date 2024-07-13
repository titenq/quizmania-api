import axios from 'axios';

import { IUser } from '../interfaces/IUser';
import baseUrl from './baseUrl';

const createUserIfNotExists = async (user: IUser): Promise<void> => {
  try {
    const userExists = await axios.get<IUser>(`${baseUrl}/user/${user.email}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!userExists.data) {
      await axios.post<IUser>(`${baseUrl}/user`, user, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

export default createUserIfNotExists;
