import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@clerk/clerk-react';

interface AccountStatus {
  accountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  needsOnboarding: boolean;
  onboardingUrl?: string;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
    pendingVerification: string[];
  };
}

export const ProviderPaymentSetup: React.FC = () => {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id && getToken) {
      fetchAccountStatus();
    }
  }, [user?.id, getToken]);

  const fetchAccountStatus = async () => {
    if (!user?.id || !getToken) return;

    try {
      const token = await getToken();
      
      // Create a custom API call with proper headers
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/stripe/provider-account/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
      });

      if (response.status === 404) {
        // No account exists yet - this is expected for new providers
        setAccountStatus(null);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAccountStatus(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch account status');
      }
    } catch (error: any) {
      console.error('Error fetching account status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment account status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!user?.id || !getToken) return;

    setIsCreating(true);
    
    try {
      const token = await getToken();
      
      // Create provider account with proper authentication headers
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_BASE_URL}/stripe/create-provider-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-ID': user.id,
          'X-User-Type': 'provider',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();

      if (result.success && result.data.onboardingUrl) {
        // Redirect to Stripe onboarding
        window.location.href = result.data.onboardingUrl;
      } else {
        throw new Error(result.message || 'Failed to create payment account');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Account creation failed';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOnboarding = () => {
    if (accountStatus?.onboardingUrl) {
      window.location.href = accountStatus.onboardingUrl;
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setIsLoading(true);
      await fetchAccountStatus();
      toast({
        title: "Status Updated",
        description: "Account status has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh account status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2">Loading payment status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!accountStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Account Setup</CardTitle>
          <CardDescription>
            Set up your payment account to start receiving payments from clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>To receive payments, you need to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Create a Stripe Express account</li>
                <li>Complete identity verification</li>
                <li>Add your bank account details</li>
              </ul>
            </div>
            
            <Button
              onClick={handleCreateAccount}
              disabled={isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  🏦 Set Up Payment Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = () => {
    if (!accountStatus) {
      return <Badge variant="secondary">Loading</Badge>;
    }
    
    if (accountStatus.chargesEnabled && accountStatus.payoutsEnabled) {
      return <Badge variant="default" className="bg-green-500">Ready</Badge>;
    } else if (accountStatus.needsOnboarding) {
      return <Badge variant="destructive">Needs Setup</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getRequirementsText = () => {
    if (!accountStatus?.requirements) {
      return 'Requirements not available';
    }
    
    const { currentlyDue, eventuallyDue, pastDue, pendingVerification } = accountStatus.requirements;
    
    if (currentlyDue?.length > 0) {
      return `Required: ${currentlyDue.join(', ')}`;
    } else if (pendingVerification?.length > 0) {
      return `Verifying: ${pendingVerification.join(', ')}`;
    } else if (eventuallyDue?.length > 0) {
      return `Eventually needed: ${eventuallyDue.join(', ')}`;
    } else {
      return 'All requirements completed';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Account Status</CardTitle>
            <CardDescription>
              Manage your payment account and payout settings
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshStatus}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : '🔄 Refresh'}
            </Button>
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Charges:</span>
            <span className={`ml-2 ${accountStatus?.chargesEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {accountStatus?.chargesEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div>
            <span className="font-medium">Payouts:</span>
            <span className={`ml-2 ${accountStatus?.payoutsEnabled ? 'text-green-600' : 'text-red-600'}`}>
              {accountStatus?.payoutsEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <span className="font-medium">Requirements:</span>
          <p className="text-muted-foreground mt-1">{getRequirementsText()}</p>
        </div>

        {accountStatus?.needsOnboarding && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-yellow-600">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Action Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>You need to complete your account setup to receive payments.</p>
                </div>
                <div className="mt-3">
                  <Button
                    onClick={handleOnboarding}
                    variant="outline"
                    size="sm"
                  >
                    Complete Setup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {accountStatus?.chargesEnabled && accountStatus?.payoutsEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-600">✅</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Account Ready
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your payment account is fully set up and ready to receive payments. Check your earnings on the top of the dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
