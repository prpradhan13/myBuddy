import ChatProvider from '@/provider/ChatProvider';
import { useAuth } from '../../context/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={"/notAuthLandingPage"} replace />
  }
  
  return (
    <ChatProvider>
      <Outlet />
    </ChatProvider>
  )
}

export default PrivateRoute;
