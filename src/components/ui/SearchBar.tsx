import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: ViewStyle;
    editable?: boolean;
    onPress?: () => void;
}

export default function SearchBar({
    placeholder = 'Search...',
    value,
    onChangeText,
    style,
    editable = true,
    onPress,
}: SearchBarProps) {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                onPressIn={onPress}
                returnKeyType="search"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.sectionBg,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        ...Typography.body1,
        color: Colors.text,
        padding: 0,
    },
});
