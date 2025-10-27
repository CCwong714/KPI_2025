import { serverApi } from '@/api/axios';

export const refreshTokenApi = async () => {
  const response = await serverApi.post('/auth/refresh');

  return response.data;
};
