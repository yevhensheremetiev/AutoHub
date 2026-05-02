import { Navigate, Route, Routes } from 'react-router-dom';

import { DriverDashboardLayout } from '@/components/driver/DriverDashboardLayout';
import { BookServicePage } from '@/pages/driver/BookServicePage';
import { DriverAddCarPage } from '@/pages/driver/DriverAddCarPage.tsx';
import { DashboardCarsPage } from '@/pages/driver/DashboardCarsPage';
import { DashboardHomePage } from '@/pages/driver/DashboardHomePage';
import { DashboardMapPage } from '@/pages/driver/DashboardMapPage';
import { MaintenanceHistoryPage } from '@/pages/driver/MaintenanceHistoryPage';
import { ServiceDetailPage } from '@/pages/driver/ServiceDetailPage';

import { ForgotPasswordPage } from './pages/ForgotPasswordPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignUpPage } from './pages/SignUpPage.tsx';
import { ResetPasswordPage } from './pages/ResetPasswordPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={<DriverDashboardLayout />}>
        <Route index element={<DashboardHomePage />} />
        <Route path="map" element={<DashboardMapPage />} />
        <Route path="cars" element={<DashboardCarsPage />} />
        <Route path="cars/new" element={<DriverAddCarPage />} />
        <Route path="history" element={<MaintenanceHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="services/:stationId" element={<ServiceDetailPage />} />
        <Route
          path="services/:stationId/book"
          element={<BookServicePage />}
        />
      </Route>
      <Route
        path="/profile"
        element={<Navigate to="/dashboard/profile" replace />}
      />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
