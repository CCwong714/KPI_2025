import { serverApi } from '@/api/axios';

type TAddPostApi = {
  success: boolean;
  message: string;
};

export const delPostApi = async ({ id }: { id: string }) => {
  const response = await serverApi.delete<TAddPostApi>(`/posted/delete/${id}`);

  return response.data;
};
