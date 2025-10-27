import { registerApi } from '@/api/auth/registerApi';
import LinkButton from '@/components/linkButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

type TInitialValue = {
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
};
const initialValue: TInitialValue = {
  email: '',
  username: '',
  password: '',
  role: 'user',
};

const formTitle: Array<{ key: keyof typeof initialValue; label: string }> = [
  { key: 'email', label: 'Email' },
  { key: 'username', label: 'User Name' },
  { key: 'password', label: 'Password' },
];

const SignUpPage = () => {
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().email('请输入有效邮箱').required('邮箱是必填的'),
    username: yup.string().required('用户名字是必填的'),
    password: yup.string().min(6, '密码至少6个字符').required('密码是必填的'),
    role: yup
      .mixed<'admin' | 'user'>() // 指定 TS 类型
      .oneOf(['admin', 'user'], '角色必须是 admin 或 user')
      .required('角色是必填的'),
  });

  const { control, handleSubmit, formState } = useForm<TInitialValue>({
    defaultValues: initialValue,
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (body: {
      username: string;
      password: string;
      email: string;
      role: 'admin' | 'user';
    }) => registerApi(body),
    onSuccess: () => {
      navigate('/');
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
          mutate({
            password: data.password,
            username: data.username,
            email: data.email,
            role: data.role,
          });
        })}
        className='flex flex-col gap-2 w-4/5 mt-[20vh] max-w-[500px]'
      >
        <p className='text-gray-800 text-2xl font-semibold w-full text-center'>
          Sign Up
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

        <Controller
          name='role'
          control={control}
          render={({ field }) => (
            <div className='w-full border rounded-lg border-blue-200'>
              <select
                className='w-full p-2'
                value={field.value}
                onChange={field.onChange}
              >
                <option value='user'>user</option>
                <option value='admin'>admin</option>
              </select>
            </div>
          )}
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
          Create Account
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
