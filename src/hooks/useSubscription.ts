import { useEffect, useState, useCallback } from 'react';
import Purchases from 'react-native-purchases';

export interface SubscriptionStatus {
  isSubscribed: boolean;
  isTrialing: boolean;
  isPremium: boolean;
  expiryDate: Date | null;
  loading: boolean;
  error: string | null;
}

export function useSubscription(): SubscriptionStatus {
  const [status, setStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    isTrialing: false,
    isPremium: false,
    expiryDate: null,
    loading: true,
    error: null,
  });

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Check for "Chippn2 Pro" entitlement
      const entitlements = customerInfo.entitlements.active;
      const proEntitlement = entitlements['Chippn2 Pro'];

      if (proEntitlement) {
        setStatus({
          isSubscribed: true,
          isPremium: true,
          isTrialing: proEntitlement.billingIssueDetected === false,
          expiryDate: proEntitlement.expirationDate ? new Date(proEntitlement.expirationDate) : null,
          loading: false,
          error: null,
        });
      } else {
        setStatus({
          isSubscribed: false,
          isPremium: false,
          isTrialing: false,
          expiryDate: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
    
    // Re-check every 30 seconds
    const interval = setInterval(checkSubscriptionStatus, 30000);
    
    // Listen for purchase updates
    const purchaseUpdatedListener = Purchases.onPurchaseCompleted(async (purchase) => {
      await checkSubscriptionStatus();
    });

    return () => {
      clearInterval(interval);
      purchaseUpdatedListener.remove();
    };
  }, [checkSubscriptionStatus]);

  return status;
}
