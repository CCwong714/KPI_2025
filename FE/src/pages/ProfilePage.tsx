import { refreshTokenApi } from '@/api/auth/refreshTokenApi';
import { getCurrentUserApi } from '@/api/user/get-current-user-api';
import { uploadPhotoApi } from '@/api/user/upload-photo-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getCurrentUser = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: () => getCurrentUserApi(),
  });

  const uploadPhoto = useMutation({
    mutationFn: (formData: FormData) => uploadPhotoApi(formData),
    onSuccess: () => {
      getCurrentUser.refetch();
      setSelectedFile(null);
    },
    onError: () => {
      console.log('❌ Upload failed');
    },
  });

  const refreshToken = useMutation({
    mutationFn: () => refreshTokenApi(),
    onSuccess: () => {
      console.log('succ');
    },
    onError: () => {
      console.log('error');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file ?? null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file first');

    const formData = new FormData();
    formData.append('profilePhoto', selectedFile);
    uploadPhoto.mutate(formData);
  };

  const profilePhotoPath = getCurrentUser.data?.user.profilePhoto
    ? `http://localhost:3000${getCurrentUser.data.user.profilePhoto}`
    : 'https://via.placeholder.com/150';

  return (
    <>
      <div className='flex px-2 py-3 shadow-lg items-center'>
        <button
          className='h-8 w-8 rounded-full border border-blue-300 text-blue-300 font-bold hover:bg-blue-100 transition'
          onClick={() => navigate(-1)}
        >
          {'<'}
        </button>
        <h2 className='ml-3 text-lg font-semibold'>Profile</h2>
      </div>

      <div className='flex justify-center items-center py-6 flex-col'>
        <img
          src={profilePhotoPath}
          alt='Profile'
          className='h-32 w-32 rounded-full object-cover shadow-md border'
        />

        <p className='text-2xl font-bold'>
          {getCurrentUser?.data?.user?.username}
        </p>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <input
          id='file-upload'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />

        <label
          htmlFor='file-upload'
          className='cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white font-medium shadow-md hover:bg-blue-600 transition'
        >
          选择照片
        </label>

        {selectedFile && (
          <span className='text-sm text-gray-600'>{selectedFile.name}</span>
        )}

        <button
          onClick={handleUpload}
          className='rounded-lg bg-green-500 px-4 py-2 text-white font-medium shadow-md hover:bg-green-600 transition disabled:opacity-50'
          disabled={!selectedFile || uploadPhoto.isPending}
        >
          {uploadPhoto.isPending ? '上传中...' : '上传'}
        </button>

        <button
          className='cursor-pointer'
          onClick={() => {
            refreshToken.mutate();
          }}
        >
          Refresh Token
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
