import axios from 'axios';

import { IUser } from '../interfaces/userInterface';
import apiBaseUrl from './apiBaseUrl';

const createUserIfNotExists = async (user: IUser): Promise<void> => {
  try {
    const userExists = await axios.get(`${apiBaseUrl}/users/${user.email}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!userExists.data) {
      await axios.post<IUser>(`${apiBaseUrl}/user`, user, {
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
