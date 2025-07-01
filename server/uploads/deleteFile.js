const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Helper to delete a file from uploads (Promise-based)
async function deleteFile(filePath) {
  try {
    if (!filePath) return;
    const fullPath = path.resolve(filePath);
    await unlinkAsync(fullPath);
    console.log('Successfully deleted file:', fullPath);
    return true;
  } catch (err) {
    console.error('Failed to delete file:', filePath, err);
    return false;
  }
}

module.exports = deleteFile;
