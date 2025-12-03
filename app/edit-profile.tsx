import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { profile } from '@/services/api';
import { AxiosError } from 'axios';
import { useResponsive } from '@/hooks/use-responsive';

export default function EditProfileScreen() {
    const router = useRouter();
    const { isMobile } = useResponsive();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await profile.getMe();
            const data = response.data;
            setName(data.name || '');
            setBio(data.bio || '');
            setEmail(data.email || '');
        } catch (err) {
            console.log('Error fetching profile:', err);
            setError('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSuccess(false);
        setIsSaving(true);
        setError('');

        try {
            await profile.updateMe({ name, bio });
            setIsSuccess(true);
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (err) {
            const axiosError = err as AxiosError<{ detail: string }>;
            setError(axiosError.response?.data?.detail || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const profileStrength = React.useMemo(() => {
        let score = 0;
        if (name.trim().length > 0) score += 40;
        if (bio.trim().length > 10) score += 30;
        if (bio.trim().length > 50) score += 30;
        return score;
    }, [name, bio]);

    const getStrengthLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 40) return 'Good';
        return 'Weak';
    };

    const getStrengthColor = (score: number) => {
        if (score >= 80) return Colors.dark.tint;
        if (score >= 40) return '#FBBF24';
        return Colors.dark.error;
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.dark.tint} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.navHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Edit Profile</Text>
                <View style={styles.navSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={isMobile ? styles.mobileScrollContent : styles.desktopScrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=150` }}
                                style={styles.avatar}
                            />
                        </View>
                    </View>

                    <View style={styles.form}>
                        {error ? (
                            <View style={styles.errorBanner}>
                                <IconSymbol name="exclamationmark.circle" size={20} color={Colors.dark.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="#6B7280"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email (Read-only)</Text>
                            <View style={styles.readOnlyInput}>
                                <Text style={styles.readOnlyText}>{email}</Text>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Tell us about yourself..."
                                placeholderTextColor="#6B7280"
                                multiline
                                numberOfLines={4}
                                maxLength={150}
                                textAlignVertical="top"
                            />
                            <Text style={styles.charCount}>{bio.length}/150</Text>
                        </View>

                        <View style={styles.strengthSection}>
                            <View style={styles.strengthHeader}>
                                <Text style={styles.strengthLabel}>Profile Strength</Text>
                                <Text style={[styles.strengthValue, { color: getStrengthColor(profileStrength) }]}>
                                    {getStrengthLabel(profileStrength)}
                                </Text>
                            </View>
                            <View style={styles.strengthBarBg}>
                                <View
                                    style={[
                                        styles.strengthBarFill,
                                        { width: `${profileStrength}%`, backgroundColor: getStrengthColor(profileStrength) }
                                    ]}
                                />
                            </View>
                        </View>

                        {isSuccess ? (
                            <View style={styles.successBanner}>
                                <IconSymbol name="checkmark.circle.fill" size={22} color="#04121C" />
                                <Text style={styles.successText}>Profile updated successfully!</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.saveButton, (isSaving || isSuccess) && styles.buttonDisabled]}
                            onPress={handleSave}
                            disabled={isSaving || isSuccess}
                        >
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Saving...' : isSuccess ? 'Saved!' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 16,
    },
    backButton: {
        padding: 8,
    },
    navTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark.text,
        letterSpacing: 0.3,
    },
    navSpacer: {
        width: 40,
    },
    mobileScrollContent: {
        padding: 24,
        paddingBottom: 48,
    },
    desktopScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    profileCard: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: Colors.dark.card,
        borderRadius: 24,
        padding: 40,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    input: {
        height: 56,
        backgroundColor: Colors.dark.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: Colors.dark.text,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    bioInput: {
        height: 120,
        paddingTop: 16,
        paddingBottom: 16,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 6,
        textAlign: 'right',
    },
    readOnlyInput: {
        height: 56,
        backgroundColor: '#111827',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
        opacity: 0.6,
    },
    readOnlyText: {
        fontSize: 15,
        color: '#9BA1A6',
    },
    strengthSection: {
        marginBottom: 24,
    },
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    strengthLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
        letterSpacing: 0.2,
    },
    strengthValue: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    strengthBarBg: {
        height: 8,
        backgroundColor: Colors.dark.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    strengthBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F1212',
        borderWidth: 1,
        borderColor: Colors.dark.error,
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
        gap: 10,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 14,
        flex: 1,
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#34D399',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 10,
    },
    successText: {
        color: '#04121C',
        fontSize: 15,
        fontWeight: '600',
    },
    saveButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.dark.tint,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.dark.tint,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#04121C',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
