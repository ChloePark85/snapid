import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';
import { IOSNavBar } from '../components/IOSNavBar';
import { 
  getOfferings, 
  purchasePackage, 
  restorePurchases 
} from '../lib/purchases';
import { supabase } from '../lib/supabase';
import type { PurchasesPackage } from 'react-native-purchases';

type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

interface Props {
  navigation: PaymentScreenNavigationProp;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  desc: string;
  badge: string | null;
  package?: PurchasesPackage;
}

const features = [
  '워터마크 제거',
  '고해상도 다운로드',
  '인쇄용 PDF 제공',
  '배경색 무제한 변경',
];

export const PaymentScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [plans, setPlans] = useState<Plan[]>([
    { id: '1', name: '1장', price: '₩2,900', desc: '증명사진 1장 생성', badge: null },
    { id: '2', name: '3장 패키지', price: '₩5,900', desc: '장당 ₩1,967 · 34% 할인', badge: '인기' },
    { id: '3', name: '월정액', price: '₩9,900', desc: '한 달 무제한 생성', badge: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await getOfferings();
      if (offerings?.availablePackages) {
        // Map RevenueCat packages to UI plans
        const updatedPlans = plans.map((plan, index) => {
          const pkg = offerings.availablePackages[index];
          return {
            ...plan,
            package: pkg,
            price: pkg?.product?.priceString || plan.price,
          };
        });
        setPlans(updatedPlans);
      }
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setLoadingOfferings(false);
    }
  };

  const handlePurchase = async () => {
    const selectedPlan = plans[selectedIndex];
    
    if (!selectedPlan.package) {
      Alert.alert('알림', '결제 시스템 준비 중입니다.');
      return;
    }

    setPurchasing(true);
    try {
      const customerInfo = await purchasePackage(selectedPlan.package);
      
      if (customerInfo) {
        // Update credits in Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let creditsToAdd = 0;
          let newPlan = 'free';
          
          switch (selectedIndex) {
            case 0: // 1장
              creditsToAdd = 1;
              newPlan = 'single';
              break;
            case 1: // 3장
              creditsToAdd = 3;
              newPlan = 'bundle';
              break;
            case 2: // 월정액
              creditsToAdd = 9999; // Unlimited
              newPlan = 'unlimited';
              break;
          }
          
          await supabase
            .from('profiles')
            .update({ 
              credits_remaining: creditsToAdd,
              plan: newPlan,
              revenucat_customer_id: customerInfo.originalAppUserId,
            })
            .eq('id', user.id);
        }
        
        Alert.alert(
          '구매 완료',
          '프리미엄 기능을 사용하실 수 있습니다!',
          [{ text: '확인', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('오류', '구매에 실패했습니다.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const customerInfo = await restorePurchases();
      if (customerInfo) {
        Alert.alert('성공', '구매 내역이 복원되었습니다.');
      } else {
        Alert.alert('알림', '복원할 구매 내역이 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '복원에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <IOSNavBar
        title="프리미엄"
        leftLabel="뒤로"
        onBack={() => navigation.goBack()}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>워터마크 없는 고품질 증명사진</Text>
        </View>

        {/* Plans - iOS grouped */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedIndex === index && styles.planCardActive,
              ]}
              onPress={() => setSelectedIndex(index)}
              activeOpacity={0.7}
            >
              {/* Radio button */}
              <View style={styles.radioContainer}>
                <View 
                  style={[
                    styles.radio,
                    selectedIndex === index && styles.radioActive,
                  ]}
                >
                  {selectedIndex === index && (
                    <Text style={styles.radioCheck}>✓</Text>
                  )}
                </View>
              </View>

              {/* Content */}
              <View style={styles.planContent}>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planDesc}>{plan.desc}</Text>
              </View>

              {/* Price */}
              <Text style={styles.planPrice}>{plan.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features - iOS grouped */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresHeader}>포함 사항</Text>
          <View style={styles.iosGroup}>
            {features.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureItem,
                  index > 0 && styles.featureItemBorder,
                ]}
              >
                <View style={styles.checkCircle}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {loadingOfferings ? (
          <ActivityIndicator size="small" color={Colors.textSecondary} />
        ) : (
          <>
            <TouchableOpacity
              style={[
                styles.ctaButton,
                purchasing && styles.ctaButtonDisabled,
              ]}
              onPress={handlePurchase}
              disabled={purchasing}
              activeOpacity={0.8}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaButtonText}>
                  {plans[selectedIndex]?.price} 구매하기
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleRestore}
              disabled={loading}
              style={styles.restoreButton}
            >
              <Text style={styles.restoreText}>구매 복원</Text>
            </TouchableOpacity>
            
            <Text style={styles.disclaimer}>구독은 언제든 취소 가능합니다</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  // Plans
  plansContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.07)',
    borderColor: Colors.primary,
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioCheck: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  planContent: {
    flex: 1,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.text,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.white,
  },
  planDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 12,
  },
  // Features
  featuresSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  featuresHeader: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  iosGroup: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  featureItemBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkIcon: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: Colors.text,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  comingSoonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
