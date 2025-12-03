import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { profile } from '@/services/api';
import { AxiosError } from 'axios';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState(''); // Email is read-only in update
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
        if (score >= 40) return '#FBBF24'; // Amber
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
                <Text style={styles.navTitle}>Update Profile</Text>
                <View style={styles.navSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.desktopContainer}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.editIconContainer} activeOpacity={0.8}>
                                <IconSymbol name="pencil" size={18} color="#04121C" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="#586380"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.bioHeader}>
                                <Text style={styles.label}>Bio</Text>
                                <Text style={styles.charCount}>{bio.length}/150</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Enter your bio"
                                placeholderTextColor="#586380"
                                multiline
                                numberOfLines={4}
                                maxLength={150}
                            />
                        </View>

                        <View style={styles.strengthContainer}>
                            <View style={styles.strengthHeader}>
                                <Text style={styles.strengthLabel}>Profile Strength</Text>
                                <Text style={[styles.strengthValue, { color: getStrengthColor(profileStrength) }]}>
                                    {getStrengthLabel(profileStrength)}
                                </Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <View
                                    style={[
                                        styles.progressBarFill,
                                        {
                                            width: `${profileStrength}%`,
                                            backgroundColor: getStrengthColor(profileStrength)
                                        }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email (Read-only)</Text>
                            <View style={styles.readOnlyInputWrapper}>
                                <TextInput
                                    style={[styles.input, styles.readOnlyInput]}
                                    value={email}
                                    editable={false}
                                    placeholder="e.g., your@email.com"
                                    placeholderTextColor="#586380"
                                />
                                <IconSymbol name="lock.fill" size={20} color="#666" />
                            </View>
                        </View>

                        {isSuccess ? (
                            <View style={styles.successMessage}>
                                <IconSymbol name="checkmark.circle.fill" size={20} color={Colors.dark.tint} />
                                <Text style={styles.successText}>Profile updated successfully!</Text>
                            </View>
                        ) : null}

                        {error ? (
                            <View style={styles.errorMessage}>
                                <IconSymbol name="exclamationmark.circle" size={20} color={Colors.dark.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                            onPress={handleSave}
                            disabled={isSaving}
                        >
                            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
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
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 24,
    },
    backButton: {
        padding: 8,
    },
    navTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark.text,
        letterSpacing: 0.2,
    },
    navSpacer: {
        width: 24,
    },
    scrollContent: {
        paddingBottom: 40,
        alignItems: 'center', // Center desktop container
    },
    desktopContainer: {
        width: '100%',
        maxWidth: 600,
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
        borderWidth: 4,
        borderColor: Colors.dark.tint,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.dark.tint,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.dark.background,
        shadowColor: '#0F172A',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        elevation: 4,
    },
    form: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9BA1A6',
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 16,
        color: Colors.dark.text,
    },
    bioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    charCount: {
        fontSize: 12,
        color: '#5EEAD4',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    strengthContainer: {
        marginBottom: 32,
    },
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    strengthLabel: {
        fontSize: 14,
        color: Colors.dark.text,
    },
    strengthValue: {
        fontSize: 14,
        color: Colors.dark.tint,
        fontWeight: 'bold',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#132033',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        width: '85%',
        height: '100%',
        backgroundColor: Colors.dark.tint,
        borderRadius: 4,
    },
    errorLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.dark.error,
        marginBottom: 8,
    },
    errorInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.dark.error,
        paddingHorizontal: 18,
    },
    errorInput: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: Colors.dark.text,
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 13,
        marginTop: 8,
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D1A2C',
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
    successText: {
        color: Colors.dark.tint,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    saveButton: {
        height: 56,
        backgroundColor: Colors.dark.tint,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        elevation: 4,
    },
    saveButtonText: {
        color: '#04121C',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    readOnlyInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937', // Darker background for read-only
        borderRadius: 16,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    readOnlyInput: {
        flex: 1,
        color: '#9BA1A6', // Muted text color
    },
    errorMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1212',
        borderWidth: 1,
        borderColor: Colors.dark.error,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 12,
    },
});
