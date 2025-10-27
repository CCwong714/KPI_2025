import { serverApi } from '@/api/axios';

type TAddPostApi = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    username: string;
    postTitle: string;
    postBody: string;
  };
};

export const addPostApi = async (body: {
  postTitle: string;
  postBody: string;
}) => {
  const response = await serverApi.post<TAddPostApi>('/posted/add', body);

  return response.data;
};
