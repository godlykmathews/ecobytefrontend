import { Button } from '@/components/ui/Button';
import { api } from '@/src/services/api';
import { User } from '@/src/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RestaurantDashboard() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        itemName: '', originalPrice: '', discountedPrice: '', hoursValid: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params.user) {
            setUser(JSON.parse(params.user as string));
        }
    }, [params.user]);

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAddListing = async () => {
        setLoading(true);
        const success = await api.addListing({
            item: formData.itemName,
            description: "Fresh food available",
            originalPrice: parseFloat(formData.originalPrice),
            discountedPrice: parseFloat(formData.discountedPrice),
            hoursValid: parseInt(formData.hoursValid) || 24,
            category: "General"
        });
        setLoading(false);

        if (success) {
            Alert.alert('Success', 'Food Item Listed!');
            setFormData({ itemName: '', originalPrice: '', discountedPrice: '', hoursValid: '' });
        }
    };

    const handleLogout = () => {
        router.replace('/role-selection');
    };

    return (
        <View style={styles.container}>
            <View style={styles.dashHeader}>
                <Text style={styles.dashName}>{user?.restaurant_name || 'Restaurant'}</Text>
                <TouchableOpacity onPress={handleLogout}><LogOut size={24} color="#D32F2F" /></TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Add Food Item</Text>
            <View style={styles.addItemCard}>
                <TextInput
                    placeholder="Item Name"
                    style={styles.input}
                    value={formData.itemName}
                    onChangeText={t => updateForm('itemName', t)}
                />
                <View style={styles.row}>
                    <TextInput
                        placeholder="Original Price"
                        keyboardType="numeric"
                        style={styles.halfInput}
                        value={formData.originalPrice}
                        onChangeText={t => updateForm('originalPrice', t)}
                    />
                    <TextInput
                        placeholder="Discount Price"
                        keyboardType="numeric"
                        style={styles.halfInput}
                        value={formData.discountedPrice}
                        onChangeText={t => updateForm('discountedPrice', t)}
                    />
                </View>
                <TextInput
                    placeholder="Hours Valid (e.g. 4)"
                    keyboardType="numeric"
                    style={styles.input}
                    value={formData.hoursValid}
                    onChangeText={t => updateForm('hoursValid', t)}
                />

                <Button
                    title="List Item"
                    onPress={handleAddListing}
                    variant="secondary"
                    loading={loading}
                    style={{ marginTop: 10, backgroundColor: '#4CAF50' }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
    dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    dashName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    addItemCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16, elevation: 2 },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16 },
    halfInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#eee', fontSize: 16, flex: 1, marginHorizontal: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
