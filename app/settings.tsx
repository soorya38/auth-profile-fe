import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { clearToken } from '@/services/api';

export default function SettingsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await clearToken();
                    router.replace('/login' as Href);
                }
            }
        ]);
    };

    const renderSettingItem = (
        icon: string,
        label: string,
        type: 'link' | 'switch' | 'button' = 'link',
        value?: boolean,
        onValueChange?: (val: boolean) => void,
        onPress?: () => void,
        color: string = '#000'
    ) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={type !== 'switch' ? onPress : undefined}
            disabled={type === 'switch'}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color === '#ff3b30' ? '#ffe5e5' : '#f0f0f0' }]}>
                    <IconSymbol name={icon as any} size={20} color={color} />
                </View>
                <Text style={[styles.settingLabel, { color }]}>{label}</Text>
            </View>

            {type === 'link' && <IconSymbol name="chevron.right" size={20} color="#ccc" />}

            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: '#767577', true: Colors.light.tint }}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.desktopContainer}>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Preferences</Text>
                        {renderSettingItem('bell.fill', 'Notifications', 'switch', notifications, setNotifications)}
                        {renderSettingItem('moon.fill', 'Dark Mode', 'switch', darkMode, setDarkMode)}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Account</Text>
                        {renderSettingItem('lock.fill', 'Privacy', 'link', undefined, undefined, () => { })}
                        {renderSettingItem('shield.fill', 'Security', 'link', undefined, undefined, () => { })}
                        {renderSettingItem('doc.text.fill', 'Terms of Service', 'link', undefined, undefined, () => { })}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Actions</Text>
                        {renderSettingItem(
                            'arrow.right.square.fill',
                            'Log Out',
                            'button',
                            undefined,
                            undefined,
                            handleLogout,
                            '#ff3b30'
                        )}
                    </View>

                    <Text style={styles.version}>Version 1.0.0</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',
    },
    contentContainer: {
        alignItems: 'center',
    },
    desktopContainer: {
        width: '100%',
        maxWidth: 600,
    },
    section: {
        marginTop: 24,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e5ea',
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        marginLeft: 16,
        marginBottom: 8,
        marginTop: 24,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    version: {
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 32,
        color: '#999',
        fontSize: 14,
    },
});
