// src/controllers/helper/file.helper.js

const buildFileUrl = (request, folder) => {
  if (!request.file) return null;
  
  // JANGAN gunakan BASE_URL dari env untuk disimpan ke DB.
  // Cukup simpan path relatifnya saja.
  return `/uploads/${folder}/${request.file.filename}`;
};

module.exports = { buildFileUrl };