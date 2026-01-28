import { Button } from '@/components/ui/Button';
import { api } from '@/src/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpId, setOtpId] = useState<string | null>(null);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!phone) return Alert.alert('Error', 'Enter phone number');
        setLoading(true);
        const data = await api.loginWithOTP(phone);
        setLoading(false);

        if (data) {
            setOtpId(data.otp_id);
            setOtpSent(true);
            if (data.dev_otp) {
                Alert.alert('OTP Sent', `Your Debug OTP is: ${data.dev_otp}`);
            }
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpId || !otp) return;
        setLoading(true);
        const data = await api.verifyOTP(otpId, otp);
        setLoading(false);

        if (data) {
            const target = data.user.role === 'owner' ? '/dashboard/restaurant' : '/dashboard/customer';
            // In a real app, store user in context/redux here
            router.replace({ pathname: target, params: { user: JSON.stringify(data.user) } });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Login with OTP</Text>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    style={styles.input}
                    onChangeText={setPhone}
                    editable={!otpSent}
                    value={phone}
                />
                {otpSent && (
                    <TextInput
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        style={styles.input}
                        onChangeText={setOtp}
                        value={otp}
                    />
                )}

                {!otpSent ? (
                    <Button title="Send OTP" onPress={handleSendOTP} loading={loading} />
                ) : (
                    <Button title="Verify & Login" onPress={handleVerifyOTP} loading={loading} />
                )}

                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={styles.backLink}>Back</Text>
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
    backLink: { textAlign: 'center', color: '#666' }
});
