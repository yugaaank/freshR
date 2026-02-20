import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface UrgencyTagProps {
    label: string;
    variant?: 'danger' | 'warning' | 'info';
    style?: ViewStyle;
}

export default function UrgencyTag({ label, variant = 'danger', style }: UrgencyTagProps) {
    const colors = {
        danger: { bg: Colors.tagRed, text: Colors.tagRedTxt },
        warning: { bg: Colors.tagOrange, text: Colors.tagOrangeTxt },
        info: { bg: Colors.tagBlue, text: Colors.tagBlueTxt },
    };
    const { bg, text } = colors[variant];

    return (
        <View style={[styles.tag, { backgroundColor: bg }, style]}>
            {variant === 'danger' && <View style={[styles.dot, { backgroundColor: text }]} />}
            <Text style={[styles.text, { color: text }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radius.full,
        gap: 4,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    text: {
        ...Typography.label,
        fontSize: 10,
        fontWeight: '700',
    },
});
