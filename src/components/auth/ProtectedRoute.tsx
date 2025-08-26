import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ children, redirectTo = '/' }: ProtectedRouteProps) => {
  const { user, isLoaded, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      // User is not authenticated, redirect to specified path
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoaded, navigate, redirectTo]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
