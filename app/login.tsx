import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { auth, setToken } from '@/services/api';
import { AxiosError } from 'axios';

const SUCCESS_DELAY = 900;

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isEmailValid = useMemo(() => {
        if (!email) {
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }, [email]);

    const handleLogin = async () => {
        setIsSuccess(false);
        if (!isEmailValid || !password.trim()) {
            setError('Invalid credentials. Please try again.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await auth.login({ email, password });
            await setToken(response.data.access_token);
            setIsSuccess(true);
            setTimeout(() => {
                router.replace('/(tabs)');
            }, SUCCESS_DELAY);
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            setError(axiosError.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <IconSymbol name="sparkles" size={32} color={Colors.dark.tint} />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                </View>

                <View style={styles.form}>
                    {error ? (
                        <View style={styles.globalErrorContainer}>
                            <IconSymbol name="exclamationmark.circle" size={20} color={Colors.dark.error} />
                            <Text style={styles.globalErrorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, error ? styles.inputError : undefined]}
                            placeholder="you@example.com"
                            placeholderTextColor="#586380"
                            value={email}
                            onChangeText={text => {
                                setEmail(text);
                                if (error) setError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.passwordContainer, error ? styles.inputError : undefined]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter your password"
                                placeholderTextColor="#586380"
                                value={password}
                                onChangeText={text => {
                                    setPassword(text);
                                    if (error) setError('');
                                }}
                                secureTextEntry={!showPassword}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)} style={styles.eyeIcon}>
                                <IconSymbol name={showPassword ? 'eye.slash.fill' : 'eye.fill'} size={20} color="#9BA1A6" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup' as Href)}>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {isSuccess ? (
                        <View style={styles.successContainer}>
                            <IconSymbol name="checkmark.circle.fill" size={22} color="#0F172A" />
                            <Text style={styles.successText}>Login successful!</Text>
                        </View>
                    ) : null}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.text,
        textAlign: 'center',
        letterSpacing: 0.2,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.dark.text,
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    input: {
        height: 56,
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        paddingHorizontal: 18,
        fontSize: 16,
        color: Colors.dark.text,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    inputError: {
        borderColor: Colors.dark.error,
    },
    passwordContainer: {
        height: 56,
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: Colors.dark.text,
    },
    eyeIcon: {
        padding: 8,
    },
    button: {
        height: 56,
        backgroundColor: Colors.dark.tint,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        shadowColor: '#0F172A',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#04121C',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#9BA1A6',
        fontSize: 14,
    },
    linkText: {
        color: '#5EEAD4',
        fontWeight: '600',
        fontSize: 14,
    },
    errorContainer: {
        marginTop: 40,
    },
    errorLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    errorInputContainer: {
        height: 56,
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        paddingHorizontal: 18,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.dark.error,
    },
    errorInputText: {
        fontSize: 16,
        color: Colors.dark.text,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 13,
        marginTop: 8,
        letterSpacing: 0.2,
    },
    successContainer: {
        backgroundColor: '#34D399',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 12,
    },
    successText: {
        color: '#04121C',
        fontSize: 16,
        fontWeight: '600',
    },
    globalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F1212',
        borderWidth: 1,
        borderColor: Colors.dark.error,
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
        gap: 8,
    },
    globalErrorText: {
        color: Colors.dark.error,
        fontSize: 14,
        flex: 1,
    },
});
