import { serverApi } from '@/api/axios';
import type { TApiResponse } from '@/api/type';

type TLoginApi = {
  username: string;
  email: string;
  role: string;
  accessToken: string;
};

export const loginApi = async (body: {
  username: string;
  password: string;
}) => {
  const response = await serverApi.post<TApiResponse<TLoginApi>>(
    '/auth/login',
    body
  );

  return response.data;
};
