
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

import Onboarding from '../components/Onboarding';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isOnboardingFinished, setIsOnboardingFinished] = useState(false);

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      if (hasOnboarded === null) {
        setIsFirstVisit(true);
      }
    };
    checkFirstVisit();
  }, []);

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    setIsOnboardingFinished(true);
  };

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isSignedIn && !inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  if (isFirstVisit && !isOnboardingFinished) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayoutNav = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayoutNav;


