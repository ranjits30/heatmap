import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HeatMapPage from './pages/HeatMapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getDashboardMode, isAuthenticated } from './auth';

function AuthRoute({ children }: { children: ReactElement }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: ReactElement }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
}

function DashboardRoute() {
  return <HeatMapPage initialMode={getDashboardMode()} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route path="/dashboard" element={<AuthRoute><DashboardRoute /></AuthRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
