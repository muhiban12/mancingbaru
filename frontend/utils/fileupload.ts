// utils/fileupload.ts

/**
 * Fungsi untuk mengubah object data biasa dan file gambar menjadi FormData
 * agar bisa dibaca oleh middleware 'multer' di Backend Fastify.
 */
export const createFormData = (
  fields: { [key: string]: any },
  files: { [key: string]: any } = {}
): FormData => {
  const formData = new FormData();
  
  // 1. Masukkan field teks biasa (nama, alamat, harga, dll)
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Jika value adalah object atau array (seperti fasilitas kolam), ubah ke string JSON
      if (typeof value === 'object' && !value.uri) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  // 2. Masukkan file gambar (foto_utama, poster, foto_ulasan, dll)
  Object.entries(files).forEach(([key, file]) => {
    if (file && file.uri) {
      // Struktur ini wajib seperti ini agar React Native bisa mengirim file
      const fileObject = {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || file.name || `${key}_${Date.now()}.jpg`
      };
      
      // 'as any' digunakan untuk menghindari error type-check di React Native FormData
      formData.append(key, fileObject as any);
    }
  });
  
  return formData;
};