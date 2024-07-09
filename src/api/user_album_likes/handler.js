const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeAlbumByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;

    await this._albumsService.isAlbumExist(albumId);

    const isLiked = await this._userAlbumLikesService
      .isUserAlreadyLikedAlbum(credentialId, albumId);

    if (isLiked) {
      throw new InvariantError('Album is already liked');
    }

    await this._userAlbumLikesService.addUserAlbumLike(credentialId, albumId);

    return h.response({
      status: 'success',
      message: 'Successfully liked the album',
    }).code(201);
  }

  async getLikesAlbumByIdHandler(request, h) {
    const { albumId } = request.params;

    await this._albumsService.isAlbumExist(albumId);

    const { source, count } = await this._userAlbumLikesService.countLikesByAlbumId(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: count,
      },
    });
    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikeAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.isAlbumExist(albumId);

    await this._userAlbumLikesService.deleteUserAlbumLike(credentialId, albumId);

    return {
      status: 'success',
      message: 'successfully delete the preferred album.',
    };
  }
}

module.exports = UserAlbumLikesHandler;
