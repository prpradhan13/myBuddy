import { useAuth } from '@/context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom'

function RegisterLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />; // Redirect logged-in users to home
  }

  return <Outlet />;
}

export default RegisterLayout