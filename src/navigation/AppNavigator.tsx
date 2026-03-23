import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';

import AuthScreen from '../screens/AuthScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { CameraScreen } from '../screens/CameraScreen';
import { FormatSelectScreen } from '../screens/FormatSelectScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { PaymentScreen } from '../screens/PaymentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  session: Session | null;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ session }) => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(seen === 'true');
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
  };

  if (checkingOnboarding) {
    return null;
  }

  // Determine initial route
  let initialRoute: keyof RootStackParamList = 'Onboarding';
  if (hasSeenOnboarding) {
    initialRoute = session ? 'Camera' : 'Auth';
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen
          name="Auth"
          options={{ headerShown: false }}
        >
          {(props) => <AuthScreen {...props} onAuthSuccess={handleOnboardingComplete} />}
        </Stack.Screen>
        <Stack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
        >
          {(props) => <OnboardingScreen {...props} onComplete={handleOnboardingComplete} />}
        </Stack.Screen>
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            title: '사진 촬영',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen
          name="FormatSelect"
          component={FormatSelectScreen}
          options={{
            title: '규격 선택',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: '결과',
            headerBackTitle: '뒤로',
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            title: '프리미엄',
            headerBackTitle: '뒤로',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
