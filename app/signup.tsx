import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { auth } from '@/services/api';
import { AxiosError } from 'axios';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        const trimmedEmail = email.trim();
        const trimmedName = name.trim();
        const trimmedPassword = password.trim();

        console.log('Attempting signup with:', { email: trimmedEmail, name: trimmedName });

        if (!trimmedName || !trimmedPassword) {
            setError('Please fill in all fields.');
            return;
        }

        // Use regex directly to avoid any stale state issues
        if (!isEmailValidRegex.test(trimmedEmail)) {
            console.log('Email validation failed for:', trimmedEmail);
            setError('Invalid email format');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Signup
            await auth.signup({ email: trimmedEmail, password: trimmedPassword });

            // 2. Navigate to login
            router.replace('/login');
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            setError(axiosError.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isEmailValid = useMemo(() => {
        const trimmed = email.trim();
        if (!trimmed) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(trimmed);
    }, [email]);

    const passwordStrength = useMemo(() => {
        if (password.length >= 10 && /[A-Z]/.test(password) && /[\d]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            return 'strong';
        }
        if (password.length >= 6) {
            return 'medium';
        }
        return 'weak';
    }, [password]);

    const isPasswordStrong = passwordStrength === 'strong';

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <IconSymbol name="shield.fill" size={32} color={Colors.dark.tint} />
                    </View>
                    <Text style={styles.title}>Create Your Account</Text>
                </View>

                <View style={styles.form}>
                    {error ? (
                        <View style={styles.globalErrorContainer}>
                            <IconSymbol name="exclamationmark.circle" size={20} color={Colors.dark.error} />
                            <Text style={styles.globalErrorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#586380"
                            value={name}
                            onChangeText={text => {
                                setName(text);
                                if (error) setError('');
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={[styles.input, error && error.toLowerCase().includes('email') ? styles.inputError : undefined]}
                            placeholder="invalid-email"
                            placeholderTextColor="#EF4444"
                            value={email}
                            onChangeText={text => {
                                setEmail(text);
                                if (error) setError('');
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.passwordContainer, isPasswordStrong ? styles.passwordStrong : undefined]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••••••••"
                                placeholderTextColor="#586380"
                                value={password}
                                onChangeText={text => setPassword(text)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon} activeOpacity={0.7}>
                                <IconSymbol name={showPassword ? "eye.slash.fill" : "eye.fill"} size={20} color="#9BA1A6" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.helperText, isPasswordStrong ? styles.helperTextStrong : undefined]}>
                            Password strength is {passwordStrength}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        activeOpacity={0.85}
                        disabled={isLoading}
                    >
                        <Text style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login' as Href)}>
                            <Text style={styles.linkText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const isEmailValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        fontSize: 30,
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
    passwordStrong: {
        borderColor: Colors.dark.tint,
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
    helperText: {
        color: '#9BA1A6',
        fontSize: 12,
        marginTop: 8,
        letterSpacing: 0.2,
    },
    helperTextStrong: {
        color: Colors.dark.tint,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 12,
        marginTop: 8,
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
        shadowOpacity: 0.35,
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
