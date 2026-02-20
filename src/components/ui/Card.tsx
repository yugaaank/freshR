import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, Radius, Shadows, Spacing } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    shadow?: 'sm' | 'md' | 'lg';
    padding?: number;
    radius?: number;
}

export default function Card({
    children,
    style,
    onPress,
    shadow = 'sm',
    padding = Spacing.lg,
    radius = Radius.lg,
}: CardProps) {
    const shadowStyle = Shadows[shadow];

    if (onPress) {
        return (
            <TouchableOpacity
                activeOpacity={0.92}
                onPress={onPress}
                style={[styles.base, shadowStyle, { padding, borderRadius: radius }, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.base, shadowStyle, { padding, borderRadius: radius }, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.cardBg,
        overflow: 'hidden',
    },
});
