import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate, runOnJS } from 'react-native-reanimated';
import OrganizeIcon from './OrganizeIcon';
import ViewsIcon from './ViewsIcon';
import WelcomeIcon from './WelcomeIcon';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const onboarding_screens = [
  {
    title: 'Organize Places',
    description: 'Add and Import places from everywhere',
    buttonText: 'Get Started',
    icon: <OrganizeIcon />,
  },
  {
    title: 'Different Views',
    description: 'Explore the map from different perspectives',
    buttonText: 'Continue',
    icon: <ViewsIcon />,
  },
  {
    title: 'Welcome',
    description: "Let's get started!",
    buttonText: "Let's Go",
    icon: <WelcomeIcon />,
  },
];

const OnboardingScreen = ({ item, scrollX, index }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.slide, animatedStyle]}>
      <View style={{ marginBottom: 40 }}>{item.icon}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </Animated.View>
  );
};

const Pagination = ({ data, scrollX }) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], Extrapolate.CLAMP);
          const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP);
          return {
            opacity,
            transform: [{ scale }],
          };
        });
        return <Animated.View key={i} style={[styles.dot, animatedStyle]} />;
      })}
    </View>
  );
};

const Onboarding = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < onboarding_screens.length - 1) {
      flatListRef.current.scrollToOffset({ offset: (currentIndex + 1) * width });
    } else {
      onFinish();
      router.push('/sign-in');
    }
  };

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    const newIndex = Math.round(event.contentOffset.x / width);
    runOnJS(setCurrentIndex)(newIndex);
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={onboarding_screens}
        renderItem={({ item, index }) => <OnboardingScreen item={item} scrollX={scrollX} index={index} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.title}
      />
      <Pagination data={onboarding_screens} scrollX={scrollX} />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {onboarding_screens[currentIndex].buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  description: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    fontFamily: 'SpaceMono',
    paddingHorizontal: 20,
  },
  button: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'SpaceMono',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 8,
  },
});

export default Onboarding;
