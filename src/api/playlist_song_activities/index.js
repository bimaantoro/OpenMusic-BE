const PlaylistSongActivitiesHandler = require('./handler');
const routes = require('./routes');

const playlistSongActivities = {
  name: 'playlist_song_activities',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongActivitiesService }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistsService,
      playlistSongActivitiesService,
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};

module.exports = playlistSongActivities;
