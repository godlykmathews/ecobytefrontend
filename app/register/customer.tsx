import { Button } from '@/components/ui/Button';
import { api } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CustomerRegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({ phone: '', name: '', location: '' });
    const [loading, setLoading] = useState(false);

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRegister = async () => {
        setLoading(true);
        const data = await api.registerCustomer(formData);
        setLoading(false);

        if (data) {
            router.replace({ pathname: '/dashboard/customer', params: { user: JSON.stringify(data.user) } });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Customer Sign Up</Text>
            <View style={styles.formContainer}>
                <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} onChangeText={t => updateForm('phone', t)} />
                <TextInput placeholder="Your Name" style={styles.input} onChangeText={t => updateForm('name', t)} />
                <TextInput placeholder="Location" style={styles.input} onChangeText={t => updateForm('location', t)} />

                <Button title="Register" onPress={handleRegister} loading={loading} />

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.linkText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    formContainer: { marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
    linkText: { color: '#1E88E5', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
