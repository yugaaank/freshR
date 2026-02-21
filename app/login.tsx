import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import { useUserStore } from '../src/store/userStore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const signInWithEmail = useUserStore(s => s.signInWithEmail);
    const demoLogin = useUserStore(s => s.demoLogin);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        const { error } = await signInWithEmail(email, password);
        setLoading(false);
        if (error) {
            Alert.alert('Login Failed', error);
        } else {
            router.replace('/(tabs)');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoWrap}>
                            <Ionicons name="flash" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>FreshR</Text>
                        <Text style={styles.subtitle}>Log in to access your digital campus.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.inputWrap}>
                                <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="yourname@college.edu"
                                    placeholderTextColor={Colors.textDimmed}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <View style={styles.inputWrap}>
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor={Colors.textDimmed}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.loginBtn, loading && styles.disabledBtn]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.loginBtnText}>Unlock Access</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.demoBtn}
                            onPress={async () => {
                                setLoading(true);
                                await demoLogin();
                            }}
                            disabled={loading}
                        >
                            <Ionicons name="sparkles" size={18} color={Colors.primary} />
                            <Text style={styles.demoBtnText}>Demo Bypass (yugaank@gmail.com)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.registerBtn}
                            onPress={() => router.push('/register')}
                        >
                            <Text style={styles.registerText}>
                                Don't have an account? <Text style={styles.registerHighlight}>Join now</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>FRESHR DEMO BUILD v1.0</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { flexGrow: 1, padding: Spacing.xl, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    logoWrap: {
        width: 64,
        height: 64,
        borderRadius: Radius.md,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    title: { ...Typography.display, color: Colors.foreground, fontSize: 32 },
    subtitle: { ...Typography.body1, color: Colors.mutedForeground, textAlign: 'center', marginTop: 8 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { ...Typography.micro, color: Colors.mutedForeground, letterSpacing: 1.5 },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.md,
        height: 56,
        gap: 12,
        borderWidth: 0.5,
        borderColor: Colors.border,
    },
    input: { flex: 1, ...Typography.body1, color: Colors.foreground, padding: 0 },
    loginBtn: {
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    loginBtnText: { ...Typography.h4, color: Colors.primaryForeground, fontFamily: 'Sora_700Bold' },
    demoBtn: {
        height: 56,
        backgroundColor: Colors.secondary,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        borderWidth: 0.5,
        borderColor: Colors.border,
        marginTop: 10,
    },
    demoBtnText: { ...Typography.h5, color: Colors.secondaryForeground, fontFamily: 'Sora_600SemiBold' },
    disabledBtn: { opacity: 0.7 },
    registerBtn: { alignItems: 'center', marginTop: 10 },
    registerText: { ...Typography.body2, color: Colors.textSecondary },
    registerHighlight: { color: Colors.primary, fontFamily: 'Sora_700Bold' },
    footer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center' },
    footerText: { ...Typography.micro, color: Colors.textDimmed, letterSpacing: 2 },
});
