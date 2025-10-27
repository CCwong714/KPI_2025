import { serverApi } from '@/api/axios';

export const logoutAPi = async () => {
  const response = await serverApi.post('/auth/logout');

  return response.data;
};
