import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface UnauthorizedRedirectProps {
  requiredRole: 'client' | 'handyman' | 'any';
  children: ReactNode;
}

const UnauthorizedRedirect = ({ requiredRole, children }: UnauthorizedRedirectProps) => {
  const { isHandyman, isClient, isAuthenticated, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to home
        navigate('/', { replace: true });
        return;
      }

      if (requiredRole === 'client' && isHandyman) {
        // Handyman trying to access client route, redirect to handyman dashboard
        navigate('/handyman/dashboard', { replace: true });
        return;
      }

      if (requiredRole === 'handyman' && isClient) {
        // Client trying to access handyman route, redirect to client dashboard
        navigate('/client/dashboard', { replace: true });
        return;
      }
    }
  }, [isLoaded, isAuthenticated, isHandyman, isClient, requiredRole, navigate]);

  // Don't render anything while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Check if user has the required role
  if (!isAuthenticated) return null;
  if (requiredRole === 'client' && isHandyman) return null;
  if (requiredRole === 'handyman' && isClient) return null;

  // User has the required role, render children
  return <>{children}</>;
};

export default UnauthorizedRedirect;
