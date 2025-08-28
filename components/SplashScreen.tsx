
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS } from 'react-native-reanimated';
import { Svg, Path, Line } from 'react-native-svg';

const Bulb = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M9 18h6v-2.5c0-2.5 2-4.5 2-6.5a6 6 0 0 0-12 0c0 2 2 4 2 6.5V18Z" />
    <Line x1="9" y1="22" x2="15" y2="22" />
    <Line x1="10" y1="18" x2="14" y2="18" />
  </Svg>
);

const SplashScreen = ({ onFinish }) => {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 }, () => {
        runOnJS(onFinish)();
      })
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Bulb />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default SplashScreen;
