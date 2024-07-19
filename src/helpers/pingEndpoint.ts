import axios, { AxiosResponse } from 'axios';

import apiBaseUrl from './apiBaseUrl';
import { IPingResponse } from '../interfaces/pingInterface';

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      const response: AxiosResponse<IPingResponse> = await axios.get(`${apiBaseUrl}/ping`);

      console.log('Ping response:', response.data);
    } catch (err) {
      console.error('Erro ao fazer ping:', err);
    }
  }, 840000); // 14 minutos
};

export default pingEndpoint;
