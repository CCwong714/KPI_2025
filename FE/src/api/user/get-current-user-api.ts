import { serverApi } from '@/api/axios';

type TAddPostApi = {
  success: boolean;
  user: {
    profilePhoto: string;
    _id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
};

export const getCurrentUserApi = async () => {
  const response = await serverApi.get<TAddPostApi>('/user/getCurrentUser');

  return response.data;
};
