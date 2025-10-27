import { changePasswordApi } from '@/api/user/change-password-api';
import { sendPasswordToEmailApi } from '@/api/user/send-password-to-email';
import LinkButton from '@/components/linkButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const initialValue = {
  username: '',
  password: '',
};
const formTitle: Array<{ key: keyof typeof initialValue; label: string }> = [
  { key: 'username', label: 'User Name' },
  { key: 'password', label: 'Password' },
];

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required('用户名字是必填的'),
    password: yup.string().min(6, '密码至少6个字符').required('密码是必填的'),
  });

  const { control, handleSubmit, formState } = useForm({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (body: { username: string; newPassword: string }) =>
      changePasswordApi(body),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: forgetPasswordMutate } = useMutation({
    mutationFn: (body: { email: string }) => sendPasswordToEmailApi(body),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { errors } = formState;

  return (
    <div className='bg-white polyfill-h-100dvh flex justify-center'>
      <form
        onSubmit={handleSubmit((data) => {
          mutate({ username: data.username, newPassword: data.password });
        })}
        className='flex flex-col gap-2 w-4/5 mt-[20vh] max-w-[500px]'
      >
        <p className='text-gray-800 text-2xl font-semibold w-full text-center'>
          Change Password Page
        </p>
        {formTitle.map((item) => {
          return (
            <Controller
              key={item.key}
              name={item.key}
              control={control}
              render={({ field }) => (
                <div className='w-full'>
                  <p className='text-gray-600'>{item.label}</p>
                  <input
                    className='bg-white focus:outline-none p-2 rounded w-full shadow-blue-100 border-gray-50 border-[1px] shadow-lg'
                    {...field}
                  />

                  <div className='h-4 text-end text-red-500 font-extrabold text-sm'>
                    {errors?.[item.key]?.message && (
                      <span className='text-red-500'>
                        {errors?.[item.key]?.message} *
                      </span>
                    )}
                  </div>
                </div>
              )}
            />
          );
        })}
        <LinkButton
          text='Forget Password (send to email)'
          onClick={() => {
            forgetPasswordMutate({ email: 'ccUser01@gmail.com' });
          }}
        />

        <LinkButton
          text='Back to login page'
          onClick={() => {
            navigate('/login');
          }}
        />

        <button
          type='submit'
          className='bg-blue-600 w-full rounded h-8 text-white mt-4 cursor-pointer'
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
