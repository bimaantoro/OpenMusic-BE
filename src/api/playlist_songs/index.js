const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

const playlistSongs = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService,
    playlistSongActivitiesService,
    playlistsService,
    songsService,
    validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongsService,
      playlistSongActivitiesService,
      playlistsService,
      songsService,
      validator,
    );

    server.route(routes(playlistSongsHandler));
  },
};

module.exports = playlistSongs;
