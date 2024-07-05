const SongsHandler = require('./handler');
const routes = require('./routes');

const songs = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songsService, validator }) => {
    const songsHandler = new SongsHandler(songsService, validator);
    server.route(routes(songsHandler));
  },
};

module.exports = songs;
