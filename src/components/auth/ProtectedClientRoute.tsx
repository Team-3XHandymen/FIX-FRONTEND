import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedClientRouteProps {
  children: ReactNode;
}

const ProtectedClientRoute = ({ children }: ProtectedClientRouteProps) => {
  const { user, isLoaded, isHandyman, isRoleVerified, isRoleLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isRoleVerified) {
      if (!user) {
        // User is not authenticated, redirect to home
        navigate('/', { replace: true });
        return;
      }

      // Handymen CAN access client routes since they are also clients
      // No need to redirect them away
      console.log('✅ Client access granted:', {
        isHandyman,
        hasClientProfile: true,
        userRole: user?.unsafeMetadata?.isHandyman
      });
    }
  }, [user, isLoaded, isHandyman, isRoleVerified, navigate]);

  // Show loading while Clerk is initializing or role is being verified
  if (!isLoaded || isRoleLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f6f7fa] flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Verifying your account...</p>
      </div>
    );
  }

  // If user is not authenticated, don't render children
  // Handymen CAN access client routes since they are also clients
  if (!user) {
    return null;
  }

  // User is authenticated and verified as a client, render the protected content
  return <>{children}</>;
};

export default ProtectedClientRoute;
