import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, role = 'user' }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <LoadingSpinner text="Verifying access..." />
      </div>
    );
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/login" state={{ from: location, mode: 'admin' }} replace />;
  }

  if (role === 'user' && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
