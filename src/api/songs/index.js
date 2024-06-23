const SongsHandler = require('./handler');
const routes = require('./routes');

const songs = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};

module.exports = songs;
