import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Href, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { profile, Profile } from '@/services/api';

export default function ProfileScreen() {
    const router = useRouter();
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
            // If unauthorized, maybe redirect to login?
            // For now just show error
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
        // Clear token and navigate to login
        // In a real app, use a context or global state
        router.replace('/login' as Href);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.desktopContainer}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=12' }} // Still using mock avatar as API doesn't provide one
                            style={styles.avatar}
                        />
                        <View style={styles.avatarRing} />
                    </View>

                    <Text style={styles.name}>{userProfile.name || 'User'}</Text>
                    <Text style={styles.email}>{userProfile.email}</Text>

                    <View style={styles.bioCard}>
                        <Text style={styles.bioTitle}>BIO</Text>
                        <Text style={styles.bioText}>
                            {userProfile.bio || 'No bio provided yet.'}
                        </Text>
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
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    contentContainer: {
        paddingBottom: 48,
        paddingTop: 48,
        flexGrow: 1,
        alignItems: 'center', // Center the desktop container
    },
    desktopContainer: {
        width: '100%',
        maxWidth: 600, // Limit width on desktop
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        width: '100%',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: Colors.dark.background,
        zIndex: 2,
    },
    avatarRing: {
        position: 'absolute',
        width: 132,
        height: 132,
        borderRadius: 66,
        borderWidth: 3,
        borderColor: Colors.dark.tint,
        zIndex: 1,
    },
    name: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    email: {
        fontSize: 15,
        color: '#9BA1A6',
        marginBottom: 32,
        letterSpacing: 0.2,
    },
    bioCard: {
        width: '100%',
        backgroundColor: '#0F172A',
        borderRadius: 20,
        padding: 26,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    bioTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.dark.tint,
        marginBottom: 14,
        letterSpacing: 1.2,
    },
    bioText: {
        fontSize: 15,
        color: '#B1B7C3',
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 0.1,
    },
    editButton: {
        width: '100%',
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
        marginBottom: 16,
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
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.dark.error,
    },
    logoutButtonText: {
        color: Colors.dark.error,
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
