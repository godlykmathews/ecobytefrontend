import { useRouter } from 'expo-router';
import { Utensils } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/role-selection');
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Utensils size={80} color="#fff" />
            <Text style={styles.title}>EcoBite</Text>
            <Text style={styles.subtitle}>Powered by FastAPI</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20
    },
    subtitle: {
        fontSize: 16,
        color: '#E8F5E9',
        marginTop: 10
    },
});
