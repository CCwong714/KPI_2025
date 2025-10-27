import { serverApi } from '@/api/axios';

type TChangePasswordApi = {
  success: boolean;
  message: string;
};

export const changePasswordApi = async (body: {
  username: string;
  newPassword: string;
}) => {
  const response = await serverApi.post<TChangePasswordApi>(
    '/auth/change-password',
    body
  );

  return response.data;
};
