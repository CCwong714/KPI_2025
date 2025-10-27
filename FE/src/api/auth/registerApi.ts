import { serverApi } from '@/api/axios';

type TLoginApi = {
  success: string;
  message: string;
};

export const registerApi = async (body: {
  username: string;
  password: string;
}) => {
  const response = await serverApi.post<TLoginApi>('/auth/register', body);

  return response.data;
};
