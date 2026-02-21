import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface BottomActionBarProps {
    leftLabel?: string;
    leftSubLabel?: string;
    buttonLabel: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
}

export default function BottomActionBar({
    leftLabel,
    leftSubLabel,
    buttonLabel,
    onPress,
    disabled = false,
    style,
}: BottomActionBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <BlurView
            intensity={80}
            tint="light"
            style={[
                styles.container,
                { paddingBottom: insets.bottom + Spacing.md },
                style,
            ]}
        >
            {leftLabel ? (
                <View style={styles.left}>
                    <Text style={styles.leftLabel}>{leftLabel}</Text>
                    {leftSubLabel ? <Text style={styles.leftSubLabel}>{leftSubLabel}</Text> : null}
                </View>
            ) : null}
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled, !leftLabel && styles.buttonFull]}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.85}
            >
                <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.75)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.md,
    },
    left: { flex: 1 },
    leftLabel: {
        ...Typography.h4,
        color: Colors.text,
    },
    leftSubLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    button: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonFull: { flex: 1 },
    buttonDisabled: { backgroundColor: Colors.textTertiary },
    buttonText: {
        ...Typography.h5,
        color: Colors.textLight,
        fontWeight: '700',
    },
});
