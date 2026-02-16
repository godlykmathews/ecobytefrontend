export interface User {
    id?: string;
    phone: string;
    role: 'owner' | 'customer';
    name?: string; // For customers
    restaurant_name?: string; // For owners
    owner_name?: string; // For owners
    location?: string;
    fssai?: string;
}

export interface Listing {
    id?: string;
    item: string;
    restaurant?: string;
    description: string;
    originalPrice: number;
    discountedPrice: number;
    hoursValid: number;
    category: string;
}

export interface AuthResponse {
    user: User;
    auth_token: string;
    detail?: string;
}

export interface OTPResponse {
    otp_id: string;
    dev_otp?: string;
    detail?: string;
}
