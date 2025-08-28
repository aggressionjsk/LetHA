
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn } from 'react-native-reanimated';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import Onboarding from '../components/Onboarding';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isOnboardingFinished, setIsOnboardingFinished] = useState(false);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
        if (hasOnboarded === null) {
          setIsFirstVisit(true);
        } else {
          setIsFirstVisit(false);
          setIsOnboardingFinished(true); // If not first visit, skip onboarding
        }
      } catch (error) {
        console.error("Failed to access AsyncStorage", error);
        setIsFirstVisit(false); // Proceed without onboarding on error
        setIsOnboardingFinished(true);
      }
    };

    checkFirstVisit();
  }, []);

  const handleOnboardingFinish = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      setIsOnboardingFinished(true);
    } catch (error) {
      console.error("Failed to set AsyncStorage", error);
      setIsOnboardingFinished(true); // Proceed even if AsyncStorage fails
    }
  };

  if (!loaded) {
    return null;
  }

  if (isFirstVisit && !isOnboardingFinished) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(1000)}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Animated.View>
  );
}

