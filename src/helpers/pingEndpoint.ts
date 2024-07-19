import axios, { AxiosResponse } from 'axios';

import baseUrl from './baseUrl';
import { IPingResponse } from '../interfaces/IPingResponse';

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      const response: AxiosResponse<IPingResponse> = await axios.get(`${baseUrl}/ping`);

      console.log('Ping response:', response.data);
    } catch (err) {
      console.error('Erro ao fazer ping:', err);
    }
  }, 840000); // 14 minutos
};

export default pingEndpoint;
