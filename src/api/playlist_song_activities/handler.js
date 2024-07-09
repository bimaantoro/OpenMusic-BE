class PlaylistSongActivitiesHandler {
  constructor(playlistsService, playlistSongActivitiesService) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    this.getActivitiesByPlaylistIdHandler = this.getActivitiesByPlaylistIdHandler.bind(this);
  }

  async getActivitiesByPlaylistIdHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const activities = await this._playlistSongActivitiesService
      .getActivitiesByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistSongActivitiesHandler;
