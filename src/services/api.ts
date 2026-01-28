import { Alert } from 'react-native';
import { AuthResponse, Listing, OTPResponse } from '../types';

export const API_URL = 'https://ecobyte-weld.vercel.app';

const getHeaders = () => ({
    'Content-Type': 'application/json',
});

export const api = {
    fetchListings: async (): Promise<Listing[]> => {
        try {
            const response = await fetch(`${API_URL}/listings`);
            if (!response.ok) throw new Error('Failed to fetch listings');
            return await response.json();
        } catch (error) {
            console.error(error);
            Alert.alert('Connection Error', 'Ensure backend is running.');
            return [];
        }
    },

    loginWithOTP: async (phone: string): Promise<OTPResponse | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                Alert.alert('Error', data.detail || 'User not found');
                return null;
            }
        } catch (error) {
            Alert.alert('Error', 'Network Error');
            return null;
        }
    },

    verifyOTP: async (otpId: string, otp: string): Promise<AuthResponse | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ otp_id: otpId, otp }),
            });
            const data = await response.json();
            if (response.ok && data.auth_token) {
                return data;
            } else {
                Alert.alert('Error', 'Invalid OTP');
                return null;
            }
        } catch (error) {
            Alert.alert('Error', 'Verification Failed');
            return null;
        }
    },

    registerOwner: async (formData: FormData): Promise<AuthResponse | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/register/owner`, {
                method: 'POST',
                body: formData,
                // Content-Type header is automatically set for FormData
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                Alert.alert('Registration Failed', data.detail);
                return null;
            }
        } catch (error) {
            Alert.alert('Error', 'Could not register');
            return null;
        }
    },

    registerCustomer: async (data: { phone: string; name: string; location: string }): Promise<AuthResponse | null> => {
        try {
            const response = await fetch(`${API_URL}/auth/register/customer`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ ...data, role: 'customer' })
            });
            const resData = await response.json();
            if (response.ok) {
                return resData;
            } else {
                Alert.alert('Registration Failed', resData.detail);
                return null;
            }
        } catch (error) {
            Alert.alert('Error', 'Could not register');
            return null;
        }
    },

    addListing: async (listing: Omit<Listing, 'id' | 'restaurant'>): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/listings`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(listing)
            });
            if (response.ok) return true;
            return false;
        } catch (error) {
            Alert.alert('Error', 'Network Error');
            return false;
        }
    }
};
