/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverApi } from '@/api/axios';

type TUploadPhotoApi = {
  success: boolean;
  message: string;
  data: any;
};

export const uploadPhotoApi = async (formData: FormData) => {
  const response = await serverApi.post<TUploadPhotoApi>(
    '/user/upload-photo',
    formData
  );

  return response.data;
};
