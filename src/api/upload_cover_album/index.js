const UploadCoverAlbumHandler = require('./handler');
const routes = require('./routes');

const uploadCoverAlbum = {
  name: 'upload_cover_album',
  version: '1.0.0',
  register: async (server, { albumsService, storageService, validator }) => {
    const uploadCoverAlbumHandler = new UploadCoverAlbumHandler(
      albumsService,
      storageService,
      validator,
    );
    server.route(routes(uploadCoverAlbumHandler));
  },
};

module.exports = uploadCoverAlbum;
