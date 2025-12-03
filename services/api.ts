import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use localhost for development. 
// For Android Emulator, use 10.0.2.2 instead of localhost.
// For iOS Simulator, localhost is fine.
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
const TOKEN_KEY = 'auth_token';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    async (config) => {
        if (Platform.OS !== 'web') {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } else {
            // Fallback for web (SecureStore doesn't work on web)
            const token = localStorage.getItem(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setToken = async (token: string) => {
    if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const clearToken = async () => {
    if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
};

// Types based on OpenAPI spec
export interface UserCreate {
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface Profile {
    id: string;
    name?: string;
    email: string;
    bio?: string;
}

export interface ProfileUpdate {
    name?: string;
    bio?: string;
}

export interface GenericMessage {
    message: string;
}

export interface ErrorResponse {
    detail: string;
}

// API Methods
export const auth = {
    signup: (data: UserCreate) => api.post<GenericMessage>('/auth/signup', data),
    login: (data: UserLogin) => api.post<Token>('/auth/login', data),
};

export const profile = {
    getMe: () => api.get<Profile>('/profile/me'),
    updateMe: (data: ProfileUpdate) => api.put<Profile>('/profile/me', data),
};

export default api;
