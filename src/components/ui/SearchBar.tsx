import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../../theme';

interface SearchBarProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: ViewStyle;
    editable?: boolean;
    onPress?: () => void;
    onClear?: () => void;
}

export default function SearchBar({
    placeholder = 'Search...',
    value,
    onChangeText,
    style,
    editable = true,
    onPress,
    onClear,
}: SearchBarProps) {
    const hasValue = value && value.length > 0;

    return (
        <View style={[styles.container, hasValue && styles.containerActive, style]}>
            <Ionicons name="search" size={20} color={hasValue ? Colors.primary : Colors.textTertiary} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.textTertiary}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                onPressIn={onPress}
                returnKeyType="search"
                clearButtonMode="while-editing"
                autoCapitalize="none"
            />
            {hasValue && onClear && (
                <TouchableOpacity onPress={onClear}>
                    <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        height: 52,
        gap: Spacing.sm,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    containerActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.background,
    },
    input: {
        flex: 1,
        ...Typography.body1,
        color: Colors.text,
        padding: 0,
    },
});
