const CollaborationsHandler = require('./handler');
const routes = require('./routes');

const collaborations = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistsService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      validator,
    );
    server.route(routes(collaborationsHandler));
  },
};

module.exports = collaborations;
