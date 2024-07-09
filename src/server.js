const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const { config } = require('./utils/config');

const ClientError = require('./exceptions/ClientError');

// songs
const SongsService = require('./services/postgres/SongsService');
const songs = require('./api/songs');
const SongsValidator = require('./validator/songs');

// albums
const AlbumsService = require('./services/postgres/AlbumsService');
const albums = require('./api/albums');
const AlbumsValidator = require('./validator/albums');

// users
const UsersService = require('./services/postgres/UsersService');
const users = require('./api/users');
const UsersValidator = require('./validator/users');

// authentications
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const authentications = require('./api/authentications');
const AuthenticationsValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlists = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlists');

// playlistSongs
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const playlistSongs = require('./api/playlist_songs');
const PlaylistSongsValidator = require('./validator/playlist_songs');

// collaborations
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');

// userAlbumLikes
const userAlbumLikes = require('./api/user_album_likes');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService');
const CacheService = require('./services/redis/CacheService');

// Export Playlist
const _export = require('./api/exports');
const ExportsValidator = require('./validator/exports');
const LocalStorageService = require('./services/storage/LocalStorageService');
const ProducerService = require('./services/rabbitmq/ProducerService');

// Upload Cover Album
const uploadCoverAlbum = require('./api/upload_cover_album');
const UploadCoverAlbumValidator = require('./validator/upload_cover_album');

// playlistsongactivities
const PlaylistSongActivitiesService = require('./services/postgres/PlaylistSongActivitiesService');
const playlistSongActivities = require('./api/playlist_song_activities');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const tokenManager = new TokenManager();
  const playlistSongsService = new PlaylistSongsService();
  const storageService = new LocalStorageService();

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: {
      request: ['error'],
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: config.jwtToken.accessToken.key,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwtToken.accessToken.expiresIn,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        songsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        playlistSongsService,
        playlistSongActivitiesService,
        playlistsService,
        songsService,
        validator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlistSongActivities,
      options: {
        playlistsService,
        playlistSongActivitiesService,
      },
    },
    {
      plugin: userAlbumLikes,
      options: {
        userAlbumLikesService,
        albumsService,
      },
    },
    {
      plugin: _export,
      options: {
        playlistsService,
        producerService: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploadCoverAlbum,
      options: {
        albumsService,
        storageService,
        validator: UploadCoverAlbumValidator,
      },
    },
  ]);

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

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
