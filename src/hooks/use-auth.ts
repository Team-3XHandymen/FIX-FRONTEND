import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { AuthAPI } from '@/lib/api';

interface UserRole {
  userId: string;
  userRole: 'none' | 'client' | 'handyman';
  isRegistered: boolean;
  hasClientProfile: boolean;
  hasHandymanProfile: boolean;
}

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(false);

  // Verify user role from database when user changes
  useEffect(() => {
    const verifyRole = async () => {
      if (user?.id && isSignedIn) {
        console.log('🔍 Verifying user role for:', user.id);
        setIsRoleLoading(true);
        try {
          const response = await AuthAPI.verifyUserRole(user.id);
          console.log('✅ Role verification response:', response);
          if (response.success) {
            setUserRole(response.data);
          } else {
            console.warn('⚠️ Role verification failed:', response.message);
            setUserRole(null);
          }
        } catch (error) {
          console.error('❌ Error verifying user role:', error);
          // If there's an error, we should treat the user as unauthorized
          setUserRole(null);
        } finally {
          setIsRoleLoading(false);
        }
      } else {
        console.log('🔒 No user or not signed in, clearing role');
        setUserRole(null);
      }
    };

    verifyRole();
  }, [user?.id, isSignedIn]);

  // Determine user type based on database verification
  // A user can be both a client AND a handyman
  const hasClientProfile = userRole?.hasClientProfile || false;
  const hasHandymanProfile = userRole?.hasHandymanProfile || false;
  
  // User is a client if they have a client profile OR are signed in (default)
  const isClient = hasClientProfile || isSignedIn;
  
  // User is a handyman if they have a handyman profile AND Clerk metadata
  const isHandyman = hasHandymanProfile && user?.unsafeMetadata?.isHandyman === true;
  
  const isAuthenticated = isSignedIn;
  const isRoleVerified = userRole !== null && !isRoleLoading;

  // Debug logging
  console.log('🔍 useAuth hook state:', {
    userId: user?.id,
    hasClientProfile,
    hasHandymanProfile,
    isClient,
    isHandyman,
    clerkHandymanFlag: user?.unsafeMetadata?.isHandyman,
    isRoleVerified,
    isRoleLoading
  });

  return {
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated,
    isHandyman,
    isClient,
    hasClientProfile,
    hasHandymanProfile,
    isRoleVerified,
    isRoleLoading,
    userId: user?.id,
    userEmail: user?.emailAddresses?.[0]?.emailAddress,
    userName: user?.username || user?.firstName || 'User',
    userRole: userRole?.userRole || 'none',
  };
};
