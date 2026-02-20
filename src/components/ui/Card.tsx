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
    shadow?: 'xs' | 'sm' | 'md' | 'lg';
    padding?: number;
    radius?: number;
    dark?: boolean;
}

export default function Card({
    children,
    style,
    onPress,
    shadow = 'sm',
    padding = Spacing.lg,
    radius = Radius.xl,   // bumped to 20 default
    dark = false,
}: CardProps) {
    const shadowStyle = Shadows[shadow];
    const base = {
        padding,
        borderRadius: radius,
        backgroundColor: dark ? Colors.darkBg : Colors.cardBg,
        // 1px highlight border on top for elevated feel (Apple-style)
        borderTopWidth: 1,
        borderTopColor: dark ? Colors.highlight : 'rgba(0,0,0,0.04)',
        borderWidth: dark ? 0 : 1,
        borderColor: dark ? 'transparent' : Colors.border,
    };

    if (onPress) {
        return (
            <TouchableOpacity
                activeOpacity={0.88}
                onPress={onPress}
                style={[styles.base, shadowStyle, base, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[styles.base, shadowStyle, base, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: { overflow: 'hidden' },
});
