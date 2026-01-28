import { Button } from '@/components/ui/Button';
import { api } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OwnerRegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: '', restName: '', ownerName: '', location: '', fssai: ''
    });
    const [loading, setLoading] = useState(false);

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRegister = async () => {
        setLoading(true);
        const form = new FormData();
        form.append('phone', formData.phone);
        form.append('restaurant_name', formData.restName);
        form.append('owner_name', formData.ownerName);
        form.append('location', formData.location);
        form.append('fssai', formData.fssai);

        const data = await api.registerOwner(form);
        setLoading(false);

        if (data) {
            router.replace({ pathname: '/dashboard/restaurant', params: { user: JSON.stringify(data.user) } });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerTitle}>Restaurant Sign Up</Text>
            <View style={styles.formContainer}>
                <TextInput placeholder="Phone" keyboardType="phone-pad" style={styles.input} onChangeText={t => updateForm('phone', t)} />
                <TextInput placeholder="Restaurant Name" style={styles.input} onChangeText={t => updateForm('restName', t)} />
                <TextInput placeholder="Owner Name" style={styles.input} onChangeText={t => updateForm('ownerName', t)} />
                <TextInput placeholder="Location" style={styles.input} onChangeText={t => updateForm('location', t)} />
                <TextInput placeholder="FSSAI Number" style={styles.input} onChangeText={t => updateForm('fssai', t)} />

                <Button title="Register" onPress={handleRegister} loading={loading} />

                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.linkText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20, textAlign: 'center' },
    formContainer: { marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
    linkText: { color: '#1E88E5', textAlign: 'center', marginTop: 20, fontSize: 16 },
});
