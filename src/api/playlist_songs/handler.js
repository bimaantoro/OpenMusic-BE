const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongByPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { userId: credentialId } = request.auth.credentials;

    await this._playlistsService.isPlaylistExists(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._songsService.isSongExists(songId);

    const playlistSongId = await this._playlistSongsService.addSongToPlaylist(playlistId, songId);

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

    await this._playlistsService.isPlaylistExists(playlistId);
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
      message: 'The song was successfully deleted from the playlist.',
    };
  }
}

module.exports = PlaylistSongsHandler;
