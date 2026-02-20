import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
    scaleTo?: number;
    hapticFeedback?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export function PressableScale({
    scaleTo = 0.95,
    hapticFeedback = true,
    style,
    children,
    onPressIn,
    onPressOut,
    ...props
}: PressableScaleProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = (e: any) => {
        if (hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 });
        if (onPressIn) onPressIn(e);
    };

    const handlePressOut = (e: any) => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        if (onPressOut) onPressOut(e);
    };

    return (
        <AnimatedPressable
            {...props}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[style, animatedStyle]}
        >
            {children}
        </AnimatedPressable>
    );
}
