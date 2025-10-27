import { serverApi } from '@/api/axios';

type TAddPostApi = {
  success: boolean;
  message: string;
  data: {
    _id: string;
    likeCount: number;
    isLiked: boolean;
    userId: string;
    username: string;
    postTitle: string;
    postBody: string;
    id: string;
    status: string;
    createDate?: Date;
  };
};

export const getSingalPostApi = async (id: string) => {
  const response = await serverApi.get<TAddPostApi>(`/posted/get/${id}`);

  return response.data;
};
