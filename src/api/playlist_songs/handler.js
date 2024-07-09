const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(
    playlistSongsService,
    playlistSongActivitiesService,
    playlistsService,
    songsService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongByPlaylistIdHandler(request, h) {
    const { playlistId } = request.params;
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.isPlaylistExist(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._songsService.isSongExist(songId);

    const playlistSongId = await this._playlistSongsService.addSongToPlaylist(playlistId, songId);

    await this._playlistSongActivitiesService.addActivityToPlaylistSong({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
    });

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
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.isPlaylistExist(playlistId);
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

  async deleteSongByPlaylistIdHandler(request) {
    const { playlistId } = request.params;
    const { songId } = this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistSongActivitiesService.addActivityToPlaylistSong({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });

    return {
      status: 'success',
      message: 'The song was successfully deleted from the playlist.',
    };
  }
}

module.exports = PlaylistSongsHandler;
