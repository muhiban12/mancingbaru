import { Platform } from 'react-native';

/**
 * Prioritas: 
 * 1. Mengambil dari .env (EXPO_PUBLIC_API_URL)
 * 2. Jika undefined, gunakan string URL Ngrok langsung sebagai cadangan
 */
const NGROK_URL = process.env.EXPO_PUBLIC_API_URL || "https://uncontrived-hastefully-nelly.ngrok-free.dev";

// Pastikan tidak ada double slash jika NGROK_URL sudah berakhir dengan /
const CLEAN_URL = NGROK_URL.replace(/\/$/, "");

export const API_BASE_URL = `${CLEAN_URL}/api`;

export const API_TIMEOUT = 15000;

// Helper untuk URL gambar
export const getFileUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  return `${CLEAN_URL}/uploads/${path}`;
};