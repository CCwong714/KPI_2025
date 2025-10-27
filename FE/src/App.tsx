import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import HomePage from '@/pages/HomePage';
import type { JSX } from 'react';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import PostDetailsPage from '@/pages/PostDetailsPage';
import ProfilePage from '@/pages/ProfilePage';

const getToken = () => sessionStorage.getItem(STORAGE_KEYS.accessToken);

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const token = getToken();
  return token ? element : <Navigate to='/login' replace />;
};

// 👇 路由定义
const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute element={<HomePage />} />, // 需要 token
  },
  {
    path: 'view/:id',
    element: <ProtectedRoute element={<PostDetailsPage />} />,
  },
  {
    path: '/profile',
    element: <ProtectedRoute element={<ProfilePage />} />, // 需要 token
  },
  {
    path: '/login',
    element: <LoginPage />, // 无需 token
  },
  {
    path: '/register',
    element: <SignUpPage />, // 无需 token
  },
  {
    path: 'change-password',
    element: <ChangePasswordPage />,
  },

  // ✅ 其他路径自动跳转到登录页
  {
    path: '*',
    element: <Navigate to='/login' replace />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
