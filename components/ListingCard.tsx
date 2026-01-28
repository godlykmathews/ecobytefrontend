import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Listing } from '../src/types';

interface ListingCardProps {
    item: Listing;
    onClaim?: (item: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, onClaim }) => {
    const handleClaim = () => {
        if (onClaim) {
            onClaim(item);
        } else {
            Alert.alert('Success', 'Reserved');
        }
    };

    return (
        <View style={styles.listingCard}>
            <View style={styles.row}>
                <Text style={styles.restName}>{item.restaurant}</Text>
                <Text style={styles.expiry}>{item.hoursValid}h left</Text>
            </View>
            <Text style={styles.itemName}>{item.item}</Text>
            <View style={styles.priceRow}>
                <Text style={styles.price}>₹{item.discountedPrice}</Text>
                <Text style={styles.oldPrice}>₹{item.originalPrice}</Text>
                <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
                    <Text style={styles.claimButtonText}>Claim</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listingCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 15, elevation: 3 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    restName: { fontSize: 14, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
    expiry: { fontSize: 12, color: '#E65100', fontWeight: 'bold', backgroundColor: '#FFF3E0', padding: 4, borderRadius: 4 },
    itemName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginVertical: 5 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
    price: { fontSize: 22, fontWeight: 'bold', color: '#4CAF50' },
    oldPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through' },
    claimButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginLeft: 'auto' },
    claimButtonText: { color: '#fff', fontWeight: 'bold' }
});
