class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivitiesService) {
    this._playlistSongActivities = playlistSongActivitiesService;
  }

  /* async getActivitiesByPlaylistId(request) {
    const { playlistId } = request.params;
    const { userId: credentialId } = request.auth.credentials;
  } */
}

module.exports = PlaylistSongActivitiesHandler;
