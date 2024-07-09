const fs = require('fs');
const { config } = require('../../utils/config');

class LocalStorageService {
  constructor() {
    if (!fs.existsSync(config.app.imagesPublicPath)) {
      fs.mkdirSync(config.app.imagesPublicPath, { recursive: true });
    }
  }

  saveAlbumArt(albumId, albumArt, fileExtension) {
    return new Promise((resolve, reject) => {
      const filename = `${albumId}.${fileExtension}`;
      const filePath = `${config.app.imagesPublicPath}/${filename}`;
      const fileStream = fs.createWriteStream(filePath);

      albumArt.pipe(fileStream);

      fileStream.on('finish', () => {
        resolve(filename);
      });

      fileStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}

module.exports = LocalStorageService;
