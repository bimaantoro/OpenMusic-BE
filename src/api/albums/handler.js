class AlbumsHandler {
  constructor(albumsService, songsService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._validator = validator;

    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async addAlbumHandler(request, h) {
    const albumPayload = this._validator.validatePostAlbumPayload(request.payload);

    const id = await this._albumsService.addAlbum(albumPayload);

    return h.response({
      status: 'success',
      message: 'Album added successfully',
      data: {
        id,
      },
    }).code(201);
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._albumsService.getAlbumById(albumId);
    const songs = await this._songsService.getSongsByAlbumId(albumId);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const albumPayload = this._validator.validatePutAlbumPayload(request.payload);

    await this._albumsService.editAlbumById(albumId, albumPayload);

    return {
      status: 'success',
      message: 'Album updated successfully',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._albumsService.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album deleted successfully',
    };
  }
}

module.exports = AlbumsHandler;
