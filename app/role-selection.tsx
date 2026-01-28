import { useRouter } from 'expo-router';
import { User, Utensils } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RoleSelectionScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Welcome Back</Text>

            <TouchableOpacity
                style={[styles.roleCard, { backgroundColor: '#E3F2FD' }]}
                onPress={() => router.push('/auth/login')}
            >
                <User size={32} color="#1565C0" />
                <Text style={styles.roleTitle}>Login (OTP)</Text>
            </TouchableOpacity>

            <Text style={styles.subHeader}>New here? Register as:</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.smallCard} onPress={() => router.push('/register/customer')}>
                    <User size={24} color="#333" />
                    <Text>Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallCard} onPress={() => router.push('/register/owner')}>
                    <Utensils size={24} color="#333" />
                    <Text>Restaurant</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
    subHeader: { fontSize: 16, color: '#666', marginTop: 30, marginBottom: 15 },
    roleCard: { padding: 20, borderRadius: 16, alignItems: 'center', flexDirection: 'row', gap: 15, marginBottom: 10 },
    smallCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 16, alignItems: 'center', gap: 10, elevation: 2 },
    roleTitle: { fontSize: 18, fontWeight: 'bold', color: '#1565C0' },
});
