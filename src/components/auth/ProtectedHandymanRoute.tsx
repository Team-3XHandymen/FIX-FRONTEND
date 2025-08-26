import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedHandymanRouteProps {
  children: ReactNode;
}

const ProtectedHandymanRoute = ({ children }: ProtectedHandymanRouteProps) => {
  const { user, isLoaded, isHandyman, hasHandymanProfile, isRoleVerified, isRoleLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isRoleVerified) {
      if (!user) {
        // User is not authenticated, redirect to home
        navigate('/', { replace: true });
        return;
      }

      // Check if user has handyman profile in database AND Clerk metadata
      const hasClerkHandymanFlag = user.unsafeMetadata?.isHandyman === true;
      const hasDatabaseHandymanProfile = hasHandymanProfile;
      
      if (!hasDatabaseHandymanProfile || !hasClerkHandymanFlag) {
        console.log('🚫 Handyman access denied:', {
          hasClerkHandymanFlag,
          hasDatabaseHandymanProfile,
          userRole: user?.unsafeMetadata?.isHandyman
        });
        // User is not a handyman, redirect to client dashboard or home
        navigate('/client/dashboard', { replace: true });
        return;
      }
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

  // If user is not authenticated or is not verified as a handyman, don't render children
  const hasClerkHandymanFlag = user?.unsafeMetadata?.isHandyman === true;
  const hasDatabaseHandymanProfile = hasHandymanProfile;
  
  if (!user || !hasDatabaseHandymanProfile || !hasClerkHandymanFlag) {
    console.log('🚫 Access denied to handyman dashboard:', {
      hasUser: !!user,
      hasDatabaseHandymanProfile,
      hasClerkHandymanFlag,
      userRole: user?.unsafeMetadata?.isHandyman,
      isRoleVerified,
      isRoleLoading
    });
    return null;
  }

  // User is authenticated and verified as a handyman, render the protected content
  return <>{children}</>;
};

export default ProtectedHandymanRoute;
