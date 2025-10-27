import { serverApi } from '@/api/axios';

type TSendPasswordToEmailApi = {
  success: boolean;
  message: string;
};

export const sendPasswordToEmailApi = async (body: { email: string }) => {
  const response = await serverApi.post<TSendPasswordToEmailApi>(
    '/auth/send-password-to-email',
    body
  );

  return response.data;
};
