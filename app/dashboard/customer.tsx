import { ListingCard } from '@/components/ListingCard';
import { api } from '@/src/services/api';
import { Listing, User } from '@/src/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CustomerDashboard() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [foodItems, setFoodItems] = useState<Listing[]>([]);

    useEffect(() => {
        if (params.user) {
            setUser(JSON.parse(params.user as string));
        }
        fetchListings();
    }, [params.user]);

    const fetchListings = async () => {
        const data = await api.fetchListings();
        setFoodItems(data);
    };

    const handleLogout = () => {
        router.replace('/role-selection');
    };

    return (
        <View style={styles.container}>
            <View style={styles.dashHeader}>
                <Text style={styles.dashName}>Hello, {user?.name || 'Customer'}</Text>
                <TouchableOpacity onPress={handleLogout}><LogOut size={24} color="#D32F2F" /></TouchableOpacity>
            </View>
            <FlatList
                data={foodItems}
                keyExtractor={(_item, index) => index.toString()}
                renderItem={({ item }) => <ListingCard item={item} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#F5F7FA' },
    dashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
    dashName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
});
