import { Platform } from 'react-native';

// Ganti IP ini dengan hasil 'ipconfig' di terminal kamu
const DEV_IP = '192.168.1.2'; 

export const API_BASE_URL = Platform.select({
  ios: `http://localhost:3000/api`,
  android: `http://${DEV_IP}:3000/api`,
  default: `http://${DEV_IP}:3000/api`,
});

export const API_TIMEOUT = 15000;

// Helper untuk URL gambar agar otomatis mengarah ke folder uploads backend
export const getFileUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://${DEV_IP}:3000/uploads/${path}`;
};