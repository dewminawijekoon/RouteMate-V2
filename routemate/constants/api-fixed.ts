import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works fine
// For physical devices, use your machine's IP address
const getBaseUrl = () => {
  // First try to get from environment variable
  const envBackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  
  if (envBackendUrl) {
    return envBackendUrl;
  }

  // Fallback to platform-specific URLs if env var not set
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Use the actual IP address of your development machine
      return 'http://192.168.1.146:3001';
    } else {
      // iOS simulator
      return 'http://localhost:3001';
    }
  }
  // Production URL
  return 'https://your-production-api.com';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  AUTH_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  TIMEOUT: 10000, // 10 seconds
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};