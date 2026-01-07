//src/controllers/helper/file.herlper.js
const BASE_URL = process.env.BASE_URL;

const buildFileUrl = (request, folder) => {
  if (!request.file) return null;
  return `${BASE_URL}/uploads/${folder}/${request.file.filename}`;
};

module.exports = { buildFileUrl };