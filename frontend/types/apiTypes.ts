// types/api.ts

export interface FileType {
  uri: string;
  type?: string;
  name?: string;
  fileName?: string;
}

/* ================= AUTH TYPES ================= */
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nama_lengkap: string;
  email: string;
  password: string;
  nomer_wa: string;
  provinsi_asal?: string;
  kota_kabupaten?: string;
}

/* ================= SPOT & POND TYPES ================= */
export interface SpotData {
  nama_spot: string;
  deskripsi?: string;
  harga_per_jam: number;
  alamat: string;
  latitude: number;
  longitude: number;
  total_kursi?: number;
  jam_buka?: string;
  jam_tutup?: string;
  kode_wilayah?: string; // Tambahkan ini sesuai SQL
  foto_utama?: FileType;
  foto_denah?: FileType;  // Tambahkan ini sesuai SQL
  facilities?: number[]; 
}

/* ================= BOOKING & EVENT ================= */
export interface BookingData {
  seat_id: number;
  start_time: string;
  duration: number;
  payment_channel_id?: number;
  nama_offline?: string; // Tambahkan untuk booking via owner
  wa_offline?: string;   // Tambahkan untuk booking via owner
}

export interface EventData {
  spot_id: number;
  nama_event: string;
  biaya_pendaftaran: number;
  deskripsi_event?: string;
  maks_peserta: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  foto_poster?: FileType;
}

/* ================= SOCIAL & REVIEW ================= */
export interface ReviewData {
  spot_id: number;
  rating: number;
  ulasan: string;
  foto_ulasan?: FileType; // Sesuaikan nama field dengan database
}

export interface StrikeFeedData {
  caption: string;
  lokasi?: string;
  foto: FileType;
}

/* ================= FINANCE ================= */
export interface WithdrawData {
  amount: number;
  nama_bank: string;
  no_rekening: string;
  atas_nama: string;
}