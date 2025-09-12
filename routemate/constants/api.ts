import { Platform } from 'react-native';

// Get backend URL from environment variable with fallback
const getBackendUrl = () => {
  // Use environment variable if available
  const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  console.log('Environment URL:', envUrl);
  console.log('Platform:', Platform.OS);
  
  if (envUrl) {
    console.log('Using environment URL:', envUrl);
    return envUrl;
  }

  // Fallback to platform-specific URLs
  if (__DEV__) {
    if (Platform.OS === 'android') {
      console.log('Using Android fallback URL');
      return 'http://192.168.1.146:3001';
    } else {
      console.log('Using iOS/other fallback URL');
      return 'http://localhost:3001';
    }
  }
  
  // Production fallback
  console.log('Using production fallback URL');
  return 'https://your-production-api.com';
};

export const API_CONFIG = {
  BASE_URL: getBackendUrl(),
  AUTH_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  TIMEOUT: 10000,
};

console.log('API_CONFIG initialized:', API_CONFIG);

export const getApiUrl = (endpoint: string) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('Generated API URL:', url);
  return url;
};
