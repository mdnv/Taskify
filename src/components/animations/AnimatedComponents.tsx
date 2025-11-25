import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  ViewStyle, 
  StyleSheet,
  Easing,
} from 'react-native';

interface AnimatedContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'none';
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  style,
  delay = 0,
  duration = 400,
  type = 'fadeIn',
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      type === 'slideUp'
        ? Animated.timing(animValue, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        : type === 'scaleIn'
        ? Animated.timing(animValue, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.back(1)),
            useNativeDriver: true,
          })
        : Animated.timing(animValue, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
    ]).start();
  }, [animValue, delay, duration, type]);

  const getAnimatedStyle = () => {
    if (type === 'slideUp') {
      return {
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
        ],
      };
    } else if (type === 'scaleIn') {
      return {
        opacity: animValue,
        transform: [
          {
            scale: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
      };
    } else {
      return { opacity: animValue };
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]}>
      {children}
    </Animated.View>
  );
};

interface PulseAnimationProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({ children, style }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface BouncyButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BouncyButton: React.FC<BouncyButtonProps> = ({ 
  onPress, 
  children, 
  style 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
};

interface FadeInOutProps {
  visible: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
}

export const FadeInOut: React.FC<FadeInOutProps> = ({ 
  visible, 
  children, 
  style, 
  duration = 300 
}) => {
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim, duration]);

  // Don't render if completely hidden
  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[style, { opacity: fadeAnim }]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({});
