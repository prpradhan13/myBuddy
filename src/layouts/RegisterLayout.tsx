import { useAuth } from '@/context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom'

function RegisterLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RegisterLayout