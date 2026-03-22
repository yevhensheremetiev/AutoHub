import { Navigate, Route, Routes } from 'react-router-dom';

import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignUpPage } from './pages/SignUpPage.tsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { CarsPage } from './pages/CarsPage.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/cars" element={<CarsPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
