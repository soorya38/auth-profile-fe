import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Href, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { profile, Profile } from '@/services/api';
import { useResponsive } from '@/hooks/use-responsive';

export default function ProfileScreen() {
    const router = useRouter();
    const { isMobile } = useResponsive();
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const fetchProfile = async () => {
        try {
            const response = await profile.getMe();
            setUserProfile(response.data);
            setError('');
        } catch (err) {
            console.log('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={Colors.dark.tint} />
            </View>
        );
    }

    if (error || !userProfile) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>{error || 'No profile data found'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleLogout = () => {
        router.replace('/login' as Href);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={isMobile ? styles.mobileContentContainer : styles.desktopContentContainer}>
            <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name || 'User')}&background=random&size=150` }}
                        style={styles.avatar}
                    />
                    <View style={styles.avatarRing} />
                </View>

                <Text style={styles.name}>{userProfile.name || 'User'}</Text>
                <Text style={styles.email}>{userProfile.email}</Text>

                <View style={styles.bioSection}>
                    <Text style={styles.bioLabel}>ABOUT</Text>
                    <View style={styles.bioCard}>
                        <Text style={styles.bioText}>
                            {userProfile.bio || 'No bio provided yet. Tell us about yourself!'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push('/edit-profile' as Href)}
                >
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    mobileContentContainer: {
        padding: 24,
        paddingTop: 48,
        paddingBottom: 48,
    },
    desktopContentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 48,
    },
    profileCard: {
        width: '100%',
        maxWidth: 600,
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: 24,
        padding: 40,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: Colors.dark.background,
        zIndex: 2,
    },
    avatarRing: {
        position: 'absolute',
        width: 156,
        height: 156,
        borderRadius: 78,
        borderWidth: 3,
        borderColor: Colors.dark.tint,
        zIndex: 1,
    },
    name: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 8,
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        color: '#9BA1A6',
        marginBottom: 40,
        letterSpacing: 0.2,
        textAlign: 'center',
    },
    bioSection: {
        width: '100%',
        marginBottom: 32,
    },
    bioLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 12,
        letterSpacing: 1.5,
        textAlign: 'center',
    },
    bioCard: {
        width: '100%',
        backgroundColor: Colors.dark.background,
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    bioText: {
        fontSize: 15,
        color: '#D1D5DB',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.2,
    },
    editButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.dark.tint,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.dark.tint,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },
    editButtonText: {
        color: '#04121C',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    logoutButton: {
        width: '100%',
        height: 56,
        backgroundColor: 'transparent',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    logoutButtonText: {
        color: '#9BA1A6',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.dark.error,
        fontSize: 16,
        marginBottom: 16,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: Colors.dark.card,
        borderRadius: 8,
    },
    retryButtonText: {
        color: Colors.dark.text,
        fontWeight: '600',
    },
});
