const fs = require('fs');
const path = require('path');

// Helper to delete a file from uploads
function deleteFile(filePath) {
  if (!filePath) return;
  const fullPath = path.join(__dirname, filePath.startsWith('uploads') ? '..' : '../uploads', filePath.replace(/^uploads[\\/]/, ''));
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Failed to delete file:', fullPath, err);
    } else {
      console.log('Deleted file:', fullPath);
    }
  });
}

module.exports = deleteFile;
