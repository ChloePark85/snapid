import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Key는 나중에 설정 (앱스토어 등록 후)
const REVENUECAT_API_KEY_IOS = 'test_PqPqfZUnjKeNOVHNxYwQlnkXisu';
const REVENUECAT_API_KEY_ANDROID = 'test_PqPqfZUnjKeNOVHNxYwQlnkXisu';

export const initPurchases = async () => {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
  await Purchases.configure({ apiKey });
};

export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    console.error('Failed to get offerings:', e);
    return null;
  }
};

export const purchasePackage = async (pkg: PurchasesPackage) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (e: any) {
    if (!e.userCancelled) {
      console.error('Purchase failed:', e);
    }
    return null;
  }
};

export const checkSubscription = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isActive = customerInfo.entitlements.active['premium'] !== undefined;
    return isActive;
  } catch (e) {
    console.error('Failed to check subscription:', e);
    return false;
  }
};

export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (e) {
    console.error('Restore failed:', e);
    return null;
  }
};
