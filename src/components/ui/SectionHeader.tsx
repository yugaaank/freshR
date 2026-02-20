import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onSeeAll?: () => void;
    style?: object;
    light?: boolean;
}

export default function SectionHeader({ title, subtitle, onSeeAll, style, light }: SectionHeaderProps) {
    return (
        <View style={[styles.row, { paddingHorizontal: Spacing.section }, style]}>
            <View style={styles.left}>
                <Text style={[styles.title, light && styles.titleLight]}>{title}</Text>
                {subtitle && <Text style={[styles.sub, light && styles.subLight]}>{subtitle}</Text>}
            </View>
            {onSeeAll && (
                <Text style={styles.seeAll} onPress={onSeeAll}>
                    See all →
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    left: { flex: 1 },
    title: { ...Typography.h2, color: Colors.text },
    titleLight: { color: '#FFFFFF' },
    sub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    subLight: { color: 'rgba(255,255,255,0.65)' },
    seeAll: {
        ...Typography.label,
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '600',
    },
});
