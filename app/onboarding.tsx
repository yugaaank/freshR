import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomActionBar from '../src/components/ui/BottomActionBar';
import { Interest, useUserStore } from '../src/store/userStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const INTERESTS: { label: Interest; emoji: string }[] = [
    { label: 'Tech', emoji: '💻' },
    { label: 'Design', emoji: '🎨' },
    { label: 'Music', emoji: '🎵' },
    { label: 'Sports', emoji: '⚽' },
    { label: 'Literature', emoji: '📚' },
    { label: 'Gaming', emoji: '🎮' },
    { label: 'Finance', emoji: '💰' },
    { label: 'Dance', emoji: '💃' },
    { label: 'Photography', emoji: '📷' },
    { label: 'Cooking', emoji: '🍳' },
    { label: 'Travel', emoji: '✈️' },
    { label: 'Fitness', emoji: '💪' },
    { label: 'Art', emoji: '🖼️' },
    { label: 'Science', emoji: '🔬' },
    { label: 'Movies', emoji: '🎬' },
];

export default function OnboardingScreen() {
    const { interests, toggleInterest, completeOnboarding } = useUserStore();

    const handleContinue = () => {
        completeOnboarding();
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.flex}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.heading}>What are you into? 🎯</Text>
                <Text style={styles.subheading}>
                    Pick at least 3 interests to personalise your FreshR feed
                </Text>

                <View style={styles.grid}>
                    {INTERESTS.map(({ label, emoji }) => {
                        const selected = interests.includes(label);
                        return (
                            <TouchableOpacity
                                key={label}
                                style={[styles.chip, selected && styles.chipSelected]}
                                onPress={() => toggleInterest(label)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.chipEmoji}>{emoji}</Text>
                                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                                    {label}
                                </Text>
                                {selected && (
                                    <View style={styles.checkMark}>
                                        <Text style={styles.checkText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomActionBar
                leftLabel={`${interests.length} selected`}
                leftSubLabel={interests.length < 3 ? 'Pick at least 3' : 'Great choices! 🎉'}
                buttonLabel="Continue →"
                onPress={handleContinue}
                disabled={interests.length < 3}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    container: {
        padding: Spacing.lg,
        paddingTop: 60,
    },
    heading: { ...Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
    subheading: { ...Typography.body1, color: Colors.textSecondary, marginBottom: Spacing.xxl, lineHeight: 22 },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: Radius.full,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.cardBg,
        ...Shadows.sm,
    },
    chipSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    chipEmoji: { fontSize: 16 },
    chipLabel: { ...Typography.body2, color: Colors.text, fontWeight: '500' },
    chipLabelSelected: { color: Colors.primary, fontWeight: '700' },
    checkMark: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
    },
    checkText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});
