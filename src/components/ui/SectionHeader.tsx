import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onSeeAll?: () => void;
    style?: ViewStyle;
}

export default function SectionHeader({ title, subtitle, onSeeAll, style }: SectionHeaderProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.left}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {onSeeAll ? (
                <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    left: { flex: 1 },
    title: {
        ...Typography.h3,
        color: Colors.text,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    seeAll: {
        ...Typography.body2,
        color: Colors.primary,
        fontWeight: '600',
    },
});
