import axios, { AxiosResponse } from 'axios';

export default async function api(path: string): Promise<AxiosResponse<any>> {
  return axios.get(path);
}
