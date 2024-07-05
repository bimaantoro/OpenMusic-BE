const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    const { name } = this._validator.validatePlaylistPayload(request.payload);

    const { userId: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name, owner: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'The playlist was added successfully.',
      data: {
        playlistId,
      },
    }).code(201);
  }

  async getPlaylistsHandler(request) {
    const { userId: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async postSongByPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistsService.isSongExists(songId);

    const playlistSongId = await this._playlistsService.addSongToPlaylist(playlistId, songId);

    return h.response({
      status: 'success',
      message: 'Song successfully added to playlist',
      data: {
        playlistSongId,
      },
    }).code(201);
  }

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'The playlist was deleted successfully.',
    };
  }

  async getSongsByPlaylistIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.isPlaylistExists(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongsByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongByIdPlaylistHandler(request) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'The song was successfully deleted from the playlist.',
    };
  }
}

module.exports = PlaylistsHandler;
