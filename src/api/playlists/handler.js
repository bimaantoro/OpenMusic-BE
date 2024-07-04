const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    const { name } = this._validator.validatePlaylistPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name, owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'Playlist was added successfully',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request) {
    const { userId: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist was deleted successfully',
    };
  }
}

module.exports = PlaylistsHandler;
