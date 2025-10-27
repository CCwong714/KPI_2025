import { delPostApi } from '@/api/post/del-post-api';
import { getSingalPostApi } from '@/api/post/get-single-post';
import { toggleLikePostApi } from '@/api/post/toggle-like-api';
import { updatePostApi } from '@/api/post/update-post-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getSingalPost = useQuery({
    queryKey: ['getSingalPostApi', id],
    queryFn: () => getSingalPostApi(id ?? ''),
  });

  const postData = getSingalPost.data?.data;

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
      getSingalPost.refetch();
    },
  });

  const delPost = useMutation({
    mutationFn: (body: { id: string }) => delPostApi(body),
    onSuccess: () => {
      navigate('/');
    },
  });

  const toggleLikePost = useMutation({
    mutationFn: (id: string) => toggleLikePostApi(id),
    onSuccess: () => {
      getSingalPost.refetch();
    },
  });

  return (
    <>
      <div className='flex px-2 py-3'>
        <button
          className='h-8 w-8 rounded-full shadow-2xl  border-[0.5px] border-blue-300 font-bold text-blue-300'
          onClick={() => {
            navigate(-1);
          }}
        >
          {'<'}
        </button>
      </div>
      <div className='flex flex-col items-center h-[calc(100vh-56px)] overflow-scroll w-full'>
        <div className='w-full bg-gray-500 h-40 flex flex-col p-4 text-white'>
          <p className='font-extrabold text-2xl'> {postData?.postTitle}</p>
          <p> {postData?.postBody}</p>
          <div className='flex justify-end'>
            {postData?.isLiked ? (
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

        <div className='flex flex-row px-2 gap-2 items-center'>
          <button
            type='button'
            className='bg-white w-full rounded-lg px-2'
            onClick={() => toggleLikePost.mutate(postData?._id ?? '')}
          >
            {postData?.isLiked ? 'unlike' : 'like'}
          </button>

          <button
            type='button'
            className='bg-white rounded-lg  px-2'
            onClick={() => {
              updatePost.mutate(postData?._id ?? '');
            }}
          >
            update
          </button>

          <button
            type='button'
            className=' text-white rounded-full border-red-500 border bg-red-500 font-extrabold h-8 min-w-8'
            onClick={() => {
              delPost.mutate({ id: postData?._id ?? '' });
            }}
          >
            -
          </button>
        </div>
      </div>
    </>
  );
};

export default PostDetailsPage;
