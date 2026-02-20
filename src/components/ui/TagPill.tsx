import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

type PillVariant = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'grey';

interface TagPillProps {
    label: string;
    variant?: PillVariant;
    style?: ViewStyle;
    textStyle?: TextStyle;
    size?: 'sm' | 'md';
}

const variantStyles: Record<PillVariant, { bg: string; text: string }> = {
    blue: { bg: Colors.tagBlue, text: Colors.tagBlueTxt },
    green: { bg: Colors.tagGreen, text: Colors.tagGreenTxt },
    orange: { bg: Colors.tagOrange, text: Colors.tagOrangeTxt },
    purple: { bg: Colors.tagPurple, text: Colors.tagPurpleTxt },
    red: { bg: Colors.tagRed, text: Colors.tagRedTxt },
    grey: { bg: Colors.sectionBg, text: Colors.textSecondary },
};

export default function TagPill({
    label,
    variant = 'blue',
    style,
    textStyle,
    size = 'md',
}: TagPillProps) {
    const { bg, text } = variantStyles[variant];
    const isSmall = size === 'sm';

    return (
        <View
            style={[
                styles.pill,
                { backgroundColor: bg },
                isSmall && styles.pillSmall,
                style,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: text },
                    isSmall && styles.textSmall,
                    textStyle,
                ]}
            >
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 5,
        borderRadius: Radius.full,
        alignSelf: 'flex-start',
    },
    pillSmall: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
    },
    text: {
        ...Typography.label,
        fontSize: 12,
        fontWeight: '600',
    },
    textSmall: {
        fontSize: 10,
    },
});
