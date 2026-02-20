import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const colleges = [
    'MIT Manipal',
    'BITS Pilani',
    'NIT Trichy',
    'IIT Bombay',
    'VIT Vellore',
    'Amity University',
    'SRM Chennai',
];

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('MIT Manipal');
    const [showCollegeList, setShowCollegeList] = useState(false);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [otp, setOtp] = useState('');
    const login = useUserStore((s) => s.login);

    const handleSendOtp = () => {
        if (phone.length >= 10) setStep('otp');
    };

    const handleVerify = () => {
        login(phone);
        router.replace('/onboarding');
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Logo */}
                <View style={styles.logoArea}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>C</Text>
                    </View>
                    <Text style={styles.appName}>FreshR</Text>
                    <Text style={styles.tagline}>Your campus, supercharged 🚀</Text>
                </View>

                {/* Card */}
                <View style={[styles.card, Shadows.md]}>
                    {step === 'phone' ? (
                        <>
                            <Text style={styles.cardTitle}>Enter your mobile number</Text>
                            <Text style={styles.cardSubtitle}>We'll send you a verification code</Text>

                            {/* College Selector */}
                            <Text style={styles.fieldLabel}>Your College</Text>
                            <TouchableOpacity
                                style={styles.selector}
                                onPress={() => setShowCollegeList(!showCollegeList)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.selectorText}>{selectedCollege}</Text>
                                <Text style={styles.selectorArrow}>{showCollegeList ? '▲' : '▼'}</Text>
                            </TouchableOpacity>
                            {showCollegeList && (
                                <View style={[styles.dropdown, Shadows.md]}>
                                    {colleges.map((c) => (
                                        <TouchableOpacity
                                            key={c}
                                            style={[styles.dropdownItem, c === selectedCollege && styles.dropdownItemActive]}
                                            onPress={() => { setSelectedCollege(c); setShowCollegeList(false); }}
                                        >
                                            <Text style={[styles.dropdownItemText, c === selectedCollege && styles.dropdownItemTextActive]}>
                                                {c}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Phone Input */}
                            <Text style={[styles.fieldLabel, { marginTop: Spacing.lg }]}>Phone Number</Text>
                            <View style={styles.phoneRow}>
                                <View style={styles.countryCode}>
                                    <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                                </View>
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="98765 43210"
                                    placeholderTextColor={Colors.textTertiary}
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    maxLength={10}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.primaryBtn, phone.length < 10 && styles.primaryBtnDisabled]}
                                onPress={handleSendOtp}
                                disabled={phone.length < 10}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.primaryBtnText}>Get OTP →</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setStep('phone')} style={styles.backBtn}>
                                <Text style={styles.backBtnText}>← Change number</Text>
                            </TouchableOpacity>
                            <Text style={styles.cardTitle}>Enter OTP</Text>
                            <Text style={styles.cardSubtitle}>Sent to +91 {phone}</Text>

                            <TextInput
                                style={styles.otpInput}
                                placeholder="------"
                                placeholderTextColor={Colors.textTertiary}
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6}
                                textAlign="center"
                            />

                            <TouchableOpacity
                                style={[styles.primaryBtn, otp.length < 4 && styles.primaryBtnDisabled]}
                                onPress={handleVerify}
                                disabled={otp.length < 4}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.resendBtn}>
                                <Text style={styles.resendText}>Resend OTP in 30s</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Text style={styles.terms}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.sectionBg },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
        paddingTop: 60,
    },
    logoArea: { alignItems: 'center', marginBottom: Spacing.xxxl },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: Radius.lg,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    logoText: { fontSize: 32, fontWeight: '800', color: '#FFF' },
    appName: { ...Typography.h2, color: Colors.text, marginBottom: 4 },
    tagline: { ...Typography.body2, color: Colors.textSecondary },
    card: {
        width: '100%',
        backgroundColor: Colors.cardBg,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    cardTitle: { ...Typography.h3, color: Colors.text, marginBottom: 4 },
    cardSubtitle: { ...Typography.body2, color: Colors.textSecondary, marginBottom: Spacing.lg },
    fieldLabel: { ...Typography.label, color: Colors.textSecondary, marginBottom: Spacing.xs },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    selectorText: { ...Typography.body1, color: Colors.text },
    selectorArrow: { color: Colors.textSecondary, fontSize: 11 },
    dropdown: {
        borderRadius: Radius.md,
        backgroundColor: Colors.cardBg,
        marginTop: Spacing.xs,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        zIndex: 99,
    },
    dropdownItem: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
    dropdownItemActive: { backgroundColor: Colors.primaryLight },
    dropdownItemText: { ...Typography.body1, color: Colors.text },
    dropdownItemTextActive: { color: Colors.primary, fontWeight: '600' },
    phoneRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    countryCodeText: { ...Typography.body1, color: Colors.text },
    phoneInput: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        ...Typography.body1,
        color: Colors.text,
    },
    primaryBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md + 2,
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    primaryBtnDisabled: { backgroundColor: '#FCBF8A' },
    primaryBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
    backBtn: { marginBottom: Spacing.md },
    backBtnText: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
    otpInput: {
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.lg,
        ...Typography.h2,
        color: Colors.text,
        letterSpacing: 12,
        marginVertical: Spacing.lg,
    },
    resendBtn: { alignItems: 'center', marginTop: Spacing.md },
    resendText: { ...Typography.body2, color: Colors.textSecondary },
    terms: { ...Typography.caption, color: Colors.textTertiary, textAlign: 'center', lineHeight: 18 },
    termsLink: { color: Colors.primary, fontWeight: '600' },
});
