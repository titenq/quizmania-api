import axios, { AxiosResponse } from 'axios';

import baseUrl from './baseUrl';

const pingEndpoint = () => {
  setInterval(async () => {
    try {
      console.log(`${baseUrl}/ping`)
      const response: AxiosResponse<string, string> = await axios.get(`${baseUrl}/ping`);

      console.log('Ping response:', response.data);
    } catch (err) {
      console.error('Erro ao fazer ping:'/* , err */);
    }
  }, 840000); // 14 minutos
};

export default pingEndpoint;
