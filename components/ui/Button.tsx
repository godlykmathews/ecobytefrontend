import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', loading, style, ...props }) => {
    const getBackgroundColor = () => {
        if (variant === 'primary') return '#1E88E5';
        if (variant === 'secondary') return '#4CAF50';
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'outline') return '#1E88E5';
        return '#fff';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outlineButton,
                style,
            ]}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: '#1E88E5',
    },
    text: {
        fontSize: 18,
        fontWeight: '600',
    },
});
