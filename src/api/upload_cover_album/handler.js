const { join } = require('path');
const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/NotFoundError');
const { config } = require('../../utils/config');

class UploadCoverAlbumHandler {
  constructor(albumssService, storageService, validator) {
    this._albumsService = albumssService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumCoverByIdHandler(request, h) {
    const { albumId } = request.params;
    await this._validator.validatePutAlbumCoverPayload(request.payload);
    const { cover } = request.payload;
    const fileExtension = cover.hapi.filename.split('.').pop();

    const filename = await this._storageService.saveAlbumArt(albumId, cover, fileExtension);

    await this._albumsService.setCoverUrlToAlbum(albumId, filename);

    return h.response({
      status: 'success',
      message: 'Album cover successfully uploaded',
    }).code(201);
  }

  async getAlbumCoverByIdHandler(request, h) {
    const { albumId } = request.params;

    await this._albumsService.isAlbumExist(albumId);

    const coverAlbum = await this._albumsService.getCoverAlbumById(albumId);

    if (!coverAlbum) {
      throw new NotFoundError('Album cover not found');
    }

    const filePath = join(config.app.imagesPublicPath, coverAlbum);

    return h.file(filePath);
  }
}

module.exports = UploadCoverAlbumHandler;
