import { Platform } from 'react-native';

// Base URL for backend API and Socket.IO server
export const API_URL: string = Platform.select({
  android: 'http://10.0.2.2:3001', // Android emulator loopback
  default: 'http://localhost:3001',
}) as string;

