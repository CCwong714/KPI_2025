import { getCurrentUserApi } from '@/api/user/get-current-user-api';
import { logoutAPi } from '@/api/auth/logoutApi';
import { addPostApi } from '@/api/post/add-post-api';
import { delPostApi } from '@/api/post/del-post-api';
import { getAllPostApi } from '@/api/post/get-all-post';
import { toggleLikePostApi } from '@/api/post/toggle-like-api';
import { updatePostApi } from '@/api/post/update-post-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const getCurrentUser = useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: () => getCurrentUserApi(),
  });

  const getAllPost = useQuery({
    queryKey: ['getAllPost'],
    queryFn: () => getAllPostApi(),
  });

  const addPost = useMutation({
    mutationFn: () =>
      addPostApi({
        postTitle: 'I am Title22',
        postBody: 'hi ~ i am body ~ nice to meet you22~',
      }),

    onSuccess: () => {
      getAllPost.refetch();
    },
  });

  const updatePost = useMutation({
    mutationFn: (id: string) =>
      updatePostApi({
        id,
        body: {
          postTitle: 'I am Title44',
          postBody: 'hi ~ i am body ~ nice to meet you44~',
        },
      }),

    onSuccess: () => {
      getAllPost.refetch();
    },
  });

  const delPost = useMutation({
    mutationFn: (body: { id: string }) => delPostApi(body),
    onSuccess: () => {
      getAllPost.refetch();
    },
  });

  const toggleLikePost = useMutation({
    mutationFn: (id: string) => toggleLikePostApi(id),
    onSuccess: () => {
      getAllPost.refetch();
    },
  });

  const logout = useMutation({
    mutationFn: () => logoutAPi(),
    onSuccess: () => {
      navigate('/login');
    },
  });

  return (
    <>
      <div className='flex items-center justify-between px-2 py-2'>
        <p>
          Hi, i am{' '}
          <span
            className='underline text-blue-500 font-bold cursor-pointer'
            onClick={() => navigate('/profile')}
          >
            {getCurrentUser.data?.user?.username}
          </span>
        </p>

        <div className='flex flex-row gap-2'>
          <button
            className='border rounded-xl p-2 bg-white'
            onClick={() => {
              addPost.mutate();
            }}
          >
            + POST
          </button>
          <button
            className='border rounded-xl p-2 bg-white'
            onClick={() => {
              logout.mutate();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className='w-full bg-green-500 flex flex-col gap-2'>
        {getAllPost.data?.data?.map((item) => {
          return (
            <div className='flex flex-row items-center h-full w-full'>
              <div className='w-full bg-gray-500 h-40 flex flex-col p-4 text-white'>
                <p className='font-extrabold text-2xl'> {item.postTitle}</p>
                <p> {item.postBody}</p>
                <div className='flex justify-end'>
                  {item.isLiked ? (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      aria-hidden='true'
                    >
                      <path
                        d='M12 21c0 0-8-6.5-8-11.5C4 6.02 6.02 4 8.5 4c1.66 0 3.04.99 3.5 2.44C12.46 4.99 13.84 4 15.5 4 17.98 4 20 6.02 20 9.5 20 14.5 12 21 12 21z'
                        fill='#ff2d6f'
                      />
                    </svg>
                  ) : (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                      aria-hidden='true'
                    >
                      <path
                        d='M12 21c0 0-8-6.5-8-11.5C4 6.02 6.02 4 8.5 4c1.66 0 3.04.99 3.5 2.44C12.46 4.99 13.84 4 15.5 4 17.98 4 20 6.02 20 9.5 20 14.5 12 21 12 21z'
                        fill='none'
                        stroke='#e0245e'
                        stroke-width='1.6'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className='flex flex-col w-full px-2 gap-2 items-center max-w-20'>
                <button
                  type='button'
                  className='bg-white w-full rounded-lg px-2'
                  onClick={() => toggleLikePost.mutate(item._id)}
                >
                  {item.isLiked ? 'unlike' : 'like'}
                </button>

                <button
                  type='button'
                  className='bg-white w-full rounded-lg px-2'
                  onClick={() => {
                    navigate('/view/' + item._id);
                  }}
                >
                  view
                </button>

                <button
                  type='button'
                  className='bg-white rounded-lg w-full px-2'
                  onClick={() => {
                    updatePost.mutate(item._id);
                  }}
                >
                  update
                </button>

                <button
                  type='button'
                  className=' text-white  rounded-full border-red-500 border bg-red-500 font-extrabold h-8 w-8'
                  onClick={() => {
                    delPost.mutate({ id: item._id });
                  }}
                >
                  -
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HomePage;
