import { serverApi } from '@/api/axios';

type TUpdatePostApi = {
  success: boolean;
  message: string;
};

export const toggleLikePostApi = async (id: string) => {
  const response = await serverApi.post<TUpdatePostApi>(`/posted/${id}/like`);

  return response.data;
};
