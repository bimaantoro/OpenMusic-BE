const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(playlistsService, playlistSongsService, validator) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
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
      message: 'Playlist was added successfully',
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

  async deletePlaylistByIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist was deleted successfully',
    };
  }

  async postSongByPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    console.log(playlistId);
    const { songId } = this._validator.validatePostSongToPlaylistPayload(request.payload);
    console.log(songId);
    const { userId: credentialId } = request.auth.credentials;
    console.log(credentialId);

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistSongId = await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
    console.log(playlistSongId);

    return h.response({
      status: 'success',
      message: 'Song successfully added to playlist',
      data: {
        playlistSongId,
      },
    }).code(201);
  }

  async getSongsByPlaylistIdHandler(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistSongsService.getSongsByPlaylistId(playlistId);

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

    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);

    return {
      status: 'success',
      message: 'Song successfully deleted from playlist',
    };
  }
}

module.exports = PlaylistsHandler;
