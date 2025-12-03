import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconSymbol name="sparkles" size={64} color={Colors.dark.tint} />
        <Text style={styles.title}>Welcome to Your App</Text>
        <Text style={styles.subtitle}>You are all set up!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)/profile' as Href)}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9BA1A6',
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#04121C',
    fontWeight: '600',
    fontSize: 16,
  },
});
