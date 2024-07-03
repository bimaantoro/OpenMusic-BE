require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// songs
const SongsService = require('./services/SongsService');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');
const albums = require('./api/albums');

// albums
const AlbumsService = require('./services/AlbumsService');
const AlbumsValidator = require('./validator/albums');
const UsersService = require('./services/UsersService');
const users = require('./api/users');
const UsersValidator = require('./validator/users');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT ?? 'localhost',
    host: process.env.HOST ?? 5000,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: {
      request: ['error'],
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      return h.response({
        status: 'error',
        message: 'Sorry, there was a failure on our server',
      }).code(500);
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        albumsService,
        songsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
