import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface PressableScaleProps extends PressableProps {
    scaleTo?: number;
    hapticFeedback?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export function PressableScale({
    scaleTo = 0.98,
    hapticFeedback = true,
    style,
    children,
    onPressIn,
    onPressOut,
    ...props
}: PressableScaleProps) {
    const handlePressIn = (e: any) => {
        if (hapticFeedback) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (onPressIn) onPressIn(e);
    };

    return (
        <Pressable
            {...props}
            onPressIn={handlePressIn}
            onPressOut={onPressOut}
            style={style}
        >
            {children}
        </Pressable>
    );
}
