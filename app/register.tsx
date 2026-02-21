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
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import { useUserStore } from '../src/store/userStore';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState('');
    const [loading, setLoading] = useState(false);
    const signUp = useUserStore(s => s.signUp);

    const handleRegister = async () => {
        if (!name || !email || !password || !college) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        const { error } = await signUp(email, password, { name, college });
        setLoading(false);
        if (error) {
            Alert.alert('Registration Failed', error);
        } else {
            Alert.alert('Success', 'Account created! Please log in.');
            router.replace('/login');
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
                            <Ionicons name="sparkles" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>Join FreshR</Text>
                        <Text style={styles.subtitle}>Create your profile to start exploring.</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>FULL NAME</Text>
                            <View style={styles.inputWrap}>
                                <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor={Colors.textDimmed}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

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
                            <Text style={styles.label}>COLLEGE NAME</Text>
                            <View style={styles.inputWrap}>
                                <Ionicons name="business-outline" size={20} color={Colors.textSecondary} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="MIT Manipal"
                                    placeholderTextColor={Colors.textDimmed}
                                    value={college}
                                    onChangeText={setCollege}
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
                            style={[styles.registerBtn, loading && styles.disabledBtn]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.registerBtnText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.loginText}>
                                Already have an account? <Text style={styles.loginHighlight}>Log in</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { flexGrow: 1, padding: Spacing.xl, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 30 },
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
    registerBtn: {
        height: 56,
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerBtnText: { ...Typography.h4, color: Colors.primaryForeground, fontFamily: 'Sora_700Bold' },
    disabledBtn: { opacity: 0.7 },
    loginBtn: { alignItems: 'center', marginTop: 10 },
    loginText: { ...Typography.body2, color: Colors.textSecondary },
    loginHighlight: { color: Colors.primary, fontFamily: 'Sora_700Bold' },
});
