import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radius, Typography } from '../../theme';

interface TagPillProps {
    label: string;
    variant?: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'teal' | 'grey' | 'dark';
    size?: 'sm' | 'md';
    style?: object;
    onPress?: () => void;
}

const VARIANTS = {
    orange: { bg: Colors.tagOrange, text: Colors.tagOrangeTxt },
    green: { bg: Colors.tagGreen, text: Colors.tagGreenTxt },
    blue: { bg: Colors.tagBlue, text: Colors.tagBlueTxt },
    purple: { bg: Colors.tagPurple, text: Colors.tagPurpleTxt },
    red: { bg: Colors.tagRed, text: Colors.tagRedTxt },
    teal: { bg: Colors.tagTeal, text: Colors.tagTealTxt },
    grey: { bg: Colors.tagGrey, text: Colors.tagGreyTxt },
    dark: { bg: 'rgba(255,255,255,0.16)', text: '#FFFFFF' },
};

export default function TagPill({ label, variant = 'grey', size = 'md', style, onPress }: TagPillProps) {
    const { bg, text } = VARIANTS[variant];
    const isSmall = size === 'sm';

    const pill = (
        <View style={[
            styles.pill,
            { backgroundColor: bg, borderRadius: Radius.pill },
            isSmall ? styles.sm : styles.md,
            style,
        ]}>
            <Text style={[
                isSmall ? styles.labelSm : styles.labelMd,
                { color: text },
            ]}>
                {label}
            </Text>
        </View>
    );

    if (onPress) {
        return <TouchableOpacity activeOpacity={0.88} onPress={onPress}>{pill}</TouchableOpacity>;
    }
    return pill;
}

const styles = StyleSheet.create({
    pill: { alignSelf: 'flex-start' },
    md: { paddingHorizontal: 12, paddingVertical: 5 },
    sm: { paddingHorizontal: 8, paddingVertical: 3 },
    labelMd: { ...Typography.label, fontSize: 12, fontWeight: '600' as const },
    labelSm: { ...Typography.label, fontSize: 10, fontWeight: '600' as const },
});
