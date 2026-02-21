import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    padding?: number;
    radius?: number;
    dark?: boolean;
}

export default function Card({
    children,
    style,
    onPress,
    padding = Spacing.lg,
    radius = Radius.xl,   // bumped to 20 default
    dark = false,
}: CardProps) {
    const base = {
        padding,
        borderRadius: radius,
        backgroundColor: dark ? Colors.darkBg : Colors.cardBg,
        // 1px highlight border on top for elevated feel (Apple-style)
        borderTopWidth: 1,
        borderTopColor: dark ? Colors.highlight : 'rgba(255,255,255,0.8)',
        borderWidth: dark ? 0 : 1,
        borderColor: dark ? 'transparent' : 'rgba(226, 232, 240, 0.4)', // More subtle border
    };

    if (onPress) {
        return (
            <TouchableOpacity
                activeOpacity={0.88}
                onPress={onPress}
                style={[base, style]}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[base, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {},
});
