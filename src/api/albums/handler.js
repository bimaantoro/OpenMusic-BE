class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.addAlbumHandler = this.addAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async addAlbumHandler(request, h) {
    const albumPayload = this._validator.validatePostAlbumPayload(request.payload);

    const albumId = await this._service.addAlbum(albumPayload);

    return h.response({
      status: 'success',
      message: 'Album added successfully',
      data: {
        albumId,
      },
    }).code(201);
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._service.getAlbumById(albumId);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const albumPayload = this._validator.validatePutAlbumPayload(request.payload);

    await this._service.editAlbumById(albumId, albumPayload);

    return {
      status: 'success',
      message: 'Album updated successfully',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._service.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album deleted successfully',
    };
  }
}

module.exports = AlbumsHandler;
