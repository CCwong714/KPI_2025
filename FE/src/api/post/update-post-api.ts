import { serverApi } from '@/api/axios';

type TUpdatePostApi = {
  success: boolean;
  message: string;
  data: {
    userId: string;
    username: string;
    postTitle: string;
    postBody: string;
  };
};

type TRequestApi = {
  id: string;
  body: {
    postTitle: string;
    postBody: string;
  };
};

export const updatePostApi = async ({ id, body }: TRequestApi) => {
  const response = await serverApi.put<TUpdatePostApi>(
    `/posted/update/${id}`,
    body
  );

  return response.data;
};
