import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn } from 'react-native-reanimated';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('hasVisited');
        if (hasVisited === null) {
          setIsFirstVisit(true);
          await AsyncStorage.setItem('hasVisited', 'true');
        } else {
          setIsFirstVisit(false);
          setIsSplashFinished(true); // If not first visit, skip splash
        }
      } catch (error) {
        console.error("Failed to access AsyncStorage", error);
        setIsFirstVisit(false); // Proceed without splash on error
        setIsSplashFinished(true);
      }
    };

    checkFirstVisit();
  }, []);

  if (!loaded) {
    return null;
  }

  if (isFirstVisit && !isSplashFinished) {
    return <SplashScreen onFinish={() => setIsSplashFinished(true)} />;
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
